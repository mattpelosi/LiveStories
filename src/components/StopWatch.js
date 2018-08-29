import React from "react";

class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };

    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.paused !== this.props.paused) {
      return true;
    }
    if (nextState.count > 0 && nextState.count <= 2000) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    }
    if (prevState.count > 2000) {
      this.pauseTimer();
      this.clearTimer();
      this.startTimer();
    }
    if (this.state.willIncrementYear) {
      this.setState({ willIncrementYear: false }, this.props.incrementYear());
    }
  }

  startTimer() {
    const startCount = Date.now() - this.state.count;
    this.timer = setInterval(() => {
      this.setState({ count: Date.now() - startCount });
    }, 10);
  }

  pauseTimer() {
    clearInterval(this.timer);
  }

  clearTimer() {
    this.setState({ count: 0, willIncrementYear: true });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return null;
  }
}

export default StopWatch;
