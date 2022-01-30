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
