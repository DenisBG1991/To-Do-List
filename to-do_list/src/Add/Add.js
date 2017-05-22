import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as IntroAndEventEmitter from '../Intro/Intro'
import './Add.css';

let eventEmitter;

/**========Add Component========**/

class Add extends Component {

    constructor(props) {
        super(props);
        this.state = {
            agreeNotChecked: true,
            titleIsEmpty: true,
            descriptionIsEmpty: true,
            importanceSelected: false
        };
        this.onBtnClickHandler = this.onBtnClickHandler.bind(this);
        this.onCheckRuleClick = this.onCheckRuleClick.bind(this);
        this.onImportanceSelected = this.onImportanceSelected.bind(this);
    };

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.title).focus();
    };

    onImportanceSelected(){
        this.setState({importanceSelected: true});
    };

    onCheckRuleClick() {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    };

    onBtnClickHandler(e) {
        e.preventDefault();
        let titleEl = ReactDOM.findDOMNode(this.refs.title),
            descriptionEl = ReactDOM.findDOMNode(this.refs.description),
            importance1El = ReactDOM.findDOMNode(this.refs.importance1),
            importance2El = ReactDOM.findDOMNode(this.refs.importance2),
            importance3El = ReactDOM.findDOMNode(this.refs.importance3),
            importancesEl = [importance1El, importance2El, importance3El],
            deadlineEL = ReactDOM.findDOMNode(this.refs.datetime);

        let title = titleEl.value,
            description = descriptionEl.value,
            importance,
            importanceEl,
            deadline;

        if (deadlineEL.value === undefined) {
            deadline = "";
        } else {
            deadline = deadlineEL.value.replace(/T/, ' | ');
        }

        importancesEl.forEach(value=>{
            if (value.checked === true) importanceEl = value;
        });

        importance = importanceEl.value;

        let item = [{
            title: title,
            description: description,
            importance: importance,
            deadline: deadline,
            businessColor: "",
            completionTime: ""
        }];

        eventEmitter = IntroAndEventEmitter.eventEmitter;
        eventEmitter.emit('Business.add', item);

        titleEl.value = "";
        descriptionEl.value = "";
        importanceEl.checked = false;
        deadlineEL.value = "";
        this.setState({titleIsEmpty: true, descriptionIsEmpty: true, agreeNotChecked: true, importanceSelected: false});
    };

    onFieldChange(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({[""+fieldName]:false});
        } else {
            this.setState({[""+fieldName]:true});
        }
    };

    render() {
        return (
            <form className='add cf'>

                <input type='text'
                       className='add__title'
                       onChange={this.onFieldChange.bind(this, 'titleIsEmpty')}
                       placeholder='Title'
                       ref='title'/>

                <textarea className='add__description'
                          onChange={this.onFieldChange.bind(this, 'descriptionIsEmpty')}
                          placeholder='Description'
                          ref='description'/>

                <p>The importance of the business:</p>

                <label className='add__importance'>
                    <input type='radio'
                           ref='importance1'
                           name="importance"
                           value={"Very important"}
                           onClick={this.onImportanceSelected}/>
                    Very important
                </label>

                <label className='add__importance'>
                    <input type='radio'
                           ref='importance2'
                           name="importance"
                           value={"Important"}
                           onClick={this.onImportanceSelected}/>
                    Important
                </label>

                <label className='add__importance'>
                    <input type='radio'
                           ref='importance3'
                           name="importance"
                           value={"Normal"}
                           onClick={this.onImportanceSelected}/>
                    Normal
                </label>

                <p>Deadline:</p>

                <label className='add__deadline'>
                    <input type='datetime-local'
                           ref='datetime'/>
                </label>

                <label className='add__checkrule'>
                    <input type='checkbox'
                           ref='checkrule'
                           checked={!this.state.agreeNotChecked}
                           onChange={this.onCheckRuleClick}/>
                    I agree with the rules
                </label>

                <button className='add__btn fa fa-reply'
                        onClick={this.onBtnClickHandler}
                        ref='add_business'
                        disabled={this.state.agreeNotChecked || this.state.titleIsEmpty ||
                        this.state.descriptionIsEmpty || !this.state.importanceSelected}>
                    Add business
                </button>

            </form>
        );
    };

}

/**=============================**/

export {Add, eventEmitter};