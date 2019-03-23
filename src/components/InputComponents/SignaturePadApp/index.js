import React, { Component } from 'react';
import ParseHtml from 'html-react-parser';
import SignaturePad from 'react-signature-pad';
import './styles.css';

class SignaturePadApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    // checks to see if signature already exists to display for editing
    // this.signatureCheckInit();
    this.props.onRef(this);

  }
  signatureUpdate = () => {
    var signature = this.refs.mySignature;
    if(signature !==undefined){
      //TODO: test this
      this.props.updateSignature(this.props.item,signature.toDataURL());

    }
  }
  signatureUpdateClear = () => {
    var signature = this.refs.mySignature;
    if(signature !==undefined){
      //TODO: test this
      this.props.removeSignature(this.props.item);

    }
  }

  signatureCheckInit = () => {
    var questionId=this.props.item.linkId;
    var signature = this.refs.mySignature;
    //TODO: check for signature content and pre-populate if needed

  }

  render() {
    return(
    <div className="signature-app col-sm-5" >
      <SignaturePad ref="mySignature" clearButton="true" onEnd={this.signatureUpdate}/>
      <p className="signature-label">{this.props.item.text}</p>
    </div>
    )
  }
}

// const mapStateToProps = store => {
//   return {
//     questionnaireResponses : store.userInputState.userInput.questionnaireResponse,
//   }
// };

export default (SignaturePadApp);
