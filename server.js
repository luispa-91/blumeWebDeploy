/*
 * @copyright
 * Copyright © Microsoft Open Technologies, Inc.
 *
 * All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: *www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
 * ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A
 * PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.
 *
 * See the Apache License, Version 2.0 for the specific language
 * governing permissions and limitations under the License.
 */
'use strict';

var fs = require('fs');
var adal = require('adal-node');
var express = require('express');
var rest=require('restler');
var app = express();
var port = process.env.port || 1337;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/test', function (req, res) {
  

var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions(
  {
    level : log.LOGGING_LEVEL.VERBOSE,
    log : function(level, message, error) {
      console.log(message);
      if (error) {
        console.log(error);
      }
    }
  });
}

/*
 * You can override the default account information by providing a JSON file
 * with the same parameters as the sampleParameters variable below.  Either
 * through a command line argument, 'node sample.js parameters.json', or
 * specifying in an environment variable.
 * {
 *    "tenant" : "rrandallaad1.onmicrosoft.com",
 *    "authorityHostUrl" : "https://login.windows.net",
 *    "clientId" : "624ac9bd-4c1c-4687-aec8-b56a8991cfb3",
 *    "clientSecret" : "verySecret=""
 * }
 */
var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE'];

var sampleParameters;
if (parametersFile) {
  var jsonFile = fs.readFileSync(parametersFile);
  if (jsonFile) {
    sampleParameters = JSON.parse(jsonFile);
  } else {
    console.log('File not found, falling back to defaults: ' + parametersFile);
  }
}

if (!parametersFile) {
  sampleParameters = {
    tenant : 'luispardophotmail.onmicrosoft.com',
    authorityHostUrl : 'https://login.microsoftonline.com',
    clientId : '3e44b5a3-68e2-4fd5-8060-07733adb75fc',
    clientSecret : 'Ys2Q5zG9wy5LXi7CfJipikFi1NMBw1TmcsxQ2QRtSN8='
  };
}

var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;

var resource = 'https://management.azure.com/';

turnOnLogging();

var context = new AuthenticationContext(authorityUrl);

var authHeader, requestURL;

context.acquireTokenWithClientCredentials(resource, sampleParameters.clientId, sampleParameters.clientSecret, function(err, tokenResponse) {
  if (err) {
    console.log('well that didn\'t work: ' + err.stack);
  } else {

    authHeader = tokenResponse['accessToken'];

    requestURL="https://management.azure.com/subscriptions/c89d04e7-07a8-4485-85a0-9a5e3881d300/resources?api-version=2015-01-01";
    rest.get(requestURL, {accessToken:authHeader}).on('complete',function(result) {
      res.send(result.value[0].name);
    });

    //res.send(tokenResponse.accessToken);
    //console.log(tokenResponse);
  }
});

  
});

app.listen(port, function () {
  console.log('Example app!');
});

