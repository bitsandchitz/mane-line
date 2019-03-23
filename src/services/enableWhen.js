
/**
 * This is a collection of utility methods that may be useful in other components and files
 */
export const multiAnswerTypes = [ 'check-box' ]
export const singleAnswerTypes = [ 'group', 'display', 'question','boolean', 
  'decimal', 'integer' ,'date', 'dateTime', 'time','text', 'url',
  'radio-button', 'discrete-slider', 'continuous-slider','drop-down', 'attachment'
]
export const noInputItems = [ 'group', 'display', 'question' ]

export const isItemEnabled = (item, state) => {
  // console.log(item.linkId);
  if ( item.linkId ) {
    if ( item.enableWhen && item.enableWhen.length > 0 ) {
      let matched = 0
      item.enableWhen.forEach( enable => {
        let answer = getAnswer(enable.question, state.answers )
        // console.log(`getAnswer(${enable.question}) :: return`, answer)
        if ( answer && compareAnswers(enable, answer) ) {
          matched++
        }
      })
      let isEnabled = false;
      if ( item.enableBehavior === 'all' ) {
        // all enableWhen conditions must be matched
        isEnabled = matched === item.enableWhen.length;
      } else {
        // as long as more than zero matched
        isEnabled = matched > 0;
      }
      // update the currently display question linkIds
      validation(item.linkId, isEnabled, state.requiredAnswers);
    } else {
      // if no enable whens are present, enabled by default
      // updateRequiredAnswersArray(item, true, inputState)
      return true 
    }

  } else {
    console.error(item, "is not of type questionnaire.item")
  }
}

const getAnswer = (question, currentAnswers) => {
  let answer = currentAnswers[question];
  if ( answer ) { // if defined
    return answer.answer
  }
}

const validation = (linkId, isEnabled, requiredAnswers) => {
  if ( isEnabled && !requiredAnswers.includes(linkId)) {
    requiredAnswers.push(linkId);
  } else if (requiredAnswers.includes(linkId) ) { 
    // NOT using this.setState intentionally, when using setState race conditions happen when removing themselves from state
    requiredAnswers = requiredAnswers.filter((element) => {
        return element != linkId
    })
  }
}

// 'exists', '=', '!=', '>', '<', '>=', '<='
const compareAnswers = (enable, answer) => {
  // console.log(`compareAnswers() ::`, enable)
  switch (enable.operator) {
    case 'exists':
      return answer ? true : false

    case '=':
      // console.log('OPERATOR MATCHED ==');
      // console.log(getEnableAnswerValue(enable), '=', answer, '???');
      return getEnableAnswerValue(enable) === answer

    case '!=':
      return getEnableAnswerValue(enable) !== answer

    case '>':
      return getEnableAnswerValue(enable) > answer

    case '>=':
      return getEnableAnswerValue(enable) >= answer

    case '<':
      return getEnableAnswerValue(enable) < answer

    case '<=':
      return getEnableAnswerValue(enable) <= answer

    default:
      console.error(`UNKNOWN item.enableWhen.operator ${enable.operator}, please check questionnaire json.`)
      return undefined
  }

}

const getEnableAnswerValue = (enableWhen) => {

  if ( enableWhen.answerString )
    return enableWhen.answerString

  if ( enableWhen.answer )
    return enableWhen.answer

  if ( enableWhen.value )
    return enableWhen.value

  if ( enableWhen.answerBoolean )
    return enableWhen.answerBoolean

  if ( enableWhen.answerInteger )
    return enableWhen.answerInteger

  if ( enableWhen.answerDate )
    return enableWhen.answerDate 

  if ( enableWhen.answerDateTime )
    return enableWhen.answerDateTime

  if ( enableWhen.answerTime )
    return enableWhen.answerTime

  if ( enableWhen.answerCoding ) //TODO are these supported?
    return enableWhen.answerCoding

  if ( enableWhen.answerQuantity ) //TODO are these supported?
    return enableWhen.answerQuantity 

  console.error(`Unknown enableWhen.answer[X], ${enableWhen}`);
    return undefined
}