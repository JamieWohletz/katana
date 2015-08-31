import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'',
  videoLength: 0,
  activeSlice: null,
  slice: null,
  currentTime: null,

  active: Ember.computed('activeSlice', function(){
    return this.get('activeSlice') === this.get('slice');
  }),

  _updateSliceProperties: Ember.observer('currentTime', function(){
    var active = this.get('activeSlice');
    var time = this.get('currentTime');
    if(!active || active.get('shouldRepeat')) {
      return;
    }
    if(time > active.get('startTime')) {
      active.set('endTime',this.get('currentTime'));
    }
  }),

  indicatorPositionPercentage: Ember.computed('currentTime','slice.startTime','slice.duration', function(){
    var left = ((this.get('currentTime') - this.get('slice.startTime')) / this.get('slice.duration'))*100;
    return new Ember.Handlebars.SafeString('left:'+left+'%;'
    );
  }),
  style: Ember.computed('slice.duration','videoLength', function(){
    var d = +this.get('slice.duration');
    var l = +this.get('videoLength');
    var s = +this.get('slice.startTime');
    var width = (d/l * 100).toFixed(2);
    var origin = s/l * 100;
    return new Ember.Handlebars.SafeString('left:'+origin+'%;width:'+width+'%;');
  }),
  actions: {
    toggleActive: function(slice) {
      this.sendAction('toggleActive',slice,!this.get('active'));
    },
    delete: function(slice) {
      this.sendAction('delete',slice);
    }
  }
});
