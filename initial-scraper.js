// Import the google play scraper variable
var gplay = require('google-play-scraper');
// Import JS File System variable
var fs = require('fs');


// Code to retrive top 5 Free Apps (5 just as an example, because I didn't tweak the query
// with delays, but we can get data for thousands of apps)

// A list of top 5 free apps

// This promise returns a reply that the scraper receives from Google Play Store
var promise = gplay.list({
  collection: gplay.collection.TOP_FREE,
  num: 5
})
.then(data => writeListToFile(data))
.then(data => fetchDetails(data))
.then(data => fetchReviews(data));


// Name of the file where we will save the JSON (we dump all this data into SQL database later,
// but for testing purposes I think a JSON file suffices)
function writeListToFile(data) {
  var top5FreeAppsFile = "C:\\Users\\Asim Hasan\\workspace\\CS216\\project\\top5free.json";

  // Write the list of top 20 Free Apps in a file
  fs.writeFile(top5FreeAppsFile, JSON.stringify(data, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Top 5 free apps data written to ' + top5FreeAppsFile + ' successfully');
    }
  });
  return data;
};



// Code to retrive more detailed information about the above 5 apps that we just scraped

// For each app that we got from the above query, run this function which will write
// its corresponding detailed info into a json file.

function writeDataToFile(obj) {
  console.log(obj)
  //write the app's description to a file
  var id = obj.appId;
  var file = "C:\\Users\\Asim Hasan\\workspace\\CS216\\project\\json\\DETAILS-"+id+".json";
  fs.writeFile(file, JSON.stringify(obj, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Description for app ' + id + ' saved in file ' + file);
    }
  });
};

function writeReviewsToFile(reviews, appId) {
  console.log(reviews);
  var file = "C:\\Users\\Asim Hasan\\workspace\\CS216\\project\\json\\REVIEWS-"+appId+".json";
  fs.writeFile(file, JSON.stringify(reviews, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Reviews for app ' + appId + ' saved in file ' + file);
    }
  });
  process.exit(0);
};

function fetchDetails(appList) {
  appList.forEach(function (appObj) {
    console.log(appObj.appId);
    var id = appObj.appId;
    var detailedAppObj;
    var pr = gplay.app({
      appId: id,
      throttle: 5
    }).then(data => writeDataToFile(data));
  });
  return appList;
}



// Code to get the first 2 pages of comments for each app and write it to a file
function fetchReviews(appList) {
  appList.forEach(function (app) {
    var id = app.appId;
    var commentList;
    var pr = gplay.reviews({
      appId: id,
      page: 2,
      sort: gplay.sort.RATING,
      throttle: 2,
    }).then(data => writeReviewsToFile(data, id));
  });
}
