import React, { Component } from 'react';
import './Entity.css';
import NoContentMessage from './../error/NoContentMessage';
import CubeSpinner from './../common/CubeSpinner.js';


export default class Entity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            hasError: false,
            data: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.props.onEntityChange(false);
            this.reset();
            this.fetchData();
        }   
    }

    reset() {
        this.setState({
            isLoaded: false,
            hasError: false,
            data: []
        });
    }

    

    async fetchData() {
        try {
            const response = await fetch(`${this.props.url}${this.props.id}`);
            const receivedData = await response.json();
            this.setState({
                isLoaded: true,
                data: receivedData,
                hasError: false
            });
            this.props.onEntityChange(true);
        } catch (e) {
            this.setState({ hasError: true, isLoaded:true });
            this.props.onEntityChange(true);
        }
    }

    render() {
        const description = React.cloneElement(this.props.description, {
            data: this.state.data,
            // className: this.props.description.props.className + " Entity-description"
        })

        const image = React.cloneElement(this.props.image, {
            data: this.state.data,
            // className: this.props.image.props.className + " Entity-image",
            onLoad: () => null
        })

        const entity =
            <div className="Entity">
                {description}
                {image}
            </div>

        const noContent =
            <div className="Entity-nocontent">
                <NoContentMessage />
            </div>

        if (!this.state.isLoaded) {
            return <CubeSpinner />
        }

        return (
            !this.state.hasError
                ? entity
                : noContent
        )
    }
}
