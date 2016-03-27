var http = require('http')
var port = process.env.PORT || 1337;

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

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Adal Node\n');
}).listen(port);