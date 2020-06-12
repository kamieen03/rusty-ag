import React from 'react'
import './LinkList.css'
import {Link} from "react-router-dom";

export default function LinkList(props) {
    const max_items = 10;

    function generateLinks() {
        return props.data.slice(0, max_items).map((item, i) => 
            <li key={item[props.idFieldName]} className="LinkList-item">
                <Link to={props.url + item[props.idFieldName]} onClick={() => props.onLinkClick()}>
                    {item[props.valueFieldName]}
                </Link>
            </li>
        )
    }

    return (
        <ul> {props.data !== undefined
            ? generateLinks()
            : null}
        </ul>
    )
}
