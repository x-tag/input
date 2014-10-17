(function(){

  var frag = xtag.createFragment(function(){/*
    <div class="x-input-text">
      <input />
      <div class="x-input-spinner">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
      </div>
    </div>
    <button class="x-input-clear"></button>
  */});
  
  xtag.register('x-input', {
    lifecycle: {
      created: function(){
        var content = frag.cloneNode(true);
        this.xtag.input = content.querySelector('.x-input-text input');
        this.appendChild(content);
      }
    },
    methods: {
      focus: function(){
        this.xtag.input.focus();
      },
      blur: function(){
        this.xtag.input.blur();
      },
      clear: function(focus){
        this.value = '';
        if (focus) this.xtag.input.focus();
        this.spinning = false;
        xtag.fireEvent(this, 'clear');
      }
    },
    events:{
      'focus:delegate(.x-input-text input)': function(e){
        e.currentTarget.setAttribute('focus', '');
      },
      'blur:delegate(.x-input-text input)': function(e){
        e.currentTarget.removeAttribute('focus');
      },
      'tap:delegate(.x-input-clear)': function(e){
        this.parentNode.clear(true);
      },
      'keyup:delegate(.x-input-clear)': function(e){
        if (e.keyCode == 32) this.parentNode.clear();
      },
      'input:delegate(.x-input-text input)': function(e){
        e.currentTarget.value = e.target.value;
      },
      'keydown:delegate(.x-input-text input)': function(e){
        var node = e.currentTarget;
        switch (e.keyCode) {
          case 8:
            node.spinning = false;
            break;
          case 13:
            if (node.autospin && node.value.length >= node.minlength) {
              node.spinning = true;
              xtag.fireEvent(node, 'submitready');
            }
            break;
          case 27:
            node.clear(true);
            break;
        }
      },
      'transitionend:delegate(.x-input-spinner img)': function(e){
        var node = e.currentTarget;
        if (e.propertyName == 'opacity' && !node.hasAttribute('spinning')) {
          node.removeAttribute('x-input-spinning');
        }
      }
    },
    accessors: {
      autospin: {
        attribute: { boolean: true }
      },
      spinning: {
        attribute: { boolean: true },
        set: function(value){
          if (value) this.setAttribute('x-input-spinning', '');
        }
      },
      name: {
        attribute: { property: 'input' }
      },
      maxlength: {
        attribute: { property: 'input' }
      },
      placeholder: {
        attribute: { property: 'input' }
      },
      autofocus: {
        attribute: {
          boolean: true,
          property: 'input'
        },
        set: function(){
          this.xtag.input.focus();
        }
      },
      autocomplete: {
        attribute: {
          boolean: true,
          property: 'input'
        }
      },
      minlength: {
        attribute: {},
        get: function(value){
          return Number(this.getAttribute('minlength'));
        }
      },
      value: {
        attribute: {},
        get: function(){
          return this.xtag.input.value || '';
        },
        set: function(value){
          this.xtag.input.value = value;
        }
      }
    }
  });

})();