import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { MdCloudUpload } from 'react-icons/md/';
import './UploadButton.css';


const useStyles = makeStyles((theme) => ({
    button: {
        fontSize: 24,
    }
}));


export default function UploadButton(props) {
    const classes = useStyles();
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                id="contained-button-file"
                onChange={props.onUpload}
                className="UploadButton-input"
            />
            <label htmlFor="contained-button-file">
                <Button
                    size="large"
                    className={classes.button}
                    component="span"
                    startIcon={<MdCloudUpload size="40px"/>}
                >
                    {props.text}
                </Button>
            </label>
        </div>
    )
}

