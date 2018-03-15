var Gallery = (function(options) {

	/*
	* Initialize global variables,
	* bind events
	* and load the first Pictures
	*********/
	var init = function() {
		$columns = $('.column');
		$backdrop = $('.backdrop');
		columnHeights = new Array();
		scrollState = 0;
		comparisonWidth = window.innerWidth;
		options = (typeof options === 'undefined') ? {} : options
		categories = (typeof options['categoryChances'] === 'undefined') ? obtainCategoriesFromInputsIn('.sliders') : options['categoryChances'];
		breakpoints = (typeof options['breakpoints'] === 'undefined') ? [1280, 960, 720, 600] : options['breakpoints'];
		imageUrl = (typeof options['imageUrl'] === 'undefined') ? 'http://lorempixel.com/@width/@height/@category' : options['imageUrl']
		autoScroll = (typeof options['autoScroll'] === 'undefined') ? '' : options['autoScroll'];
		autoScrollSpeed = (typeof options['autoScrollSpeed'] === 'undefined') ? 10 : options['autoScrollSpeed'];
		scrollThreshold = (typeof options['scrollThreshold'] === 'undefined') ? 1 : options['scrollThreshold'];


		//Represent columns heights through an Array of Integers,
		//instead of constantly querying the columns for their height
		$columns.each(function(index) {
			if (typeof(columnHeights[index]) == 'undefined') {columnHeights[index] = 0};
		});

		bindEvents();

		loadMore($(window).scrollTop() + window.innerHeight*scrollThreshold*2);
	};

	/*
	* Bind Events on:
	* - Body for resetting scrollState when animation stops
	* - .toggleScroll for invoking the autoscroll-feature
	* - window.scroll for loading more pictures
	* - window.resize for responsiveness
	*********/
	var bindEvents = function() {
		if (typeof autoScroll !== 'undefined') {
			$('body, html').on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
				scrollState = 0;
			});
			$(autoScroll).click(function() {
				toggleScroll();
				scrollHandler();
			});
		}
		$(window).scroll(function() {
			loadMore($(window).scrollTop() + window.innerHeight*6);
		});
		$(window).resize(function() {
			respond();
			rearrange(0);
		});
	}

	/*
	* Returns an Object of category names with chances
	* from a jQuery object of a parent with inputs as children
	* For structure, see randomCategory() function
	*********/
	var obtainCategoriesFromInputsIn = function(selector) {
		var _categories = {reference: 0, categories: {}},
			_offset = 0;
		$(selector).children('input').each(function() {
			_value = parseInt($(this).val());
			_categories["categories"][$(this).attr('name')] = parseInt(_value + _offset);
			_offset += _value;
		});
		_categories['reference'] = parseInt(_offset);
		return _categories;
	};



	/*
	* Returns a random category based on
	* an object of structure:
	*
	*	{reference: XXX,
	*	 categories: {
	*	 	category: chance,
	*	 	 ...
	*		}
	*	}
	*
	* reference is mostly the sum of all chances
	* e.g. if you provide percentage-chances, reference should be 100
	********/
	var randomCategory = function(categories) {
		var _die = Math.floor(Math.random()*categories['reference']+ 1);
		for (var key in categories['categories']) {
			if (_die <= categories['categories'][key]) {
				return key;
			}
		};
	};


	/*
	* Redistribute the Pictures among the columns
	* from tallest to shortest
	* taking @prevDifference as indicator, if we have to
	* rearrange further
	*********/
	var rearrange = function(_prevDifference) {
		$columns.each(function(index) {
			columnHeights[index] = $(this).height();
		});

		var _minValue = Math.min.apply(null, columnHeights),
			_maxValue = Math.max.apply(null, columnHeights),
			_min = columnHeights.indexOf(_minValue),
			_max = columnHeights.indexOf(_maxValue);

		_difference = _maxValue - _minValue;
		var _$imgToAppend = $('.column'+ _max).children().last();
		if (_difference < _prevDifference && columnHeights[_min]+_$imgToAppend.height() < columnHeights[_max]) {
			$('.column' + _min).append(_$imgToAppend);
			rearrange(_difference);
		}
	};

	/*
	* Invoke Shrink or Grow Actions
	* on Window resize Breakpoints
	*********/
	var respond = function() {
		var _w = window.innerWidth;
		breakpoints.forEach(function(i) {
			if (_w <= i && comparisonWidth > i) {
				shrink();
			} else if (_w > i && comparisonWidth <= i) {
				grow();
			}
		});
		comparisonWidth = _w;
	};


	/*
	* Remove the last column and distribute the
	* containing Pictures among the others
	*********/
	var shrink = function() {
		var _remainingColumns = $columns.length-2,
			_i = _remainingColumns,
			_lastCol = $columns.last(),
			_amount = _lastCol.children().length;

		for (j=0; j < _amount; j++) {
			var _$imgToMove = _lastCol.children().last();
			$('.column'+_i).append(_$imgToMove);
			columnHeights[_i] += _$imgToMove.height();
			if (_i > 0) {_i--} else {_i=_remainingColumns}
		}
		columnHeights.splice(-1,1);
		$columns.last().remove();
		$columns = $('.column');
	};


	/*
	* Add another Column and sequentially
	* redistribute pictures from the others to it
	*********/
	var grow = function() {
		var _numColumns = $columns.length,
			_picturesToMove = 0,
			_j = _numColumns;

		$columns.each(function() {
			_picturesToMove += $(this).children().length;
		});

		_picturesToMove = Math.floor(_picturesToMove/_numColumns+1);
		$('#wall').append('<div class="transparent column column'+_numColumns+'"></div>');

		for (i=0;i<_picturesToMove;i++) {
			$('.column'+_numColumns).append($('.column'+_j+' img:last-child'));
			if (_j > 0) {_j--} else {_j=_numColumns}
		}
		$('.column'+_numColumns).animate({opacity: 1}, 150).removeClass('transparent');
		$columns = $('.column');
	};


	/*
	* Toggles scrollState variable
	* and stops animation on turn-off
	*********/
	var toggleScroll = function() {
		if (scrollState == 0) {
			scrollState = 1;
		} else {
			scrollState = 0;
			$('body, html').stop(true);
		}
	};


	/*
	* Smooth Scroll Handler
	* Calculates the Distance to the end of document
	* then scrolls down that distance and
	* loadsMore if needed
	*********/
	var scrollHandler = function() {
		var _remainingSpace = $(document).height() - $(window).scrollTop() - window.innerHeight;
		if (scrollState == 1) {
			loadMore($(document).height()+window.innerHeight*scrollThreshold);
			rearrange(0);
			scrollDown(_remainingSpace);
		}
	};


	/*
	* Scroll down smoothly @distance pixels
	*********/
	var scrollDown = function(distance) {
		$('body,html').animate({scrollTop: '+='+distance}, {
			duration: distance*autoScrollSpeed,
			easing: 'linear',
			complete: scrollHandler
		});
	};

	/*
	* Get images from the API URL
	* and append them until the
	* document height has reached @goalSize
	*********/
	var loadMore = function(goalSize) {
		while ($(document).height() < goalSize) {
			var	_min = columnHeights.indexOf(Math.min.apply(null, columnHeights));
			var img = $('<img>',{src:buildImageURL()});
			$('.column'+_min).append(img);
			$(img).on('click', function() {
							scaleUp($(this));
			});
			columnHeights[_min] = $('.column'+_min).height();
		}
	};

	/*
	* Replace @category, @width and @height
	* in the imageURL and return it
	********/
	var buildImageURL = function() {
		return imageUrl
			.replace(/@category/, randomCategory(categories))
			.replace(/@width/, (Math.floor(Math.random()*600)+200))
			.replace(/@height/, (Math.floor(Math.random()*600)+200));
	};

	var scaleUp = function(image) {
		if (image.hasClass('focus')) {
			image.removeClass('focus');
			$backdrop.fadeOut('fast');
		} else {
			$('.focus').removeClass('focus');
			$backdrop.fadeIn('fast');
			image.addClass('focus');
		}
	};


	init();
});


$(window).load( function() {
	/*
	* Possible options:
	*
	* categoryChances: {reference: XXX, categories: {name: chance}}
	* breakpoints: [1280, 960, 720, 600]
	* imageUrl: 'http://lorempixel.com/@width/@height/@category'
	* scrollThreshold: 3
	* autoScroll: ''
	* autoScrollSpeed: 10
	*/

	gallery = new Gallery({
		imageUrl: 'http://placeimg.com/@width/@height/@category',
		autoScroll: '.toggleScroll'
	});
});
