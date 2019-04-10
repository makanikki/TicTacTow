import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';
import { pickWinner } from './services/winnerPicker';

const PLAYERS = ['X', 'O'];
const BOARD_SIDE_LENGTH = 5;

function generateBoard(boardSideLength) {
  return [...new Array(Math.pow(boardSideLength, 2))].reduce(
    (board, _, i) => ({
      ...board,
      [i]: undefined,
    }),
    {},
  );
}

function getNextPlayer(player, players) {
  const currentIndex = players.indexOf(player);
  if (currentIndex + 1 >= players.length) return players[0];

  return players[currentIndex + 1];
}

function getGameStatus(isGameFinished, winner) {
  return isGameFinished
    ? winner !== 'Nobody'
      ? 'Won'
      : 'Draw'
    : 'On Progress';
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const [currentPlayer, setCurrentPlayer] = React.useState('X');
  const [board, setBoard] = React.useState(generateBoard(BOARD_SIDE_LENGTH));

  React.useEffect(() => {
    props.onBoardChange(board);
  }, [props, board]);

  function handleClick(i) {
    setBoard({
      ...board,
      [i]: currentPlayer,
    });
    setCurrentPlayer(getNextPlayer(currentPlayer, PLAYERS));
  }

  function renderSquare(i) {
    const isEmpty = board[i] === undefined;
    return (
      <Square
        value={board[i] || null}
        onClick={isEmpty && !props.isFinnished ? () => handleClick(i) : null}
      />
    );
  }

  const status = `Next player: ${currentPlayer}`;

  const renderBoard = boardSideLength => {
    const boardRows = [];
    let row = [];

    for (let rowId = 0; rowId < boardSideLength; ++rowId) {
      row = [...new Array(boardSideLength)].map((item, index) =>
        renderSquare(rowId * boardSideLength + index),
      );
      boardRows.push(<div className="board-row">{row}</div>);
    }

    return boardRows;
  };

  return (
    <div>
      <div className="status">{status}</div>
      {renderBoard(BOARD_SIDE_LENGTH)}
    </div>
  );
}

function Game() {
  const [isGameFinished, setIsGameFinished] = React.useState(false);
  const [winner, setWinner] = React.useState(undefined);

  function onBoardChange(board) {
    const emptyCells = Object.keys(board).filter(
      config => board[config] === undefined,
    );

    const potentialWinner = pickWinner(board);

    setIsGameFinished(!!potentialWinner || emptyCells.length === 0);

    if (isGameFinished) setWinner(potentialWinner || 'Nobody');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onBoardChange={onBoardChange} isFinnished={isGameFinished} />
      </div>
      <div className="game-info">
        <div>
          Status: <i>{getGameStatus(isGameFinished, winner)}</i>
        </div>
        <div>
          Winner: <i>{winner}</i>
        </div>
        <button onClick={() => window.location.reload()}>Restart</button>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
