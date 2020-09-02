import React from 'react'
import { Link } from 'react-router-dom'
import './BlackAndWhiteLink.css'

export default function BlackAndWhiteLink(props) {
    return (
        <Link to={props.to} className="BlackAndWhiteLink">
            {props.children}
        </Link>
    )
}
