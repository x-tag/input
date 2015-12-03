xtag.mixins.value = {
  lifecycle: {
    created: function(){
      if (!this.xtag.input) this.xtag.input = this.querySelector('input');
    }
  },
  methods: {
    isValid: function(){
      return this.xtag.validationRegex ? this.xtag.validationRegex.test(this.value) : true;
    }
  },    
  accessors: {
    value: {
      attribute: {},
      get: function(){
        return this.xtag.input.value || '';
      },
      set: function(value){
        this.xtag.input.value = value;
      }
    },
    validate: {
      attribute: {},
      set: function(value){
        this.xtag.validationRegex = new RegExp(value);
      }
    }
  }
};
