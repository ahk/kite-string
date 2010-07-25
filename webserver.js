var http = require('http'), 
  sys = require('sys');

// Start an HTTP server
http.createServer(function (request, response) {

    // Every request gets the same "Hello Connect" response.
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Connect");

}).listen(8081);
sys.puts('Janglin scripts at http://127.0.0.1:8081/');