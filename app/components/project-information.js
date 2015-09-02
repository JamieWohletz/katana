import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteProject: function(project){
      this.sendAction('deleteProject',project);
    }
  }
});
