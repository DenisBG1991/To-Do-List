import React, { Component } from 'react';
import logo from './logo.svg';
import './Header.css';

/**========Header Component========**/

class Header extends Component {

    render(){
        return (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to "To-Do List"!</h2>
            </div>
        );
    };
}

/**================================**/

export default Header;