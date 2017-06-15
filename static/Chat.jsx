import React from 'react';
const io = require('socket.io-client');



class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  messages: [],
		  value: ''
		};
		const socket = this.props.socket;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		socket.on('messages update', (payload) => this.updateMessages(payload['messages']));
    }
	componentDidMount(){
		
	}
	updateMessages(data){
		this.setState({
			messages: data
		})
	}
	handleChange(event) {
    this.setState({value: event.target.value});
	}
	handleSubmit(event){
		event.preventDefault();
		this.props.socket.emit('message sent', {'message':this.state.value, 'name':this.props.name})
		this.setState({
			value: ""
		})
	}
	
  render() {
	var _class;
	var messageBoxStyle ={
		height: '400px',
		background: 'white',
		border: '3px solid #77aca2',
		borderRadius: '8px',
		padding: '10px',
		overflowY: 'scroll'
	};
    return (
      <div id="chat-box">
	  <div className="message-area" style={messageBoxStyle}>
		<ol className="messages-list">
		{
			  this.state.messages.map(function(item, i){
			  return <li key={i}>
						<span className="message-content">{item[1]}</span>
						<span className="message-name">{item[0]}</span>
					</li>
				})
		}
		</ol>
	  </div>
	  
	  		<form onSubmit={this.handleSubmit} >
				<div className="form-group">
					<label className="message-label">
					
					  <input className="form-control" type="text" value={this.state.value} onChange={this.handleChange}/>
					</label>
					  <input type="submit" value="submit"/>
				</div>
			</form>
	  </div>
    );
  }
}

export default Chat;
