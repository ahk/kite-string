#!/usr/bin/env node

// imports
var sys = require('sys');
var DNode = require('dnode');
// local
var utils, cli;

utils = {
  
  slice: function (arr, start, opt_end) {
    if (arguments.length <= 2) {
      return Array.prototype.slice.call(arr, start);
    } else {
      return Array.prototype.slice.call(arr, start, opt_end);
    }
  }
  
};

cli = {
  
  greeting:  "Let's go fly a kite! (.quit or ctrl-D to quit)\n",
  
  prompt:    'kite-string ~ ',
  
  msgHeader: 'kiting ... ',
  
  clientName: 'andrewcmd',
  
  inspect: function(thingy) {
    sys.debug(sys.inspect(thingy));
  },
  
  info: function() {
    if (arguments.length == 0) {
      return this.msgHeader;
    }
    var text = [];
    text.push(this.msgHeader);
    text.push(utils.slice(arguments, 0));
    text.push('\n');
    return text.join('');
  },
  
  run: function() {
    var stdin = process.openStdin();
    var newLineOnExit = true;
    
    stdin.setEncoding('utf8');
    process.stdout.write(cli.greeting);
    
    DNode(function () {
        this.name = function (f) { f(cli.clientName) };
        
        this.joined = function (who) {
          process.stdout.write(cli.info('joined'));
        };
        
        this.parted = function (who) {
          process.stdout.write(cli.info('parted'));
        };
        
        this.said = function (who,msg) {
          process.stdout.write(cli.info(who + ' said: ' + msg));
        };
        
        this.refreshNames = function (names) {
          process.stdout.write(cli.info('refreshNames'));
        };
    }).connect(6060, function (remote) {
        remote.names(function (names) {
          process.stdout.write( cli.info('users: ' + names.join(' ')) );
        });
        
        process.stdout.write(cli.prompt);

        stdin.addListener('data', function (chunk) {
          if (chunk === '.quit\n') {
            newLineOnExit = false;
            process.exit();
          }
          remote.chat(chunk);
          process.stdout.write(chunk);
          process.stdout.write(cli.prompt);
        });

        stdin.addListener('end', function () {
          process.exit();
        });

        process.addListener('exit', function () {
          var msg = cli.info('has ended');
          if (newLineOnExit) msg = '\n' + msg;
          process.stdout.write(msg);
        });
    });
  }
  
};

cli.run();