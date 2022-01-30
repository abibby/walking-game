import { DB } from 'database'

export enum Item {
    A = 'a',
    B = 'b',
    C = 'c',
    D = 'd',
    E = 'e',
    F = 'f',
    G = 'g',
    H = 'h',
    I = 'i',
    J = 'j',
    K = 'k',
    L = 'l',
    M = 'm',
    N = 'n',
    O = 'o',
    P = 'p',
    Q = 'q',
    R = 'r',
    S = 's',
    T = 't',
    U = 'u',
    V = 'v',
    W = 'w',
    X = 'x',
    Y = 'y',
    Z = 'z',
}

export function getItemName(i: Item): string {
    for (const [name, key] of Object.entries(Item)) {
        if (i === key) {
            return name
        }
    }
    return i
}

export async function addItems(item: Item, quantity: number) {
    DB.transaction('rw', DB.inventory, async tx => {
        const i = (await DB.inventory.get(item)) ?? {
            item: item,
            quantity: 0,
        }
        i.quantity += quantity
        DB.inventory.put(i)
    })
}

export async function tradeItems(
    itemGive: Item,
    quantityGive: number,
    itemRecieve: Item,
    quantityRecieve: number,
): Promise<boolean> {
    return DB.transaction('rw', DB.inventory, async (): Promise<boolean> => {
        const ig = (await DB.inventory.get(itemGive)) ?? {
            item: itemGive,
            quantity: 0,
        }
        if (quantityGive > ig.quantity) {
            return false
        }
        ig.quantity -= quantityGive
        DB.inventory.put(ig)

        const ir = (await DB.inventory.get(itemRecieve)) ?? {
            item: itemRecieve,
            quantity: 0,
        }
        ir.quantity += quantityRecieve
        DB.inventory.put(ir)
        return true
    })
}
