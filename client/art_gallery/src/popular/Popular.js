import React, { Component } from 'react'
import { GET_POPULAR_ARTWORKS } from './../constants'
import ArtworkEntity from '../artwork/ArtworkEntity.js'
import { IconButton } from '@material-ui/core'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { MdKeyboardArrowRight } from 'react-icons/md'
import './Popular.css'


export default class Popular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auto_spin: true,
            paintings_iter: 0,
            paintings: null
        }
    }

    componentDidMount() {
        this.fetchPopular()
            .then(data => {
                this.setState({ paintings: data });
                setInterval(() => {
                    if (this.state.auto_spin) {
                        this.scroll(1, true)
                    }
                }, 7000)
            })
    }

    async fetchPopular() {
        const result = fetch(`${GET_POPULAR_ARTWORKS}`)
        return (await result).json()
    }

    scroll(n, auto_spin) {
        this.setState({
            auto_spin: auto_spin,
            paintings_iter: (() => {
                const k = (this.state.paintings_iter + n) % this.state.paintings.length;
                if (k >= 0) return k;
                return this.state.paintings.length - 1;
            })()
        });
    }



    render() {
        if (this.state.paintings == null) {
            return null;
        }

        return (
            <div className="Popular">
                <ArtworkEntity artworkId={this.state.paintings[this.state.paintings_iter].id} />
                <div className="Popular-buttons">
                    <IconButton className="Popular-next" onClick={() => this.scroll(-1, false)} >
                        <MdKeyboardArrowLeft />
                    </IconButton>
                    <IconButton className="Popular-next" onClick={() => this.scroll(1, false)} >
                        <MdKeyboardArrowRight />
                    </IconButton>
                </div>
            </div>
        )
    }
}
