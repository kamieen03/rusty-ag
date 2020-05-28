import React from 'react';
import './Searcher.css'
import SearchResults from './SearchResults'
import { MdClose } from 'react-icons/md';
import { IconButton } from '@material-ui/core';

export default class Searcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phrase: "",
		};

		this.handleSearchPhraseChange = this.handleSearchPhraseChange.bind(this);
	}


	handleSearchPhraseChange(event) {
		this.setState({phrase: event.target.value});
	}

	render() {
		return (
			<div className="Searcher">
				<IconButton onClick={this.props.onStopSearching} className="Searcher-close">
					<MdClose className="Searcher-close-icon"/>
				</IconButton>
				<input className="Searcher-searchbar"type="search"  placeholder="Search" onChange={this.handleSearchPhraseChange}/>
				<SearchResults searchPhrase={this.state.phrase} onLinkClick={this.props.onStopSearching}/>
			</div>
		);
	}
}