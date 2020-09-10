import React from 'react'
import Entity from '../entity/Entity.js'
import { GET_ARTWORK_URL } from './../constants'
import ArtworkEntityDescription from './ArtworkEntityDescription'
import './ArtworkEntity.css'
import ArtworkEntityImage from './ArtworkEntityImage.js'


export default function ArtworkEntity(props) {
    return (
        <Entity
            id={props.id}
            url={GET_ARTWORK_URL}
            description={<ArtworkEntityDescription />}
            image={<ArtworkEntityImage artworkId={props.id} />}
            onEntityChange={props.onArtworkChange} />
    )
}

