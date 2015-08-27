import Ember from 'ember';

export default Ember.Component.extend({
  storage: Ember.inject.service(),
  tagName:'a',
  attributeBindings: ['href','title'],
  href:'#',
  title: 'Click and hold to change clip\'s length',
  direction: '',
  classNames:['video-player-slice-size-adjuster','fa'],
  classNameBindings: ['direction','icon'],
  intervalId: '',
  icon: Ember.computed('direction', function(){
    return this.get('direction') === 'left' ? 'fa-backward' : 'fa-forward';
  }),
  mouseDown(event) {
    console.log('pressed!');
    this.set('pressed',true);
  },
  mouseUp(event) {
    console.log('released!');
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
      self.sendAction('changeSize',self.get('direction'));
    },100));
  })
});
