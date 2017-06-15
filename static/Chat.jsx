import React from 'react';

class Square extends React.Component {

  render() {
	var _class ='board-value ' + this.props.value;
    return (
      <button className="square" onClick={() => this.props.onClick()}>
		<span className={_class}>
			{this.props.value}
		</span>
      </button>
    );
  }
}

export default Square;
