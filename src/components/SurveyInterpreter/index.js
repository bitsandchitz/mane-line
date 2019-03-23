import React, { Component } from 'react';
import TextObject from '../InputComponents/TextObject';
import TextInput from '../InputComponents/TextInput';
import CheckboxContainer from '../InputComponents/CheckboxContainer';
import DateInput from '../InputComponents/DateInput';
import DropdownInput from '../InputComponents/DropdownInput';
import RadioInput from '../InputComponents/RadioInput';
import { isItemEnabled } from '../../services/enableWhen';
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

    this.state = {
      answers: {
          // <linkId> : {
          //     item: {},
          //     answer: [{}], 
          //     score: number 
          // }
      },
      requiredAnswers: [
          // enabled & required linkIds 
          // added and removed as the change enable states
      ],
  };
  }

  //sets the entire answerStructure shown above. answer item coming in should be an array
  setAnswer = (item, answer, { append, score } = {append: false, score: undefined}) => {
    let linkId = item.linkId
    let newAnswer = this.state.answers;

    if ( append === true ) { // if append call we want an array of answers
        if ( newAnswer[linkId] && newAnswer[linkId].answer ) {
            newAnswer[linkId].answer.push(answer); // push next answer
        } else {
            newAnswer[linkId] = { // initialize the answer array
                item,
                answer : [answer],
                score : score ? score : 0
            }
        }
    } else { // if single answer question
        newAnswer[linkId] = {
            item,
            answer : answer,
            score : score ? score : 0
        }
    }
    this.setState({
        answers : newAnswer,
    })
  }


  //removes the whole linkId key from the answer object
  removeAnswer = (item, valueString) => {
      let linkId = item.linkId || item; // can pass item or linkId
      
      let newAnswer = this.state.answers;
      if ( valueString ) {
          newAnswer[linkId].answer = newAnswer[linkId].answer.filter(ans => ans !== valueString);
      } else {
          // delete the property from the object
          delete newAnswer[linkId]
      }

      this.setState({
          answers: newAnswer
      }, this.recalculateScore());
  }

  showItem = (item) => {
    // set up scroll func
    let scrollFunc = (linkId) => { 
      console.log("asnwered ", linkId); 
      let activeQs = this.state.requiredAnswers;
      let scrollTarget = activeQs.indexOf(linkId)+1;
      if ( scrollTarget >= activeQs.length ) {
        return;
      }
      console.log(`scrolling from ${linkId} to ${'#'+activeQs[scrollTarget].replaceAll('.', '_')}` );
      this.sweetScroll.to('#'+activeQs[scrollTarget].replaceAll('.', '_')); // dots are not legal id chars
    }
    
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
        return <TextInput item={item} onChange={this.setAnswer} pattern={decimalValidation} />
      case 'integer':
        return <TextInput item={item} onChange={this.setAnswer} pattern={integerValidation} />


      case 'date':
        // TODO: the input is overloaded to handle text and date input
        // TODO : implement a dateTime, and time component (could overload)
        return <DateInput item={item} onChange={this.setAnswer} />


      case 'url':
        return <TextInput item={item} onChange={this.setAnswer} isUrl={true} pattern={urlValidation} />

      case 'text':
        // currently rendering as text input
        // TODO: implement url validation
        return <TextInput item={item} onChange={this.setAnswer} />


      case 'radio-button':
      case 'choice':
        return <RadioInput item={item} scroll={scrollFunc} onChange={this.setAnswer} />
      case 'drop-down':
        return <DropdownInput item={item} onChange={this.setAnswer} />
      case 'check-box':
        return <CheckboxContainer item={item} addCheckbox={this.setAnswer} removeCheckbox={this.removeAnswer} />


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
        if ( isItemEnabled(item, this.state) ) {
          if ( !this.state.requiredAnswers.includes(item.linkId) && item.type !== 'group' ) {
            this.state.requiredAnswers.push(item.linkId)
          }
          return (
            <div key={item.linkId} id={item.linkId.replaceAll('.','_')} className="col-12 questionnaire-item">
              {this.showItem(item)}
              <div className="row">
                {this.showQuestionnaire(item.item)}
              </div>
            </div>
          );
        }
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
          <span className="text-center">
            <button className="survey-submit-button"> Submit </button>
          </span>
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
