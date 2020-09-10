import React from 'react'
import Item from './Item'
import { Link } from 'react-router-dom'

export default function MultiLinksItem(props) {
    const linksList =
        <ul>
            {props.links.map((link, i) =>
                <li key={link.name}>
                    <Link to={"/" + link.url}>
                        {link.name}
                    </Link>
                </li>
            )}
        </ul>

    return (
        <Item
            name={props.name}
            value={linksList}
        />
    )
}
