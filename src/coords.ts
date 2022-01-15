export interface PolarPoint {
    bearing: number
    distance: number
}
export interface SphericalPoint {
    latitude: number
    longitude: number
}
export interface Point {
    x: number
    y: number
}

function distance(a: SphericalPoint, b: SphericalPoint): number {
    const R = 6371e3 // metres
    const aLat = (a.latitude * Math.PI) / 180
    const bLat = (b.latitude * Math.PI) / 180
    const latDiff = ((b.latitude - a.latitude) * Math.PI) / 180
    const longDiff = ((b.longitude - a.longitude) * Math.PI) / 180

    const haversine =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(aLat) *
            Math.cos(bLat) *
            Math.sin(longDiff / 2) *
            Math.sin(longDiff / 2)
    const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))

    return R * c // in metres
}

function bearing(a: SphericalPoint, b: SphericalPoint): number {
    const aLat = (a.latitude * Math.PI) / 180
    const bLat = (b.latitude * Math.PI) / 180
    const aLong = (a.longitude * Math.PI) / 180
    const bLong = (b.longitude * Math.PI) / 180

    const y = Math.sin(bLong - aLong) * Math.cos(bLat)
    const x =
        Math.cos(aLat) * Math.sin(bLat) -
        Math.sin(aLat) * Math.cos(bLat) * Math.cos(bLong - aLong)

    return (Math.atan2(y, x) - Math.PI / 2) % (Math.PI * 2)
}

export function polar(root: SphericalPoint, pos: SphericalPoint): PolarPoint {
    return {
        bearing: bearing(root, pos),
        distance: distance(root, pos),
    }
}

export function cartesian(root: SphericalPoint, pos: SphericalPoint): Point {
    const { bearing, distance } = polar(root, pos)
    return {
        x: distance * Math.cos(bearing),
        y: distance * Math.sin(bearing),
    }
}
