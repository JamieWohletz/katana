import Ember from 'ember';
import DebounceMixin from '../../../mixins/debounce';
import { module, test } from 'qunit';

module('Unit | Mixin | debounce');

// Replace this with your real tests.
test('it works', function(assert) {
  var DebounceObject = Ember.Object.extend(DebounceMixin);
  var subject = DebounceObject.create();
  assert.ok(subject);
});
