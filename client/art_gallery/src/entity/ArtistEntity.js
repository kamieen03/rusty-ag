import React, { Component } from 'react'
import Entity from './Entity.js'
import { GET_ARTIST_URL } from './../constants'
import { Link } from 'react-router-dom'
import './ArtistEntity.css'


export default class ArtistEntity extends Component {
    constructor(props) {
        super(props);
        this.state = { isEntityLoaded: false }
        this.handleArtistLoad = this.handleArtistLoad.bind(this);
        this.handleArtistUpdate = this.handleArtistUpdate.bind(this);
    }

    handleArtistLoad() {
        this.setState({ isEntityLoaded: true })
    }

    handleArtistUpdate() {
        this.setState({ isEntityLoaded: false })
    }

    render() {
        const { artistId } = this.props.match.params
        const name = "name";
        const fields = [["birth", "Born"], ["death", "Died"]];
        const imgField= "image_url";

        return (
            <div className="Artist">
                <Entity id={artistId} 
                    url={GET_ARTIST_URL} 
                    title={name} 
                    fields={fields} 
                    imgField={imgField} 
                    onEntityLoad={this.handleArtistLoad} 
                    onEntityUpdate={this.handleArtistUpdate} 
                    className="Artist-entity"
                />
                {this.state.isEntityLoaded
                    ? <Link className="Artist-artworks" to={`/artist/${artistId}/paintings/`}>See artworks</Link>
                    : null }
            </div>
        )
    }
}
