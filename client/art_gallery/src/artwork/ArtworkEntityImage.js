import React from 'react'
import EntityImage from '../entity/EntityImage'

export default function ArtworkEntityImage(props) {
    return (
        <EntityImage src={props.data.image} onLoad={props.onLoad} /> 
    )
}
