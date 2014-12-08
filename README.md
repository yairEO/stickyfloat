stickyfloat
===========

This plugin makes it possible to have a fixed position element that is relative to it’s parent. A normal fixed positioned element would be “out of context” and is very difficult to use in the most common situations with fluid designs. This plugin solves that problem with as little code as I could possible get it so it will run in the most optimized way, while also allow you to customize it in many important ways which might suit you best.

**1.2KB** - minified + gziped

**9KB** - uncompressed

# [Demo page](http://dropthebit.com/demos/stickyfloat/stickyfloat.html)

###Benefits

* Can handle many floated elements, each with it’s own settings
* Floated elements’ movement can be bound inside their parents’ area
* Uses Native javascript easing, but using CSS3 transitions would be the optimum (not for IE)
* Has many settings, such as stick to the bottom or animation style
* Code is very maintainable and higly efficient
* Uses `requestAnimationFrame` with a throttled fall-back

####Example – initialize
    jQuery('.menu').stickyfloat( {duration: 400} );
    
####Example – update (change settings for a specific element)
    jQuery('.menu').stickyfloat('update',{duration : 0, stickToBottom:true });

####Example – destroy (no more floating)
    jQuery('.menu').stickyfloat('destroy');


#### Old Browsers (no ES5 support)
Please add this shim before any other script:
    
	<script src='http://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-shim.js'></script>

##Parameters

| Setting       | Default / type       | what it's for                                                                                          |
|---------------|----------------------|--------------------------------------------------------------------------------------------------------|
| scrollArea    | window / DOM element | The element which stickyfloat should track it's scroll position (for situations with inner scroll)     |
| duration      | 200 / Number in ms   | The duration of the animation in ms                                                                    |
| startOffset   | 0 / Number           | The amount of scroll offset in px after the animations kicks in                                        |
| offsetY       | 0 / Number           | The offset from the top in px when the object is animated                                              |
| lockBottom    | true / Boolean       | Set to false if you don’t want your floating box to stop at parent's bottom                            |
| stickToBottom | false / Boolean      | Make whatever that is “floating” stick to the bottom instead to the top                                |
| delay         | 0 / Number           | Delay in milliseconds until the animation starts                                                       |
| easing        | linear / String      | Easing function (jQuery has only two by default: ‘swing’ & ‘linear’)                                   |
| cssTransition | false / Boolean      | If you wish to manually set your own CSS3 transition styles on the floated element, set this to 'true' |
| onReposition  | undefined / function | A callback to be invoked when the floated element is repositioned. Takes one argument: the element. |
