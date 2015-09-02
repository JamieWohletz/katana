import Ember from 'ember';

export default Ember.Component.extend({
  showList: false,
  toggleShowList: function(){
    this.set('showList',!this.get('showList'));
  },
  actions: {
    toggleShow: function(){
      this.toggleShowList();
    },
    setProject: function(project){
      this.toggleShowList();
      this.sendAction('setProject',project);
    }
  }
});
