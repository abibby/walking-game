import { distance, SphericalPoint } from 'coords'
import { PointOfInterest } from 'database'
import { useGeolocation } from 'hooks/geolocation'
import { getPoints } from 'poi'
import { FunctionalComponent, h, render } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface PointOfInterestDistance extends PointOfInterest {
    distance: number
}

const App: FunctionalComponent = () => {
    const [pos] = useGeolocation({ enableHighAccuracy: true })
    const [lastFech, setLastFech] = useState<SphericalPoint | null>(null)
    const [points, setPoints] = useState<PointOfInterest[]>([])

    useEffect(() => {
        if (pos === null) {
            return
        }
        const radius = 0.01
        if (lastFech === null || distance(pos, lastFech) > radius / 2) {
            getPoints(pos, radius).then(p => {
                setPoints(p)
            })
        }
    }, [pos, lastFech, setLastFech])

    if (pos === null) {
        return <div>Could not find location</div>
    }

    const poids: PointOfInterestDistance[] = points
        .map(p => ({
            ...p,
            distance: distance(p.location, pos),
        }))
        .sort(byKey('distance'))

    return (
        <div>
            <h1>Game</h1>
            <div>
                ({pos.latitude}, {pos.longitude})
            </div>

            <pre>{JSON.stringify(poids, undefined, '    ')}</pre>
            {/* <div>
                <Map elements={elements} scale={0.5} position={pos} />
            </div> */}
        </div>
    )
}

function byKey<T, K extends keyof T & string>(key: K): (a: T, b: T) => number {
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

render(<App />, document.getElementById('app')!)
