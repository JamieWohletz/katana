import Ember from 'ember';

export default Ember.Component.extend({
  //The good ol' trusty storage instance
  storage: Ember.inject.service(),
  //The current project; this stores all video slices
  project: null,
  // Player width in pixels
  // Sadly, right now, everything in the CSS is based off a hardcoded 640 so
  // if you change this, very strange things will happen.
  playerWidth: 640,
  // There are three modes we care about
  // Creating a new video slice
  SLICING: 0,
  // Playing and looping over an existing video slice
  REPEATING: 1,
  // Playing the YouTube video like normal
  NORMAL: 2,
  //By default, we're just playing the video
  mode: 2,
  // If we're slicing, this becomes the slice we're working with
  // It's also used to track the currently-playing slice
  currentSlice: null,
  // Current video ID
  videoId: '',
  // Variables for the youtube player component
  playerVars: {
    controls: 1,
    enablejsapi: 1,
    rel: 0, // disable related videos
    showinfo: 0,
    autohide: 1,
    fs: 1,
    playsinline: 1,
    modestbranding: 0
  },

  //Computed Properties

  //Observers

  _saveVideoLength: Ember.observer('youtubePlayer.durationValue','project',function(){
    var project = this.get('project');
    var vidLength = Ember.get(project, 'videoLength') || this.get('youtubePlayer.durationValue');
    if(!project) {
      return;
    }
    Ember.set(project,'videoLength',vidLength);
  }),

  /**
  * Updates the current slice so it displays in accordance with the playback
  * of the video.
  */
  _updateSlicingVisual: Ember.observer('youtubePlayer.currentTime', function(){
    if(this.mode !== this.SLICING) {
      return;
    }

    var newEndTime = this.get('youtubePlayer.currentTime');
    var startTime = this.get('currentSlice.startTime');
    if(!this._isValidDuration(startTime,newEndTime)) {
      return;
    }

    Ember.set(this.get('currentSlice'),'endTime',this.get('youtubePlayer.currentTime'));
  }),
  /**
  * Updates the little vertical line indicator that shows progress through
  * a slice when it's being played.
  */
  _updateSliceProgressIndicator: Ember.observer('youtubePlayer.currentTime', function(){
    if(this.mode !== this.REPEATING) {
      return;
    }

    var currentSlice = this.get('currentSlice');
    var startTime = Ember.get(currentSlice,'startTime');
    var time = +this.get('youtubePlayer.currentTime') - startTime;
    var duration = Ember.get(currentSlice,'duration');
    Ember.set(currentSlice,'indicatorPositionPercentage', (time/duration)*100);
  }),
  /**
  * Makes sure that, while a slice is playing, it keeps looping.
  */
  _loopSlice: Ember.observer('youtubePlayer.currentTime', function(){
    if(this.mode !== this.REPEATING) {
      return;
    }

    var slice = this.get('currentSlice');
    var endTime = Ember.get(slice,'endTime');
    var startTime = Ember.get(slice,'startTime');

    if(this.get('youtubePlayer.currentTime') >= endTime) {
      this._seekTo(startTime);
    }
  }),

  //Computed properties

  //Functions

  startSlice: function(startTime){
    this.setMode(this.SLICING);

    var newSlice = this.get('storage').createSliceAndAddToProject({
      startTime: startTime,
      endTime: startTime
    }, this.get('project'));
    this.set('currentSlice',newSlice);
  },
  finishSlice: function(slice, endTime) {
    //make sure that the end time is before the start time
    //if it isn't then we just leave the end time at whatever it is
    if(this._isValidDuration(Ember.get(slice,'startTime'),endTime)) {
      Ember.set(this.get('currentSlice'),'endTime',endTime);
    }
    this.setMode(this.NORMAL);
  },
  playSlice: function(slice) {
    this._seekTo(Ember.get(slice,'startTime'));
    this.set('currentSlice',slice);
    this.setMode(this.REPEATING);
  },
  deleteSlice: function(slice) {
    this.get('project.slices').removeObject(slice);
  },
  setMode: function(mode) {
    if(mode === this.NORMAL) {
      this.set('currentSlice',null);
    }
    this.set('mode',mode);
  },
  /**
  * Verifies that a given end time is before a start time.
  * This is necessary because the user could seek to a different part
  * of the video during slicing and just screw everything up.
  */
  _isValidDuration: function(startTime,endTime) {
    return endTime > startTime;
  },
  _seekTo: function(time) {
    var player = this.get('youtubePlayer');
    var ytp = player.get('player');
    ytp.seekTo(time);
  },

  //Actions

  //NOTE: All data saving takes place in these actions and nowhere else.
  //All the data gets saved every time a slice is finished, and again any
  //time a slice is delete. That's it. 
  actions: {
    toggleSliceAction: function(time){
      if(!time) {
        return;
      }

      var slice = this.get('currentSlice');
      if(this.mode === this.SLICING) {
        this.finishSlice(slice, time);
        this.playSlice(slice);
        this.get('storage').saveAll();
      } else {
        this.setMode(this.SLICING);
        this.startSlice(time);
      }
    },
    togglePlaySliceAction: function(slice) {
      if(this.mode === this.REPEATING && this.get('currentSlice') === slice) {
        this.setMode(this.NORMAL);
        return;
      }
      this.playSlice(slice);
    },
    deleteSliceAction: function(slice) {
      if(this.get('currentSlice') === slice) {
        this.setMode(this.NORMAL);
      }
      this.deleteSlice(slice);
      this.get('storage').saveAll();
    }
  }
});
