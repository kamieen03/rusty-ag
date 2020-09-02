import React from 'react'
import './ArtworkCell.css'
import { Link } from 'react-router-dom'
import { ARTWORK_URL } from '../constants'

export default function ArtworkCell(props) {
    const backgroundImageStyle = {
        backgroundImage: `url(${props.data.image})`,
        backgroundSize: 'cover',
        height: `100%`
    }

    return (
        <div className="ArtworkCell">
            <div className="ArtworkCell-picture">
                <Link to={ARTWORK_URL + props.data.contentId}>
                    <div style={backgroundImageStyle}></div>
                </Link>
            </div>

            <div className="ArtworkCell-description">
                <div className="ArtworkCell-description-title">
                    {props.data.title}
                </div>
                <div className="ArtworkCell-description-year">
                    {props.data.completitionYear}
                </div>
            </div>
        </div>
    )
}
