import DS from 'ember-data';
import DebounceMixin from 'katana/mixins/debounce';

export default DS.Model.extend(DebounceMixin, {
  shouldRepeat: null,
  project: DS.belongsTo('project', {async: true}),
  //all values are in seconds
  startTime: DS.attr('number'),
  endTime: DS.attr('number'),
  duration: Ember.computed('startTime,endTime', function(){
    return this.get('endTime') - this.get('startTime');
  }),

  //We want to automatically save the slice anytime it's changed,
  //but we don't want to go crazy with it. So we'll save it every 250 ms.
  _autoSave: Ember.observer('startTime','endTime', function(){
    this.debounce(this, this.save, 250)();
  })
});
