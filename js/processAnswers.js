import { getAnswerValues, setProfile } from "./processProfile.js";
import { getAnswerValues_p2, setProfile_p2 } from "./processProfileV2.js";

let societyWrapper = document.querySelector('#society');
let solutionWrapper = document.querySelector('#solution');
let systemWrapper = document.querySelector('#system');


function setAnswerList(answersList) {
  return [...answersList].map((answer) => parseInt(answer.value));
}

function showSelectedValue(event) {
  if(event.target.tagName === "INPUT") {
    let question = event.target;
    question.parentNode.querySelector('.selected-value').innerHTML = event.target.value;
  }
}


function getProfile() {
  let societyAnswers = setAnswerList(societyWrapper.querySelectorAll("input"));
  let solutionAnswers = setAnswerList(solutionWrapper.querySelectorAll("input"));
  let systemAnswers = setAnswerList(systemWrapper.querySelectorAll("input"));


  getAnswerValues({
    society: societyAnswers,
    solution: solutionAnswers,
    system: systemAnswers
  });
  getAnswerValues_p2({
    society: societyAnswers,
    solution: solutionAnswers,
    system: systemAnswers
  });

  let profile = setProfile();
  let profile2 = setProfile_p2();

  setProfileView(profile2, '.result-v1');
  setProfileView(profile, '.result-v2');

  setRoadmapTodo(profile2.priority, '.result-v1');
  setRoadmapTodo(profile.priority, '.result-v2');
}

function setProfileView(data, container) {
  let { solution_score, society_score, system_score, media_score, profile } = data;
  let wrapper = document.querySelector(container);

  wrapper.innerHTML = `<ul class="list-group">
    <li class="list-group-item d-flex justify-content-between align-items-center">
      Media score:
      <span class="badge bg-success rounded-pill">${media_score.toFixed(1)}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      Solution score:
      <span class="badge bg-primary rounded-pill">${solution_score.toFixed(1)}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      Society score:
      <span class="badge bg-primary rounded-pill"> ${society_score.toFixed(1)}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      System score:
      <span class="badge bg-primary rounded-pill">${system_score.toFixed(1)}</span>
    </li>
    <li class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center">
       Profile: <span class="tf-4"> ${profile}</span>
    </li>
  </ul>`;
}

function setRoadmapTodo(data, container) {
  let wrapper = document.querySelector(container);
  let _header = document.createElement('li');

  _header.className = "list-group-item list-group-item-secondary d-flex justify-content-between align-items-center";
  _header.innerHTML = 'Roadmap to do priority';
  wrapper.querySelector('.list-group').insertAdjacentElement('beforeend', _header);

  data.filter(Boolean).map(function(dimension) {
    let _li = document.createElement('li');
    _li.className = "list-group-item d-flex justify-content-between align-items-center";
    _li.innerHTML = dimension.name;
    wrapper.querySelector('.list-group').insertAdjacentElement('beforeend', _li);
  });
}

societyWrapper.addEventListener('mouseup', showSelectedValue);
solutionWrapper.addEventListener('mouseup', showSelectedValue);
systemWrapper.addEventListener('mouseup', showSelectedValue);

let btn = document.querySelector('.js-profile');
let reset = document.querySelector('.js-reset');

btn.addEventListener('click', getProfile);
reset.addEventListener('click', () => {
  window.location.href = window.location.href
});