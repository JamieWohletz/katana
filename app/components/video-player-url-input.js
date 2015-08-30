import Ember from 'ember';

export default Ember.Component.extend({
  storage: Ember.inject.service(),
  project: null,

  videoId: Ember.computed('videoUrl', {
    get(key) {
      return this.extractVideoIdFromUrl(this.get('videoUrl') || '');
    },
    set(key, value) {
      return value;
    }
  }),

  _autoSetupProject: Ember.observer('videoId', function(){
    var videoId = this.get('videoId');
    var storage = this.get('storage');
    var self = this;
    
    if(!videoId) {
      self.set('project',null);
      return;
    }

    storage.loadAll(function(){
      var record = storage.findProjectBy('videoId',videoId);
      if(!record) {
        record = storage.createProject({
          videoId:videoId,
          slices:[],
          videoLength:0
        });
      }
      self.set('project',record);
    });
  }),

  extractVideoIdFromUrl: function(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return null;
  },
});
