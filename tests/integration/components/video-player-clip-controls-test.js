import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('video-player-clip-controls', 'Integration | Component | video player clip controls', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{video-player-clip-controls}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#video-player-clip-controls}}
      template block text
    {{/video-player-clip-controls}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
