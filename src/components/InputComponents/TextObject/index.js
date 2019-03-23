import React, { Component } from 'react';
import './styles.css';

class TextObject extends Component {
  
  render(){
    return(
      <div className='textobject'>
        <p className="textobjecttitle">{this.props.item.prefix}</p>
        <p className='textobjecttext'>{this.props.item.text}</p>
      </div>
    )
  }
}

export default TextObject;

