export function getHueFromHex(hex) 
{
  // 1. Convert HEX to RGB
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  // 2. Find min and max values to determine the range
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;
  let h = 0;

  // 3. Calculate Hue based on which channel is max
  if (delta === 0) {
    h = 0; // Achromatic (gray)
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60); // Convert to degrees
  if (h < 0) h += 360;    // Ensure positive value

  return h;
}