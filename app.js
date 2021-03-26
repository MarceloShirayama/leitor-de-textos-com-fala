const main = document.querySelector('main');
const buttonInsertText = document.querySelector('.btn-toggle');
const buttonReadText = document.querySelector('#read');
const divTextBox = document.querySelector('.text-box');
const closeDivTextBox = document.querySelector('.close');
const selectElement = document.querySelector('select');
const textArea = document.querySelector('textarea');

const humanExpressions = [
  { img: './img/angry.jpg', text: 'Estou com raiva' },
  { img: './img/drink.jpg', text: 'Estou com sede' },
  { img: './img/food.jpg', text: 'Estou com fome' },
  { img: './img/grandma.jpg', text: 'Quero ver a vovó' },
  { img: './img/happy.jpg', text: 'Estou feliz' },
  { img: './img/home.jpg', text: 'Quero ir para casa' },
  { img: './img/hurt.jpg', text: 'Estou machucado' },
  { img: './img/outside.jpg', text: 'Quero ir lá fora' },
  { img: './img/sad.jpg', text: 'Estou triste' },
  { img: './img/scared.jpg', text: 'Estou assustado' },
  { img: './img/school.jpg', text: 'Quero ir para a escola' },
  { img: './img/tired.jpg', text: 'Estou cansado' },
];

let voices = [];

const utterance = new SpeechSynthesisUtterance();

const setTextMessage = (text) => {
  utterance.text = text;
};

const speakText = () => {
  speechSynthesis.speak(utterance);
};

const setVoice = (event) => {
  const selectVoice = voices.find((voice) => voice.name === event.target.value);
  utterance.voice = selectVoice;
};

const addExpressionBoxesIntoDOM = () => {
  main.innerHTML = humanExpressions.map(({ img, text }) => `
    <div class="expression-box" data-js="${text}">
      <img src="${img}" alt="${text}" data-js="${text}">
      <p class="info" data-js="${text}">${text}</p>
    </div>
  `).join('');
};

addExpressionBoxesIntoDOM();

const setStyleClickedDiv = (dataValue) => {
  const div = document.querySelector(`[data-js="${dataValue}"]`);

  div.classList.add('active');

  setTimeout(() => {
    div.classList.remove('active');
  }, 1500);
};

main.addEventListener('click', (event) => {
  const { tagName, dataset } = event.target;
  const clickedElementTextMustBeSpoken = ['img', 'p']
    .some((elementName) => elementName.toLowerCase() === tagName.toLowerCase());

  if (clickedElementTextMustBeSpoken) {
    setTextMessage(dataset.js);
    speakText();

    setStyleClickedDiv(dataset.js);
  }
});

const insertElementsIntoDOM = (voicesInternal) => {
  selectElement.innerHTML = voicesInternal.reduce((acc, { name, lang }) => {
    // eslint-disable-next-line no-param-reassign
    acc += `<option value="${name}">${lang} | ${name}</option>`;
    return acc;
  }, '');
};

const setUtterandeVoice = (selectedVoice) => {
  utterance.voice = selectedVoice;
  const voiceOptionElement = selectElement
    .querySelector(`[value="${selectedVoice.name}"]`);
  voiceOptionElement.selected = true;
};

const setPTBRVoices = (voicesInternal) => {
  const googleVoice = voicesInternal.find((voice) => (
    voice.name === 'Google português do Brasil'
  ));

  const microsoftVoice = voicesInternal.find((voice) => (
    voice.name === 'Microsoft Daniel - Portuguese (Brazil)'
  ));

  if (googleVoice) {
    setUtterandeVoice(googleVoice);
  } else if (microsoftVoice) {
    setUtterandeVoice(microsoftVoice);
  }
};

speechSynthesis.addEventListener('voiceschanged', () => {
  voices = speechSynthesis.getVoices();

  insertElementsIntoDOM(voices);

  setPTBRVoices(voices);
});

buttonInsertText.addEventListener('click', () => {
  divTextBox.classList.add('show');
});

closeDivTextBox.addEventListener('click', () => {
  divTextBox.classList.remove('show');
});

selectElement.addEventListener('change', setVoice);

buttonReadText.addEventListener('click', () => {
  setTextMessage(textArea.value);
  speakText();
});
