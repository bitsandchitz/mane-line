import React, { Component } from 'react';
import PropType from 'prop-types';
import './style.css';


class RadioInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
    }
  }

  componentDidMount() {
    if (this.props.validation) {
      this.props.validation(this.props.item.linkId, true)
    }
  }

  componentWillUnmount() {
    if (this.props.validation) {
      this.props.validation(this.props.item.linkId, false)
    }
  }

  onChange(item, valueString, score) {
    this.props.onChange(item, valueString, score);
    this.setState({
      selectedOption: valueString
    });
  }

  getAnswerScore = (option) => {
    if (option.extension) {
      let score = option.extension.find((ext) => {
        return ext.url === "answerValue"
      })
      let scoreValue = score.valueInteger | score.valueDecimal | score.valueString
      scoreValue = typeof scoreValue !== 'number' ? JSON.parse(scoreValue) : scoreValue

      return { score: scoreValue } // parse just incase to turn 'strings' into 'numbers'
    } else {
      return undefined
    }
  }

  render() {

    return (
      <div key={this.props.item.linkId} >
        <p className="question-text">
          { this.props.item.prefix && <span className="question-prefix"> {this.props.item.prefix}. </span> }
          { this.props.item.text }
        </p>
        <div className="radio-options" >
          {this.props.item.answerOption.map((option, index) => {
            return (
              <div key={index} className="radio-container">
                {/* <label>
                  <input className="btn" type="radio" checked={this.state.selectedOption === option.valueCoding.display}
                    onChange={() => this.onChange(this.props.item, option.valueCoding.display, this.getAnswerScore(option))}
                    value={option.valueCoding.display} />
                  {option.valueCoding.display}
                </label> */}
                <button type="button" className="btn radio-button-option"
                  onClick={() => this.onChange(this.props.item, option.valueCoding.display, this.getAnswerScore(option))}>
                  {option.valueCoding.display}
                </button>
              </div>

            )
          }
          )}
        </div>
        <div id={'error' + this.props.item.linkId}></div>
      </div>
    )
  }

//   return(
//     <div id={this.props.item.linkId} >
//       <p className={'question-text'}>{this.props.item.text}</p>
//       <div className="radio-options row" >
//         { this.props.item.answerOption.map((option) => {
//           return (
//               <label className={`col-4 col-md-3 col-lg-2 radio-container`} key={option.valueCoding.code}>
//                 <span className="option-label">{option.valueCoding.display}</span>
//                 <input className="radio-checkmark" type="radio" checked={this.state.selectedOption === option.valueCoding.display} 
//                     onChange={() => this.onChange(this.props.item, option.valueCoding.display, this.getAnswerScore(option))}
//                     value={option.valueCoding.display} 
//                 />
//                 <span className="radio-checkmark"></span>
//               </label>
//           )}
//         )}
//       </div>
//       <div id={'error'+ this.props.item.linkId}></div>
//>>>>>>> corrected scoring to not just keep adding to the total score when answers changed, styling changes
//     </div>
//     <div id={'error' + this.props.item.linkId}></div>
//   </div>
//  )

}

export default RadioInput;

RadioInput.PropType = {
  selectedOption: PropType.string,  //the value chosen by the user
  item: PropType.object,  //the question being asked (questionnaire.item fhir resource)
  onChange: PropType.func, // function in InputContainer
}