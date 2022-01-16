import { FunctionalComponent, h } from 'preact'

export interface EntityProps {
    name: string
    x: number
    y: number
}

export const Entity: FunctionalComponent<EntityProps> = props => {
    return (
        <text x={props.x} y={props.y}>
            {props.name}
        </text>
    )
}
