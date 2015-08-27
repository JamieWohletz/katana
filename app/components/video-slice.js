import Ember from 'ember';

export default Ember.Component.extend({
  videoLength: 0,
  indicatorPositionPercentage: Ember.computed('currentTime','slice.startTime','duration', function(){
    return ((this.get('currentTime')-this.get('slice.startTime'))/this.get('duration'))*100;
  }),
  duration: Ember.computed('slice.startTime','slice.endTime', function(){
    return +this.get('slice.endTime') - (+this.get('slice.startTime'));
  }),
  style: Ember.computed('duration', function(){
    var d = +this.get('duration');
    var l = +this.get('videoLength');
    var s = +this.get('slice.startTime');
    var width = (d/l * 100).toFixed(2);
    var origin = s/l * 100;
    return 'left:'+origin+'%;width:'+width+'%;';
  }),
  actions: {
    play: function(slice) {
      this.sendAction('play',slice);
    }
  }
});
