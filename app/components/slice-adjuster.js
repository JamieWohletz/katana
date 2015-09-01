import Ember from 'ember';

export default Ember.Component.extend({
  videoLengthInSeconds: null,
  dragging: false,
  //our parent slice component is kind enough to keep track of the mouse X
  //and give it to us so we can use it.
  //we NEED this because the user should be able to go crazy with the handles,
  //not just move them a tiny bit
  mouseX: null,

  classNames: ['video-player-slice-adjuster'],
  classNameBindings: ['side'],
  side:'',

  attributeBindings: ['title'],
  title: 'Click & drag to adjust size.',

  mouseDown: function(e){
    this.set('dragging',true);
  },

  mouseUp: function(){
    this.set('dragging',false);
    this.sendAction('saveSlice');
  },

  convertPercentageToSeconds: function(percentage) {
    return percentage/100 * this.get('videoLengthInSeconds');
  },

  _triggerSizeUpdate: Ember.observer('dragging','mouseX',function(){
    if(!this.get('dragging')) {
      return;
    }

    var relativeX = this.get('mouseX') - this.$().offset().left;
    this.sendAction('updateSize',relativeX,this.get('side') === 'left');
  })

});
