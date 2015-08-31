import DS from 'ember-data';

export default DS.Model.extend({
  shouldRepeat: null,
  project: DS.belongsTo('project'),
  //all values are in seconds
  startTime: DS.attr('number'),
  endTime: DS.attr('number'),
  duration: Ember.computed('startTime,endTime', function(){
    return this.get('endTime') - this.get('startTime');
  })
});
