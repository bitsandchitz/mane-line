import React, { Component } from 'react';
import './style.css';

class CheckboxContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }


  componentDidMount () {
    // once component mounts, check what needs to be checked
    this.initValidation();
  }

  initValidation = () => {
    // let validation = this.props.validation;
    //! VALIDATION OFF it is heavily tied to consent flow
  }



  onChange (item, valueString, e) {
    if (e.target.checked) {
      this.props.addCheckbox(item, valueString, {append : true});
    }
    else {
      this.props.removeCheckbox(item, valueString);
    }
    // this.props.item.answerOption[index]
  }

  render () {
    let disabled = false;
    let width = this.props.item.answerOption.length % 3 === 0 ? 'three-wide ' :  'four-wide ';
        width = this.props.item.answerOption.length === 2 ? 'two-wide ' : width;

    
    return(
      <div id={this.props.item.linkId} >
        <p className={'question-text check-box-color-enabled'}>{this.props.item.text}</p>
        <div className="radio-options row" >
          { this.props.item.answerOption.map((option) => {
            return (
              <label className={"checkbox-container check-box-color-enabled col-4 col-md-3 col-lg-2"} key={option.valueCoding.code}>
                <span className="option-label">{option.valueCoding.display}</span>
                <input disabled={disabled} type="checkbox" value={option.valueCoding.display} onChange={(e) => this.onChange(this.props.item, option.valueCoding.display, e)}/>
                <span className="checkmark"></span>
              </label>
            )}
          )}
        </div>
        <div id={'error'+ this.props.item.linkId}></div>
      </div>
    )
  }

}

// const mapStateToProps = store => {
//   return {
//     // navigationStack : store.navigationState.nav.navigationStack,
//     // consentingFor: store.patientState.patientDisplay.consentingFor
//   }
// };

export default (CheckboxContainer);
//How to use in Component:
//Add to import statement:
// import CheckboxContainer from './components/CheckboxContainer';
//add where needed:
// <CheckboxContainer type="open-choice" styleQuestion={marginLeft:20px}options={choices} question="additionalFindings"/>
