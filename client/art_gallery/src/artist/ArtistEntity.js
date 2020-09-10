import React from 'react'
import Entity from '../entity/Entity.js'
import ArtistEntityDescription from './ArtistEntityDescription.js'
import ArtistEntityImage from './ArtistEntityImage.js'
import { GET_ARTIST_URL } from './../constants'
import './ArtistEntity.css'

export default function ArtistEntity(props) {
    return (
        <Entity
            id={props.id}
            url={GET_ARTIST_URL}
            description={<ArtistEntityDescription />}
            image={<ArtistEntityImage />}
            onEntityChange={props.onArtistChange} />
    )
}
