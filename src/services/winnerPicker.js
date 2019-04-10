export function buildMatrice(board) {
  const sideLength = Math.sqrt(Object.keys(board).length);

  return Object.keys(board).reduce((acc, cellId) => {
    const cell = board[cellId];
    const cellRow = Math.floor(cellId / sideLength);

    if (!acc[cellRow]) acc[cellRow] = [];
    acc[cellRow].push(cell);

    return [...acc];
  }, []);
}

export function getNewCoords(currentCoords, direction) {
  return currentCoords.map(
    (coord, i) => parseInt(coord) + parseInt(direction[i]),
  );
}

// TODO: Only return a single line. Return format : ['0,0_1,1', 'X']
export function findWinPattern(lines) {
  return Object.keys(lines).reduce((acc, lineId) => {
    if (acc) return acc;
    const line = lines[lineId];
    const isWin = line.every(item => item !== undefined && item === line[0]);

    return isWin ? [lineId, line[0]] : acc;
  }, undefined);
}

export function exploreVector(matrice, currentCoords, direction, chain = []) {
  const [x, y] = currentCoords;
  // console.warn("x, y", x, y);
  const newChain = [...chain, matrice[x] ? matrice[x][y] : undefined];

  if (newChain.length >= matrice.length) return newChain;

  return exploreVector(
    matrice,
    getNewCoords(currentCoords, direction),
    direction,
    newChain,
  );
}

export function searchForWin(matrice) {
  // console.warn("matrice", matrice);
  let lines = [];
  for (const rowId in matrice) {
    const row = matrice[rowId];
    for (const itemId in row) {
      // console.warn("itemId", itemId);
      // TODO: find a way to find the line back in a more explicit way (no "0,0_0,1")
      lines = {
        '0,0_0,1': exploreVector(matrice, [rowId, itemId], [0, 1]),
        '0,0_1,0': exploreVector(matrice, [rowId, itemId], [1, 0]),
        '0,0_1,1': exploreVector(matrice, [rowId, itemId], [1, 1]),
        '0,0_1,-1': exploreVector(matrice, [rowId, itemId], [1, -1]),
      };

      const winningLine = findWinPattern(lines);

      if (!!winningLine) return winningLine;
    }
  }
}

export function pickWinner(board) {
  const matrice = buildMatrice(board);
  const winningLine = searchForWin(matrice);

  return winningLine ? winningLine[1] : undefined;
}
