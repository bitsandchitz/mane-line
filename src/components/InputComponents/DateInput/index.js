import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cleave from 'cleave.js/react'
import './styles.css';


class DateInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      safariClass : "safari-date-input"
    }
  }
  
  dateFormat = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;

  // simple method that will return the value of its input value
  // getDateValue = () => {
  //   if ( this.input ) {
  //     return this.input.value;
  //   }
  // }

  handleChange = (event) => {
    if ( this.props.onChange ) {
      console.log('cleave data' , event.target.rawValue);
      this.props.onChange(this.props.item, event.target.rawValue); // this.getDateValue()
    }
  }

  handleSafariChange = () => {
    if ( this.props.onChange ) {
      let value = this.getDateValue().trim();
      // console.log('handleSafariChange, value=', value, `is valid format ${this.dateFormat.test(value)}`);
      if ( this.dateFormat.test(value) ) { 
        this.handleChange();
        this.setState({ safariClass : "safari-date-input safari-date-input-valid" });
      } else {
        this.setState({ safariClass : "safari-date-input safari-date-input-invalid" });
      }
    }
  }

  render () {
    // // safari date picker onInput event is broken and never saves the value, so if safari we need 
    // // to make a fake text input date picker, so sad come on safari... and firrefox woow
    // var is_safari =/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // var isFirefox = typeof InstallTrigger !== 'undefined';

    return(
      <div className="row" >
        <div className="text-input col-12 col-sm-8 col-md-6">
        <p className="question-text">{this.props.item.text}</p>
          <Cleave placeholder="mm/dd/yyyy" 
            options={{ date: true, datePattern: ['m', 'd', 'Y'] }}
            onChange={this.handleChange}
          />
        </div>
        {/* <label>{ this.props.label}</label> */}
        {/* //TODO: change the basic input tags to cleave.js component */}
        {/* { (!is_safari && !isFirefox) && <input ref={id => this.input=id} onInput={this.handleChange} value={this.props.value} data-date-format="dd/mm/yyyy" placeholder={this.props.placeholder} type="date"/>  }
        { ( is_safari || isFirefox) && <input className={this.state.safariClass} ref={id => this.input=id} onChange={this.handleSafariChange} placeholder="dd/mm/yyyy" type="text"/>  } */}
      </div>
    )
  }
}

DateInput.propTypes = {
  item: PropTypes.object.isRequired, //  item / question
  onChange: PropTypes.func.isRequired, // function to save when input is collected

  label: PropTypes.string, // label above the input element
  value: PropTypes.string, // default value to start with
}



export default DateInput;