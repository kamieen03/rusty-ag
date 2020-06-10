import React from 'react'
import './ArtworksGrid.css'
import '../common/CubeSpinner'
import { GET_ARTIST_ARTWORKS_URL, ARTIST_URL } from './../constants'
import ArtworkCell from './ArtworkCell.js'
import { useParams } from 'react-router-dom'
import BlackAndWhiteLink from '../common/BlackAndWhiteLink.js'
import Grid from './Grid'
import { idToName } from './../helper.js'

export default function ArtworksGrid() {
    const { artistId } = useParams();
    const title =
        <div>
            <BlackAndWhiteLink to={ARTIST_URL + artistId}>
                {idToName(artistId)}
            </BlackAndWhiteLink> 
            <span style={{ fontWeight: 'normal' }}> paintings</span>
        </div>;

    return (
        <Grid
            url={GET_ARTIST_ARTWORKS_URL(artistId)}
            titleComponent={title}
            cellComponent={<ArtworkCell />}
        />
    )
}
