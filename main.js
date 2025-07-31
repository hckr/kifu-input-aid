const gobanTable = document.querySelector('.goban');
const statusTextarea = document.querySelector('.status');
const sgfTextarea = document.querySelector('.sgf');

const headerRow = document.createElement('tr');
headerRow.innerHTML = [].map
  .call(' ABCDEFGHJKLMNOPQRST', (letter) => `<th>${letter}</th>`)
  .join('');
gobanTable.appendChild(headerRow);

for (let i = 0; i < 19; ++i) {
  const row = document.createElement('tr');
  row.setAttribute('data-row', i);
  row.innerHTML = `<th>${19 - i}</th>${`<td><input /></td>`.repeat(19)}`;
  row
    .querySelectorAll('td')
    .forEach((el, key) => el.setAttribute('data-col', key));
  gobanTable.appendChild(row);
}

gobanTable.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
  if (e.target.value == '0') {
    e.target.value = '';
  }
  updateSGF();
  if (e.target.value == '') {
    e.target.classList.remove('stone-black');
    e.target.classList.remove('stone-white');
    return;
  }
  const isEven = e.target.value % 2 == 0;
  e.target.classList.add(isEven ? 'stone-white' : 'stone-black');
  e.target.classList.remove(isEven ? 'stone-black' : 'stone-white');
});

function updateSGF() {
  const sgfLetters = 'abcdefghijklmnopqrs';
  const inputs = gobanTable.querySelectorAll('input');
  const movesToCoords = [];
  const duplicatedNumbers = [];

  inputs.forEach((el) => {
    if (el.value) {
      const col = el.closest('td').getAttribute('data-col');
      const row = el.closest('tr').getAttribute('data-row');
      const ind = el.value - 1;
      if (movesToCoords[ind] !== undefined) {
        duplicatedNumbers.push(el.value);
        return;
      }
      movesToCoords[ind] = `${sgfLetters[col]}${sgfLetters[row]}`;
    }
  });

  const missingMoves = [];
  for (let i = 0; i < movesToCoords.length; ++i) {
    if (movesToCoords[i] === undefined) {
      missingMoves.push(i + 1);
    }
  }

  let error = false;
  statusTextarea.value = '';
  if (duplicatedNumbers.length > 0) {
    statusTextarea.value += 'Duplicated numbers: ' + duplicatedNumbers + '\n';
    error = true;
  }
  if (missingMoves.length > 0) {
    statusTextarea.value += 'Missing moves: ' + missingMoves + '\n';
    error = true;
  }

  if (error) {
    sgfTextarea.value = '';
    return;
  }

  sgfTextarea.value =
    '(;FF[4]\n' +
    movesToCoords
      .map((coords, ind) => `;${ind % 2 == 0 ? 'B' : 'W'}[${coords}]`)
      .join('\n') +
    ')';
}

// `;${el.value % 2 == 1 ? 'B' : 'W'}[${
//         sgfLetters[col]
//       }${sgfLetters[row]}]`;
