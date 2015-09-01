import Ember from 'ember';

export default Ember.Component.extend({
  //These are never directly set here in this component.
  //They are just used to update the appearance of the component.
  //projects is used for history
  projects: null,
  //project is used to ensure the input is filled appropriately
  //when this component is first constructed
  project: null,

  extractVideoIdFromUrl: function(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return null;
  },

  _init: Ember.on('didInsertElement', function(){
    var project = this.get('project');
    var input = this.get('fieldInput');
    if(!input && project && project.get('videoUrl')) {
      this.set('fieldInput', project.get('videoUrl'));
    }
  }),

  _updateVideo: Ember.observer('fieldInput',function(){
    var url = this.get('fieldInput') || '';
    var id = this.extractVideoIdFromUrl(url);
    if(!id) {
      return;
    }
    this.sendAction('action', {
      videoId: id,
      videoUrl: url
    });
  })
});
