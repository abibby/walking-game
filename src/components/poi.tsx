import { bind } from '@zwzn/spicy'
import { SphericalPoint } from 'coords'
import { PointOfInterest } from 'database'
import { getItemName, Item, randomItem, tradeItems } from 'inventory'
import { FunctionalComponent, h } from 'preact'
import { randByDay } from 'random'

export interface POIProps {
    poi: PointOfInterest
    pos: SphericalPoint
}

export const POI: FunctionalComponent<POIProps> = ({ poi, pos }) => {
    const dist = poi.distance(pos)
    const rand = randByDay(poi.id)

    console.log(Item)

    const resourceFrom = randomItem(rand)
    const resourceTo = randomItem(rand)

    return (
        <div style='border: solid 1px;'>
            <div>{poi.name()}</div>
            <div>{Math.round(dist)}m</div>
            {/* <pre>{JSON.stringify(poi.element, undefined, '    ')}</pre> */}
            {rand()}
            {dist < 1500 && (
                <div>
                    <button
                        onClick={bind(
                            resourceFrom,
                            1,
                            resourceTo,
                            1,
                            tradeItems,
                        )}
                    >
                        trade {getItemName(resourceFrom)} for{' '}
                        {getItemName(resourceTo)}
                    </button>
                </div>
            )}
        </div>
    )
}
