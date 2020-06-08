import React, { Component } from 'react'
import { GET_ARTIST_ARTWORKS_URL } from '../constants'
import './ArtworksGrid.css'
import '../common/CubeSpinner'
import GridView from './GridView'
import CubeSpinner from './../common/CubeSpinner'
import { GRID_PAGE_SIZE, ARTIST_URL } from './../constants'
import ArtworkCell from './ArtworkCell.js'
import { Link } from 'react-router-dom'
import BlackAndWhiteLink from '../common/BlackAndWhiteLink'

export default class ArtworksGrid extends Component {
    constructor(props) {
        super(props);
        this.artistId = this.props.match.params.artistId;
        this.state = {
            isLoaded: false,
            paintings: null
        }
    }

    componentDidMount() {
        this.fetchPaintings()
            .then(receivedPaintings =>
                this.setState({
                    isLoaded: true,
                    paintings: receivedPaintings
                })
            )
    }

    async fetchPaintings() {
        const response = await fetch(`${GET_ARTIST_ARTWORKS_URL(this.artistId)}`);
        const data = await response.json()
        return data
    }

    getArtistName() {
        return this.artistId
            .split("-")
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(" ");
    }

    render() {
        return (
            <div>
                <h2 className="ArtworkGrid-title">
                    <BlackAndWhiteLink to={ARTIST_URL + this.artistId}>
                        {this.getArtistName()}
                    </BlackAndWhiteLink>

                    <span style={{fontWeight: 'normal' }}> paintings</span>
                </h2>

                {this.state.isLoaded
                    ? <GridView
                        cellsData={this.state.paintings}
                        cellComponent={<ArtworkCell />}
                        pageSize={GRID_PAGE_SIZE}
                    />
                    : <CubeSpinner />}
            </div>
        )
    }
}
