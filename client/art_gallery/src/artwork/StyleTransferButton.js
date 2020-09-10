import React from 'react';
import UploadButton from './../common/UploadButton'
import { POST_STYLE_TRANSFER } from './../constants.js'
import { toBase64 } from './../helper.js'


export default function StyleTransferButton(props) {

    async function handleUpload(event) {
        const file = event.target.files[0];
        const fileBase64 = await toBase64(file);

        const data = {
            artworkId: props.artworkId,
            file: fileBase64
        }

        const response = await fetch(POST_STYLE_TRANSFER, {
            method: "POST",
            body: JSON.stringify(data)
        })
        console.log(response);
    }

    return (
        <UploadButton
            text={"Transform"}
            onUpload={handleUpload} />
    )
}

