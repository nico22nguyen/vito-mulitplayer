var generateClouds = function generateClouds() {
  for (i = 0; i < NUM_CLOUD_LEVELS; i++) {
    var xSpacing = Math.floor((CLOUD_SPACING_X_MAX - CLOUD_SPACING_X_MIN) * Math.random() + CLOUD_SPACING_X_MIN);
    var cloudX = Math.floor(xSpacing * (Math.random() - 0.5));
    var yVariation = Math.floor(CLOUD_LEVEL_Y_VARIATION * (Math.random() - 0.5));
    var cloudY = CLOUD_INTER_LEVEL_SPACING * i + yVariation + CLOUD_START;
    var velocity = Math.floor(CLOUD_MAX_VELOCITY * (Math.random() - 0.5)) || (Math.random() > 0.5 ? 1 : -1);

    // y variation between clouds within a cloud level
    var yVariationSchedule = [];
    var numClouds = 2 * OUT_OF_BOUNDS / xSpacing + 1;
    for (var j = 0; j < numClouds; j++) {
      yVariationSchedule.push(Math.floor(CLOUD_INTRA_LEVEL_SPACING_MAX * (Math.random() - 0.5)));
    }
    cloudLevels[i] = {
      x: cloudX,
      y: cloudY,
      xInitial: cloudX,
      xSpacing: xSpacing,
      velocity: velocity,
      yVariationSchedule: yVariationSchedule
    };
  }
};
var updateCloudPositions = function updateCloudPositions() {
  cloudLevels.forEach(function (cloud, i) {
    cloud.x += cloud.velocity;
    var displacement = Math.abs(cloud.xInitial - cloud.x);
    if (displacement >= cloud.xSpacing) {
      var offset = displacement - cloud.xSpacing;
      cloud.x = cloud.xInitial + offset;
      cloud.yVariationSchedule.unshift(cloud.yVariationSchedule.pop());
    }
  });
};