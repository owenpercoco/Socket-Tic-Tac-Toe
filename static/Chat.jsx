import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
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
		while(data.length > 7){
			data.shift()
		}
		if(data.length - this.state.messages.length > 1){
			var new_data = [];
			
				for(var i = 0; i < data.length; i++){
					new_data[i] = data[i];
					console.log(data[i]);
					this.setState({
						messages: new_data
					});
				}
			
		}else{
			this.setState({
				messages: data
			})
		}

	}
	handleChange(event) {
    this.setState({value: event.target.value});
	}
	handleSubmit(event){
		event.preventDefault();
		this.props.socket.emit('message sent', {'message':this.state.value, 'name':this.props.name});
		this.setState({
			value: ""
		})
	}
	
  render() {
	var _class;
	var messageBoxStyle ={
		height: '400px',
		overflowY: 'hidden',
		overflowX: 'hidden',
		marginBottom:'10px'
	};
	const items = this.state.messages.map((item, i) => (
				 <li key={i}>
					<span className="message-content">{item[1]}</span>
					<span className="message-name">{item[0]}</span>
				</li>
		));
    return (
      <div id="chat-box">
	  <div className="message-area" style={messageBoxStyle}>
		<ol className="messages-list">
			<CSSTransitionGroup transitionName = "example"
						  transitionEnterTimeout={500}
						  transitionLeaveTimeout={300}>
							  {items}
			</CSSTransitionGroup >
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
