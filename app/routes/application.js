import Ember from 'ember';
import { AutosaveProxy } from 'ember-autosave';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller,model);
    controller.set('activeProject',null);
  },

  model: function(){
    return this.store.findAll('project');
  },

  findOrCreateProject: function(videoId, videoUrl) {
    var record;
    if(!videoId) {
      return null;
    }
    record = this.get('controller.model').findBy('videoId',videoId);
    if(!record) {
      record = this.store.createRecord('project',{
        videoId: videoId,
        videoUrl: videoUrl,
        createdAt: new Date(),
      });
    }
    return AutosaveProxy.create({content:record});
  },

  actions: {
    setActiveProject: function(videoHash){
      this.set('controller.activeProject',
        this.findOrCreateProject(videoHash.videoId,videoHash.videoUrl)
      );
    },
    createSlice: function(startTime,endTime,project) {
      if(endTime < startTime || !project) {
        return;
      }
      var slice = this.store.createRecord('slice',{
        startTime:startTime,
        endTime:endTime
      });
      project.get('slices').pushObject(AutosaveProxy.create({content:slice}));
      project.set('activeSlice',slice);
    }
  }
});
