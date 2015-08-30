import Ember from 'ember';

export default Ember.Component.extend({
  storage: Ember.inject.service(),
  intervalId: '',

  tagName:'a',
  attributeBindings: ['href','title'],
  href:'#',
  title: 'Click and hold to adjust the clip.',
  direction: '',
  classNames:['video-player-slice-adjuster','fa'],
  classNameBindings: ['icon'],
  icon: Ember.computed('direction', function(){
    return this.get('direction') === 'left' ? this.get('leftIcon') : this.get('rightIcon');
  }),

  mouseDown(event) {
    this.set('pressed',true);
  },
  mouseUp(event) {
    this.set('pressed',false);
  },

  _reactToInteraction: Ember.observer('pressed', function(){
    var self = this;
    if(!this.get('pressed')) {
      window.clearInterval(this.get('intervalId'));
      //SAVE CHANGES!
      self.get('storage').saveAll();
      return;
    }
    this.set('intervalId',window.setInterval(function(){
      self.sendAction('action',self.get('direction'));
    },100));
  })
});
