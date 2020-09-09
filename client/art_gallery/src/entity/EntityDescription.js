import React from 'react';
import './EntityDescription.css';

export default function EntityDescription(props) {
    return (
        <div className="EntityDescription">
            <div className="EntityDescription-title">
                {props.title}
            </div>
            <ul className="EntityDescription-properties">
                {props.children}
            </ul>
        </div>
    )
}
