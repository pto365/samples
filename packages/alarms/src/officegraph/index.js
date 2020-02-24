var request = require("request");

var auth = {};

var config = {
  tokenEndpoint: "https://login.microsoftonline.com/common/oauth2/token"
};

auth.getAccessToken = function() {
  if (window) {
    throw "Not valid client side";
  }
  return new Promise((resolve, reject) => {
    var requestParams = {
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      resource: "https://graph.microsoft.com"
    };

    request.post(
      {
        url: config.tokenEndpoint,
        form: requestParams
      },
      function(err, response, body) {
        var parsedBody = JSON.parse(body);

        if (err) {
          reject(err);
        } else if (parsedBody.error) {
          reject(parsedBody.error_description);
        } else {
          resolve(parsedBody.access_token);
        }
      }
    );
  });
};

function post2(token, url, body, cb) {
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    },
    function(err, response, body) {
      var parsedBody;

      if (err) {
        return cb(err);
      } else {
        parsedBody = body === "" ? {} : JSON.parse(body);
        if (parsedBody.error) {
          return cb(parsedBody.error);
        } else {
          cb(null, parsedBody);
        }
      }
    }
  );
}

function post(token, url, body, cb) {
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token
      },
      body: JSON.stringify(body)
    },
    function(err, response, body) {
      var parsedBody;

      if (err) {
        return cb(err);
      } else {
        parsedBody = body === "" ? {} : JSON.parse(body);
        if (parsedBody.error) {
          return cb(parsedBody.error);
        } else {
          cb(null, parsedBody);
        }
      }
    }
  );
}
function patch(token, url, body, cb) {
  request.patch(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token
      },
      body: JSON.stringify(body)
    },
    function(err, response, body) {
      var parsedBody;

      if (err) {
        return cb(err);
      } else {
        parsedBody = body === "" ? {} : JSON.parse(body);
        if (parsedBody.error) {
          return cb(parsedBody.error);
        } else {
          cb(null, parsedBody);
        }
      }
    }
  );
}

function get(token, url, cb, appendTo, index, retrycount) {
  console.log("getting", url, appendTo === true);
  request.get(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token
      }
    },
    function(err, response, body) {
      var parsedBody;

      if (err) {
        var errCounter = retrycount ? retrycount + 1 : 1;
        if (errCounter > 3) {
          return cb(err, null, index);
        } else {
          // retry
          console.log("retry #", errCounter);
          return get(token, url, cb, appendTo, index, errCounter);
        }
      }

      parsedBody = JSON.parse(body);
      if (parsedBody.error) {
        return cb(parsedBody.error, null, index);
      }

      if (parsedBody["@odata.nextLink"]) {
        var data;
        if (!appendTo) {
          data = parsedBody.value;
        } else {
          data = appendTo.concat(parsedBody.value);
        }

        return get(token, parsedBody["@odata.nextLink"], cb, data, index);
      }

      if (appendTo) {
        cb(null, appendTo.concat(parsedBody.value), index);
      } else {
        if (parsedBody.value) {
          cb(null, parsedBody.value, index);
        } else {
          cb(null, parsedBody, index);
        }
      }
    }
  );
}

module.exports.getRaw = (token, url) => {
  console.log("getting", url);

  return new Promise((resolve, reject) => {
    request.get(
      {
        url: url,
        headers: {
          authorization: "Bearer " + token
        }
      },
      function(err, response, body) {
        if (err) {
          return resolve({ hasError: true, error: err });
        }
        resolve({ hasError: false, result: body });
      }
    );
  });
};

module.exports.get = (token, url) => {
  return new Promise((resolve, reject) => {
    get(token, url, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
module.exports.post = (token, url, payload) => {
  return new Promise((resolve, reject) => {
    post(token, url, payload, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
module.exports.patch = (token, url, payload) => {
  return new Promise((resolve, reject) => {
    patch(token, url, payload, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports.auth = auth;
