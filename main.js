const gobanTable = document.querySelector('.goban');
const movesInPlaceOfOtherTextarea = document.querySelector(
  '.moves-in-place-of-other'
);
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
  if (e.target.value == '') {
    e.target.classList.remove('stone-black');
    e.target.classList.remove('stone-white');
    return;
  }
  const isEven = e.target.value % 2 == 0;
  e.target.classList.add(isEven ? 'stone-white' : 'stone-black');
  e.target.classList.remove(isEven ? 'stone-black' : 'stone-white');
});

document.addEventListener('input', () => {
  updateSGF();
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

  console.log(movesToCoords);

  const missingMoves = [];

  // moves in place of other moves
  for (let movesLine of movesInPlaceOfOtherTextarea.value.split('\n')) {
    if (movesLine == '') {
      break;
    }
    const [moveOnBoard, movesInItsPlaceRaw] = movesLine.split(':');
    const moveOnBoardInd = toInt(moveOnBoard) - 1;
    console.log(moveOnBoardInd);
    if (movesToCoords[moveOnBoardInd] == undefined) {
      missingMoves.push(moveOnBoard);
      continue;
    }
    for (let moveInItsPlace of movesInItsPlaceRaw.split(',').map(toInt)) {
      const moveInItsPlaceInd = toInt(moveInItsPlace) - 1;

      console.log(
        moveOnBoard,
        moveOnBoardInd,
        moveInItsPlace,
        moveInItsPlaceInd
      );
      movesToCoords[moveInItsPlaceInd] = movesToCoords[moveOnBoardInd];
    }
  }
  //

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
    '(' +
    sgfHeader() +
    movesToCoords
      .map((coords, ind) => `;${ind % 2 == 0 ? 'B' : 'W'}[${coords}]`)
      .join('\n') +
    ')';
}

function sgfHeader() {
  const gameName = document.querySelector('.game-name').value.trim();
  const blackPlayerName = document
    .querySelector('.black-player-name')
    .value.trim();
  const whitePlayerName = document
    .querySelector('.white-player-name')
    .value.trim();
  return `;FF[4]
CA[UTF-8]
GM[1]
GN[${gameName}]
PB[${blackPlayerName}]
PW[${whitePlayerName}]
`;
}

function toInt(x) {
  return x | 0;
}
