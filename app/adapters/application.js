import DS from 'ember-data';
/* global localforage */

export default DS.Adapter.extend({
  namespace: 'katana',

  shouldBackgroundReloadRecord: function(store, snapshot) {
    return false;
  },

  generateIdForRecord: function(store, inputProperties){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },

  findRecord: function(store, type, id, snapshot) {
    var key = this._getKey(type);
    //returns a promise
    return localforage.getItem(key).then(function(jsonObj){
      return jsonObj[type].findBy('id',id);
    });
  },

  findAll: function(store, type, sinceToken) {
    var key = this._getKey(type);
    return localforage.getItem(key);
  },

  createRecord: function(store, type, snapshot) {
    var key = this._getKey(type);
    var objToSave = snapshot.attributes();
    objToSave.id = snapshot.id;
    var self = this;

    return localforage.getItem(key).then(function(obj){
      if(obj && obj[type]) {
        obj[type].push(objToSave);
      }

      var newArrayObject = self._wrapInJsonObject([objToSave],type);
      return localforage.setItem(key, obj || newArrayObject).then(function(value){
        return self._wrapInJsonObject(objToSave,type);
      });
    }, function(error){
      return null;
    });
  },

  updateRecord: function(store, type, snapshot) {
    var key = this._getKey(type);
    return localforage.getItem(key).then(function(jsonObj){
      if(!jsonObj || !jsonObj[type]) {
        return null;
      }
      var updatedRecord = jsonObj[type].findBy('id',snapshot.id);
      updatedRecord.setProperties(snapshot.attributes());

      return localforage.setItem(key,jsonObj).then(function(array){
        return updatedRecord;
      });
    });
  },

  deleteRecord: function(store, type, snapshot) {
    var key = this._getKey(type);
    var objToDelete = snapshot.attributes();
    return localforage.getItem(key).then(function(jsonObj){
      if(jsonObj && jsonObj[type]) {
        jsonObj[type].removeAt(jsonObj[type].indexOf(objToDelete));
        return localforage.setItem(key,jsonObj).then(function(array){
          return objToDelete;
        });
      }
      return null;
    });
  },

  query: function(store, type, query) {
    // var key = this._getKey(type);
    // return localforage.getItem(key).then(function(array){
    //   return array.filter(function(item){
    //     item.
    //   });
    // });
  },

  _wrapInJsonObject: function(object, type) {
    var obj = {};
    obj[type.modelName] = object;
    return obj;
  },

  _getKey: function(type) {
    return [this.get('namespace'),type.modelName].join('-');
  }
});
