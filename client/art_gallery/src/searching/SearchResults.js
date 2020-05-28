import React, { Component } from 'react'
import './SearchResults.css'
import LinkList from './LinkList.js'
import {GET_SEARCH_URL} from './../constants'


export default class SearchResults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            results: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchPhrase !== prevProps.searchPhrase) {
            console.log(this.state.results);
            this.fetchSearchResults(this.props.searchPhrase)
                .then(data => this.setState({ results: data }))
        }
    }

    async fetchSearchResults(phrase) {
        const response = fetch(`${GET_SEARCH_URL}${phrase}`)
        return (await response).json()
    }

    render() {
        if (this.props.searchPhrase === "") {
            return null;
        }

        return (
            <div className="SearchResults">
                <div className="SearchResults-list">
                    <h1>Artists</h1>
                    <LinkList onLinkClick={this.props.onLinkClick} data={this.state.results.artists} idFieldName="url" valueFieldName="name" url="/artist" />
                </div>
                <div className="SearchResults-list">
                    <h1>Paintings</h1>
                    <LinkList onLinkClick={this.props.onLinkClick} data={this.state.results.artworks} idFieldName="id" valueFieldName="name" url="/paintings" />
                </div>
                <div className="SearchResults-list">
                    <h1>Styles</h1>
                    <LinkList onLinkClick={this.props.onLinkClick} data={this.state.results.styles} idFieldName="url" valueFieldName="title" url="/art_movement" />
                </div>
            </div>
        )
    }
}
