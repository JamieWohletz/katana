import DS from 'ember-data';
/* global localforage */

export default DS.Adapter.extend({
  namespace: 'katana',

  shouldBackgroundReloadRecord: function(store, snapshot) {
    return true;
  },

  generateIdForRecord: function(store, inputProperties){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },

  findRecord: function(store, type, id, snapshot) {
    var modelName = type.modelName;
    var key = this._getKey(modelName);
    //returns a promise
    return localforage.getItem(key).then(function(jsonObj){
      return jsonObj[modelName].findBy('id',id);
    });
  },

  findAll: function(store, type, sinceToken) {
    var modelName = type.modelName;
    var key = this._getKey(modelName);

    return localforage.getItem(key).then(function(wrapperObject){
      return wrapperObject[modelName];
    });
  },

  createRecord: function(store, type, snapshot) {
    var modelName = type.modelName;
    var key = this._getKey(modelName);
    var self = this;
    var objToSave = this._serialize(snapshot);

    return localforage.getItem(key).then(function(obj){
      if(obj && obj[modelName]) {
        obj[modelName].push(objToSave);
      }

      var newArrayObject = self._wrapInJsonObject([objToSave],modelName);
      return localforage.setItem(key, obj || newArrayObject).then(function(value){
        return objToSave;
      });
    }, function(error){
      return null;
    });
  },

  updateRecord: function(store, type, snapshot) {
    var modelName = type.modelName;
    var freshAttributes = this._serialize(snapshot);
    var key = this._getKey(modelName);

    return localforage.getItem(key).then(function(jsonObj){
      if(!jsonObj || !jsonObj[modelName]) {
        return null;
      }
      var updatedRecord = jsonObj[modelName].findBy('id',freshAttributes.id);
      Ember.setProperties(updatedRecord, freshAttributes);

      return localforage.setItem(key,jsonObj).then(function(array){
        return updatedRecord;
      });
    });
  },

  deleteRecord: function(store, type, snapshot) {
    var modelName = type.modelName;
    var key = this._getKey(modelName);
    var objToDelete = this._serialize(snapshot);

    return localforage.getItem(key).then(function(jsonObj){
      if(jsonObj && jsonObj[modelName]) {
        var array = jsonObj[modelName];

        array.removeObject(array.findBy('id',objToDelete.id));

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
    return null;
  },

  _wrapInJsonObject: function(object, modelName) {
    var obj = {};
    obj[modelName] = object;
    return obj;
  },

  _getKey: function(modelName) {
    return [this.get('namespace'),modelName].join('-');
  },

  _serialize: function(snapshot) {
    var tmp = snapshot.serialize();
    tmp.id = snapshot.id;
    return tmp;
  }
});
