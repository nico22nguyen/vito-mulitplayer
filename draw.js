var VIRTUAL_Y_0 = SCREEN_HEIGHT - GROUND_THICKNESS;
var VIRTUAL_X_0 = SCREEN_WIDTH / 2;
var drawClouds = function drawClouds(xPos, yPos, context) {
  cloudLevels.forEach(function (cloud) {
    var numClouds = 2 * OUT_OF_BOUNDS / cloud.xSpacing;
    var offset = cloud.velocity > 0 ? -OUT_OF_BOUNDS : OUT_OF_BOUNDS;
    for (var i = -1; i < numClouds; i += 1) {
      context.fillStyle = 'white';
      var xSpacing = (cloud.velocity > 0 ? i : -i) * cloud.xSpacing;
      var drawY = VIRTUAL_Y_0 - cloud.y + yPos + cloud.yVariationSchedule[i + 1];

      // left bubble
      // context.ellipse(offset + xPos + cloud.x - 75 + xSpacing, drawY, 100, 50, 0, 0, 2 * Math.PI);
      drawEllipse(context, offset + xPos + cloud.x - 75 + xSpacing, drawY, 100, 50, 0, 0, 2 * Math.PI, false);
      context.fill();

      // right bubble
      // context.ellipse(offset + xPos + cloud.x + 75 + xSpacing, drawY, 100, 50, 0, 0, 2 * Math.PI);
      drawEllipse(context, offset + xPos + cloud.x + 75 + xSpacing, drawY, 100, 50, 0, 0, 2 * Math.PI, false);
      context.fill();

      // top bubble
      // context.ellipse(offset + xPos + cloud.x + xSpacing, drawY - 30, 120, 65, 0, 0, 2 * Math.PI);
      drawEllipse(context, offset + xPos + cloud.x + xSpacing, drawY - 30, 100, 50, 0, 0, 2 * Math.PI, false);
      context.fill();
    }
  });
};
var drawPlats = function drawPlats(xPos, yPos, context) {
  platforms.forEach(function (platform, i) {
    var platform_color_index = i < 45 ? Math.floor(i / 10) : PLATFORM_COLOR_SCHEDULE.length - 1;
    context.fillStyle = PLATFORM_COLOR_SCHEDULE[platform_color_index];
    context.fillRect(xPos + platform.x + VIRTUAL_X_0, VIRTUAL_Y_0 - platform.y + yPos, PLATFORM_WIDTH, PLATFORM_HEIGHT);
  });
};
var drawBackground = function drawBackground(xPos, yPos, context) {
  // sky background
  context.fillStyle = SKY_COLOR;
  context.fillRect(-10000, -10000, 20000, 20000);

  // clouds
  drawClouds(xPos, yPos, context);

  // ground
  context.fillStyle = GROUND_COLOR;
  context.fillRect(xPos - 10000, VIRTUAL_Y_0 + yPos, 20000, 200);

  // walls
  context.fillStyle = 'grey';
  context.fillRect(xPos + OUT_OF_BOUNDS + VIRTUAL_X_0, 0, WALL_THICKNESS, yPos + VIRTUAL_Y_0);
  context.fillRect(xPos - OUT_OF_BOUNDS + VIRTUAL_X_0, 0, WALL_THICKNESS, yPos + VIRTUAL_Y_0);

  // platforms
  drawPlats(xPos, yPos, context);
};

/**
 * IMPORTANT**: vito is drawn from the bottom center, between his shoes
 * This function works by taking the "center of mass" of vito's body parts,
 * and reflecting them by an offset depending on the direction
 */
var drawVito = function drawVito(x, y, unitDirection, context) {
  y = VIRTUAL_Y_0 - y;

  // body
  context.fillStyle = 'red';
  context.fillRect(x - 20, y - 92.5, 40, 60);

  // overalls
  var LEGS_CENTER = -17.5;
  var BELLY_CENTER = 7.5;
  context.fillStyle = OVERALL_COLOR;
  context.fillRect(x + LEGS_CENTER + 2.5 * unitDirection, y - 67.5, 35, 35);
  context.fillRect(x + LEGS_CENTER - 2.5 * unitDirection, y - 32.5, 10, 30);
  context.fillRect(x + BELLY_CENTER - 2.5 * unitDirection, y - 32.5, 10, 30);

  // button
  context.fillStyle = OVERALL_BUTTON_COLOR;
  context.beginPath();
  context.arc(x + 12.5 * unitDirection, y - 60, 5, 0, 2 * Math.PI);
  context.fill();

  // head
  context.fillStyle = 'yellow';
  context.fillRect(x - 25, y - 117.5, 50, 45);
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(x + 20 * unitDirection, y - 92.5, 2.5, 0, 2 * Math.PI);
  context.fill();

  // hat
  var HAT_CENTER = -30;
  context.fillStyle = 'red';
  context.fillRect(x + HAT_CENTER + 5 * unitDirection, y - 122.5, 60, 20);

  // shoes
  var SHOE_CENTER = -10;
  context.fillStyle = SHOE_COLOR;
  context.fillRect(x + SHOE_CENTER + 10 * -unitDirection, y - 7.5, SHOE_WIDTH, 7.5);
  context.fillRect(x + SHOE_CENTER + 15 * unitDirection, y - 7.5, SHOE_WIDTH, 7.5);

  // arm
  ARM_CENTER = -2.5;
  context.fillStyle = 'red';
  context.fillRect(x + ARM_CENTER + 22.5 * -unitDirection, y - 67.5, 5, 35);
};