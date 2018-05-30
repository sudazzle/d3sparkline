import * as d3 from "d3"
import './style.css';
class Sparkline {
  constructor(props) {
    const { containerElement, width, height, arraySize, data } = props
    let self = this
    this.props = props
    this.data = data || []
    this.x = d3.scaleLinear().domain([0, arraySize]).range([0, width - 1])
    this.y = d3.scaleLinear().range([height, 0])
    this.line = d3.line().x((d, idx) => this.x(idx)).y(d => this.y(d))
    this.pixelScale = width / arraySize
    this.dataIndex = null
    this.lastClientX = width

    this.svg = d3.select(containerElement)
      .attr('class', 'wrapper')
      .append('svg')
      .attr('class', 'sparkline')
      .attr('height', height)
      .attr('width', 0)
      .datum(this.data)

    this.group = this.svg.append('g')
    
    this.path = this.group.append('path')
    this.tooltip = d3.select(containerElement)
      .append('div')
      .attr('class', 'tooltip')

    this.focus = this.group.append('g').attr('class', 'focus')
    this.focusLine = this.focus.append('line')
      .attr('class', 'hover-line')
      .attr('y1', height)
      .attr('y2', -1 * height)
    this.focusCircle = this.focus.append('circle')
      .attr('class', 'focus-circle')
      .attr('r', 2)

    this.svg.append('rect')
      .attr('class', 'overlay')
      .attr('height', height)
      .attr('width', width)
      .on('mouseover', function() { 
        self.mouseMove(this)
      })

      .on('mouseout', () => { 
        this.focus.style('display', 'none')
        this.tooltip.style('display', 'none')
        this.dataIndex = null
      })
      .on('mousemove', function() { 
        self.mouseMove(this)
      })

    if (data) {
      this.updateLine()
    }
  }

  updateLine (data) {
    const max = d3.max(this.data, d => +d) || 0
    const min = d3.min(this.data, d => +d) || 0
    const currLineWidth = this.data.length * this.pixelScale
    this.y.domain([(Math.sign(min) === -1) ? min : 0, max])

    if (data) {
      if (this.data.length >= this.props.arraySize) {
        this.data.shift()
      }

      this.data.push(data)
    }

    
    if (this.data.length !== 2 || this.data[0] !== 0) {
      this.path.attr('d', this.line)
      this.svg.attr('transform', `translate(${this.props.width - currLineWidth})`)
      .attr('width', currLineWidth)
    }
    if (this.dataIndex !== null) {
      this.mouseMove('update')
    }
  }

  mouseMove (e) {
    let dataIndex = (e === 'update') ? this.dataIndex : Math.ceil(this.x.invert(d3.mouse(e)[0]))
    
    if (dataIndex < this.props.arraySize) {
      try {
        let clientX;
        if (this.data.length !== this.props.arraySize && e === 'update') {
          clientX = this.lastClientX;
          dataIndex++;
        } else if (e === 'update') {
          clientX = this.lastClientX
        } else {
          clientX = d3.event.pageX
        }
        this.dataIndex = dataIndex
        this.lastClientX = clientX
        const cy = this.y(this.data[dataIndex])
        this.tooltip.text(this.data[dataIndex])
        .style('display', 'block')
        .style('transform', `translate(${clientX}px)`)
        this.focus.attr('transform', `translate(${dataIndex * this.pixelScale})`)
        .style('display', 'block')
        this.focusCircle.attr('cy', cy)
      } catch (err) {
        console.log('err', err);
      }
    }
  }
}
export default Sparkline;