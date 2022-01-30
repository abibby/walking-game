import { SphericalPoint } from 'coords'
import { Chunk, DB } from 'database'
import { centeredBoundingBox, map } from 'openstreetmaps'
import { v4 as uuidv4 } from 'uuid'

const chunkSize = 0.005

export async function updateChunks(
    location: SphericalPoint,
    radius: number,
): Promise<void> {
    const chunkPoint = toChunkPoint(location)
    const chunkRadius = radius / chunkSize
    console.log(chunkPoint)

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
        const elements = m.elements.filter(
            e => e.type === 'node' && e.tags?.name,
        )
        console.log('elements', elements)

        for (const element of elements) {
            DB.pois.put({
                id: element.id,
                name: element.tags?.name ?? 'N/A',
                location: {
                    longitude: element.lon,
                    latitude: element.lat,
                },
            })
        }
        DB.chunks.put({
            id: uuidv4(),
            location: chunk,
        })
    }
}

async function getChunks(
    location: SphericalPoint,
    radius: number,
): Promise<readonly Chunk[]> {
    console.log(
        [location.latitude - radius, location.longitude - radius],
        [location.latitude + radius, location.longitude + radius],
    )

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
