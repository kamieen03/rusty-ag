import React from 'react'
import './NoPhotoAvailable.css'
import { MdBrokenImage } from 'react-icons/md';

export default function NoPhotoAvailable() {
    return (
        <div className="NoPhotoAvailable">
            <MdBrokenImage className="NoPhotoAvailable-icon"/>
            <div className="NoPhotoAvailable-dialog">
                No image available
            </div>
        </div>
    )
}
