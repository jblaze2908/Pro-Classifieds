const titleCase = (str) => {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
};
const addDaysToDate = (ogDate, daysToAdd) => {
  let og_date = new Date(ogDate);
  og_date.setDate(og_date.getDate() + daysToAdd);
  return og_date;
};
const checkIfFeatured = (listing) => {
  let featured = false;
  if (listing.isFeatured) {
    let dateTillFeatured = new Date(listing.featuredTillDate);
    if (dateTillFeatured.getTime() > new Date().getTime()) {
      featured = true;
    }
  }
  return featured;
};
export { titleCase, addDaysToDate, checkIfFeatured };
