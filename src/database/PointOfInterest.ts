import { distance, SphericalPoint } from 'coords'
import { Element } from 'openstreetmaps'

export default class PointOfInterest {
    public id: number = 0
    public location: SphericalPoint = { longitude: 0, latitude: 0 }
    public element: Element = {
        changeset: 0,
        id: 0,
        lat: 0,
        lon: 0,
        timestamp: '',
        type: '',
        uid: 0,
        user: '',
        version: 0,
    }

    public name(): string {
        return (
            this.element.tags?.name ??
            this.element.tags?.amenity ??
            String(this.element.id)
        )
    }

    public distance(pos: SphericalPoint): number {
        return distance(this.location, pos)
    }
}
