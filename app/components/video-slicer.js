import Ember from 'ember';

export default Ember.Component.extend({
  videoPlayerCurrentTime: null,
  projects: null,
  allSlices: null,
  activeProject: null,

  actions: {
    updateVideoInformation: function(informationHash) {
      this.sendAction('updateVideoInformation', informationHash);
    },
    createAndActivateSlice: function(startTime){
      this.sendAction('createAndActivateSlice',startTime,startTime,this.get('activeProject'));
    }
  }
});
