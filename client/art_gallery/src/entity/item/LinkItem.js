import React from 'react'
import Item from './Item'
import { Link } from 'react-router-dom'

export default function LinkItem(props) {
    return (
        <Item
            name={props.name}
            value={
                <Link to={props.to}>
                    {props.value}
                </Link>
            } />
    )
}
