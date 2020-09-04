import React, { Component } from 'react'
import Entity from '../entity/Entity.js'
import { GET_ARTWORK_URL } from './../constants'
import './ArtworkEntity.css'


export default class ArtworkEntity extends Component {
    constructor(props) {
        super(props);
        this.state = { isEntityLoaded: false }
        this.handleArtworkLoad = this.handleArtworkLoad.bind(this);
        this.handleArtworkUpdate = this.handleArtworkUpdate.bind(this);
    }

    handleArtworkLoad() {
        this.setState({ isEntityLoaded: true })
    }

    handleArtworkUpdate() {
        this.setState({ isEntityLoaded: false })
    }

    render() {
        let artworkId;
        if ('match' in this.props) {
            artworkId = this.props.match.params.artworkId
        } else {
            artworkId = this.props.artworkId
        }

        const title = "title";
        
        const fields = [
            { caption: "Artist", property: "artist_name" },
            { caption: "Year", property: "completition_year" },
            { caption: "Location", property: "location" },
            { caption: "Gallery", property: "gallery" },
            { caption: "Media", property: "media" },
            { caption: "Width", property: "size_x" },
            { caption: "Height", property: "size_y" },
        ]
        
        const imgField = "image";

        return (
            <div className="Artwork">
                <Entity id={artworkId} url={GET_ARTWORK_URL} title={title} fields={fields} imgField={imgField} onEntityLoad={this.handleArtworkLoad} onEntityUpdate={this.handleArtworkUpdate} />
            </div>
        )
    }
}
