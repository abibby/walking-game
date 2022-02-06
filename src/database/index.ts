import { SphericalPoint } from 'coords'
import Dexie from 'dexie'
import { Item } from 'inventory'
import PointOfInterest from './PointOfInterest'
import { State } from './State'

export { PointOfInterest, State }

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
    state: Dexie.Table<State, string>

    constructor() {
        super('Database')
        this.version(1).stores({
            pois: 'id, [location.latitude+location.longitude]',
            chunks: 'id, [location.latitude+location.longitude]',
            inventory: 'item',
            state: 'key',
        })

        this.pois = this.table('pois')
        this.chunks = this.table('chunks')
        this.inventory = this.table('inventory')
        this.state = this.table('state')

        this.pois.mapToClass(PointOfInterest)
    }
}

export const DB = new Database()
