let ANSWERS_SOLUTION;
let ANSWERS_SOCIETY;
let ANSWERS_SYSTEM;
let mediaScore;

let solution_score;
let society_score;
let system_score;
let priority;

let HIGH_PRIORITY_THRESHOLD = 2;
let MEDIUM_PRIORITY_THRESHOLD = 3;

const getAnswerValues_p2 = (values) => {
  ANSWERS_SOLUTION = values.solution;
  ANSWERS_SOCIETY = values.society;
  ANSWERS_SYSTEM = values.system;
}


const getLowerValues = (values) => {
  let lowerValues = values.filter((value) => value <= mediaScore);
  return lowerValues.length > 0;
}

const getPriorityList = (answers, score, name) => {
  if (getLowerValues(answers)) {
    return {name: `${name} priority: ${getPriority(score)}`}
  }
}


const getDimensionScore = (dimensionAnswers) => {
  let reduceAnswers = dimensionAnswers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return reduceAnswers / dimensionAnswers.length;
}

const calculateResults = () => {
  solution_score = getDimensionScore(ANSWERS_SOLUTION);
  society_score = getDimensionScore(ANSWERS_SOCIETY);
  system_score = getDimensionScore(ANSWERS_SYSTEM);

  mediaScore = (solution_score + society_score + system_score) / 3;

  HIGH_PRIORITY_THRESHOLD = (mediaScore / 3);
  MEDIUM_PRIORITY_THRESHOLD = (mediaScore / 2);

  priority = [
    [ANSWERS_SOLUTION, solution_score, 'Solution'],
    [ANSWERS_SOCIETY, society_score, 'Society'],
    [ANSWERS_SYSTEM, system_score, 'System'],
  ].map((dimension) => getPriorityList(...dimension));
}

const getPriority = (score) => {
  if (score === mediaScore) return '<span class="badge bg-info rounded-pill">N/A</span>';
  if (score <= HIGH_PRIORITY_THRESHOLD) return '<span class="badge bg-danger rounded-pill">H</span>';
  if (HIGH_PRIORITY_THRESHOLD < score && score <= MEDIUM_PRIORITY_THRESHOLD) return '<span class="badge bg-warning rounded-pill">M</span>';
  return '<span class="badge bg-secondary rounded-pill">L</span>';
}


//Check for the profile:
const setProfile_p2 = () => {
  calculateResults();
  let data = { solution_score, society_score, system_score, media_score: mediaScore, priority };

  if (society_score >= mediaScore) {
    if (solution_score >= mediaScore) {
      if(system_score >= mediaScore) {
        return {...data, profile:"High balance"};
      } else {
        return {...data, profile:"Society - Solution"};
      }
    } else {
      if (system_score >= mediaScore) {
        return {...data, profile:"Society - System"};
      } else {
        return {...data, profile:"Society"};
      }
    }
  } else {
    if (solution_score >= mediaScore) {
      if(system_score >= mediaScore) {
        return {...data, profile:"System - solution"};
      } else {
        return {...data, profile:"Solution"};
      }
    } else if(system_score >= mediaScore) {
      return {...data, profile:"System "};
    } else {
      return {...data, profile:"Low balance"};
    }
  }
}


export {
  getAnswerValues_p2,
  setProfile_p2,
}
