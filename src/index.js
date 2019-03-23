import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import KOOS from './services/KOOS_JR';
import KOOS_EN from './services/KOOS_JR_enableWhen';
import SurveyInterpreter from './components/SurveyInterpreter';
import './index.css';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

ReactDOM.render(<SurveyInterpreter questionnaire={KOOS_EN.questionnaire}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
