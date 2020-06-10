import React from 'react';
import './Header.css'
import { MdSearch } from 'react-icons/md';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Header(props) {
  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/">
          Artsee
        </Link>
      </div>
      <IconButton onClick={() => { props.onStartSearching() }}>
        <MdSearch className="header-search" />
      </IconButton>
    </div>
  );
}
