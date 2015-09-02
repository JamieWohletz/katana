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
      project.set('updatedAt', new Date());
      this.set('activeProject',project);
    },
    deleteProject: function(project) {
      if(!confirm("Are you sure you'd like to delete this project? You will lose all your clips!")) {
        return;
      }
      var self = this;
      project.destroyRecord().then(function(){
        if(self.get('projects.length') > 0) {
          self.set('activeProject',self.get('projects').get('lastObject'));
        }
        else {
          self.set('activeProject',null);
        }
      });
    }
  }
});
