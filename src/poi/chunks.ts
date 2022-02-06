import { Mutex } from 'async-mutex'
import { SphericalPoint } from 'coords'
import { Chunk, DB, PointOfInterest } from 'database'
import { centeredBoundingBox, map } from 'openstreetmaps'
import { v4 as uuidv4 } from 'uuid'

const updateChunksMtx = new Mutex()

const chunkSize = 0.005

export async function updateChunks(
    location: SphericalPoint,
    radius: number,
): Promise<void> {
    return updateChunksMtx.runExclusive(async () => {
        const chunkPoint = toChunkPoint(location)
        const chunkRadius = radius / chunkSize

        const chunks = await getChunks(chunkPoint, chunkRadius)

        const neededChunks: SphericalPoint[] = []

        for (
            let long = chunkPoint.longitude - chunkRadius;
            long < chunkPoint.longitude + chunkRadius;
            long++
        ) {
            for (
                let lat = chunkPoint.latitude - chunkRadius;
                lat < chunkPoint.latitude + chunkRadius;
                lat++
            ) {
                if (
                    !chunks.find(
                        c =>
                            c.location.latitude === lat &&
                            c.location.longitude === long,
                    )
                ) {
                    neededChunks.push({
                        latitude: lat,
                        longitude: long,
                    })
                }
            }
        }

        for (const chunk of neededChunks) {
            const m = await map(
                centeredBoundingBox(fromChunkPoint(chunk), {
                    longitude: chunkSize,
                    latitude: chunkSize,
                }),
            )
            const elements = m.elements

            DB.pois.bulkPut(
                elements.map(element => {
                    const p = new PointOfInterest()
                    p.id = element.id
                    p.location = {
                        longitude: element.lon,
                        latitude: element.lat,
                    }
                    p.element = element
                    return p
                }),
            )

            DB.chunks.put({
                id: uuidv4(),
                location: chunk,
            })
        }
    })
}

async function getChunks(
    location: SphericalPoint,
    radius: number,
): Promise<readonly Chunk[]> {
    const chunks = await DB.chunks
        .where(['location.latitude', 'location.longitude'])
        .between(
            [location.latitude - radius, location.longitude - radius],
            [location.latitude + radius, location.longitude + radius],
        )
        .toArray()

    return chunks
}

function toChunkPoint(location: SphericalPoint): SphericalPoint {
    return {
        longitude: Math.floor(location.longitude / chunkSize),
        latitude: Math.floor(location.latitude / chunkSize),
    }
}

function fromChunkPoint(location: SphericalPoint): SphericalPoint {
    return {
        longitude: location.longitude * chunkSize,
        latitude: location.latitude * chunkSize,
    }
}
