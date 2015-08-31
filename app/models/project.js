import DS from 'ember-data';

export default DS.Model.extend({
  activeSlice: null,

  videoId: DS.attr('string'),
  videoUrl: DS.attr('string'),
  videoLength: DS.attr('number'), //seconds
  slices: DS.hasMany('slice'),
  createdAt: DS.attr('date')
});
