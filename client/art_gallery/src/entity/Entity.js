import React, { Component } from 'react'
import CubeSpinner from './../common/CubeSpinner.js'
import './Entity.css'

export default class Entity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            data: null,
        };
    }


    componentDidMount() {
        this.updateArtist();
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.props.onEntityUpdate();
            this.setState({
                isLoaded: false,
                data: null,
            });

            this.updateArtist();
        }
    }


    async updateArtist() {
        const receivedData = await this.fetchEntityData();
        const img = new Image();

        img.onload = () => {
            this.setState({
                isLoaded: true,
                data: receivedData,
            });
            this.props.onEntityLoad();
        };

        img.src = receivedData[this.props.imgField];
    }

    async fetchEntityData() {
        const response = await fetch(`${this.props.url}${this.props.id}`);
        const data = await response.json()
        return data
    }

    generateDescription() {
        return this.props.fields
            .filter(field => this.state.data[field[0]] != null)
            .map(field =>
                <div className="Entity-description-item">
                    <div className="Entity-description-item-property">
                        {field[1] + ":"}
                    </div>
                    <div className="Entity-description-item-value">
                        {this.state.data[field[0]]}
                    </div>
                </div>
            );
    }


    render() {
        if (this.state.isLoaded) {
            return (
                <div className="Entity">
                    <div className="Entity-description">
                        <h1 className="Entity-description-title">{this.state.data[this.props.title]}</h1>
                        {this.generateDescription()}
                    </div>
                    <div className="Entity-image" style={{backgroundImage: `url("${this.state.data[this.props.imgField]}")`}}></div>
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
