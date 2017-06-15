import Ember from 'ember'
import * as d3 from 'd3'

export default Ember.Component.extend({
  classNames: ['top-10-pps-in'],
  data: [
    {
      'x': '2017-06-09T09:45:03Z',
      'y': 6793,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:45:04Z',
      'y': 11899,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:45:05Z',
      'y': 9872,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:45:06Z',
      'y': 11220,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:45:07Z',
      'y': 9217,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:45:08Z',
      'y': 7554,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:47:12Z',
      'y': 11785,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:47:13Z',
      'y': 10466,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:47:14Z',
      'y': 8835,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    },
    {
      'x': '2017-06-09T09:47:15Z',
      'y': 7826,
      'cidr': '130_226_136_242',
      'resource': 'pps'
    }
  ],
  didInsertElement () {
    let widget = d3.select('.' + this.get('classNames') + ' > .dash-widget')
    widget.append('p')
      .text('top 10 pps (in)')
      .style('font-size', '.875rem')
      .style('font-weight', '100')

    let yValues = this.get('data').map(data => data.y)

    let yScale = d3.scaleLinear()
    .domain([0, Math.max(...yValues)])
    .range([0, 300])

    let xScale = d3.scaleBand()
      .domain(this.get('data').map(data => data.y))
      .range([0, 35])
      .paddingInner(0.12)

    let svg = d3.select(this.$('svg')[0])
    svg.selectAll('rect').data(this.get('data'))
      .enter()
      .append('rect')
      .attr('stroke', 'none')
      .attr('fill', '#448AFF')
      .attr('width', 2)
      .attr('height', (d) => yScale(d.y))
      .attr('x', (d) => xScale(d.y))
      .attr('y', (d) => 300 - yScale(d.y))
  }
})
