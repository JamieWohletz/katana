import Ember from 'ember';

export default Ember.Component.extend({
  videoId: '',
  _autoSetVideoId: Ember.observer('videoUrl', function(){
    this.setVideoIdFromUrl(this.get('videoUrl') || '');
  }),
  setVideoIdFromUrl: function(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      this.set('videoId',match[2]);
    }
  }
});
