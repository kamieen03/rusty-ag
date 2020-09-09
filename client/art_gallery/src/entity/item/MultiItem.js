import React from 'react'
import Item from './Item'


export default function MultiItem(props) {
    const valuesList =
        <ul>
            {props.values.map((value, i) =>
                <li key={i}>{value}</li>
            )}
        </ul>

    return (
        <Item
            name={props.name}
            value={valuesList}
        />
    )
}
