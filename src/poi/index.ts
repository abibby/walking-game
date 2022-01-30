import { DB, PointOfInterest } from 'database'
import { SphericalPoint } from '../coords'
import { updateChunks } from './chunks'

export async function getPoints(
    location: SphericalPoint,
    radius: number,
): Promise<PointOfInterest[]> {
    await updateChunks(location, radius)

    const pois = DB.pois
        .where(['location.latitude', 'location.longitude'])
        .between(
            [location.latitude - radius, location.longitude - radius],
            [location.latitude + radius, location.longitude + radius],
        )
        .toArray()

    return pois
}
