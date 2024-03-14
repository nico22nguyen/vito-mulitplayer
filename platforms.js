// initializes platforms array
var populatePlatforms = function populatePlatforms() {
  for (var i = 0; i < NUM_PLATFORMS; i++) {
    var _platforms;
    // use root to space platforms further horizontally as the height increases
    var nthRoot = 1 + Math.floor(i / PLATFORMS_PER_LEVEL);

    // platforms 45 and above use the max spacing, otherwise weight a random number using the root
    var weightedRandom = i < 45 ? Math.pow(Math.random(), 1 / nthRoot) : 1;

    // soften maximum for lower levels, it's hard to make the max spacing jump
    var max_spacing = i < 30 ? MAX_PLATFORM_SPACING_X - MAX_PLATFORM_SPACING_X_SOFTENER : MAX_PLATFORM_SPACING_X;

    // previous platform's x position, or 0 if this is the first platform
    var previousPlatformX = ((_platforms = platforms[i - 1]) === null || _platforms === void 0 ? void 0 : _platforms.x) || 0;

    // generate the offset from the previous platform we'll use to position this platform. Also make sure the final offset is at least the minimum spacing
    var offset = Math.max(Math.round(weightedRandom * max_spacing), MIN_PLATFORM_SPACING_X);

    // determine whether to position this platform to the left or right of the previous platform
    if (Math.random() > 0.5) offset *= -1;

    // calculate the platform's x position
    var unsafePlatformX = previousPlatformX + offset;

    // if the platform would intersect the wall, position it in the opposite direction
    var safePlatformX = unsafePlatformX;
    if (unsafePlatformX < -OUT_OF_BOUNDS + WALL_THICKNESS) safePlatformX = previousPlatformX - offset;else if (unsafePlatformX + PLATFORM_WIDTH > OUT_OF_BOUNDS) safePlatformX = previousPlatformX - offset;

    // add the platform to the array
    platforms[i] = {
      x: safePlatformX,
      y: i * PLATFORM_SPACING_Y + PLATFORM_START_Y
    };
  }
};
var xAlignsWithPlatform = function xAlignsWithPlatform(x, platform) {
  if (!platform) return false;
  return x > platform.x - SHOE_WIDTH && x < platform.x + PLATFORM_WIDTH + SHOE_WIDTH;
};

// returns intersecting platform or null if no platform is found
var platformCheck = function platformCheck(xPosition, yPosition) {
  if (yPosition <= 0) return {
    x: undefined,
    y: 0
  };
  return find(platforms, function (platform) {
    return yPosition <= platform.y && yPosition >= platform.y - 5 && xAlignsWithPlatform(xPosition, platform);
  });
};

// gets "next" platform, assuming player is falling
var getNextPlatform = function getNextPlatform(yPosition) {
  var correctedY = yPosition - PLATFORM_START_Y;
  if (correctedY <= 0) return {
    x: undefined,
    y: 0
  };
  var platformIndex = Math.floor(correctedY / PLATFORM_SPACING_Y);
  if (platformIndex >= NUM_PLATFORMS) return null;
  return platforms[platformIndex];
};