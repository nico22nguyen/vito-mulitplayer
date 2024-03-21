/** 
 * TODO:
 * New Mechanics
 * -> add score at top of screen (increments after reaching top of level)
 * -> add portal on the top platform (end of level, increment score, regenerate platforms/clouds)
 * -> sky color darkens progressively each level, draw stars starting at a dark enough level (e.g. 5)
 * -> kill vito if he falls more than (5?) platforms (reset score, regenerate platforms/clouds)
 * -> power ups?
 * 
 * Visual Updates
 * -> Cloud updates
 *    - clouds within a level should be able to have different velocities
 *    - give them a thin outline so that when they overlap they are still distinguishable
 *    - add z-index so they overlap correctly instead of both outlines showing
 *    - add slight randomness to cloud shapes
 * -> character customization (at least be able to re-skin vito's basic colors)
 * -> use textures for background instead of just color blocks
 * 
 * QoL Updates
 * -> Canvas should be dynamic size (match window size, update on window resize)
 * -> disable window scroll
 * -> convert to ts
 * -> FPS should be 60 by default
 *    - Maybe add an fps slider (in a new options menu??)
 *    - Make sure adjusting FPS doesn't accelerate game speed, it should feel the same speed just update faster
 *    - Will need some sort of adjusted "time" coefficient for tick updates instead of doing constant moves per frame 
*/

// game variables
var keys = {};
var platforms = [];
var cloudLevels = [];
var vito = new Vito(0, 0);
var otherVito = new Vito(0, 0);
var tick = function tick(context) {
  vito.adjustY();
  vito.adjustX();

  // background moves in the opposite direction of vito, hence -x
  drawBackground(-vito.x, vito.y, context);
  updateCloudPositions();
  drawVito(otherVito, SCREEN_WIDTH / 2 + otherVito.x - vito.x, vito.y - otherVito.y + VIRTUAL_Y_0, context, 'absolute', true);
  drawVito(vito, SCREEN_WIDTH / 2, 0, context);
};
var run = function run() {
  var canvas = document.getElementById('canvas');
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  var context = canvas.getContext('2d');
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  populatePlatforms();
  generateClouds();
  var _tick = function _tick() {
    return tick(context);
  };
  var game = setInterval(_tick, 1000 / FPS);
};
run();