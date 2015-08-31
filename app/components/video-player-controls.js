import Ember from 'ember';

export default Ember.Component.extend({
  project: null,
  actions: {
    slice: function(currentTime) {
      var activeSlice = this.get('project.activeSlice');
      if(activeSlice && !activeSlice.get('shouldRepeat')) {
        activeSlice.set('shouldRepeat',true);
        return;
      }
      // else if(activeSlice && activeSlice.get('shouldRepeat')) {
      //   this.set('project.activeSlice',null);
      // }

      this.sendAction('slice',currentTime);
    },
    updateActiveSlice: function(slice, isActive){
      if(!isActive) {
        this.set('project.activeSlice',null);
        return;
      }
      slice.set('shouldRepeat',true);
      this.set('project.activeSlice',slice);
    }
  }
});
