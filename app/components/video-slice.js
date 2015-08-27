import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'',
  videoLength: 0,
  EXPANSION_INCREMENT: 1,
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
    changeSize: function(direction) {
      console.log('changeSize top level');
      //FIXME: bug here that causes things to act weird
      var slice = this.get('slice');
      var startTime = Ember.get(slice,'startTime');
      var endTime = Ember.get(slice,'endTime');
      endTime += direction === 'left'? -this.EXPANSION_INCREMENT : this.EXPANSION_INCREMENT;
      Ember.setProperties(slice, {
        startTime:Math.min(endTime,startTime),
        endTime:Math.max(endTime,startTime)
      });
    }
  }
});
