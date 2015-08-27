import DS from 'ember-data';

export default DS.Model.extend({
  startTime: DS.attr('number'),
  endTime: DS.attr('number')
});
