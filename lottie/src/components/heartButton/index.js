import React from 'react';
import lottie from 'lottie-web';
import h from 'react-hyperscript';

import './style.less';
import heartButtonAnimation from './heartButtonAnimation.json';

const playAnimation = (animation) => () => animation && animation.playSegments([60, 110], true);

export default class HeartButton extends React.Component {
  constructor() {
    super();
    this.state = {
      animation: null,
    };
  }

  componentDidMount() {
    const { container } = this;

    const animation = lottie.loadAnimation({
      animationData: heartButtonAnimation,
      autoplay: false,
      loop: false,
      container
    });

    this.setState({ animation });
  }

  render() {
    const { animation } = this.state;

    window.animation = animation;

    return h('div.animation.heart-button', {
      onClick: playAnimation(animation),
      ref: (container) => {
        this.container = container;
      },
    });
  }
};
