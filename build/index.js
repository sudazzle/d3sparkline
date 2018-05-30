'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

require('./style.css');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sparkline = function () {
  function Sparkline(props) {
    var _this = this;

    _classCallCheck(this, Sparkline);

    var containerElement = props.containerElement,
        width = props.width,
        height = props.height,
        arraySize = props.arraySize,
        data = props.data;

    var self = this;
    this.props = props;
    this.data = data || [];
    this.x = d3.scaleLinear().domain([0, arraySize]).range([0, width - 1]);
    this.y = d3.scaleLinear().range([height, 0]);
    this.line = d3.line().x(function (d, idx) {
      return _this.x(idx);
    }).y(function (d) {
      return _this.y(d);
    });
    this.pixelScale = width / arraySize;
    this.dataIndex = null;
    this.lastClientX = width;

    this.svg = d3.select(containerElement).attr('class', 'wrapper').append('svg').attr('class', 'sparkline').attr('height', height).attr('width', 0).datum(this.data);

    this.group = this.svg.append('g');

    this.path = this.group.append('path');
    this.tooltip = d3.select(containerElement).append('div').attr('class', 'tooltip');

    this.focus = this.group.append('g').attr('class', 'focus');
    this.focusLine = this.focus.append('line').attr('class', 'hover-line').attr('y1', height).attr('y2', -1 * height);
    this.focusCircle = this.focus.append('circle').attr('class', 'focus-circle').attr('r', 2);

    this.svg.append('rect').attr('class', 'overlay').attr('height', height).attr('width', width).on('mouseover', function () {
      self.mouseMove(this);
    }).on('mouseout', function () {
      _this.focus.style('display', 'none');
      _this.tooltip.style('display', 'none');
      _this.dataIndex = null;
    }).on('mousemove', function () {
      self.mouseMove(this);
    });

    if (data) {
      this.updateLine();
    }
  }

  _createClass(Sparkline, [{
    key: 'updateLine',
    value: function updateLine(data) {
      var max = d3.max(this.data, function (d) {
        return +d;
      }) || 0;
      var min = d3.min(this.data, function (d) {
        return +d;
      }) || 0;
      var currLineWidth = this.data.length * this.pixelScale;
      this.y.domain([Math.sign(min) === -1 ? min : 0, max]);

      if (data) {
        if (this.data.length >= this.props.arraySize) {
          this.data.shift();
        }

        this.data.push(data);
      }

      if (this.data.length !== 2 || this.data[0] !== 0) {
        this.path.attr('d', this.line);
        this.svg.attr('transform', 'translate(' + (this.props.width - currLineWidth) + ')').attr('width', currLineWidth);
      }
      if (this.dataIndex !== null) {
        this.mouseMove('update');
      }
    }
  }, {
    key: 'mouseMove',
    value: function mouseMove(e) {
      var dataIndex = e === 'update' ? this.dataIndex : Math.ceil(this.x.invert(d3.mouse(e)[0]));

      if (dataIndex < this.props.arraySize) {
        try {
          var clientX = void 0;
          if (this.data.length !== this.props.arraySize && e === 'update') {
            clientX = this.lastClientX;
            dataIndex++;
          } else if (e === 'update') {
            clientX = this.lastClientX;
          } else {
            clientX = d3.event.pageX;
          }
          this.dataIndex = dataIndex;
          this.lastClientX = clientX;
          var cy = this.y(this.data[dataIndex]);
          this.tooltip.text(this.data[dataIndex]).style('display', 'block').style('transform', 'translate(' + clientX + 'px)');
          this.focus.attr('transform', 'translate(' + dataIndex * this.pixelScale + ')').style('display', 'block');
          this.focusCircle.attr('cy', cy);
        } catch (err) {
          console.log('err', err);
        }
      }
    }
  }]);

  return Sparkline;
}();

exports.default = Sparkline;