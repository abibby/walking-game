import { cartesian, SphericalPoint } from 'coords'
import { FunctionalComponent, h } from 'preact'
import { Element } from '../openstreetmaps'
import { Entity, EntityProps } from './entity'
import styles from './map.module.scss'

export interface MapProps {
    position: SphericalPoint
    elements: Element[]
    scale: number
}

export const Map: FunctionalComponent<MapProps> = props => {
    const entities: EntityProps[] = props.elements.map(e => {
        const p = cartesian(props.position, {
            longitude: e.lon,
            latitude: e.lat,
        })
        return {
            name: e.tags?.name ?? '',
            x: p.x * props.scale,
            y: p.y * props.scale,
        }
    })
    return (
        <svg class={styles.map}>
            {entities.map(e => (
                <Entity {...e} />
            ))}
        </svg>
    )
}
