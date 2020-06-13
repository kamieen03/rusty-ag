import React from 'react'
import './NoContentMessage.css'
import { MdSentimentDissatisfied } from 'react-icons/md';

export default function NoContentMessage() {
    return (
        <div className="NoContentMessage">
            <div className="NoContentMessage-dialog">
                Sorry, content not found
            </div>
            <MdSentimentDissatisfied className="NoContentMessage-icon"/>
        </div>
    )
}
