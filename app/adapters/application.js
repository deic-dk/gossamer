import DS from 'ember-data'

export default DS.JSONAPIAdapter.extend({
  host: 'http://10.33.0.97:4242',
  namespace: 'api'
})