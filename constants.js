/* colors */
var OVERALL_COLOR = '#1560bd';
var OVERALL_BUTTON_COLOR = '#ffd700';
var SHOE_COLOR = '#663300';
var PLATFORM_COLOR_SCHEDULE = ['#00ff00', '#ffd700', '#00ffff', '#ff00ff', '#turquoise', 'red'];
var SKY_COLOR = '#7ec0ee';
var GROUND_COLOR = '#7cfc00';

/* game */
var SCREEN_WIDTH = 1350;
var SCREEN_HEIGHT = 600;
var FPS = 40;
var GRAVITY_FORCE = -1;
var MAX_FALL_SPEED = 50;
var OUT_OF_BOUNDS = 5715;
var GROUND_THICKNESS = 200;
var WALL_THICKNESS = 400;
var KEYCODE_TO_DIRECTION = {
  65: 'LEFT', // A
  68: 'RIGHT', // S
  87: 'UP', // W
  32: 'UP' // SPACE
};

/* clouds */
var CLOUD_SPACING_X_MAX = 1000;
var CLOUD_SPACING_X_MIN = 500;
var CLOUD_INTER_LEVEL_SPACING = 600;
var CLOUD_LEVEL_Y_VARIATION = 100;
var CLOUD_INTRA_LEVEL_SPACING_MAX = 200;
var CLOUD_MAX_VELOCITY = 8;
var CLOUD_START = 400;
var NUM_CLOUD_LEVELS = 40;

/* platforms */
var PLATFORM_WIDTH = 200;
var PLATFORM_HEIGHT = 30;
var PLATFORM_SPACING_Y = 275;
var PLATFORM_START_Y = 250;
var MIN_PLATFORM_SPACING_X = 100;
var MAX_PLATFORM_SPACING_X = 525;
// soften the max for lower levels since the max should be really hard to hit
var MAX_PLATFORM_SPACING_X_SOFTENER = 25;
var NUM_PLATFORMS = 50;
var PLATFORMS_PER_LEVEL = 10;

/* vito */
var JUMP_POWER = 25;
var X_VELOCITY = 10;
var SHOE_WIDTH = 20; // for platform detection
var HAT_JUT = 35; // for wall detection (UNSAFE, THIS IS NOT TIED TO THE ACTUAL HAT DRAWING)

function find(arr, finder_fn) {
  found = null;
  arr.forEach(function (element) {
    if (found) return;
    if (finder_fn(element)) found = element;
  });
  return found;
}

function drawEllipse(ctx, x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  var kappa = 0.5522848,
  ox = radiusX * kappa, // control point offset horizontal
  oy = radiusY * kappa; // control point offset vertical
    
  ctx.save(); // Save the current transformation matrix
  ctx.translate(x, y); // Translate to the center of the ellipse
  ctx.rotate(rotation); // Rotate if necessary
    
  ctx.beginPath();
  ctx.moveTo(0, -radiusY);
  ctx.bezierCurveTo(ox, -radiusY, radiusX, -oy, radiusX, 0);
  ctx.bezierCurveTo(radiusX, oy, ox, radiusY, 0, radiusY);
  ctx.bezierCurveTo(-ox, radiusY, -radiusX, oy, -radiusX, 0);
  ctx.bezierCurveTo(-radiusX, -oy, -ox, -radiusY, 0, -radiusY);
  ctx.closePath(); // Close the path
    
  ctx.restore(); // Restore the previous transformation matrix
}