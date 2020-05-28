import React, { Component } from 'react'
import { GET_ARTIST_ARTWORKS_URL } from './../constants'
import './Paintings.css'
import './../common/CubeSpinner'
import CubeSpinner from './../common/CubeSpinner';
import GridView from './GridView'

export default class Paintings extends Component {
    constructor(props) {
        super(props);
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
        const { artistId } = this.props.match.params
        const response = await fetch(`${GET_ARTIST_ARTWORKS_URL(artistId)}`);
        const data = await response.json()
        return data
    }

    handleLoaded() {

    }

    handleStartLoading() {
        this.setState({isLoaded: false});
    }


    render() {

        if (this.state.isLoaded) {
            return (
                <div>
                    <GridView images={this.state.paintings} pageSize={10}/>
                </div>
            )
        } else {
            return (
                <div>
                    <CubeSpinner />
                </div>
            )
        }

    }
}
