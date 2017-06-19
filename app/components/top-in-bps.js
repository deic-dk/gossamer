import Ember from 'ember'
import * as d3 from 'd3'

export default Ember.Component.extend({
  classNames: ['top-10-bps-in'],
  didInsertElement () {
    // time parser for influx timestamp
    var parseTime = d3.utcParse('%Y-%m-%dT%H:%M:%SZ')
    // only to show hours
    var xTime = d3.timeFormat('%M:%S')

    // get data for `bps` on component call in handlebars
    // parse time data using parser
    var data = this.get('bps').stamp
    var dx = data.map((data) => parseTime(data.x))
    var dy = data.map((data) => (data.y))
    // console.log(dx)

    // get svg width and height from DOM
    var widget = d3.select('.' + this.get('classNames') + ' > .dash-widget')
    var svg = d3.select('.' + this.get('classNames') + ' > .dash-widget' + ' > svg')
    var svgW = svg['_groups'][0][0].clientWidth
    var svgH = svg['_groups'][0][0].clientHeight
    // configure chart widget dimensions
    var margin = {top: 20, right: 0, bottom: 120, left: 32}
    var margin2 = {top: 200, right: 0, bottom: 20, left: 32}
    var width = svgW - margin.left - margin.right - 20
    var height = +svgH - margin.top - margin.bottom
    var height2 = +svgH - margin2.top - margin2.bottom
    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // set widget title
    widget.append('p')
      .text('top 10 bps (in)')
      .style('font-size', '.875rem')
      .style('font-weight', '100')

    console.log(height)
    console.log(height2)

    // set x scale
    var x = d3.scaleTime().domain(d3.extent(dx)).rangeRound([5, width])
    var x2 = d3.scaleTime().range([5, width])
    // x axis gen
    var xAxis = d3.axisBottom(x)
    var xAxis2 = d3.axisBottom(x2)

    // set y scale
    var y = d3.scaleLinear().domain(d3.extent(dy)).rangeRound([height, 0])
    var y2 = d3.scaleLinear().range([height2, 0])
    // y axis gen
    var yAxis = d3.axisLeft(y)

    // brush and zoom
    var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed)
    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on('zoom', zoomed)

    // console.log(d3.extent(dx))

    // append the x axis
    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.tickSize(3)
              .ticks(15)
              .tickFormat(xTime))

    // append the y axis
    g.append('g')
        .call(yAxis
              .tickFormat(d3.formatPrefix('1.1', 1e6))
              .tickSize(2)
              .ticks(8))
      .append('text')
        .attr('fill', '#448AFF')
        .attr('transform', 'rotate(-90)')

    // change y domain to plot
    var yd = y.domain(d3.extent(dy)).rangeRound([5, height - 10])
    console.log(d3.extent(dy))

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('stroke', 'none')
      .attr('fill', '#448AFF')
      .attr('width', 1)
      .attr('height', (d) => yd(d.y))
      .attr('x', (d) => x(parseTime(d.x)))
      .attr('dx', (d) => x(parseTime(d.x)) * 1.2)
      .attr('y', (d) => height - yd(d.y))

    function brushed () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
      var s = d3.event.selection || x2.range()
      x.domain(s.map(x2.invert, x2))
      focus.select('.bars').attr('d', area)
      focus.select('.axis--x').call(xAxis)
      svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
          .scale(width / (s[1] - s[0]))
          .translate(-s[0], 0))
    }

    function zoomed () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return // ignore zoom-by-brush
      var t = d3.event.transform
      x.domain(t.rescaleX(x2).domain())
      focus.select('.bars').attr('d', area)
      focus.select('.axis--x').call(xAxis)
      context.select('.brush').call(brush.move, x.range().map(t.invertX, t))
    }
  }
})
