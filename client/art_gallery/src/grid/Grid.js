import React, { Component } from 'react'
import './Grid.css'
import { GRID_PAGE_SIZE } from './../constants'
import GridView from './GridView'
import CubeSpinner from './../common/CubeSpinner'

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: []
        }
    }

    async componentDidMount() {
        const items = await this.fetchItems();
        this.setState({
            isLoaded: true,
            items: items
        })
    }

    async fetchItems() {
        const response = await fetch(`${this.props.url}`);
        const data = await response.json()
        return data
    }

    decodeIdToName() {
        return this.entityId
            .split("-")
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(" ");
    }

    render() {
        return (
            <div className="Grid">
                <h2 className="Grid-title">
                    {this.props.titleComponent}
                </h2>

                {this.state.isLoaded
                    ? <GridView
                        cellsData={this.state.items}
                        cellComponent={this.props.cellComponent}
                        pageSize={GRID_PAGE_SIZE}
                    />
                    : <CubeSpinner />}
            </div>
        )
    }
}
