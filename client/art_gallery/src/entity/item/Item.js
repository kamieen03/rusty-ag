import React from 'react';
import './Item.css';

export default function Item(props) {
    return (
        <li key={props.name} className="Item">
            <div className="Item-name">
                {props.name}
            </div>
            <div className="Item-value">
                {props.value}
            </div>
        </li>
    )
}
