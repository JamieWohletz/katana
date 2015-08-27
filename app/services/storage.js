import Ember from 'ember';
/* global localforage */

export default Ember.Service.extend({
  KEY: 'katana-store',
  store: {
    projects:[]
  },
  loadAll: function(callback){
    var store = this.get('store');
    localforage.getItem(this.KEY,function(err,savedStore){
      savedStore = JSON.parse(savedStore);
      if(savedStore && savedStore.projects) {
        savedStore.projects.forEach(function(project) {
          store.projects.pushObject(project);
        });
      }
      callback();
    });
  },
  saveAll: function(){
    localforage.setItem(this.KEY, JSON.stringify(this.get('store')));
  },
  findProjectBy: function(property,value) {
    var projects = this.get('store').projects;
    return projects.filter(function(project) {
      return project[property] === value;
    }).shift();
  },
  createProject: function(obj) {
    if(!this.validProperties(obj, 'project')) {
      return null;
    }
    this.get('store').projects.pushObject(obj);
    return obj;
  },
  createSliceAndAddToProject: function(slice,project) {
    if(!this.validProperties(slice,'slice') || !this.validProperties(project, 'project')){
      return null;
    }
    var projects = this.get('store').projects;
    projects[projects.indexOf(project)].slices.pushObject(slice);
    return slice;
  },
  validProperties: function(object, type) {
    if(type==='slice') {
      return object.startTime && typeof object.startTime === 'number' &&
      object.endTime && typeof object.endTime === 'number';
    }else {
      return object.videoId && typeof object.videoId === 'string' &&
      object.slices && object.slices instanceof Array;
    }
  }
});
