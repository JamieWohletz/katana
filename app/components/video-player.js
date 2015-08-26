import Ember from 'ember';

export default Ember.Component.extend({
  // Player width in pixels
  // Sadly, right now, everything in the CSS is based off a hardcoded 640 so
  // if you change this, very strange things will happen.
  playerWidth: 640,
  // Array containing all known slices
  slices: [],
  // Are we currently creating a new slice?
  slicing: false,
  // If we're slicing, this becomes the slice we're working with
  currentSlice: null,
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
  // Current video ID
  videoId: '',

  //Observers

  /**
  * Updates the current slice so it displays in accordance with the playback
  * of the video.
  */
  _updateSliceVisual: Ember.observer('youtubePlayer.currentTime', function(){
    if(!this.get('slicing')) {
      return;
    }

    var newEndTime = this.get('youtubePlayer.currentTime');
    var startTime = this.get('currentSlice').get('startTime');
    if(!this.isValidDuration(startTime,newEndTime)) {
      return;
    }

    this.get('currentSlice').set('endTime',this.get('youtubePlayer.currentTime'));
  }),
  //Computed properties

  //Functions
  makeSliceObject: function(startTime,endTime){
    var Slice = Ember.Object.extend({
      startTime: null,
      endTime: null,
      videoLength: null,
      duration: Ember.computed('startTime','endTime', function(){
        return +this.get('endTime') - (+this.get('startTime'));
      }),
      style: Ember.computed('duration', function(){
        var d = +this.get('duration');
        var l = +this.get('videoLength');
        var s = +this.get('startTime');
        var scale = d/l;
        var origin = s/l * 100;
        return 'transform:scaleX('+scale+');transform-origin:'+origin+'% 0;';
      })
    });
    return Slice.create({
      startTime: startTime,
      endTime: endTime || startTime,
      videoLength: this.get('youtubePlayer.duration')
    });
  },
  slice: function(time){
    if(!this.get('slicing')) {
      this.set('currentSlice',this.makeSliceObject(time));
      this.get('slices').pushObject(this.get('currentSlice'));
    }
    else {
      if(this.isValidDuration(
        this.get('currentSlice').get('startTime'),
        time
      )) {
        this.get('currentSlice').set('endTime',time);
      }
      this.set('currentSlice',null);
    }
    this.set('slicing',!this.get('slicing'));
  },
  /**
  * Verifies that a given end time is before a start time.
  * This is necessary because the user could seek to a different part
  * of the video during slicing and just screw everything up.
  */
  isValidDuration: function(startTime,endTime) {
    return +endTime > +startTime;
  },

  //Actions
  actions: {
    sliceAction: function(startTime){
      this.slice(startTime, startTime + this.get('defaultSliceLength'));
    }
  }
});
