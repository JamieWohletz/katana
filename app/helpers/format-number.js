import Ember from 'ember';

export function formatNumber(number) {
  if(!isNaN(number)) {
    return (+number).toFixed(1);
  }
  return number;
}

export default Ember.Helper.helper(formatNumber);
