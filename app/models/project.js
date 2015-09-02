import DS from 'ember-data';

export default DS.Model.extend({
  activeSlice: null,

  title: DS.attr('string'),
  videoId: DS.attr('string'),
  videoUrl: DS.attr('string'),
  videoLength: DS.attr('number'), //seconds
  updatedAt: DS.attr('date'),

  slices: DS.hasMany('slice'),

  //"But sir!", you ask, "Why not just listen to all these in the autosave method?"
  //Well, my good friend, it's because we need to keep udpatedAt completely up to date
  //because we use it to determine which project to load first.
  _touched: Ember.observer('slices.@each','title','videoId','videoUrl','videoLength', function(){
    this.set('updatedAt', new Date());
  }),

  _autoSave: Ember.observer('updatedAt', function(){
    Ember.run.debounce(this,this.save, 500);
  }),

  destroyRecord: function() {
    var slices = this.get('slices');
    var response = this._super();
    slices.forEach(function(slice){
      slice.destroyRecord();
    });
    return response;
  }
});
