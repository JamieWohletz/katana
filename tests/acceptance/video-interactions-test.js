import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'katana/tests/helpers/start-app';

var testURL = 'https://www.youtube.com/watch?v=bXf5huCVSGE';
var testVideoId = 'bXf5huCVSGE';
var enterUrl = function(){
  visit('/');
  fillIn('#video-player-url-input', testURL);
};

module('Acceptance | video interactions', {
  beforeEach: function() {
    this.application = startApp();
    enterUrl();
  },

  afterEach: function() {
    try { Ember.run(this.application, 'destroy'); } catch(e){ Ember.run(this.application, 'destroy'); }
  }
});

test('can load a video in', function(assert) {
  const projectBoxSelector = '#project-title-box';
  andThen(function() {
    assert.equal(find(projectBoxSelector).val(), testVideoId);
  });
});

test('can clip a video', function(assert) {
  const buttonSelector = '#video-player-slice-button';
  const clipSelector = '.video-player-slice';
  andThen(() => {
    click(buttonSelector);
    andThen(() => {
      assert.ok(find(buttonSelector).text().indexOf('Stop') !== -1);
      click(buttonSelector);
      andThen(() => {
        assert.ok(find(clipSelector).length > 0);
      });
    });
  });
});

test('can delete a project', function(assert) {
  const deleteSelector = '#deleteProject';
  const helpSelector = '#video-player-help';
  //temporarily override window.confirm
  var backup = window.confirm;
  window.confirm = function(){return true;};
  andThen(()=>{
    click(deleteSelector);
    andThen(() => {
      assert.ok(find(helpSelector));
      window.confirm = backup;
    });
  });
});
