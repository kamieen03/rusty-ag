import React from 'react';
import LoadablePhoto from '../common/LoadablePhoto';
import './EntityImage.css';

export default function EntityImage(props) {
    return (
        <div className="EntityImage">
            <LoadablePhoto 
                src={props.src} 
                onLoad={props.onLoad} 
                styleName="EntityImage-image" />
        </div>
    )
}
