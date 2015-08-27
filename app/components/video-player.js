import Ember from 'ember';

export default Ember.Component.extend({
  //We need the store so we can doooo things.
  store: Ember.inject.service(),
  // Player width in pixels
  // Sadly, right now, everything in the CSS is based off a hardcoded 640 so
  // if you change this, very strange things will happen.
  playerWidth: 640,
  // Array containing all known slices. This will typically get overwritten
  // from the outside
  slices: [],
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
    autoplay: 0,
    controls: 1,
    enablejsapi: 1,
    rel: 0, // disable related videos
    showinfo: 0,
    autohide: 1,
    fs: 1, // disable fullscreen button
    playsinline: 1,
    // disablekb: 1,
    // iv_load_policy: 3,
    modestbranding: 0
  },

  //Computed Properties
  videoLength: Ember.computed('youtubePlayer.duration',function(){
    return this.get('youtubePlayer.duration');
  }),

  //Observers

  /**
  * Updates the current slice so it displays in accordance with the playback
  * of the video.
  */
  _updateSlicingVisual: Ember.observer('youtubePlayer.currentTime', function(){
    if(this.mode !== this.SLICING) {
      return;
    }

    var newEndTime = this.get('youtubePlayer.currentTime');
    var startTime = this.get('currentSlice').get('startTime');
    if(!this._isValidDuration(startTime,newEndTime)) {
      return;
    }

    this.get('currentSlice').set('endTime',this.get('youtubePlayer.currentTime'));
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
    var startTime = +currentSlice.get('startTime');
    var time = +this.get('youtubePlayer.currentTime') - startTime;
    var duration = +currentSlice.get('duration');
    currentSlice.set('indicatorPositionPercentage', (time/duration)*100);
  }),
  /**
  * Makes sure that, while a slice is playing, it keeps looping.
  */
  _loopSlice: Ember.observer('youtubePlayer.currentTime', function(){
    if(this.mode !== this.REPEATING) {
      return;
    }

    var endTime = this.get('currentSlice').get('endTime');
    var startTime = this.get('currentSlice').get('startTime');

    if(this.get('youtubePlayer.currentTime') >= endTime) {
      this._seekTo(startTime);
    }
  }),

  //Computed properties

  //Functions

  startSlice: function(startTime){
    this.setMode(this.SLICING);

    var newSlice = this.get('store').createRecord('slice',{
      startTime: startTime,
      endTime: startTime
    });
    this.set('currentSlice',newSlice);
  },
  finishSlice: function(slice, endTime) {
    //make sure that the end time is before the start time
    //if it isn't then we just leave the end time at whatever it is
    if(this._isValidDuration(slice.get('startTime'),endTime)) {
      this.get('currentSlice').set('endTime',endTime);
      this.get('currentSlice').save();
    }
    this.setMode(this.NORMAL);
  },
  playSlice: function(slice) {
    this._seekTo(slice.get('startTime'));
    this.set('currentSlice',slice);
    this.setMode(this.REPEATING);
  },
  deleteSlice: function(slice) {
    this.get('store').deleteRecord(slice);
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
    return +endTime > +startTime;
  },
  _seekTo: function(time) {
    var player = this.get('youtubePlayer');
    var ytp = player.get('player');
    ytp.seekTo(time);
  },

  //Actions
  actions: {
    toggleSliceAction: function(time){
      if(!time) {
        return;
      }

      var slice = this.get('currentSlice');
      if(this.mode === this.SLICING) {
        this.finishSlice(slice, time);
        this.playSlice(slice);
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
    }
  }
});
