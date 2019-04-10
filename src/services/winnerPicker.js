export function buildMatrice(board) {
  const sideLength = Math.sqrt(Object.keys(board).length);

  return Object.keys(board).reduce((acc, cellId) => {
    const cell = board[cellId];
    const cellRow = Math.ceil(cellId / sideLength) - 1;

    if (!acc[cellRow]) acc[cellRow] = [];
    acc[cellRow].push(cell);

    return [...acc];
  }, []);
}

export function getNewCoords(currentCoords, direction) {
  return currentCoords.map(
    (coord, i) => parseInt(coord) + parseInt(direction[i])
  );
}

export function findWinPattern(lines) {
  return Object.keys(lines).reduce((acc, lineId) => {
    const line = lines[lineId];
    const isWin = line.every(item => item === line[0]);

    return isWin
      ? {
          ...acc,
          [lineId]: line
        }
      : acc;
  }, undefined);
}

export function exploreVector(matrice, currentCoords, direction, chain = []) {
  const [x, y] = currentCoords;
  const newChain = [...chain, matrice[x][y]];

  if (newChain.length >= matrice.length) return newChain;

  return exploreVector(
    matrice,
    getNewCoords(currentCoords, direction),
    direction,
    newChain
  );
}

export function searchForWin(matrice) {
  let lines = [];
  for (const rowId in matrice) {
    const row = matrice[rowId];
    for (const itemId in row) {
      // TODO: find a way to find the line back in a more explicit way (no "0,0_0,1")
      lines = {
        "0,0_0,1": exploreVector(matrice, [rowId, itemId], [0, 1]),
        "0,0_1,0": exploreVector(matrice, [rowId, itemId], [1, 0]),
        "0,0_1,1": exploreVector(matrice, [rowId, itemId], [1, 1])
      };

      return findWinPattern(lines);
    }
  }
}

export function pickWinner(board) {
  const matrice = buildMatrice(board);
  const hasWinningPattern = searchForWin(matrice);
  return "X";
}
