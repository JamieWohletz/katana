import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'',
  videoLength: 0,
  //How much should we adjust a slice's size/position by?
  INCREMENT: 1,
  //How short can a slice be in seconds?
  MINIMUM_SLICE_SIZE: 2,
  //This determines which side of the slice should stay still while
  //the clip is being modified
  expandFromLeft:true,

  adjustSizeTitle: 'Click and hold to adjust clip length.',
  adjustPositionTitle: 'Click and hold to adjust clip position.',

  active: Ember.computed('currentSlice',function(){
    return this.get('slice') === this.get('currentSlice');
  }),
  indicatorPositionPercentage: Ember.computed('currentTime','slice.startTime','duration', function(){
    var left = ((this.get('currentTime') - this.get('slice.startTime')) / this.get('duration'))*100;
    return new Ember.Handlebars.SafeString('left:'+left+'%;'
    );
  }),
  duration: Ember.computed('slice', 'slice.startTime','slice.endTime', function(){
    return +this.get('slice.endTime') - (+this.get('slice.startTime'));
  }),
  style: Ember.computed('duration','videoLength', function(){
    var d = +this.get('duration');
    var l = +this.get('videoLength');
    var s = +this.get('slice.startTime');
    var width = (d/l * 100).toFixed(2);
    var origin = s/l * 100;
    return new Ember.Handlebars.SafeString('left:'+origin+'%;width:'+width+'%;');
  }),
  actions: {
    play: function(slice) {
      this.sendAction('play',slice);
    },
    delete: function(slice) {
      this.sendAction('delete',slice);
    },
    changePosition: function(direction) {
      var slice = this.get('slice');
      var startTime = Ember.get(slice,'startTime');
      var endTime = Ember.get(slice,'endTime');
      var duration = this.get('duration');
      if(direction === 'left') {
        var newStartTime = Math.max(0,startTime-this.INCREMENT);
        Ember.setProperties(slice, {
          startTime: newStartTime,
          endTime: duration + newStartTime
        });
      } else {
        var newEndTime = Math.min(this.videoLength, endTime + this.INCREMENT);
        Ember.setProperties(slice, {
          endTime: newEndTime,
          startTime: newEndTime - duration
        });
      }
    },
    changeSize: function(direction) {
      var slice = this.get('slice');
      var startTime = Ember.get(slice,'startTime');
      var endTime = Ember.get(slice,'endTime');
      var leftIsStationary = this.get('expandFromLeft');
      if(leftIsStationary) {
        endTime += direction === 'left'? -this.INCREMENT : this.INCREMENT;
      }
      else {
        startTime += direction === 'left'? -this.INCREMENT : this.INCREMENT;
      }
      if((endTime - startTime) < this.MINIMUM_SLICE_SIZE) {
        this.set('expandFromLeft',!leftIsStationary);
      }
      Ember.setProperties(slice, {
        startTime:startTime,
        endTime:endTime
      });
    }
  }
});
