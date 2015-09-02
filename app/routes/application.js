import Ember from 'ember';
import {AutosaveProxy} from 'ember-autosave';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    model = model.sortBy('updatedAt');
    controller.set('model',model);
    controller.set('activeProject',model.get('lastObject'));
    //force slices to load. this way, no matter what project the user wants to
    //work with, they've got the data.
    controller.set('slices',this.store.findAll('slice'));
  },

  model: function(params){
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
        title: videoId,
        videoId: videoId,
        videoUrl: videoUrl,
        updatedAt: new Date()
      });
    }
    return record;
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
      project.get('slices').pushObject(slice);
      slice.set('project',project);
      project.set('activeSlice',slice);
      project.set('updatedAt', new Date());
    }
  }
});
