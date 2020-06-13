import React, { Component } from 'react'
import CubeSpinner from './../common/CubeSpinner.js'
import './Entity.css'
import { Link } from 'react-router-dom';
import NoContentMessage from './../error/NoContentMessage'
import NoPhotoAvailable from './../error/NoPhotoAvailable'

export default class Entity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            hasError: false,
            hasErrorImage: false,
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
        try {
            const response = await fetch(`${this.props.url}${this.props.id}`);
            const receivedData = await response.json();
            this.setState({
                data: receivedData,
                hasError: false
            });

            const img = new Image();

            img.onload = () => {
                this.setState({
                    isLoaded: true,
                    hasErrorImage: false,
                });
                this.props.onEntityLoad();
            };

            img.onerror = () => {
                this.setState({
                    isLoaded: true,
                    hasErrorImage: true,
                });
                this.props.onEntityLoad();
            }

            img.src = receivedData[this.props.imgField];
        } catch (e) {
            this.setState({
                hasError: true
            });
        }
    }
    createDescription() {
        return this.props.fields
            .filter(field => this.state.data[field.property] != null)
            .map(field =>
                <div className="Entity-description-item" key={field.caption}>
                    <div className="Entity-description-item-property">
                        {field.caption + ":"}
                    </div>
                    <div className="Entity-description-item-value">
                        {this.createDescriptionItemValue(field)}
                    </div>
                </div>
            );
    }

    createDescriptionItemValue(field) {
        const value = this.state.data[field.property];

        if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((item, i) =>
                        <li key={i}>
                            {this.convertArrayItem(field, item)}
                        </li>)}
                </ul>
            )
        }

        return value;
    }

    convertArrayItem(field, item) {
        if (typeof item === 'object') {
            const link =
                <Link to={"/" + item[field.itemUrlProperty]}>
                    {item[field.itemIdProperty]}
                </Link>;
            return link;
        }

        return item
    }

    render() {
        if (this.state.isLoaded && this.state.data != null && !this.state.hasError) {
            const title = this.state.data[this.props.title];

            return (
                <div className="Entity">
                    <div className="Entity-description">
                        <h1 className="Entity-description-title">
                            {title
                                ? title
                                : "No title"
                            }
                        </h1>
                        {this.createDescription()}
                    </div>
                    <div className="Entity-presentation">
                        {!this.state.hasErrorImage
                            ? <img className="Entity-presentation-image" src={this.state.data[this.props.imgField]} />
                            : <NoPhotoAvailable />
                        }
                    </div>

                </div>
            )
        } else if (this.state.hasError) {
            return (
                <div className="Entity-nocontent">
                    <NoContentMessage />
                </div>
            )
        }
        else {
            return (
                <div>
                    <CubeSpinner />
                </div>
            )
        }
    }
}
