import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  slices: DS.hasMany('slice')
});
