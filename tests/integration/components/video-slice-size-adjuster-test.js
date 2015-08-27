import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('video-slice-size-adjuster', 'Integration | Component | video slice size adjuster', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{video-slice-size-adjuster}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#video-slice-size-adjuster}}
      template block text
    {{/video-slice-size-adjuster}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
