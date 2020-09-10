import React from 'react'
import EntityImage from '../entity/EntityImage'
import StyleTransferButton from './StyleTransferButton'
import './ArtworkEntityImage.css'

export default function ArtworkEntityImage(props) {
    return (
        <div className="ArtworkEntityImage">
            <EntityImage src={props.data.image} onLoad={props.onLoad} />
            <div className="ArtworkEntityImage-upload">
                <StyleTransferButton
                    text="Style transfer"
                    artworkId={props.artworkId}
                    className="ArtworkEntityImage-upload" />
            </div>
        </div>
    )
}
