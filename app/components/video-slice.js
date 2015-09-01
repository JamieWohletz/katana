import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'div',
  classNames: ['video-player-slice-parent'],
  videoLength: 0,
  activeSlice: null,
  slice: null,
  currentTime: null,
  //we need to track this for slice size adjustment
  mouseAbsoluteX: null,

  //this ensures that the user can't adjust a slice to be 0 or negative seconds long
  //eventually we'll want to calculate this so it's a percentage of the video length
  //(because if a video is 10 seconds long, 2 seconds is a long time, relatively speaking)
  MINIMUM_SLICE_DURATION: 2,

  mouseMove: function(e) {
    var self = this;
    Ember.run.scheduleOnce('afterRender',this,function(){
      self.set('mouseAbsoluteX',e.pageX);
    });
  },

  percentageWidth: Ember.computed('slice.duration','videoLength', function(){
    var d = +this.get('slice.duration');
    var l = +this.get('videoLength');
    return (d/l * 100).toFixed(2);
  }),

  percentageLeft: Ember.computed('slice.startTime','videoLength', function(){
    var s = +this.get('slice.startTime');
    var l = +this.get('videoLength');
    return (s/l * 100).toFixed(2);
  }),

  active: Ember.computed('activeSlice', function(){
    return this.get('activeSlice') === this.get('slice');
  }),

  indicatorPositionPercentage: Ember.computed('currentTime','slice.startTime','slice.duration', function(){
    var left = ((this.get('currentTime') - this.get('slice.startTime')) / this.get('slice.duration'))*100;
    return new Ember.Handlebars.SafeString('left:'+left+'%;'
    );
  }),

  style: Ember.computed('percentageWidth','percentageLeft', function(){
    var self = this;
    return new Ember.Handlebars.SafeString(
      'left:'+self.get('percentageLeft')+'%;'+
      'width:'+self.get('percentageWidth')+'%;'
    );
  }),

  _updateActiveSliceEndTime: Ember.observer('currentTime', function(){
    var active = this.get('activeSlice');
    var time = this.get('currentTime');
    if(!active || active !== this.get('slice') || active.get('shouldRepeat')) {
      return;
    }
    if(time > active.get('startTime')) {
      active.set('endTime',this.get('currentTime'));
    }
  }),

  _updateSize: function(handleOffsetX, relativeToLeft) {
    var percentageChange = (handleOffsetX/this.$().width())*100;
    var newSeconds = this._convertPercentWidthToDuration(percentageChange);
    var st = this.get('slice.startTime');
    var et = this.get('slice.endTime');
    var stoppingPoint;

    if(relativeToLeft) {
      stoppingPoint = et - this.MINIMUM_SLICE_DURATION;
      this.set('slice.startTime',Math.min(stoppingPoint, st + newSeconds));
    }
    else {
      stoppingPoint = st + this.MINIMUM_SLICE_DURATION;
      this.set('slice.endTime',Math.max(stoppingPoint, et + newSeconds));
    }
  },

  _convertPercentWidthToDuration: function(percentWidth) {
    var l = this.get('videoLength');
    return percentWidth/100 * l;
  },

  actions: {
    adjustSize: function(handleOffsetX, relativeToLeft) {
      var self = this;
      self._updateSize(handleOffsetX, relativeToLeft);
    },
    toggleActive: function(slice) {
      this.sendAction('toggleActive',slice,!this.get('active'));
    },
    save: function(){
      var slice = this.get('slice.project').set('updatedAt',new Date());
    },
    delete: function(slice) {
      slice.destroyRecord();
      this.set('activeSlice',null);
    }
  }
});
