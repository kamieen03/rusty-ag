import React from 'react'
import { useParams } from 'react-router-dom'
import { idToName } from './../helper.js'
import Grid from '../grid/Grid.js'
import { GET_ART_MOVEMENT_URL } from './../constants'
import ArtMovementCell from './ArtMovementCell.js'

export default function ArtMovementGrid() {
    const { artMovementId } = useParams();
    const title = <div>{idToName(artMovementId)}</div>;

    return (
        <Grid
            url={GET_ART_MOVEMENT_URL + artMovementId}
            titleComponent={title}
            cellComponent={<ArtMovementCell />}
        />
    )
}
