import React from 'react';
import Board from './board/board.js';
import './tic-tac-toe.scss';

  class TicTactoe extends React.Component {
    // state.history.squares records the status of each Square - X, O, or null
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
          }
        ], 
        stepNumber: 0, 
        xIsNext: true
      }
    }
    
    // FOR SERVER USE ONLY (doesn't check legality)
    handleClickOverride(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      this.props.onBoardClick({ 
        player: this.props.role, 
        squareNum: i
      });
      
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({ 
        history: [...history, { squares: squares }],
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext 
      });
    }

    // Updates the TicTacToe's history.squares and stepNumber when a Square is clicked.
    handleClick(i) {
      // Ready to wipe the previous history beyond this point (future has changed)
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      // Check if legal move
      const playerTurn = this.state.xIsNext ? "X" : "O";
      if (squares[i] || this.props.role !== playerTurn || getGameResult(squares)) {
        return ;
      }

      // Communicate to server
      this.props.onBoardClick({ 
        player: this.props.role, 
        squareNum: i
      });
      
      // Update state
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({ 
        history: [...history, { squares: squares }],
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext 
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step, 
        xIsNext: (step % 2) === 0
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];

      const gameResult = getGameResult(current.squares);
      let status; 
      if (!gameResult) {
        status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
      } else if (gameResult === "Tie") {
        status = `The game ended in a tie!`
      } else {
        status = `Winner: ${gameResult}`
      }

      // Check if the playerMove is already rendered - if not, update the state.
      if (this.props.playerMove) {
        const playMovedSquare = this.props.playerMove.squareNum;
        if (!current.squares[playMovedSquare]) {
          this.handleClickOverride(playMovedSquare);
        }
      }

      // eslint-disable-next-line no-unused-vars
      const moves = history.map((step, move) => {
        const desc = move ? "Go to move #" + move : "Go to game start";
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button> 
          </li>
        );
      });

      return (
        <div className="game">
          <div className="game-inception">
            <div className="game-board">
              <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
              <div>Your Mark: {this.props.role}</div>
              <div>{status}</div>
              {/* <ol>{moves}</ol> */}
            </div>
          </div>
        </div>
      );
    }
  }
  
  // getGameResult takes in an array of 9 elements 'X', 'O', or null and returns the 
  //   final game result:  "X", "O", "Tie", or null if the game is still ongoing.
  function getGameResult(squares) {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.reduce((acc, cur) => acc && cur)) {
      return "Tie";
    } 
    return null;
  }

  export default TicTactoe;