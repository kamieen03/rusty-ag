import React from 'react'
import './LinkList.css'
import {Link} from "react-router-dom";

export default function LinkList(props) {

    function generateLinks() {
        return props.data.slice(0,8).map(elem => 
            <li className="LinkList-item">
                <Link to={props.url + "/" + elem[props.idFieldName]} onClick={() => props.onLinkClick()}>
                    {elem[props.valueFieldName]}
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
