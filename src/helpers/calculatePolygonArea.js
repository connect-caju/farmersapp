

// calculate the area from the latitude and longitude points
// @params: points (an area of objects where properties are lat and lng)
export const calculatePolygonArea = (points)=>{
// -15.114660593965437, 39.26315221365944
// -15.128746573500143, 39.2830649339801
// -15.124427913005626, 39.25660753673366


// -15.124821486435781, 39.25775552219747
// -15.125981488052844, 39.258458260980504
// -15.125846845334083, 39.256655816468715
 // points = [
 //  {lat: 39.25775552219747, lng: -15.124821486435781},
 //  {lat: 39.258458260980504, lng: -15.125981488052844},
 //  {lat: 39.256655816468715, lng: -15.125846845334083},
 //  // {latitude: 37.76825, longitude: -122.4324},
 // ];

 // console.log('points: ', JSON.stringify(points))

 // make sure the array has at least 3 points
 // if (points.length < 3) {
 //  return 0;
 // }
 
 const earthRadiusKm = 6371; // Radius of the earth in kilometers
 let totalDistance = 0;

 // convert latitude and longitude points from degrees to radians
 // const radiansArray = points.map((point)=>{
 //  return {
 //   lat: point.lat * (Math.PI / 180),
 //   lng: point.lng * (Math.PI / 180),
 //  };
 // });

 // calculate the area using the shoelece formula
 for (let i = 0; i < points.length - 1; i++) {
  const p1 = points[i];
  const p2 = points[i + 1];
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;
  totalDistance += distance;
  // area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));
 }

 let area = 0;
 for (let i = 0; i < points.length; i++){
  const p1 = points[i];
  const p2 = i === points.length - 1 ? points[0] : points[i + 1];
  area += (p1.lng * p2.lat - p2.lng * p1.lat);
 }

 area = (0.5 * Math.abs(area) * totalDistance) * 100; //100 times the area to convert it from square km to hectares
 // console.log('area in square km:', area);
 return area;

 // Add the area for the last point and the first point
 // const p1 = radiansArray[radiansArray.length - 1];
 // const p2 = radiansArray[0];
 // area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));

 //  divide the result by 2 and the earth's radius to get the area in square kilometers
 // area = Math.abs(area * earthRadiusKm * earthRadiusKm / 2);

 // convert the square kilometers to hectares and return the final result
 // return Number(area * 100);

}