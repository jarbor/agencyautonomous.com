(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["metamorpher"] = factory();
	else
		root["metamorpher"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Edge = exports.Point = exports.Instruction = exports.Path = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Path =
/*#__PURE__*/
function () {
  function Path(input) {
    var _this = this;

    _classCallCheck(this, Path);

    this.instructions = [];

    if (input instanceof Path) {
      this.element = input.element;
      input.instructions.forEach(function (instruction) {
        return _this.instructions.push(new Instruction(instruction));
      });
    } else {
      var dataString;

      if (typeof input === 'string') {
        dataString = input;
      } else {
        dataString = input.getAttribute('d');
        this.element = input;
      }

      dataString.split(' ').forEach(this.pushData, this);
    }
  }

  _createClass(Path, [{
    key: "pushData",
    value: function pushData(data) {
      if (data === '') {// Do nothing
      } else if (isNaN(data)) {
        this.instructions.push(new Instruction(data));
      } else {
        this.instructions[this.instructions.length - 1].pushData(Number(data));
      }
    }
  }, {
    key: "attach",
    value: function attach(element) {
      this.element = element;
      return this;
    }
  }, {
    key: "detach",
    value: function detach() {
      delete this.element;
      return this;
    }
  }, {
    key: "paint",
    value: function paint() {
      this.element && this.element.setAttribute('d', this.toString());
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.instructions.reduce(function (accumulator, instruction) {
        return "".concat(accumulator, " ").concat(instruction);
      }, '');
    }
  }, {
    key: "scale",
    value: function scale(factor, origin) {
      this.instructions.forEach(function (instruction) {
        return instruction.scale(factor, origin);
      });
      return this;
    }
  }, {
    key: "rotate",
    value: function rotate(degrees, origin) {
      this.instructions.forEach(function (instruction) {
        return instruction.rotate(degrees, origin);
      });
      return this;
    }
  }, {
    key: "transform",
    value: function transform(path) {
      // TODO: Throw error if path lengths don't match
      this.instructions.forEach(function (instruction, index) {
        return instruction.transform(path.instructions[index]);
      });
      return this;
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      this.instructions.forEach(function (instruction) {
        return instruction.translate(x, y);
      });
      return this;
    }
  }, {
    key: "interpolate",
    value: function interpolate(startPath, endPath, progress) {
      // TODO: Throw error if path lengths don't match
      this.instructions.forEach(function (instruction, index) {
        return instruction.interpolate(startPath.instructions[index], endPath.instructions[index], progress);
      });
      return this;
    }
  }, {
    key: "longestEdge",
    get: function get() {
      var lastPoint,
          edges = [],
          longestEdge,
          longestEdgeLength = 0;
      this.instructions.forEach(function (instruction) {
        var nextPoint = instruction.lastPoint;

        if (instruction.type === 'L') {
          edges.push(new Edge(lastPoint, nextPoint));
        }

        lastPoint = nextPoint;
      });
      edges.forEach(function (edge) {
        if (edge.length > longestEdgeLength) {
          longestEdge = edge;
          longestEdgeLength = edge.length;
        }
      });
      return longestEdge;
    }
  }]);

  return Path;
}();

exports.Path = Path;

var Instruction =
/*#__PURE__*/
function () {
  function Instruction() {
    _classCallCheck(this, Instruction);

    if (arguments[0] instanceof Instruction) {
      this.type = arguments[0].type;
      this.points = arguments[0].points.map(function (point) {
        return new Point(point);
      });
    } else {
      this.points = [];
      var args = Array.prototype.slice.call(arguments);
      args.forEach(this.pushData.bind(this));
    }
  }

  _createClass(Instruction, [{
    key: "pushData",
    value: function pushData(data) {
      if (typeof data === 'string') {
        this.type = data;
      } else {
        this.nextIncompletePoint.pushData(data);
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.points.reduce(function (accumulator, point) {
        return "".concat(accumulator, " ").concat(point);
      }, this.type);
    }
  }, {
    key: "scale",
    value: function scale(factor, origin) {
      this.points.forEach(function (point) {
        return point.scale(factor, origin);
      });
      return this;
    }
  }, {
    key: "rotate",
    value: function rotate(degrees, origin) {
      this.points.forEach(function (point) {
        return point.rotate(degrees, origin);
      });
      return this;
    }
  }, {
    key: "transform",
    value: function transform(instruction) {
      // TODO: Throw error if path lengths don't match
      this.points.forEach(function (point, index) {
        return point.transform(instruction.points[index]);
      });
      return this;
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      this.points.forEach(function (point) {
        return point.translate(x, y);
      });
      return this;
    }
  }, {
    key: "interpolate",
    value: function interpolate(startInstruction, endInstruction, progress) {
      // TODO: Throw error if path lengths don't match
      this.points.forEach(function (point, index) {
        return point.interpolate(startInstruction.points[index], endInstruction.points[index], progress);
      });
      return this;
    }
  }, {
    key: "nextIncompletePoint",
    get: function get() {
      var point;

      if (!this.points.length || this.points[this.points.length - 1].y !== undefined) {
        point = new Point();
        this.points.push(point);
      } else {
        point = this.points[this.points.length - 1];
      }

      return point;
    }
  }, {
    key: "lastPoint",
    get: function get() {
      return this.points.length ? this.points[this.points.length - 1] : undefined;
    }
  }]);

  return Instruction;
}();

exports.Instruction = Instruction;

var Point =
/*#__PURE__*/
function () {
  function Point() {
    _classCallCheck(this, Point);

    if (arguments[0] instanceof Point) {
      this.x = arguments[0].x;
      this.y = arguments[0].y;
    } else {
      var args = Array.prototype.slice.call(arguments);
      args.forEach(this.pushData.bind(this));
    }
  }

  _createClass(Point, [{
    key: "pushData",
    value: function pushData(data) {
      if (this.x === undefined) {
        this.x = data;
      } else if (this.y === undefined) {
        this.y = data;
      } else {
        throw new Error("Can't push ".concat(data, " - coordinates already defined: ").concat(this));
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.x, " ").concat(this.y);
    }
  }, {
    key: "scale",
    value: function scale(factor, origin) {
      origin = origin || new Point(0, 0);
      this.x = (this.x - origin.x) * factor + origin.x;
      this.y = (this.y - origin.y) * factor + origin.y;
    }
  }, {
    key: "rotate",
    value: function rotate(degrees, origin) {
      origin = origin || new Point(0, 0);
      var radians = degrees * Math.PI / 180;
      var sin = Math.sin(radians);
      var cos = Math.cos(radians); // Translate point to origin

      var x = this.x - origin.x;
      var y = this.y - origin.y; // Rotate point

      var newX = x * cos - y * sin;
      var newY = x * sin + y * cos; // Translate point back

      this.x = newX + origin.x;
      this.y = newY + origin.y;
    }
  }, {
    key: "transform",
    value: function transform(point) {
      this.instruction = point.instruction;
      this.x = point.x;
      this.y = point.y;
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      this.x += x;
      this.y += y;
    }
  }, {
    key: "interpolate",
    value: function interpolate(startPoint, endPoint, progress) {
      this.x = (endPoint.x - startPoint.x) * progress + startPoint.x;
      this.y = (endPoint.y - startPoint.y) * progress + startPoint.y;
    }
  }]);

  return Point;
}();

exports.Point = Point;

var Edge =
/*#__PURE__*/
function () {
  function Edge(p1, p2) {
    _classCallCheck(this, Edge);

    this.p1 = p1;
    this.p2 = p2;
  }

  _createClass(Edge, [{
    key: "length",
    get: function get() {
      if (!this._length) {
        this._length = Math.sqrt(Math.pow(Math.abs(this.p1.x - this.p2.x), 2) + Math.pow(Math.abs(this.p1.y - this.p2.y), 2));
      }

      return this._length;
    }
  }, {
    key: "angle",
    get: function get() {
      if (!this._angle) {
        this._angle = (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x);
      }

      return this._angle;
    }
  }]);

  return Edge;
}();

exports.Edge = Edge;

/***/ })
/******/ ]);
});