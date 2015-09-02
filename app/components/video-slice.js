import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'div',
  videoLength: 0,
  activeSlice: null,
  slice: null,
  slicing: false,
  currentTime: null,
  //we need to track this for slice size adjustment
  mouseAbsoluteX: null,

  //this ensures that the user can't adjust a slice to be 0 or negative seconds long
  //eventually we'll want to calculate this so it's a percentage of the video length
  //(because if a video is 10 seconds long, 2 seconds is a long time, relatively speaking)
  MINIMUM_SLICE_DURATION: 2,

  mouseMove: function(e) {
    e.preventDefault();
    var self = this;
    Ember.run.scheduleOnce('afterRender',this,function(){
      self.set('mouseAbsoluteX',e.pageX);
    });
  },

  percentageWidth: Ember.computed('slice.duration','videoLength', function(){
    var d = +this.get('slice.duration');
    var l = +this.get('videoLength');
    var width = (d/l * 100).toFixed(2);
    if(isNaN(width)) {
      width = 0;
    }
    return width;
  }),

  percentageLeft: Ember.computed('slice.startTime','videoLength', function(){
    var s = +this.get('slice.startTime');
    var l = +this.get('videoLength');
    var left = (s/l * 100).toFixed(2);
    if(isNaN(left)) {
      left = 0;
    }
    return left;
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

  _updateActiveSliceEndTime: Ember.observer('activeSlice', 'currentTime', 'slicing', function(){
    var active = this.get('activeSlice');
    var time = this.get('currentTime');
    if(!active || active !== this.get('slice') || !this.get('slicing')) {
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
    var newValue;

    if(relativeToLeft) {
      stoppingPoint = et - this.MINIMUM_SLICE_DURATION;
      newValue = Math.min(stoppingPoint, st + newSeconds);
      newValue = Math.max(0,newValue);
      this.set('slice.startTime',newValue);
    }
    else {
      stoppingPoint = st + this.MINIMUM_SLICE_DURATION;
      newValue = Math.max(stoppingPoint, et + newSeconds);
      newValue = Math.min(newValue,this.get('videoLength'));
      this.set('slice.endTime',newValue);
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
    delete: function(slice) {
      this.sendAction('delete',slice);
    }
  }
});
