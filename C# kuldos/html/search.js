'use strict';

const form = document.querySelector('#filters');
const query = document.querySelector('#query');
const chapter = document.querySelector('#chapter');
const type = document.querySelector('#type');
const count = document.querySelector('#count');

function normalize(text) {
  return text.toLocaleLowerCase('hu').normalize('NFD').replace(/\p{M}/gu, '');
}

const results = Array.from(document.querySelectorAll('.results li'), (element) => ({
  element,
  text: normalize(element.dataset.search),
}));

const parameters = new URLSearchParams(window.location.search);
query.value = parameters.get('q') ?? '';
form.hidden = false;

function filter() {
  const words = normalize(query.value).trim().split(/\s+/).filter(Boolean);
  let matches = 0;
  for (const { element, text } of results) {
    const visible = (!chapter.value || chapter.value === element.dataset.chapter) &&
      (!type.value || type.value === element.dataset.type) &&
      words.every((word) => text.includes(word));
    element.hidden = !visible;
    if (visible) matches++;
  }
  count.textContent = matches ? matches + ' találat' : 'Nincs találat. Próbálj más kifejezést vagy töröld a szűrőket.';
}

form.addEventListener('input', filter);
form.addEventListener('change', filter);
form.addEventListener('reset', () => window.setTimeout(filter, 0));
form.addEventListener('submit', (event) => event.preventDefault());
filter();

