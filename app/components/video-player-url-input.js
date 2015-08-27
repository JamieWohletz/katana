import Ember from 'ember';

export default Ember.Component.extend({
  storage: Ember.inject.service(),
  videoId: '',
  project: null,

  _autoSetVideoId: Ember.observer('videoUrl', function(){
    this.setVideoIdFromUrl(this.get('videoUrl') || '');
  }),
  _autoMakeProject: Ember.observer('videoId', function(){
    var videoId = this.get('videoId');
    if(!videoId) {
      return;
    }

    var storage = this.get('storage');
    var self = this;
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

  setVideoIdFromUrl: function(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      this.set('videoId',match[2]);
    }
  },
});
