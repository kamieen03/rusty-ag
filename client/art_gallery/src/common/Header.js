import React from 'react';
import './Header.css'
import { MdSearch } from 'react-icons/md';
import { IconButton } from '@material-ui/core';

export default function Header(props) {
  return (
    <div className="header">
      <div className="header-logo">Artsee</div>
      <IconButton onClick={()=> { props.onStartSearching() }}>
        <MdSearch className="header-search"/>      
      </IconButton>
    </div>
  );
}
