// Import the google play scraper variable
var gplay = require('google-play-scraper');
// Import JS File System variable
var fs = require('fs');

// Code to retrive top 5 Free Apps (I'm using 5 files just as an example. This is 
// because I didn't tweak the query with delays, which we'll have to do when we 
// send Google requests for thousands of apps.

// This promise returns a reply that the scraper receives from Google Play Store
// and handles the the scraping flow

var index = 0;

var promise = gplay.list({
  collection: gplay.collection.TOP_FREE,
  num: 120,
  start: index,
  throttle: 1
})
  .then(data => writeListToFile(data))
  .then(data => fetchDetails(data))
  .then(data => fetchReviews(data));

// This method writes the list of top 5 apps that we got as a reply, and saves it as a JSON dump.
// (later we can dump all this data into SQL database, or just keep it in JSON format as 
// it might be easier to play with, but for testing purposes I think a JSON suffices)
function writeListToFile(data) {
  var file = "/home/asim2056/CS216-Project/json/topPaidApps.json";
  // Write the list of top 20 Free Apps in a file
  fs.writeFile(file, JSON.stringify(data, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Top 10000 free apps data written to ' + file + ' successfully');
    }
  });
  return data;
};

// Code to retrive more detailed information about the above 5 apps that we just scraped 

// For each app that we got from the above query, this function fetches more detailed information
// about the app and writes it into a corresponding json file.

function fetchDetails(appList) {
  appList.forEach(function (appObj) {
    console.log(appObj.appId);
    var id = appObj.appId;
    var detailedAppObj;
    var pr = gplay.app({
      appId: id,
      throttle: 1
    }).then(data => writeDataToFile(data));
  });
  return appList;
}

// This function fetches the first two pages of reviews for each app that we scraped, 
// and writes that data into a JSON file.

function fetchReviews(appList) {
  appList.forEach(function (app) {
    var id = app.appId;
    var commentList;
    var pr = gplay.reviews({
      appId: id,
      page: 2,
      sort: gplay.sort.RATING,
      throttle: 1,
    }).then(data => writeReviewsToFile(data, id));
  });
  index = index+120;
}



function writeDataToFile(obj) {
  //console.log(obj)
  //write the app's description to a file
  var id = obj.appId;
  var file = "/home/asim2056/CS216-Project/json/DETAILS-"+id+".json";
  fs.writeFile(file, JSON.stringify(obj, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Description for app ' + id + ' saved in file ' + file);
    }
  });
};

// This function gets the first 2 pages of 

function writeReviewsToFile(reviews, appId) {
  console.log(reviews);
  var file = "/home/asim2056/CS216-Project/json/REVIEWS-"+appId+".json";
  fs.writeFile(file, JSON.stringify(reviews, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Reviews for app ' + appId + ' saved in file ' + file);
    }
  });
};
