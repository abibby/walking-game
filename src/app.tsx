import { POI } from 'components/poi'
import { distance, SphericalPoint } from 'coords'
import { PointOfInterest } from 'database'
import { useGeolocation } from 'hooks/geolocation'
import { getPoints } from 'poi'
import { FunctionalComponent, h, render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { by } from 'utils'
import { Inventory } from './components/inventory'

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

    const pois = points
        .filter(p => p.distance(pos) < 1000 && p.element.tags?.amenity)
        .sort(by(p => p.distance(pos)))

    return (
        <div>
            <h1>Game</h1>
            <div>
                ({pos.latitude}, {pos.longitude})
            </div>

            <Inventory />

            {loadingPoints && 'Loading ...'}

            <div>
                {pois.map(p => (
                    <POI poi={p} pos={pos} />
                ))}
            </div>
        </div>
    )
}

render(<App />, document.getElementById('app')!)
