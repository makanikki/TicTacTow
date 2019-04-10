import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { pickWinner } from "./services/winnerPicker";
import { searchForWin } from "./services/plop";

const PLAYERS = ["X", "O"];

function getNextPlayer(player, players) {
  const currentIndex = players.indexOf(player);
  if (currentIndex + 1 >= players.length) return players[0];

  return players[currentIndex + 1];
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const [currentPlayer, setCurrentPlayer] = React.useState("X");
  const [board, setBoard] = React.useState({
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
    8: undefined,
    9: undefined
  });
  const [isGameFinished, setIsGameFinished] = React.useState(false);

  React.useEffect(() => {
    props.onConfigChange(board);
  }, [props, board]);

  function handleClick(i) {
    setBoard({
      ...board,
      [i]: currentPlayer
    });
    setCurrentPlayer(getNextPlayer(currentPlayer, PLAYERS));
  }

  function renderSquare(i) {
    const isEmpty = board[i] === undefined;
    return (
      <Square
        value={board[i] || null}
        onClick={isEmpty ? () => handleClick(i) : null}
      />
    );
  }

  const status = `Next player: ${currentPlayer}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [isGameFinished, setIsGameFinished] = React.useState(false);
  const [winner, setWinner] = React.useState(undefined);

  function onConfigChange(configuration) {
    const emptyCell = Object.keys(configuration).filter(
      config => configuration[config] === undefined
    );
    setIsGameFinished(emptyCell.length === 0);

    // if (isGameFinished) setWinner(pickWinner(configuration));
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onConfigChange={onConfigChange} />
      </div>
      <div className="game-info">
        <div>
          Status: <i>{isGameFinished ? "Over" : "In progress"}</i>
        </div>
        <div>
          Winner: <i>{winner}</i>
        </div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
