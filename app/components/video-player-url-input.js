import Ember from 'ember';

export default Ember.Component.extend({
  projects: null,

  extractVideoIdFromUrl: function(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return null;
  },

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
