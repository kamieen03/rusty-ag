import React, { Component } from 'react'
import Entity from './Entity.js'
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
        var artworkId;
        if ('match' in this.props) {
            artworkId = this.props.match.params
        } else {
            artworkId = this.props.artworkId
        }

        const title = "title";
        const fields = [
            ["artist_name", "Artist"], 
            ["completition_year", "Completition year"], 
            ["location", "Location"],
            ["gallery", "Gallery"],
            ["size_x", "Width"],
            ["size_y", "Height"]
        ];
        
        const imgField = "image";

        return (
            <div className="Artwork">
                <Entity id={artworkId} url={GET_ARTWORK_URL} title={title} fields={fields} imgField={imgField} onEntityLoad={this.handleArtworkLoad} onEntityUpdate={this.handleArtworkUpdate} />
            </div>
        )
    }
}
