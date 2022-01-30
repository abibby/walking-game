import { SphericalPoint } from 'coords'
import Dexie from 'dexie'
import { Item } from 'inventory'

export interface PointOfInterest {
    id: number
    location: SphericalPoint
    name: string
}

export interface Chunk {
    id: string
    location: SphericalPoint
}

export interface InventoryItem {
    item: Item
    quantity: number
}

class Database extends Dexie {
    pois: Dexie.Table<PointOfInterest, number>
    chunks: Dexie.Table<Chunk, string>
    inventory: Dexie.Table<InventoryItem, string>

    constructor() {
        super('Database')
        this.version(1).stores({
            pois: 'id, [location.latitude+location.longitude]',
            chunks: 'id, [location.latitude+location.longitude]',
            inventory: 'item',
        })

        this.pois = this.table('pois')
        this.chunks = this.table('chunks')
        this.inventory = this.table('inventory')
    }
}

export const DB = new Database()
