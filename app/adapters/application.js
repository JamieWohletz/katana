import baseAdapter from 'ember-data-offline/adapters/base';

export default baseAdapter.extend({
  offlineNamespace: 'katana',
  _forceOffline: Ember.observer('isOnline',function(){
    if(this.get('isOnline')) {
      this.set('isOnline',false);
    }
  })
});
