import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as IntroAndEventEmitter from '../Intro/Intro';
import './Business.css';
import '../../font-awesome-4.7.0/css/font-awesome.min.css';

let eventEmitter;

/**========Business Component========**/

class Business extends Component {

    constructor(props) {
        super(props);
        this.state = {
            titleValue: this.props.data.title,
            descriptionValue: this.props.data.description,
            importanceValue: this.props.data.importance,
            deadlineValue: this.props.data.deadline,
            businessColorValue: this.props.data.businessColor,
            completionTimeValue: this.props.data.completionTime,
            isDisabled: true,
            visible: false,
        };
        this.readmoreClick = this.readmoreClick.bind(this);
        this.onBtnEdit = this.onBtnEdit.bind(this);
        this.onExecutedClickHandler = this.onExecutedClickHandler.bind(this);
        this.onDeleteClickHandler = this.onDeleteClickHandler.bind(this);
    };

    readmoreClick(e) {
        e.preventDefault();
        if (this.state.visible) {
            this.setState({visible: false});
        } else {
            this.setState({visible: true});
        }
    };

    onBtnEdit(e){
        e.preventDefault();
        if (!this.state.isDisabled) {
            let item = {
                title: this.state.titleValue,
                description: this.state.descriptionValue,
                importance: this.state.importanceValue,
                deadline: this.state.deadlineValue,
                businessColor: this.state.businessColorValue,
                completionTime: this.state.completionTimeValue
            },
                items = [item, this.props.data];

            eventEmitter = IntroAndEventEmitter.eventEmitter;
            eventEmitter.emit('Business.update', items);

            this.setState({isDisabled: !this.state.isDisabled});
        } else {
            this.setState({isDisabled: !this.state.isDisabled});
        }
    }

    onFieldChange(fieldName, e) {
        this.setState({[""+fieldName]: e.target.value});
    };

    onDeleteClickHandler(e){
        e.preventDefault();
        eventEmitter = IntroAndEventEmitter.eventEmitter;
        eventEmitter.emit('Business.delete', this.props.data);
    }

    onExecutedClickHandler(e) {
        e.preventDefault();
        let time = new Date(),
            fullYear = "" + time.getFullYear(),
            month = `${time.getMonth()+1}`,
            day = "" + time.getDate(),
            hours = "" + time.getHours(),
            minutes = "" + time.getMinutes();

        if (month.length === 1) month = `0${month}`;
        if (day.length === 1) day = `0${day}`;
        if (hours.length === 1) hours = `0${hours}`;
        if (minutes.length === 1) minutes = `0${minutes}`;

        let completionTime = `Completion time: ${fullYear}-${month}-${day} | ${hours}:${minutes}`,
            executed = Number(fullYear + month + day + hours + minutes),
            deadline = this.props.data.deadline,
            deadlineNumber,
            businessColor,
            items;

        if (deadline.length === 0) {
            businessColor = 'completed';
        } else {
            deadlineNumber = Number(deadline.replace(/-/g, "").replace(/ \| /, "").replace(/:/, ""));
            if (executed <= deadlineNumber){
                businessColor = 'completed';
            } else {
                businessColor = 'past_due';
            }
        }

        let item = {
            title: this.props.data.title,
            description: this.props.data.description,
            importance: this.props.data.importance,
            deadline: this.props.data.deadline,
            businessColor: businessColor,
            completionTime: completionTime
        };

        items = [item, this.props.data];

        eventEmitter = IntroAndEventEmitter.eventEmitter;
        eventEmitter.emit('Business.update', items);
    };

    componentWillReceiveProps (newProps){
        this.setState({
            titleValue: newProps.data.title,
            descriptionValue: newProps.data.description,
            importanceValue: newProps.data.importance,
            deadlineValue: newProps.data.deadline,
            businessColorValue: newProps.data.businessColor,
            completionTimeValue: newProps.data.completionTime,
            visible: false
        });
    };

    render() {
        let visible = this.state.visible,
            title = this.state.titleValue,
            description = this.state.descriptionValue,
            importance = this.state.importanceValue,
            deadline = this.state.deadlineValue,
            businessColor = this.state.businessColorValue,
            completionTime = this.state.completionTimeValue,
            colorImportance,
            editDisabled = false;

        if (businessColor !== "") editDisabled = true;

        switch (this.props.data.importance){
            case 'Important': colorImportance = "yellow";
                break;
            case 'Very important' : colorImportance = "red";
                break;
            case 'Normal': colorImportance = "green";
                break;
            default: colorImportance = "";
        }

        return (
            <div className={`business ${businessColor}`}>

                <input type='text'
                       className={`business__title ${businessColor}`}
                       value={title}
                       onChange={this.onFieldChange.bind(this, 'titleValue')}
                       disabled={this.state.isDisabled}
                       ref="title"/>

                <a href="#"
                   onClick={this.readmoreClick}
                   className={`business__readmore ${(visible ? 'clicked': "")}`}>
                    Description
                </a>

                <textarea className={`business__description ${businessColor} ${(visible ? "": 'none')}`}
                          value={description}
                          onChange={this.onFieldChange.bind(this, 'descriptionValue')}
                          readOnly={this.state.isDisabled}
                          ref="description"/>

                <input type='text'
                       className={`business__importance ${businessColor} ${colorImportance}`}
                       value={importance}
                       onChange={this.onFieldChange.bind(this, 'importanceValue')}
                       disabled={this.state.isDisabled}
                       ref="importance"/>

                <p className={`${businessColor}`}>Deadline:</p>

                <input type='text'
                       className={`business__deadline ${businessColor}`}
                       value={deadline}
                       onChange={this.onFieldChange.bind(this, 'deadlineValue')}
                       disabled={this.state.isDisabled}
                       ref="deadline"/>

                <p>{completionTime}</p>

                <button className='btn edit__business fa fa-pencil'
                        ref='edit__business'
                        title="Add business"
                        onClick={this.onBtnEdit}
                >
                </button>

                <button className='btn remove__business fa fa-trash-o'
                        ref='remove__business'
                        title="Remove business"
                        onClick={this.onDeleteClickHandler}>
                </button>

                <button className='btn executed fa fa-check-square-o'
                        ref='executed'
                        title="Executed"
                        onClick={this.onExecutedClickHandler}
                        disabled={editDisabled}>
                </button>

            </div>
        );
    };

}

Business.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        importance: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        businessColor: PropTypes.string.isRequired,
        completionTime: PropTypes.string.isRequired
    })
};

/**=============================**/

export {Business, eventEmitter};