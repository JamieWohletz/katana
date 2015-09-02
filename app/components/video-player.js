import Ember from 'ember';

export default Ember.Component.extend({

  //Normal properties
  project: null,

  // Variables for the youtube player component
  playerVars: {
    controls: 1,
    enablejsapi: 1,
    rel: 0, // disable related videos
    showinfo: 1,
    fs: 1,
    autohide:0,
    playsinline: 1,
    modestbranding: 0,
    iv_load_policy: 3
  },

  //Computed Properties
  currentTime: Ember.computed('youtubePlayer.currentTime', {
    get() {
      return this.get('youtubePlayer.currentTime');
    },
    set(key,value) {
      return value;
    }
  }),

  //Observers
  _updateVideoLength: Ember.observer('project','youtubePlayer.durationValue', function(){
    var project = this.get('project');
    var duration = this.get('youtubePlayer.durationValue');
    if(project && duration > 0) {
      project.set('videoLength',this.get('youtubePlayer.durationValue'));
    }
  }),
  _repeat: Ember.observer(
      'project.activeSlice',
      'project.activeSlice.shouldRepeat',
      'project.activeSlice.startTime',
      'project.activeSlice.endTime',
      'currentTime',
      function(){
    var as = this.get('project.activeSlice');
    if(!as){
      return;
    }
    var
      shouldRepeat = as.get('shouldRepeat'),
      s = as.get('startTime'),
      e = as.get('endTime'),
      c = this.get('currentTime');
    if(!shouldRepeat || isNaN(s) || isNaN(e)) {
      return;
    }
    if(c < s || c > e) {
      this.seekTo(s);
    }
  }),
  _clearVideoIfNecessary: Ember.observer('project', function(){
    var player;
    if(this.get('project')) {
      return;
    }

    player = this.get('youtubePlayer.player');
    player.stopVideo();
    //we have to do this because for some reason, player.clearVideo() doesn't work.
    //thanks, YouTube.
    player.loadVideoById('',0);
  }),

  //Methods
  seekTo: function(time) {
    if(time < 0 || time > this.get('videoLength')) {
      return;
    }
    var player = this.get('youtubePlayer');
    var ytp = player.get('player');
    ytp.seekTo(time);
  },

  //Private Methods
  _isValidDuration: function(startTime,endTime) {
    return endTime > startTime;
  }

});
