import { SphericalPoint } from 'coords'
import Dexie from 'dexie'

export interface PointOfInterest {
    id: number
    location: SphericalPoint
    name: string
}

export interface Chunk {
    id: string
    location: SphericalPoint
}

class Database extends Dexie {
    pois: Dexie.Table<PointOfInterest, number>
    chunks: Dexie.Table<Chunk, string>

    constructor() {
        super('Database')
        this.version(1).stores({
            pois: 'id, [location.latitude+location.longitude]',
            chunks: 'id, [location.latitude+location.longitude]',
        })

        this.pois = this.table('pois')
        this.chunks = this.table('chunks')
    }
}

export const DB = new Database()
