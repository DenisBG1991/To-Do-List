import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Business} from '../Business/Business';
import './ListToDo.css';

/**========ListToDo Component========**/

class ListToDo extends Component {

    constructor(props){
        super(props);
        this.state = {
            newProps: this.props.data
        }
    }

    componentWillReceiveProps (newProps){
        this.setState({
            newProps: newProps.data
        });
    };

    render() {
        let data = this.state.newProps,
            BusinessTemplate;

        if (data.length > 0) {
            BusinessTemplate = data.map((item, index)=> {
                return (
                    <div key={index}>
                        <Business data={item} />
                    </div>
                );
            });
        } else {
            BusinessTemplate = <p>Unfortunately the list of cases is empty.</p>
        }

        return (
            <div className="listToDo">
                {BusinessTemplate}
                <strong className={`listToDo__count  ${(data.length > 0 ? '':'none')}`}>
                    Total number of business: {data.length}
                </strong>
            </div>
        );
    };

}

ListToDo.propTypes = {
    data: PropTypes.array.isRequired
};

/**==============================**/

export default ListToDo;