import React, { Component } from 'react';
import NoPhotoAvailable from './../error/NoPhotoAvailable.js';
import './LoadablePhoto.css';

export default class LoadablePhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            hasError: false
        }
    }

    handleLoading = () => {
        this.setState({
            isLoaded: true,
            hasError: false
        })
    }

    handleError = () => {
        this.setState({
            isLoaded: true,
            hasError: true
        });
    }

    render() {
        const className = this.state.isLoaded
            ? "img-loaded"
            : "img-loading";

        return (
            !this.state.hasError
                ? <img
                    src={this.props.src}
                    alt=""
                    className={className + " " + this.props.styleName}
                    onLoad={this.handleLoading}
                    onError={this.handleError} />
                : <NoPhotoAvailable />
        )
    }
}

