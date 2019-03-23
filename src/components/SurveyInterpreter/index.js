import React, { Component } from 'react';
import TextObject from '../InputComponents/TextObject';
import TextInput from '../InputComponents/TextInput';
import CheckboxContainer from '../InputComponents/CheckboxContainer';
import SignaturePadApp from '../InputComponents/SignaturePadApp';
import DateInput from '../InputComponents/DateInput';
import DropdownInput from '../InputComponents/DropdownInput';
import RadioInput from '../InputComponents/RadioInput';
import SweetScroll from 'sweet-scroll';
import { integerValidation, decimalValidation, urlValidation } from '../../services/validationPatterns';
import './styles.css';

class SurveyInterpreter extends Component {
  //this component handles the recursively going through the question and determining user input type
  constructor(props) {
    super(props);
    this.sweetScroll = new SweetScroll({
      // trigger: '[data-scroll]',       // Selector for trigger (must be a valid css selector)
      // header: '[data-scroll-header]', // Selector or Element for fixed header (Selector of must be a valid css selector)
      duration: 600,                 // Specifies animation duration in integer
      easing: 'easeInOutCubic',         // Ease options => https://www.npmjs.com/package/sweet-scroll#easings
      offset: -200,                      // Specifies the value to offset the scroll position in pixels
      vertical: true,                 // Enable the vertical scroll
      horizontal: false,              // Enable the horizontal scroll
      cancellable: false,              // When fired wheel or touchstart events to stop scrolling
      updateURL: false,               // Update the URL hash on after scroll (true | false | 'push' | 'replace')
      preventDefault: true,           // Cancels the container element click event
      stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase

      // Callbacks
      before: null,
      after: null,
      cancel: null,
      complete: null,
      step: null,
    })
  }

  showItem = (item) => {
    // this function takes an item and then looks at the item.type field of the
    // item and then calls the appropriate method to return the correct input object
    // fall through is currently intentional until we further implement components
    switch (item.type) {
      case 'group':
      case 'display':
      case 'question':
        // Input for TYPE : 'display' && 'question'
        //show basic text object for type display
        return <TextObject item={item} />


      case 'boolean':
        console.warn(`item.type ${item.type} in NOT yet implemented -- fallback : NONE`);
        break;


      case 'decimal':
        return <TextInput item={item} onChange={this.inputContainer.setAnswer} pattern={decimalValidation} />
      case 'integer':
        return <TextInput item={item} onChange={this.inputContainer.setAnswer} pattern={integerValidation} />


      case 'time':
      case 'dateTime':
        console.warn(`item.type ${item.type} in NOT yet implemented -- fallback : date`);
      case 'date':
        // TODO: the input is overloaded to handle text and date input
        // TODO : implement a dateTime, and time component (could overload)
        return <DateInput item={item} onChange={this.inputContainer.setAnswer} />


      case 'url':
        return <TextInput item={item} onChange={this.inputContainer.setAnswer} isUrl={true} pattern={urlValidation} />

      case 'text':
        // currently rendering as text input
        // TODO: implement url validation
        return <TextInput item={item} onChange={this.inputContainer.setAnswer} />



      case 'attachment':
        console.warn(`item.type ${item.type} in NOT yet implemented -- fallback : signature`);
      case 'signature':
        // attachment is rendering as signature
        // TODO: expand to allow signatures and file attachments
        // show signature pad for type attachment
        return <SignaturePadApp item={item} validation={this.props.validation} onRef={ref => this.signature_pad_app = ref} updateSignature={this.inputContainer.setAnswer} removeSignature={this.inputContainer.removeAnswer} />


      case 'radio-button':
      case 'choice':
        return <RadioInput item={item} validation={this.props.validation}
          onChange={this.inputContainer.setAnswer} validation={this.inputContainer.validation}
        />
      case 'drop-down':
        return <DropdownInput item={item} onChange={this.inputContainer.setAnswer} />
      case 'check-box':
        return <CheckboxContainer item={item} validation={this.props.validation} addCheckbox={this.inputContainer.setAnswer} removeCheckbox={this.inputContainer.removeAnswer} />


      case 'discrete-slider':
      case 'continuos-slider':
        console.warn(`item.type ${item.type} in NOT yet implemented -- fallback : NONE`);
        break;

      default:
        console.error(`item.type "${item.type}" in NOT recognized, please fix type or add new type`, item)
        break;
    }
  }

  showTitleHeader = () => {
    return <h3 className="title-header"> {this.props.questionnaire.title} </h3>
  }

  showVersionNumber = () => {
    return (
      <p className="version-num" >{this.props.questionnaire.name + " version " + this.props.questionnaire.version}</p>
    );
  }

  isSubmitDisabled = () => {
    return false; // always enabled
  }

  showQuestionnaire = (items) => {
    if (items) {
      let questionnaire = items.map((item) => {
        return (
          <div key={item.linkId} className="col-12 questionnaire-item">
            {this.showItem(item)}
            <div className="row">
              {this.showQuestionnaire(item.item)}
            </div>
          </div>
        );
      })
      return questionnaire
    }
  }

  render() {
    if (this.props.questionnaire.item) {
      // console.log("RE-RENDERING ...", );
      return (
        <div className='textobjectcontainer row'>
          {this.showQuestionnaire(this.props.questionnaire.item)}
          <button className="survey-submit-button" > Submit </button>
          {this.showVersionNumber()}
        </div>
      )
    } else {
      console.error("ERROR :: No items in questionnaire.item");
      return (
        <h1> No questions found in this questionnaire, Sorry </h1>
      )
    }
  }





}

export default SurveyInterpreter;
