(function(){
  var matchNum = /[1-9]/,
      replaceSpaces = / /g,
      captureTimes = /(\d|\d+?[.]?\d+?)(s|ms)(?!\w)/gi,
      transPre = 'transition' in getComputedStyle(document.documentElement) ? 't' : xtag.prefix.js + 'T',
      transDur = transPre + 'ransitionDuration',
      transProp = transPre + 'ransitionProperty',
      ready = document.readyState == 'complete' ?
        xtag.skipFrame(function(){ ready = false }) :
        xtag.addEvent(document, 'readystatechange', function(){
          if (document.readyState == 'complete') {
            xtag.skipFrame(function(){ ready = false });
            xtag.removeEvent(document, 'readystatechange', ready);
          }
        });

  function getTransitions(node){
    return node.__transitions__ = node.__transitions__ || {};
  }

  function startTransition(node, name, transitions){
    var current = node.getAttribute('transition');
    if (transitions[current]) clearTimeout(transitions[current].timer);

    node.setAttribute('transition', name);

    var max = 0,
        style = getComputedStyle(node),
        transition = transitions[name],
        after = transition.after,
        transProps = style[transProp].replace(replaceSpaces, '').split(',');

    style[transDur].replace(captureTimes, function(match, time, unit){
      time = parseFloat(time) * (unit === 's' ? 1000 : 1);
      if (time >= max) max = time;
    });

    transition.timer = setTimeout(function(){
      node.removeAttribute('transitioning');
      if (transition.after) transition.after.call(node);
    }, max);

    if (after && !style[transDur].match(matchNum)) after.call(node);
  }

  xtag.transition = function(node, name, obj){
    if (node.getAttribute('transition') != name){

      var transitions = getTransitions(node),
          options = transitions[name] = obj || {};

      node.setAttribute('transitioning', name);

      if (options.immediate) options.immediate.call(node);

      if (options.before) {
        options.before.call(node);
        if (ready) xtag.skipTransition(node, function(){
          startTransition(node, name, transitions);
        });
        else xtag.skipFrame(function(){
          startTransition(node, name, transitions);
        });
      }
      else xtag.skipFrame(function(){
        startTransition(node, name, transitions);
      });
    }
  };

  xtag.pseudos.transition = {
    onCompiled: function(fn, pseudo){
      var when = pseudo.arguments[0] || 'immediate',
          name = pseudo.arguments[1] || pseudo.key.split(':')[0];
      return function(){
        var options = {},
            args = arguments;
        options[when] = function(){
          return fn.apply(this, args);
        }
        xtag.transition(this, name, options);
      }
    }
  }
})();
