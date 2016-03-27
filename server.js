var adal = require('adal-node').AuthenticationContext;

var authorityHostUrl = 'https://login.windows.net';
var tenant = 'myTenant';
var authorityUrl = authorityHostUrl + '/' + tenant;
var clientId = 'yourClientIdHere';
var clientSecret = 'yourAADIssuedClientSecretHere'
var resource = '00000002-0000-0000-c000-000000000000';
 
var context = new AuthenticationContext(authorityUrl);
 
context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function(err, tokenResponse) {
  if (err) {
    console.log('well that didn\'t work: ' + err.stack);
  } else {
    console.log(tokenResponse);
  }
});