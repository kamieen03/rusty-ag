import React from 'react';
import './App.css'
import Header from './common/Header.js'
import Searcher from './searching/Searcher.js'
import ArtistEntity from './entity/ArtistEntity';
import Paintings from './entity/Paintings'
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import ArtworkEntity from './entity/ArtworkEntity';


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
							<Route path="/artist/:artistId/paintings/" component={Paintings} />
							<Route path="/artist/:artistId/" component={ArtistEntity} />
							<Route path="/paintings/:artworkId/" component={ArtworkEntity} />
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