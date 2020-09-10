import React from 'react'
import EntityImage from '../entity/EntityImage'

export default function ArtistEntityImage(props) {
    return (
        <EntityImage src={props.data.image_url} onLoad={props.onLoad}/>
    )
}