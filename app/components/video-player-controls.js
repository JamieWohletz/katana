import Ember from 'ember';

export default Ember.Component.extend({
  project: null,
  slicing:false,
  actions: {
    slice: function(currentTime) {
      var activeSlice = this.get('project.activeSlice');

      if(activeSlice && !activeSlice.get('shouldRepeat')) {
        activeSlice.set('shouldRepeat',true);
        this.set('slicing',false);
        activeSlice.save();
        return;
      }
      this.set('slicing',true);

      currentTime = isNaN(currentTime) ? 0 : currentTime;
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
