function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Vito = /*#__PURE__*/_createClass(function Vito(x, y) {
  var _this = this;
  _classCallCheck(this, Vito);
  _defineProperty(this, "adjustY", function () {
    // can't go below the ground
    if (_this.y < 0) {
      _this.y = 0;
      _this.yVelocity = 0;
      return;
    }

    // only apply gravity if vito is above the ground
    _this.yVelocity += Math.min(GRAVITY_FORCE, MAX_FALL_SPEED);

    // if vito is moving upwards, no platform logic needed
    if (_this.yVelocity > 0) {
      _this.y += _this.yVelocity;
      return;
    }

    // If vito is touching a platform, stop y velocity or jump if key is pressed
    var intersectingPlatform = platformCheck(_this.x, _this.y);
    if (intersectingPlatform) {
      _this.yVelocity = keys['UP'] ? JUMP_POWER : 0;
      _this.y = intersectingPlatform.y;
      return;
    }

    // if applying velocity would skip vito past the next platform, land him on the platform
    var nextPlatform = getNextPlatform(_this.y);
    var nextPosition = _this.y + _this.yVelocity;
    if (nextPosition <= 0 || nextPosition <= (nextPlatform === null || nextPlatform === void 0 ? void 0 : nextPlatform.y) && xAlignsWithPlatform(_this.x, nextPlatform)) {
      _this.yVelocity = keys['UP'] ? JUMP_POWER : 0;
      _this.y = nextPlatform.y;
      return;
    }

    // otherwise, apply velocity
    _this.y += _this.yVelocity;
  });
  _defineProperty(this, "adjustX", function () {
    // "do nothing" cases
    if (keys['RIGHT'] && keys['LEFT']) return; // both pressed
    if (!keys['RIGHT'] && !keys['LEFT']) return; // none pressed

    // want to go left, but at wall
    if (keys['LEFT'] && _this.x < -OUT_OF_BOUNDS + HAT_JUT + WALL_THICKNESS + X_VELOCITY) {
      _this.x = -OUT_OF_BOUNDS + WALL_THICKNESS + HAT_JUT;
      return;
    }

    // want to go right, but at wall
    if (keys['RIGHT'] && _this.x > OUT_OF_BOUNDS - HAT_JUT - X_VELOCITY) {
      _this.x = OUT_OF_BOUNDS - HAT_JUT;
      return;
    }
    _this.x += X_VELOCITY * _this.direction;
  });
  this.x = x;
  this.y = y;
  this.yVelocity = 0;
  this.direction = 1;
});