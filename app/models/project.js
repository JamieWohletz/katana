import DS from 'ember-data';
import DebounceMixin from 'katana/mixins/debounce';

export default DS.Model.extend(DebounceMixin, {
  activeSlice: null,

  videoId: DS.attr('string'),
  videoUrl: DS.attr('string'),
  videoLength: DS.attr('number'), //seconds
  updatedAt: DS.attr('date'),

  slices: DS.hasMany('slice', {async:true}),

  _autoSave: Ember.observer('updatedAt', function(){
    this.debounce(this, this.save)();
  })
});
