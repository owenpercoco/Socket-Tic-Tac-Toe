import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Square from './Square.jsx';
import Chat from './Chat.jsx';
const io = require('socket.io-client');
const socket = io();


class Board extends React.Component {
   
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }
  
  render() {
    return (
      <div className=" ">
	  
			<div className="board-row">
			  {this.renderSquare(0, 0)}
			  {this.renderSquare(0, 1)}
			  {this.renderSquare(0, 2)}
			</div>
			<div className="board-row">
			  {this.renderSquare(1, 0)}
			  {this.renderSquare(1,1)}
			  {this.renderSquare(1,2)}
			</div>
			<div className="board-row">
			  {this.renderSquare(2, 0)}
			  {this.renderSquare(2, 1)}
			  {this.renderSquare(2, 2)}
			</div>
		  
	  </div>
    );
  }
}
//generates your scoreboard, adding a nice music note to whoever is winning.  If its tied, its still the computers win, because really if you aren't winning, the computer is.
class Score extends React.Component{

  render(){
	  if (this.props.playerScore > this.props.computerScore){
		return(
		  <div>
			  <span  className="winning">{this.props.player_1}: {this.props.playerScore}</span>
			  <span>{this.props.player_2}:  {this.props.computerScore}</span>
			  <span>Ties: {this.props.ties}</span>
		  </div>
	  )  
	  }else{
		  return(
		  <div>
			  <span>{this.props.player_1}: {this.props.playerScore}</span>
			  <span className="winning">{this.props.player_2}:  {this.props.computerScore}</span>
			  <span>Ties: {this.props.ties}</span>
		  </div>
	  )
	  }
	  
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares:[['-', '-', '-'],
			  ['-', '-', '-'],
			  ['-', '-', '-']
			],
	  playerTurn: true,
	  player: 0,
	  playerScore: 0,
	  computerScore: 0,
	  ties: 0,
	  player_1: 'player one',
	  player_2: 'player two'
    };
	socket.on('click move', (payload) => this.Sockethandleclick(payload['data']['i'], payload['data']['j']));
	socket.on('reset move', (payload) => this.resetBoard(payload));
	socket.on('naming change', (payload) => this.namingChange(payload));
	socket.on('signed on', (payload) => this.setPlayer(payload['player']));
    }
	setPlayer(playerId){
		if(this.state.player == 0){
			this.setState({player: playerId%2 +1})
		}
		if(this.state.player === 2){
			this.setState({
			  playerTurn: !this.state.playerTurn,
			});
		}
	}
	namingChange(data){
		if (data['data']['player'] === 1){
			this.setState({
				player_1:data['data']['name']
			});
		}else{
			this.setState({
				player_2:data['data']['name']
			});
		}
		
	}
	updateNameEmit(event){
		var player = this.state.player;
		socket.emit('name change', {'name':event.target.value, 'player':player})

	}
    Sockethandleclick(i, j) {
		
		const squares = this.state.squares.slice();
		if (calculateWinner(this.state.squares) || this.state.squares[i][j] !== '-') {
		  return;
		}
		
		if(this.state.player === 1){
			squares[i][j] = this.state.playerTurn ? 'X' : 'O';
		}else if(this.state.player === 2){
			squares[i][j] = this.state.playerTurn ? 'O' : 'X';
		}
		
		this.setState({
		  squares: squares,
		  playerTurn: !this.state.playerTurn,
		});
  }
  
  resetBoard(){
	  this.setState({
      squares: [['-', '-', '-'],['-', '-', '-'],['-', '-', '-']]
    });
  }
  handleClick(i, j) {
	if(this.state.playerTurn === false){
			return
		}
    socket.emit('click', { 'i': i, 'j':j });
  }
  
  
  resetBoard(){
	  this.setState({
      squares: [['-', '-', '-'],['-', '-', '-'],['-', '-', '-']]
    });
  } 
  render() {
	
	const winner = calculateWinner(this.state.squares, this.state.playerTurn);
    let status;
    if (winner) {
	  if (winner === 'tie'){
		  this.state.ties += 1;
	  }else{
		if(this.state.player === 1){
			this.state.playerTurn ? this.state.computerScore+=1 : this.state.playerScore += 1;  //im mutating state directly here and above, it throws a warning.  Will fix
		}else if(this.state.player === 2){
			this.state.playerTurn ? this.state.playerScore+=1 : this.state.computerScore += 1;  //im mutating state directly here and above, it throws a warning.  Will fix
		}
		  
	  }
	  
      status = winner;
	  
    } else {
      status = (this.state.playerTurn ? 'Your turn' : 'their turn');
    }
	
	var name = this.state.player ==1 ? this.state.player_1 : this.state.player_2;  //im mutating state directly here and above, it throws a warning.  Will fix
    return (
	<div className="row">
		<div className="col-md-4">
			<form>
				<div className="form-group">
					<label>
					  Player {this.state.player} Name:
					  <input className="form-control" type="text" value={this.state.value} onChange={this.updateNameEmit.bind(this)} />
					</label>
				</div>
			</form>
			<Chat
			 name = {name}
			 socket = {socket}
			/>
		</div>
	<div className="col-md-8 text-center">
		<div className="game">
		  <div className="row">
			<div className="col-md-12">
				<div className="status">{status}</div>
			</div>
		  </div>
	  <div className="row">
        <div className="game-board">
          <Board squares={this.state.squares}
            onClick={(i, j) => this.handleClick(i, j)}
			/>
        </div>
	  </div>
	</div>      
		<div className="row">
			<div className="game-info">
			  <Score playerScore = {this.state.playerScore}
					 computerScore = {this.state.computerScore}
					 ties = {this.state.ties}
					 player_1={this.state.player_1}
					 player_2={this.state.player_2}/>
			  <button onClick={() => socket.emit('reset', {'board':1 })} >Reset Board </button>
			</div>
		  </div>
	</div>
	</div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
//helper method, calculates the game winner, or returns false if no one has clinched it yet
function calculateWinner(squares, player) {
	
	  var status = (player ? 'You lost' : 'You won!');
	  if (squares[0][0] === squares[1][1] && squares[0][0] === squares[2][2] && squares[0][0] !== '-') {
			return status;
	  }else if (squares[0][2] === squares[1][1] && squares[1][1] === squares[2][0] && squares[2][0] !== '-') {
			return status;
	  }
	  for(var i = 0; i < squares.length; i++) {
		if (squares[i][0] === squares[i][1] && squares[i][1] === squares[i][2] && squares[i][1] !== '-') {
			return status;
		}
		if (squares[0][i] === squares[1][i] && squares[1][i] === squares[2][i] && squares[0][i] !== '-') {
			return status;
		}
	}
	var spaces = false;
	for (i = 0; i <squares.length; i++) {
        for(var j = 0; j < squares[i].length; j++){
			if (squares[i][j] === '-'){
				spaces = true;
			}
		}
	}
	if(spaces === false){
		return 'tie';
	}
	  return false;
	  
}

export default Game;


