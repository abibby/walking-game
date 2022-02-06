export type Random = () => number

function mulberry32(a: number): Random {
    return function () {
        var t = (a += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const millisecond = 1
const second = 1000 * millisecond
const minute = second * 60
const hour = minute * 60
const day = hour * 60

function currentDay() {
    return Math.floor(Date.now() / day)
}

export function randByDay(seed: number): Random {
    const day = currentDay()
    const a = 9302219081
    const b = 8641015441
    const c = 32567
    const d = 15846
    return mulberry32((Math.imul(a, day) + Math.imul(b, seed) + c) ^ d)
}
