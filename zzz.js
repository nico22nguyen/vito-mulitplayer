function updateOtherVito(x, y, direction) {
    otherVito.forceState(x, y, direction)
}
function getVitoX() {
    return vito.x
}
function getVitoY() {
    return vito.y
}
function getVitoDirection() {
    return vito.direction
}
function getPlatforms() {
    return JSON.stringify(platforms)
}
function setPlatforms(_platforms) {
    platforms = JSON.parse(_platforms)
}