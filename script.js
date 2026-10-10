'use strict';
const $ = id => document.getElementById(id);
let round = 0;
let selected = new Set();
let history = [];
let checked = false;
let optionOrder = [];
function announce(message) { $('announcement').textContent = message; }
function focusHeading(id) { $(id).focus(); $(id).scrollIntoView({block:'start'}); }
function shuffled(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function start() {
  round = 0; history = []; selected = new Set();
  $('intro').hidden = true; $('results').hidden = true; $('builder-section').hidden = true;
  $('built-result').hidden = true; $('builder').reset(); $('game').hidden = false;
  renderRound();
}
function renderRound() {
  const c = CHALLENGES[round];
  checked = false; selected.clear();
  $('feedback').hidden = true; $('check').disabled = true;
  $('hint').open = false;
  $('progress-label').textContent = `CHALLENGE ${round + 1} OF ${CHALLENGES.length}`;
  $('progress').value = round;
  for (const [id, value] of Object.entries({'category':c.category,'challenge-title':c.title,'context':c.context,'vague':`“${c.vague}”`,'mission':c.mission,'hint-text':c.hint})) $(id).textContent = value;
  $('options').replaceChildren();
  optionOrder = shuffled(c.options.map((_, i) => i));
  for (const i of optionOrder) {
    const label = document.createElement('label'); label.className = 'option';
    const input = document.createElement('input'); input.type = 'checkbox'; input.value = i;
    input.addEventListener('change', () => {
      if (checked) return;
      if (input.checked && selected.size === 3) {
        input.checked = false;
        $('selection-status').textContent = 'Three selected. Untick one to swap a detail.';
        announce('Three details selected. Untick one before choosing another.');
        return;
      }
      input.checked ? selected.add(i) : selected.delete(i);
      $('selection-status').textContent = `${selected.size} of 3 selected`;
      $('check').disabled = selected.size !== 3;
    });
    const text = document.createElement('span'); text.textContent = c.options[i][0];
    label.append(input, text); $('options').append(label);
  }
  $('selection-status').textContent = '0 of 3 selected';
  focusHeading('challenge-title');
}
function checkRound() {
  if (checked || selected.size !== 3) return;
  checked = true;
  const c = CHALLENGES[round];
  const points = [...selected].filter(i => c.options[i][1]).length;
  history.push({points, selected:[...selected]});
  $('options').querySelectorAll('input').forEach(input => { input.disabled = true; });
  $('check').disabled = true;
  $('progress').value = round + 1;
  $('feedback-heading').textContent = points === 3 ? 'That’s a useful brief.' : 'A few details make the difference.';
  $('feedback-copy').textContent = points === 3 ? 'Your three additions fit this task. Here is why they help.' : 'Good practice includes spotting what to leave out. Compare your choices with the details that serve this task.';
  $('round-score').textContent = `${points} / 3`;
  $('round-score').setAttribute('aria-label', `${points} of 3 useful details selected`);
  $('choice-review').replaceChildren();
  for (const i of optionOrder) {
    const [text, good, reason] = c.options[i];
    const note = document.createElement('div'); note.className = `choice-note${good ? ' useful' : ''}`;
    const label = document.createElement('span'); label.className = 'note-label';
    label.textContent = good ? (selected.has(i) ? 'Selected · useful detail' : 'Worth adding') : (selected.has(i) ? 'Selected · rethink this' : 'Left out · good call');
    const title = document.createElement('strong'); title.textContent = text;
    const p = document.createElement('p'); p.textContent = reason;
    note.append(label, title, p); $('choice-review').append(note);
  }
  $('model-prompt').textContent = c.model; $('takeaway').textContent = c.takeaway;
  $('copy-example').textContent = 'Copy example prompt';
  $('next').textContent = round === CHALLENGES.length - 1 ? 'See my takeaways →' : 'Next challenge →';
  $('feedback').hidden = false;
  focusHeading('feedback');
}
function showResults() {
  $('game').hidden = true; $('results').hidden = false; $('builder-section').hidden = false;
  const total = history.reduce((sum, item) => sum + item.points, 0);
  $('score').textContent = `${total} of ${CHALLENGES.length * 3} useful details selected`;
  $('result-copy').textContent = total === 18 ? 'You matched every task with the details it needed. Take that thinking into your next prompt.' : 'You’ve practised giving context, setting limits and checking assumptions. Take one of these habits into your next prompt.';
  $('review').replaceChildren();
  CHALLENGES.forEach((c, i) => {
    const details = document.createElement('details'); details.className = 'review-item';
    const summary = document.createElement('summary'); const name = document.createElement('strong'); name.textContent = `${i + 1}. ${c.title}`;
    const points = document.createElement('span'); points.textContent = `${history[i].points} / 3`; summary.append(name, points);
    const takeaway = document.createElement('p'); takeaway.textContent = c.takeaway;
    const prompt = document.createElement('p'); prompt.textContent = c.model;
    details.append(summary, takeaway, prompt); $('review').append(details);
  });
  focusHeading('result-heading');
}
async function copyText(text, button) {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied'; announce('Prompt copied.');
  } catch {
    const target = button.id === 'copy-built' ? $('built-prompt') : $('model-prompt');
    const range = document.createRange(); range.selectNodeContents(target);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    button.textContent = 'Select text and copy'; announce('Automatic copying is unavailable. The prompt text is selected so you can copy it manually.');
  }
}
function downloadNotes() {
  const total = history.reduce((sum, h) => sum + h.points, 0);
  const text = ['PROMPT PRACTICE | CODED FEMALE', 'https://codedfemale.com', '', `${total} of 18 useful details selected. This is practice, not a measure of AI expertise.`, '', ...CHALLENGES.flatMap((c, i) => [`${i+1}. ${c.title}`, c.takeaway, `Your selections: ${history[i].selected.map(n => c.options[n][0]).join(' | ')}`, `Example prompt: ${c.model}`, '']), 'Review AI output, check important facts and protect confidential information.'].join('\n');
  const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'coded-female-prompt-notes.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Your prompt notes have been downloaded.');
}
$('start').addEventListener('click', start); $('replay').addEventListener('click', start);
$('restart').addEventListener('click', () => { if (window.confirm('Start again? Your current practice round will reset.')) start(); });
$('check').addEventListener('click', checkRound);
$('next').addEventListener('click', () => { if (!checked) return; if (round + 1 === CHALLENGES.length) showResults(); else { round++; renderRound(); } });
$('copy-example').addEventListener('click', () => copyText(CHALLENGES[round].model, $('copy-example')));
$('download').addEventListener('click', downloadNotes);
$('open-builder').addEventListener('click', () => focusHeading('builder-heading'));
$('builder').addEventListener('submit', event => {
  event.preventDefault();
  const task = $('task').value.trim();
  if (!task) { $('task').setCustomValidity('Add a task before building your prompt.'); $('task').reportValidity(); return; }
  const parts = [task];
  for (const [id, label] of [['background','Context'],['format','Answer format'],['limits','Limits and checks']]) {
    const value = $(id).value.trim(); if (value) parts.push(`${label}: ${value}`);
  }
  $('built-prompt').textContent = parts.join('\n\n'); $('built-result').hidden = false;
  $('copy-built').textContent = 'Copy my prompt';
  $('built-result').scrollIntoView({block:'nearest'}); announce('Your draft prompt is ready below the form.');
});
$('task').addEventListener('input', () => $('task').setCustomValidity(''));
$('builder').addEventListener('input', () => { $('built-result').hidden = true; });
$('copy-built').addEventListener('click', () => copyText($('built-prompt').textContent, $('copy-built')));
