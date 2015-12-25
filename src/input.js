(function(){

  xtag.register('x-input', {
    mixins: ['input'],
    content: function(){/*
      <div class="x-input-text">
        <input />
        <x-spinner fade></x-spinner>
      </div>
      <button class="x-input-clear" tabindex="-1"></button>
    */},
    lifecycle: {
      created: function(){
        this.xtag.spinner = this.querySelector('x-spinner');
      }
    },
    methods: {
      focus: function(){
        this.xtag.input.focus();
      },
      blur: function(){
        this.xtag.input.blur();
      },
      submit: function(){
        if (this.isValid()){
          if (this.autospin) this.spinning = true;
          xtag.fireEvent(this, 'submitready');
        }
        else xtag.fireEvent(this, 'invalid');
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
          case 8: node.spinning = false;
            break;
          case 13: node.submit();
            break;
          case 27: node.clear(true);
            break;
        }
      }
    },
    accessors: {
      autospin: {
        attribute: { boolean: true }
      },
      spinning: {
        attribute: { boolean: true, property: 'spinner' }
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
      }
    }
  });

})();
