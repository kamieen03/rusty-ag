import React, { Component } from 'react'
import { GET_POPULAR_ARTWORKS } from './../constants'
import ArtworkEntity from './../entity/ArtworkEntity';
import { IconButton } from '@material-ui/core';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
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
                setInterval(()=>this.scroll(1), 7000)
            })
    }

    async fetchPopular() {
        const result = fetch(`${GET_POPULAR_ARTWORKS}`)
        return (await result).json()
    }

    scroll(n) {
        this.setState({ auto_spin: false,
                        paintings_iter: (()=>{
                            const k = (this.state.paintings_iter+n) % this.state.paintings.length;
                            if (k >= 0) return k;
                            return this.state.paintings.length-1;
                        })()
        });
    }



    render() {
        if (this.state.paintings != null) {
            return (
                <div className="Carousel">
                    <IconButton onClick={() => this.scroll(-1)} >
                        <MdKeyboardArrowLeft />
                    </IconButton>
                        <ArtworkEntity artworkId={this.state.paintings[this.state.paintings_iter].id }/>
                    <IconButton onClick={() => this.scroll(1)} >
                        <MdKeyboardArrowRight/>
                    </IconButton>
                </div>
            )
        } else {
            return (
                <div className="Carousel">
                </div>
            )
        }
    }
}
