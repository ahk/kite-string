#!/usr/bin/env node
// Simple DNode chat server example.
// Just as simple as plain socket.io since it's a simple problem.

var DNode = require('dnode');
var fs = require('fs');
var http = require('http');
var sys = require('sys');

// load the files to serve up into memory
var html = fs.readFileSync(__dirname + '/chat.html');
var css = fs.readFileSync(__dirname + '/chat.css');
var js = require('dnode/web').source();

// simple http server to serve pages and for socket.io transport
var httpServer = http.createServer(function (req,res) {
    if (req.url == '/dnode.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(js);
    }
    else if (req.url == '/chat.css') {
        res.writeHead(200, { 'Content-Type' : 'text/css' });
        res.end(css);
    }
    else {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(html);
    }
});
httpServer.listen(6061);

// share the chat server routines with remote clients
var names = [];
var transports = [];
function ChatServer (client, con) {
    function xbroadcast(cmd, name, msg) {
      for(var i = 0; i < transports.length; i++) {
         transports[i].broadcast(cmd, name, msg);
       }
    }
    
    transports.push(con);
    var name = '?';
    
    con.addListener('ready', function () {
        client.name(function (who) {          
            con.broadcast('joined', who);
            name = who;
            names.push(name);
            con.broadcast('refreshNames', names);
        });
    });
    
    con.addListener('disconnect', function () {
        con.broadcast('parted', name);
        var i = names.indexOf(name);
        if (i >= 0) names.splice(i,1);
    });
    
    this.chat = function (msg) {
      xbroadcast('said', name, msg);
    };
    
    this.names = function (f) { f(names) };
}

DNode(ChatServer)
  .listen(6060)
  .listen({
    protocol : 'socket.io',
    server : httpServer,
    transports : 'websocket xhr-multipart xhr-polling htmlfile'
        .split(/\s+/),
});
