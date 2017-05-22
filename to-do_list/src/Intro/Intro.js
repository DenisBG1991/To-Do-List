import React, { Component } from 'react';
import * as AddAndEventEmitter from '../Add/Add';
import * as BusinessAndEventEmitter from '../Business/Business';
import ListToDo from '../ListToDo/ListToDo';
import my_to_do_list from '../To-DoList';
import './Intro.css';

function LoadFromLocalStorage() {
    let list = localStorage.getItem('list'),
        to_do_list;

    if (list === null) {
        to_do_list = my_to_do_list;
        console.log(`This is your first launch!
            Welcome to "To-Do List!`);
    } else {
        list = list.split('#@&');
        list.pop();
        list = list.map(value => {
            value = JSON.parse(value);
            return value;
        });
        to_do_list = list;
    }

    return to_do_list;
}

let events = require('events'),
    eventEmitter = new events.EventEmitter(),
    Add = AddAndEventEmitter.Add,
    businessesList,
    to_do_list = LoadFromLocalStorage();

if (AddAndEventEmitter.eventEmitter !== undefined) eventEmitter = AddAndEventEmitter.eventEmitter;
if (BusinessAndEventEmitter.eventEmitter !== undefined) eventEmitter = BusinessAndEventEmitter.eventEmitter;

/**========Intro Component========**/

class Intro extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: to_do_list,
            searchList: [],
            searchON: false
        };
    };

    componentDidMount() {
        let self = this;
        eventEmitter.addListener('Business.add', item => {
            let nextBusinesses = item.concat(self.state.businesses);
            self.setState({businesses: nextBusinesses});
        });
        eventEmitter.addListener('Business.update', item => {
            let updateBusiness = self.state.businesses.map(val => {
                if (val === item[1]) val = item[0];
                return val;
            });
            self.setState({businesses: updateBusiness});
        });
        eventEmitter.addListener('Business.delete', item => {
            let indexDel,
                businessAfterDelete = this.state.businesses;

            self.state.businesses.forEach((val, index) => {
                if (val === item) indexDel = index;
            });
            businessAfterDelete.splice(indexDel,1);
            self.setState({businesses: businessAfterDelete});
        });
    }

    componentWillReceiveProps (newProps){
        this.setState({
            searchON: false
        });
    };

    componentDidUpdate  (){
        let newLocalStorageString = '',
            newLocalStorage = this.state.businesses.map(val => {
            val = JSON.stringify(val);
            return val;
        });
        newLocalStorage.forEach(value => {
            newLocalStorageString += value + '#@&';
        });
        localStorage.setItem('list', newLocalStorageString);
    };

    componentWillUnmount() {
        eventEmitter.removeListener('Business.add');
        eventEmitter.removeListener('Business.update');
        eventEmitter.removeListener('Business.delete');
    };

    toDoFilter(importance){
        let search = [];

        if (importance === 'All') {
            this.setState({searchList: this.state.businesses});
        } else {
            this.state.businesses.forEach(val => {
                if (val.importance === importance) search.push(val);
            });
            this.setState({searchList: search});
        }
        this.setState({searchON: true});
    };

    render(){

        if (this.state.searchList.length === 0) {
            if (this.state.searchON){
                businessesList = this.state.searchList;
            } else {
                businessesList = this.state.businesses;
            }
        } else {
            businessesList = this.state.searchList;
        }

        return (
            <div className="App-intro">
                <button className='btn_search search_all'
                        onClick={this.toDoFilter.bind(this, 'All')}>
                    Search All
                </button>
                <button className='btn_search search_normal'
                        onClick={this.toDoFilter.bind(this, 'Normal')}>
                    Search Normal
                </button>
                <button className='btn_search search_important'
                        onClick={this.toDoFilter.bind(this, 'Important')}>
                    Search Important
                </button>
                <button className='btn_search search_very_important'
                        onClick={this.toDoFilter.bind(this, 'Very important')}>
                    Search Very Important
                </button>
                <Add />
                <ListToDo data={businessesList} />
            </div>
        );
    };

}

/**================================**/

export {Intro, eventEmitter};