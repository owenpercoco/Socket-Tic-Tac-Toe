import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

class Square extends React.Component {

  render() {
	var _class ='board-value ' + this.props.value;
    return (
      <button className="square" onClick={() => this.props.onClick()}>
		  <CSSTransitionGroup transitionName = "example"
							  transitionEnterTimeout={500}
							  transitionLeaveTimeout={300}>
			<span className={_class}>
				{this.props.value}
			</span>
			</CSSTransitionGroup >
      </button>
    );
  }
}

export default Square;
