import React from 'react'
import './ArtMovementCell.css'
import { Link } from 'react-router-dom'
import { ART_MOVEMENT_URL, ARTIST_URL } from '../constants'
import { nameToId } from './../helper'

export default function ArtMovementCell(props) {
    const backgroundImageStyle = {
        backgroundImage: `url(${props.data.image})`,
        backgroundSize: 'cover',
        height: `100%`
    }

    return (
        <div className="ArtMovementCell">
            <div className="ArtMovementCell-picture">
                <Link to={ART_MOVEMENT_URL + props.contentId}>
                    <div style={backgroundImageStyle}></div>
                </Link>
            </div>

            <div className="ArtMovementCell-description">
                <div className="ArtMovementCell-description-title">
                    {props.data.title}
                </div>
                    <Link to={ARTIST_URL + nameToId(props.data.artist_name)} className="ArtMovementCell-description-artist" >
                        {props.data.artist_name}
                    </Link>
                <div className="ArtMovementCell-description-year">
                    {props.data.year}
                </div>
            </div>
        </div>
    )
}
