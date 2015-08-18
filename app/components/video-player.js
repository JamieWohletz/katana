import Ember from 'ember';

export default Ember.Component.extend({
  playerVars: {
    autoplay: 0,
    controls: 1,
    enablejsapi: 1,
    rel: 0, // disable related videos
    showinfo: 0,
    autohide: 1,
    fs: 1, // disable fullscreen button
    playsinline: 1,
    // disablekb: 1,
    // iv_load_policy: 3,
    modestbranding: 0
  },

  videoId: Ember.computed('videoUrl', function(){
    var videoUrl = this.get('videoUrl');
    if(!videoUrl) {
      return '';
    }

    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = videoUrl.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
    return '';
  })
});
