import React, { Component } from 'react';
import PropType from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import './style.css';

class DropdownInput extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selectedOption : "Select Answer",
        }
    }



    onChange = (item, valueCoding) => {
        this.setState({
            selectedOption: valueCoding.display
        });
        this.props.onChange(item, valueCoding);
    }

    render() {
        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle className="dropdown-button">{this.state.selectedOption}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.props.item.answerOption.map((i) => {
                            return(
                                <Dropdown.Item key={i.valueCoding.code} value={i.valueCoding.display}  onClick={() => this.onChange(this.props.item, i.valueCoding)}>{i.valueCoding.display}</Dropdown.Item>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }

}

export default (DropdownInput);

DropdownInput.PropType = {
    item: PropType.object,   //the question being asked (questionnaire.item fhir resource)
    setAnswer: PropType.func // function in InputContainer
}