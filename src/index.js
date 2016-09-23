(function() {
  'use strict';

  var request = require('request');

  var fitbitUri = 'www.fitbit.com';
  var oauthClientId = '228229';
  var clientSecret = 'd10afb06b974386896267a634ec30152';
  // var redirectUri = 'http://localhost:8888/Apps/fitbit-playground/index.html';
  var redirectUri = 'http://localhost:8888/fitbit-playground/index.html';

  function App() {
    checkQueryString();
  };

  function checkQueryString() {
    var accessToken = getQueryVariable('access_token');
    var userId = getQueryVariable('user_id');
    var scope = getQueryVariable('scope');
    var tokenType = getQueryVariable('token_type');
    var expiresIn = getQueryVariable('expires_in');
    var authed = accessToken && userId;
    console.log(accessToken);
    console.log(userId);

    if (authed) {
      setSleepGoal({
        accessToken,
        userId,
        scope
      });
    } else {
      authoriseUser();
    }
  };

  function authoriseUser() {
    // https://dev.fitbit.com/apps/oauthinteractivetutorial
    window.open('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=228229&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Ffitbit-playground%2Findex.html&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800');
  };

  function getUserDetails(data) {
    var options = {
      uri: 'https://api.fitbit.com/1/user/-/profile.json',
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data);
      } else {
        console.log('error ', error);
      }
    });
  };

  function getHeartRateData(data) {
    var options = {
      uri: 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data);
      } else {
        console.log('error ', error);
      }
    });
  };

  function getSleepData(data) {
    var options = {
      uri: 'https://api.fitbit.com/1/user/-/sleep/date/2016-09-23.json',
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data);
      } else {
        console.log('error ', error);
      }
    });
  };

  function setSleepGoal(data) {
    var options = {
      method: 'POST',
      uri: 'https://api.fitbit.com/1/user/-/sleep/goal.json',
      form: {
        minDuration: '180'
      },
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        'WWW-Authenticate': 'Basic realm="api.fitbit.com"'
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data);
      } else {
        console.log('error ', error);
      }
    });
  };

  function getQueryVariable(variable) {
    var params = window.location.hash.substr(1);
    var vars = params.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  };

  var app = new App();
})();


// browserify src/index.js -o src/bundle.js -d
