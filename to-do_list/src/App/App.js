import React, { Component } from 'react';
import Header from '../Header/Header';
import {Intro} from '../Intro/Intro';
import './App.css';

/**========App Component========**/

class App extends Component {

    render() {
        return (
            <div className="App">
                <Header />
                <Intro />
            </div>
        );
    };

}

/**=============================**/

export default App;