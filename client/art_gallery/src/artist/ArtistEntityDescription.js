import React from 'react'
import EntityDescription from './../entity/EntityDescription'
import Item from './../entity/item/Item.js'
import MultiLinkItem from './../entity/item/MultiLinksItem.js'
import MultiItem from '../entity/item/MultiItem';

export default function ArtistEntityDescription(props) {
    const data = props.data;
    return (
        <EntityDescription title={data.name}>
            {data.birth &&
                <Item
                    name="Born"
                    value={data.birth} />}
            {data.death &&
                <Item
                    name="Died"
                    value={data.death} />}
            {data.nationality &&
                <Item
                    name="Nationality"
                    value={data.nationality} />}
            {data.field &&
                <MultiItem
                    name="Field"
                    values={data.field} />}
            {data.painting_school &&
                <Item
                    name="Painting school"
                    value={data.painting_school} />}
            {data.art_movement &&
                <MultiLinkItem
                    name="Art movement"
                    links={data.art_movement} />}
            {data.influenced_by &&
                <MultiLinkItem
                    name="Influenced by"
                    links={data.influenced_by} />}
        </EntityDescription>
    )
}
