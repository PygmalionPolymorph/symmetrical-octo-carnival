function changeOrigin(ev) {
    var posX = ev.clientX;
    var posY = ev.clientY;
    var targetElement = document.getElementById('canvas');
    targetElement.style['perspectiveOrigin'] = posX + 'px ' + posY + 'px';
    console.log(targetElement.style['perspectiveOrigin']);
  }
};
console.log('init');
function debounce(func, wait, immediate) {
  console.log('debounce');
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


var body = document.getElementsByTagName("body")[0];
body.addEventListener("mousemove", function(ev) {
  console.log('event');
  debounce(changeOrigin(ev), 500);
});
