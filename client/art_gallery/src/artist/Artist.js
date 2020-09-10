import React, { Component } from 'react';
import ArtistEntity from './ArtistEntity';
import { Link } from 'react-router-dom';

export default class Artist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isArtistLoaded: false
        }
        this.handleArtistChange = this.handleArtistChange.bind(this);
    }

    handleArtistChange(isArtistLoaded) {
        this.setState({ isArtistLoaded });
    }

    render() {
        const { artistId } = this.props.match.params;
        
        return (
            <div className="Artist">
                <ArtistEntity id={artistId} onArtistChange={this.handleArtistChange} />
                {this.state.isArtistLoaded &&
                    <Link className="Artist-artworks" to={`/artist/${artistId}/paintings/`}>See artworks</Link>}
            </div>
        )
    }
}
