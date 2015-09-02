import DS from 'ember-data';

export default DS.Model.extend({
  activeSlice: null,

  title: DS.attr('string'),
  videoId: DS.attr('string'),
  videoUrl: DS.attr('string'),
  videoLength: DS.attr('number'), //seconds
  updatedAt: DS.attr('date'),

  slices: DS.hasMany('slice', {async:true}),

  _titleUpdated: Ember.observer('title', function(){
    this.set('updatedAt',new Date());
  }),
  _autoSave: Ember.observer('updatedAt', function(){
    Ember.run.debounce(this,this.save, 500);
  })
});
