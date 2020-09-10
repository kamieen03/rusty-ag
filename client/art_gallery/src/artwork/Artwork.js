import React, { Component } from 'react'
import ArtworkEntity from './ArtworkEntity'


export default class Artwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isArtworkLoaded: false
        }
        this.handleArtworkChange = this.handleArtworkChange.bind(this);
    }

    handleArtworkChange(isArtworkLoaded) {
        this.setState({ isArtworkLoaded: isArtworkLoaded });
    }

    render() {
        let artworkId;
        if ('match' in this.props) {
            artworkId = this.props.match.params.artworkId
        } else {
            artworkId = this.props.artworkId
        }

        return (
            <div className="Artwork">
                <ArtworkEntity id={artworkId} onArtworkChange={this.handleArtworkChange} />
            </div>
        )
    }
}

