import DS from 'ember-data';

export default DS.Model.extend({
  shouldRepeat: null,
  project: DS.belongsTo('project', {async: true}),
  //all values are in seconds
  startTime: DS.attr('number'),
  endTime: DS.attr('number'),
  duration: Ember.computed('startTime,endTime', function(){
    return this.get('endTime') - this.get('startTime');
  }),

  _autoSave: Ember.observer('startTime','endTime', function(){
    Ember.run.debounce(this,this.save, 500);
  })
});
