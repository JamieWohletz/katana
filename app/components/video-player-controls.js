import Ember from 'ember';

export default Ember.Component.extend({
  project: null,
  slicing:false,
  disableButton: Ember.computed('project', function(){
    return !this.get('project');
  }),
  actions: {
    slice: function(currentTime) {
      if(!this.get('project')) {
        return;
      }

      var activeSlice = this.get('project.activeSlice');

      if(activeSlice && !activeSlice.get('shouldRepeat')) {
        activeSlice.set('shouldRepeat',true);
        this.set('slicing',false);
        return;
      }
      this.set('slicing',true);

      currentTime = isNaN(currentTime) ? 0 : currentTime;
      this.sendAction('slice',currentTime);
    },
    updateActiveSlice: function(slice, isActive){
      if(this.get('slicing')) {
        this.set('slicing',false);
      }

      if(!isActive) {
        this.set('project.activeSlice',null);
        return;
      }
      slice.set('shouldRepeat',true);
      this.set('project.activeSlice',slice);
    },
    deleteSlice: function(slice) {
      if(this.get('project.activeSlice') === slice) {
        this.set('slicing',false);
      }
      slice.destroyRecord();
    }
  }
});
