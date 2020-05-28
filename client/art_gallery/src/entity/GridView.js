import React, { Component } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './GridView.css'

export default class GridView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
        }
    }

    render() {
        const from = (this.state.pageIndex - 1) * this.pageSize;
        const to = this.state.pageIndex * this.pageSize;

        return (
            <div>
                {this.props.images.slice(0,20).map(image =>
                    <LazyLoadImage src={image.image} className="" />
                )}
            </div>
        )
    }
}
