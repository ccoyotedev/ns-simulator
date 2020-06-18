function calculateXYDisplacement(theta, hyp) {
  let dx = hyp * Math.cos(theta);
  let dy = hyp * Math.sin(theta);
  return {dx: dx, dy: dy};
}

function calculateDistance(x1, y1, x2, y2) {
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
}