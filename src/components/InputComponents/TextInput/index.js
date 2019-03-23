import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class TextInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeholder: props.item.answerOption ? props.item.answerOption : null,
      isValid: true,
    }
  }
  

  // simple method that will return the value of its input value
  getTextValue = () => {
    if ( this.input ) {
      let val = this.input.value;
      return val.trim() !== "" ? val.trim() : undefined;
    }
  }

  handleChange = (event) => {
    const text = event.target.value;
    if ( this.props.onChange !== undefined) { 

      if ( this.props.pattern ) {
          //input validation
        if (this.props.pattern.test(text) || !text) {
          this.setState({ isValid: true });
          // validate the pattern and store if valid
          this.props.onChange(this.props.item, text);
        } else {
          this.setState({ isValid: false });
        }
      } else {
        // save the text if no pattern
        this.props.onChange(this.props.item, text);
      }
    }
    // console.log(this.state.isValid);
  }

  render(){
    let textStyle = this.props.error === true ? "text-input cli-field-error" : "text-input";
    let {item} = this.props;
    return(
      <div className="row">
        <div className={textStyle + " col-12 col-sm-8 col-md-6"} >
          <p className="question-text">{item.text}</p>
            {/* <label> label </label><br/> */}
            <input className={this.state.isValid ? "" : "not-valid"} ref={id => this.input = id } onChange={(e) => this.handleChange(e)} value={this.props.value} type="text"/>
        </div>
      </div>
    )
  }
}

TextInput.propTypes = {
  //! required
  item: PropTypes.object.isRequired, // item / question
  // onChange: PropTypes.func.isRequired, // function to execute on text input

  // ? optional
  value: PropTypes.string, // default text value
  label: PropTypes.string, // label above input element
  error: PropTypes.bool, // display error styles
}

export default TextInput;
