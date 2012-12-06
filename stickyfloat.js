/******************************************
 * stickyfloat - jQuery plugin for verticaly floating anything in a constrained area
 *
 * @author          Yair Even-Or (vsync)
 * @copyright       Copyright (c) 2012
 * @license         MIT and GPL licenses.
 * @link            http://dropthebit.com
 * @version         Version 6
 * @parameters		duration 		(number, 200)    - the duration of the animation
					startOffset 	(number)         - the amount of scroll offset after the animations kicks in
					offsetY			(number)         - the offset from the top when the object is animated
					lockBottom		(boolean, true)  - set to false if you don't want your floating box to stop at parent's bottom
					delay			(number, 0)      - delay in milliseconds  until the animnations starts
					easing			(string, linear) - easing function (jQuery has by default only 'swing' & 'linear')
					stickToBottom 	(boolean, false) - to make the element stick to the bottom instead to the top
   @example			Example: jQuery('#menu').stickyfloat({duration: 400});
 *
 ******************************************/
 
(function($){
	var doc	= $(document),
		bottomPos, minTopPos, pastStartOffset, objFartherThanTopPos, objBiggerThanWindow, newpos, checkTimer
		
		defaults = {
			duration		: 200, 
			lockBottom 		: true, 
			delay 			: 0, 
			easing 			: 'linear', 
			stickToBottom 	: false,
			cssTransition	: false
		},
		// detect CSS transitions support
		supportsTransitions = (function() {
			var s = document.body.style,
				v = ['ms','Khtml','O','Moz','Webkit',''];
			while( v.length )
			  if( s[v.pop() + 'Transition'] == '' ) return true;
			return false;
		})(),
		
		Sticky = function(settings, obj){
			this.settings = settings;
			this.obj = $(obj);
		};
		
		Sticky.prototype = {
			init : function(){
				var that = this;
				this.onScroll = function(){ that.rePosition() };
				
				$(window).ready(function(){
					that.rePosition(true);  // do a quick repositioning without any duration or delay
					$(window).on('scroll.sticky', that.onScroll);
				});
				// create a variable that could later be un-binded (per instance) in the 'destroy' method
				// bind the events
				// for every element, attach it's instanced 'sticky'
				this.obj.data('_stickyfloat', that);
			},
			/**
			* @quick - do a quick repositioning without any duration
			* @force - force a repositioning
			**/
			rePosition : function(quick, force){
				var $obj 	 = this.obj,
					settings = this.settings,
					duration = settings.duration;
				
				if( quick )
					duration = 0;

				$obj.stop(); // stop all calculations on scroll event
				
				bottomPos = $obj.parent().height() - $obj.outerHeight() + settings.offsetY; // get the maximum bottom position
				if( bottomPos < 0 )
					bottomPos = 0;
				
				// define the basics of when should the object be moved
				pastStartOffset			= doc.scrollTop() > settings.startOffset;	// check if the window was scrolled down more than the start offset declared.
				objFartherThanTopPos	= $obj.offset().top > settings.startOffset;	// check if the object is at it's top position (starting point)
				objBiggerThanWindow 	= $obj.outerHeight() < $(window).height();	// if the window size is smaller than the Obj size, do not animate.
				
				// if window scrolled down more than startOffset OR obj position is greater than
				// the top position possible (+ offsetY) AND window size must be bigger than Obj size
				if( (pastStartOffset || objFartherThanTopPos && objBiggerThanWindow) || force ){ 
					newpos = settings.stickToBottom ? 
								doc.scrollTop() + $(window.top).height() - $obj.outerHeight() - settings.startOffset - settings.offsetY : 
								doc.scrollTop() - settings.startOffset + settings.offsetY;
					// made sure the floated element won't go beyond a certain maximum bottom position
					if( newpos > bottomPos && settings.lockBottom )
						newpos = bottomPos;
					// make sure the new position is never less than the offsetY so the element won't go too high (when stuck to bottom and scrolled all the way up)
					if( newpos < settings.offsetY )
						newpos = settings.offsetY;
					// if window scrolled < starting offset, then reset Obj position (settings.offsetY);
					else if( doc.scrollTop() < settings.startOffset && !settings.stickToBottom ) 
						newpos = settings.offsetY;
					
					// if duration is set too low OR user wants to use css transitions, then do not use jQuery animate
					if( duration < 5 || (settings.cssTransition && supportsTransitions) )
						$obj.css('top', newpos);
					else
						$obj.stop().delay(settings.delay).animate({ top: newpos }, duration , settings.easing );
				}
			},
			// update the settings for the instance and re-position the floating element 
			update : function(opts){
				if( typeof opts === 'object' ){
					if( !opts.offsetY || opts.offsetY == 'auto' )
						opts.offsetY = getComputed(this.obj).offsetY;
					if( !opts.startOffset || opts.startOffset == 'auto' )
						opts.startOffset = getComputed(this.obj).startOffset;

					this.settings = $.extend( {}, this.settings, opts);
					this.rePosition(false, true);
				}
				return this.obj;
			},
			destroy : function(){
				$(window).off('scroll.sticky', this.onScroll);
				this.obj.removeData();
				return this.obj;
			}
		};
		// find the computed startOffset & offsetY of a floating element
		function getComputed($obj){
			return { 
				startOffset : $obj.parent().offset().top, 
				offsetY		: parseInt($obj.parent().css('padding-top'))
			};
		}

	$.fn.stickyfloat = function(option, settings){
		if(typeof option === 'object')
			settings = option;
		else if(typeof option === 'string'){
			if( this.data('_stickyfloat') && typeof this.data('_stickyfloat')[option] == 'function' ){
				var sticky = this.data('_stickyfloat');
				return sticky[option](settings);
			}
			else
				return this;
		} 
		// instatiate a new 'Sticky' object per item that needs to be floated
		return this.each(function(){
			var $obj = $(this),
				$settings = $.extend( {}, defaults, getComputed($obj), settings || {} );
				
			var sticky = new Sticky($settings, $obj);
			sticky.init();
		});
	};
})(jQuery);