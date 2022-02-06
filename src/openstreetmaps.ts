import { SphericalPoint } from 'coords'

interface BoundingBox {
    top: number
    bottom: number
    left: number
    right: number
}

export function centeredBoundingBox(
    center: SphericalPoint,
    size: SphericalPoint,
): BoundingBox {
    return {
        top: center.latitude + size.latitude,
        bottom: center.latitude - size.latitude,
        left: center.longitude - size.longitude,
        right: center.longitude + size.longitude,
    }
}

export interface Bounds {
    minlat: number
    minlon: number
    maxlat: number
    maxlon: number
}

export interface Element {
    changeset: number
    id: number
    lat: number
    lon: number
    tags?: Record<string, string | undefined>
    timestamp: string
    type: string
    uid: number
    user: string
    version: number
}

export interface Map {
    attribution: string
    bounds: Bounds
    copyright: string
    elements: Element[]
    length: 400
    generator: string
    license: string
    version: string
}

/**
 * https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_.2Fapi.2F0.6.2Fmap
 */
export async function map(bbox: BoundingBox): Promise<Map> {
    const response = await fetch(
        `https://www.openstreetmap.org/api/0.6/map.json?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}`,
    )

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return response.json()
}
