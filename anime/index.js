import anime from 'animejs';

const scrollTo = (targetY) => () => {
  let scroll = {
    y: window.scrollY
  };

  anime({
    targets: scroll,
    y: targetY,
    easing: 'easeInOutExpo',
    update: (anim) => {
      console.log(scroll);
      window.scroll(window.scrollX, anim.animations[0].currentValue);
    }
  });
}

document.addEventListener('click', scrollTo(0));
