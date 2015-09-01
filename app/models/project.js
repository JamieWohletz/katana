import DS from 'ember-data';

export default DS.Model.extend({
  activeSlice: null,

  videoId: DS.attr('string'),
  videoUrl: DS.attr('string'),
  videoLength: DS.attr('number'), //seconds
  updatedAt: DS.attr('date'),

  slices: DS.hasMany('slice', {async:true}),

  _autoSave: Ember.observer('updatedAt', function(){
    Ember.run.debounce(this,this.save, 500);
  })
});
