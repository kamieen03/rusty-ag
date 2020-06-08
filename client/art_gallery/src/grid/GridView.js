import React, { Component } from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroller';
import './GridView.css'

export default class GridView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: [],
            hasMore: this.props.cellsData.length > this.props.pageSize,
            initialLoad: true
        }

        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    handleLoadMore(page) {
        const nextCellsNumber = this.props.pageSize * page;

        if (this.state.initialLoad === true) {
            this.setState({ initialLoad: false });
        }

        if (this.props.cellsData.length > nextCellsNumber) {
            this.setState({ cells: this.props.cellsData.slice(0, nextCellsNumber) });
        } else {
            this.setState({ cells: this.props.cellsData.slice(0, this.props.cellsData.length) });
        }
    }

    render() {
        const Cell = this.props.cellComponent;

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.handleLoadMore}
                hasMore={this.state.hasMore}
                initialLoad={this.state.initialLoad}
                useWindow={true}
                className="GridView"
            >
                {this.state.cells.map((cellData, i) =>
                    React.cloneElement(Cell, {
                        key: i,
                        data: cellData
                    })
                )}
            </InfiniteScroll>
        )
    }
}
