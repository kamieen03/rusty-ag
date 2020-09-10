import React from 'react'
import EntityDescription from './../entity/EntityDescription'
import Item from './../entity/item/Item'
import LinkItem from './../entity/item/LinkItem'
import { ARTIST_URL } from './../constants.js'
import MultiLinksItem from '../entity/item/MultiLinksItem'
import MultiItem from '../entity/item/MultiItem'


export default function ArtworkEntityDescription(props) {
    const data = props.data;
    return (
        <EntityDescription title={data.title}>
            {data.artist_name && data.artist_url &&
                <LinkItem
                    name="Artist"
                    value={data.artist_name}
                    to={ARTIST_URL + data.artist_url} />}
            {data.completition_year &&
                <Item
                    name="Year"
                    value={data.completition_year} />}
            {data.period &&
                <Item
                    name="Period"
                    value={data.period} />}
            {data.serie &&
                <Item
                    name="Serie"
                    value={data.serie} />}
            {data.location &&
                <Item
                    name="Location"
                    value={data.location} />}
            {data.gallery &&
                <Item
                    name="Gallery"
                    value={data.gallery} />}
            {data.media[0] &&
                <MultiItem
                    name="Media"
                    values={data.media} />}
            {data.size_x && data.size_y &&
                <Item
                    name="Size"
                    value={data.size_x + " x " + data.size_y} />}
            {data.styles &&
                <MultiLinksItem
                    name="Styles"
                    links={data.styles} />}
        </EntityDescription>
    )
}
