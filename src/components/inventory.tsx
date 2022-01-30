import { DB } from 'database'
import { useLiveQuery } from '../hooks/dexie-react-hooks'
import { FunctionalComponent, h } from 'preact'
import { addItems, getItemName, Item, tradeItems } from 'inventory'
import { bind } from '@zwzn/spicy'

export interface InventoryProps {}

export const Inventory: FunctionalComponent<InventoryProps> = props => {
    const inventory = useLiveQuery(async () => {
        return DB.inventory.toArray()
    })

    return (
        <div>
            <h1>Inventory</h1>
            <button onClick={bind(Item.A, 1, addItems)}>Add A</button>
            <button onClick={bind(Item.A, 2, Item.B, 1, tradeItems)}>
                Trade 2A for 1B
            </button>
            <ul>
                {inventory?.map(i => (
                    <li>
                        {getItemName(i.item)}: {i.quantity}
                    </li>
                ))}
            </ul>
        </div>
    )
}
