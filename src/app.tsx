import { distance, SphericalPoint } from 'coords'
import { PointOfInterest } from 'database'
import { useGeolocation } from 'hooks/geolocation'
import { getPoints } from 'poi'
import { FunctionalComponent, h, render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { byKey } from 'utils'
import { Inventory } from './components/inventory'

interface PointOfInterestDistance extends PointOfInterest {
    distance: number
}

const App: FunctionalComponent = () => {
    const [pos] = useGeolocation({ enableHighAccuracy: true })
    const [lastFech, setLastFech] = useState<SphericalPoint | null>(null)
    const [points, setPoints] = useState<PointOfInterest[]>([])
    const [loadingPoints, setLoadingPoints] = useState(false)

    useEffect(() => {
        if (pos === null) {
            return
        }
        const radius = 0.01
        if (lastFech === null || distance(pos, lastFech) > 100) {
            setLoadingPoints(true)
            getPoints(pos, radius).then(p => {
                setPoints(p)
                setLoadingPoints(false)
                setLastFech(pos)
            })
        }
    }, [pos, lastFech, setLastFech, setLoadingPoints])

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

            <Inventory />

            {loadingPoints && 'Loading ...'}

            <div>
                {poids.slice(0, 4).map(p => (
                    <div style='border: solid 1px;'>
                        <div>{p.name}</div>
                        <div>{Math.round(p.distance)}m</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

render(<App />, document.getElementById('app')!)
