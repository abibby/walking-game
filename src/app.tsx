import { cartesian, polar, SphericalPoint } from 'coords'
import { useGeolocation } from 'hooks/geolocation'
import { get, set } from 'idb-keyval'
import { centeredBoundingBox, map } from 'openstreetmaps'
import { FunctionalComponent, h, render } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

const App: FunctionalComponent = () => {
    const [loc] = useGeolocation({ enableHighAccuracy: true })
    const [homePos, setHomePos] = useState<SphericalPoint | null>(null)

    const pos: SphericalPoint | undefined = loc?.coords

    useEffect(() => {
        get('home').then((h: SphericalPoint) => {
            if (h !== undefined) {
                setHomePos(h)
                map(centeredBoundingBox(h, {longitude: 0.005, latitude: 0.005}))
                    .then(m => m.elements.filter(e => e.type === 'node' && e.tags?.name).map(e => e.tags))
                    .then(console.log)
            }
        })
    }, [])
    const setHome = useCallback(
        function () {
            setHomePos(pos ?? null)
            if (pos) {
                set('home', {
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                })
            }
        },
        [pos, setHomePos],
    )

    return (
        <div>
            <h1>Game</h1>
            <div>
                ({pos?.latitude}, {pos?.longitude})
                <button onClick={setHome}>Set Home</button>
            </div>
            <div>
                <h3>Home</h3>({homePos?.latitude}, {homePos?.longitude})
            </div>
            {homePos && pos && <Coords home={homePos} pos={pos}></Coords>}
        </div>
    )
}

interface CoordsProps {
    home: SphericalPoint
    pos: SphericalPoint
}

const Coords: FunctionalComponent<CoordsProps> = props => {
    const { distance, bearing } = polar(props.home, props.pos)
    const { x, y } = cartesian(props.home, props.pos)
    return (
        <div>
            <p>
                <h3>Polar</h3>
                <b>bearing:</b> {bearing}
                <br />
                <b>distance:</b> {distance}
            </p>
            <p>
                <h3>Cartesian</h3>
                <b>x:</b> {x}
                <br />
                <b>y:</b> {y}
            </p>
        </div>
    )
}

render(<App />, document.getElementById('app')!)
