import React from 'react';
import UploadButton from './../common/UploadButton'
import { POST_STYLE_TRANSFER } from './../constants.js'
import { toBase64 } from './../helper.js'


export default function StyleTransferButton(props) { 

    function loadImage(src){
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        })
      }

    async function handleUpload(event) {
        const file = event.target.files[0];
        const fileBase64 = await toBase64(file);
        const img = await loadImage(fileBase64);

        const data = {
            artworkId: props.artworkId,
            file: fileBase64,
            width: img.width,
            height: img.height
        }

        const response = await fetch(POST_STYLE_TRANSFER, {
            method: "POST",
            body: JSON.stringify(data)
        })
        window.open(response.url);
    }

    return (
        <UploadButton
            text={"Transform"}
            onUpload={handleUpload} />
    )
}

