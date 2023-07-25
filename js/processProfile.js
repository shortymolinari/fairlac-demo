const HIGH_PRIORITY_THRESHOLD = 2;
const MEDIUM_PRIORITY_THRESHOLD = 3;
const RECOMENDATION_DISPLAY_THRESHOLD = 2; //2.5;
const DISPLAY_SUBQUESTION_THRESHOLD = 4;//2.5;

let mediaScore = 2.5;
let max_val = 0.0;
let min_val = 5.0;

let ANSWERS_SOLUTION;
let ANSWERS_SOCIETY;
let ANSWERS_SYSTEM;

const getAnswerValues = (values) => {
  ANSWERS_SOLUTION = values.solution;
  ANSWERS_SOCIETY = values.society;
  ANSWERS_SYSTEM = values.system;
}

const getDimensionScore = (dimensionAnswers) => {
  let reduceAnswers = dimensionAnswers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return reduceAnswers / dimensionAnswers.length;
}

const setMinMax = (answers) => {
  for (let answer in answers) {
    if (answers[answer]) {
      if (answers[answer] < min_val) min_val = answers[answer];
      if (answers[answer] > max_val) max_val = answers[answer];
    }
  }

  if (min_val === max_val) {
    min_val = max_val - min_val;
  }
}

const normalize = (answers, max_val, min_val) => {
  let values = [];
  for (let answer in answers) {
    let val = answers[answer] - min_val;
    values.push((val / (max_val - min_val)) * 5);
  }
  return values;
}

const getLowerValues = (values) => {
  let lowerValues = values.filter((value) => value <= MEDIUM_PRIORITY_THRESHOLD);
  return lowerValues.length > 0;
}

const getPriorityList = (answers, score, name) => {
  if (getLowerValues(answers)) {
    return {name: `${name} priority: ${getPriority(score)}`}
  }
}


const getPriority = (score) => {
  if (score === 5) return '<span class="badge bg-info rounded-pill">N/A</span>';
  if (score <= HIGH_PRIORITY_THRESHOLD) return '<span class="badge bg-danger rounded-pill">H</span>';
  if (HIGH_PRIORITY_THRESHOLD < score && score <= MEDIUM_PRIORITY_THRESHOLD) return '<span class="badge bg-warning rounded-pill">M</span>';
  return '<span class="badge bg-secondary rounded-pill">L</span>';
}



const calculateResults = () => {
  setMinMax([...ANSWERS_SOLUTION, ...ANSWERS_SOCIETY, ...ANSWERS_SYSTEM]);

  let normalized_society_values = getDimensionScore(normalize(ANSWERS_SOCIETY, max_val, min_val));
  let normalized_solution_answers = getDimensionScore(normalize(ANSWERS_SOLUTION, max_val, min_val));
  let normalized_system_answers = getDimensionScore(normalize(ANSWERS_SYSTEM, max_val, min_val));

 let priority = [
   [ANSWERS_SOLUTION, normalized_solution_answers, 'Solution'],
   [ANSWERS_SOCIETY, normalized_society_values, 'Society'],
   [ANSWERS_SYSTEM, normalized_system_answers, 'System'],
 ].map((dimension) => getPriorityList(...dimension));


  return {
    society_score: normalized_society_values,
    solution_score: normalized_solution_answers,
    system_score: normalized_system_answers,
    priority
  };
}

//Check for the profile:
const setProfile = () => {
  let { solution_score, society_score, system_score, priority } = calculateResults();
  let data = { solution_score, society_score, system_score, media_score: mediaScore, priority };

  if (society_score > mediaScore) {
    if (solution_score > mediaScore) {
      if(system_score > mediaScore) {
        return {...data, profile:"High balance"};
      } else {
        return {...data, profile:"Society - Solution"};
      }
    } else {
      if (system_score > mediaScore) {
        return {...data, profile:"Society - System"};
      } else {
        return {...data, profile:"Society"};
      }
    }
  } else {
    if (solution_score > mediaScore) {
      if(system_score > mediaScore) {
        return {...data, profile:"System - solution"};
      } else {
        return {...data, profile:"Solution"};
      }
    } else if(system_score > mediaScore) {
      return {...data, profile:"System "};
    } else {
      return {...data, profile:"Low balance"};
    }
  }
}


export {
  getAnswerValues,
  setProfile,
}



