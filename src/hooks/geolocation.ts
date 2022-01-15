import { useEffect, useState } from 'preact/hooks'
export function useGeolocation(
    options?: PositionOptions,
): [GeolocationPosition | null, GeolocationPositionError | null] {
    const [pos, setPos] = useState<GeolocationPosition | null>(null)
    const [err, setErr] = useState<GeolocationPositionError | null>(null)
    const {
        enableHighAccuracy,
        maximumAge,
        timeout,
    } = options ?? {}
    useEffect(() => {
        const cancel = navigator.geolocation.watchPosition(
            pos => {
                setPos(pos)
                setErr(null)
            },
            err => {
                setPos(null)
                setErr(err)
            },
            {
                enableHighAccuracy,
                maximumAge,
                timeout,
            },
        )
        return () => {
            navigator.geolocation.clearWatch(cancel)
        }
    }, [enableHighAccuracy, maximumAge, timeout])
    return [pos, err]
}
