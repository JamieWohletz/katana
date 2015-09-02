import Ember from 'ember';

export default Ember.Component.extend({
  videoPlayerCurrentTime: null,
  projects: null,
  activeProject: null,

  actions: {
    updateProjectInformation: function(informationHash) {
      this.sendAction('updateProjectInformation', informationHash);
    },
    createAndActivateSlice: function(startTime){
      this.sendAction('createAndActivateSlice',startTime,startTime,this.get('activeProject'));
    },
    setActiveProject: function(project) {
      this.set('activeProject',project);
    }
  }
});
