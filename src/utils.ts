export function byKey<T, K extends keyof T & string>(
    key: K,
): (a: T, b: T) => number {
    return (a: T, b: T) => {
        if (a[key] > b[key]) {
            return 1
        }
        if (a[key] < b[key]) {
            return -1
        }
        return 0
    }
}

export function by<T, U>(callback: (v: T) => U): (a: T, b: T) => number {
    return (a: T, b: T) => {
        const compA = callback(a)
        const compB = callback(b)
        if (compA > compB) {
            return 1
        }
        if (compA < compB) {
            return -1
        }
        return 0
    }
}
