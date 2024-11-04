export function getCurrentPosition() {
  let position;
  navigator.geolocation.getCurrentPosition((pos) => {
    position = pos;
  });
  return position;
}
