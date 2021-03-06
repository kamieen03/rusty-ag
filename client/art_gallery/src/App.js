import React from 'react';
import './App.css';
import Header from './common/Header.js';
import Searcher from './searching/Searcher.js';
import Artist from './artist/Artist';
import Artwork from './artwork/Artwork';
import ArtworksGrid from './artwork/ArtworksGrid';
import ArtMovementGrid from './artmovement/ArtMovementGrid';
import Popular from './popular/Popular';

import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSearching: false,
		};

		this.handleStartSearching = this.handleStartSearching.bind(this)
		this.handleStopSearching = this.handleStopSearching.bind(this)
	}

	handleStartSearching() {
		this.setState({ isSearching: true })
	}

	handleStopSearching() {
		this.setState({ isSearching: false })
	}

	render() {
		return (
			<Router>
				<div className="App">
					<header className="App-header">
						<Header onStartSearching={this.handleStartSearching} />
					</header>
					<main className="App-main">
						<Switch>
							<Route path="/artist/:artistId/paintings/" component={ArtworksGrid} />
							<Route path="/artist/:artistId/" component={Artist} />
							<Route path="/paintings/:artworkId/" component={Artwork} />
							<Route path="/art_movement/:artMovementId/" component={ArtMovementGrid} />
                            <Route path="/" component={Popular}/>
						</Switch>
					</main>
					{this.state.isSearching
						? <div className="App-searcher"><Searcher onStopSearching={this.handleStopSearching} /></div>
						: null}
				</div>
			</Router>
		);
	}
}

export default App;
