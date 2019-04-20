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
var rest = require('restler');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.port || 1337;

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
}

app.use("/app", express.static(__dirname + '/app'));
app.use("/templates", express.static(__dirname + '/templates'));

app.listen(port, function () {

  console.log('Check out my Node App');

});

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname } );
});

app.post('/deploy', function (req, res) {
  var body = {
    "properties": {
      "mode": "Incremental",
      "template": {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
          "siteName": {
            "type": "string",
            "metadata": {
              "description": "The name of the web app that you wish to create."
            }
          },
          "hostingPlanName": {
            "type": "string",
            "metadata": {
              "description": "The name of the App Service plan to use for hosting the web app."
            }
          },
          "sku": {
            "type": "string",
            "allowedValues": [
              "F1",
              "D1",
              "B1",
              "B2",
              "B3",
              "S1",
              "S2",
              "S3",
              "P1",
              "P2",
              "P3",
              "P4"
            ],
            "defaultValue": "S1",
            "metadata": {
              "description": "The pricing tier for the hosting plan."
            }
          },
          "workerSize": {
            "type": "string",
            "allowedValues": [
              "0",
              "1",
              "2"
            ],
            "defaultValue": "0",
            "metadata": {
              "description": "The instance size of the hosting plan (small, medium, or large)."
            }
          },
          "repoURL": {
            "type": "string",
            "defaultValue": "https://github.com/luispa-91/Blume-Material-v3.git",
            "metadata": {
              "description": "The URL for the GitHub repository that contains the project to deploy."
            }
          },
          "branch": {
            "type": "string",
            "defaultValue": "master",
            "metadata": {
              "description": "The branch of the GitHub repository to use."
            }
          },
          "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
              "description": "Location for all resources."
            }
          }
        },
        "resources": [
          {
            "apiVersion": "2015-08-01",
            "name": "[parameters('hostingPlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "location": "[parameters('location')]",
            "sku": {
              "name": "[parameters('sku')]",
              "capacity": "[parameters('workerSize')]"
            },
            "properties": {
              "name": "[parameters('hostingPlanName')]"
            }
          },
          {
            "apiVersion": "2015-08-01",
            "name": "[parameters('siteName')]",
            "type": "Microsoft.Web/sites",
            "location": "[parameters('location')]",
            "dependsOn": [
              "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
            ],
            "properties": {
              "serverFarmId": "[parameters('hostingPlanName')]"
            },
            "resources": [
              {
                "apiVersion": "2015-08-01",
                "name": "web",
                "type": "sourcecontrols",
                "dependsOn": [
                  "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
                ],
                "properties": {
                  "RepoUrl": "[parameters('repoURL')]",
                  "branch": "[parameters('branch')]",
                  "IsManualIntegration": true
                }
              }
            ]
          }
        ]
      },
      "parameters": {
        "siteName": {
          "value": req.body.siteName
        },
        "hostingPlanName": {
          "value": "Default2"
        }
      }
    } 
  }
  
  deployWebsite(body);

});

app.get('/test', function (req, res) {
  
});

function deployWebsite(body){
  var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions(
  {
    level : log.LOGGING_LEVEL.VERBOSE,
    log : function(level, message, error) {
      console.log('logging message');
      console.log(message);
      if (error) {
        console.log('logging error');
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
// var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE'];

var sampleParameters;
// if (parametersFile) {
//   var jsonFile = fs.readFileSync(parametersFile);
//   if (jsonFile) {
//     sampleParameters = JSON.parse(jsonFile);
//   } else {
//     console.log('File not found, falling back to defaults: ' + parametersFile);
//   }
// }

//if (!parametersFile) {
  sampleParameters = {
    tenant : 'luispardophotmail.onmicrosoft.com',
    authorityHostUrl : 'https://login.microsoftonline.com',
    clientId : '3e44b5a3-68e2-4fd5-8060-07733adb75fc',
    clientSecret : '509xtK6xuVuit70uzlyJEQMfy3y/8NHLW+b49hquwmo='
  };
//}

var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;

var resource = 'https://management.azure.com/';

turnOnLogging();

var context = new AuthenticationContext(authorityUrl);

var authHeader, requestURL;

//Retrieve ARM template JSON for a basic website
var jsonObj = require("./templates/basicWebsite.json");

context.acquireTokenWithClientCredentials(resource, sampleParameters.clientId, sampleParameters.clientSecret, function(err, tokenResponse) {
  if (err) {
    console.log('well that didn\'t work: ' + err.stack);
  } else {

    authHeader = tokenResponse['accessToken'];

    requestURL="https://management.azure.com/subscriptions/c89d04e7-07a8-4485-85a0-9a5e3881d300/resourcegroups/Default-Web-WestUS/providers/Microsoft.Resources/deployments/"+ body.properties.parameters.siteName.value +"?api-version=2015-01-01";
    rest.putJson(requestURL,body, {accessToken:authHeader}).on('complete',function(result) {
      console.log('logging result of requestURL');
      console.log(result);
    });
    
  }
});
}



