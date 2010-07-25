#!/usr/bin/env node

var stdin = process.openStdin(), sys = require('sys'), cli;

utils = {
  slice: function (arr, start, opt_end) {
    if (arguments.length <= 2) {
      return Array.prototype.slice.call(arr, start);
    } else {
      return Array.prototype.slice.call(arr, start, opt_end);
    }
  }
}

cli = {
  prompt: 'noding! ~ ',
  msgHeader: 'node ... ',
  
  inspect: function(thingy) {
    sys.debug(sys.inspect(thingy));
  },
  
  info: function() {
    if (arguments.length == 0) {
      return this.msgHeader;
    }
    var text = [];
    text.push('\n')
    text.push(this.msgHeader);
    text.push(utils.slice(arguments, 0));
    text.push('\n');
    return text.join('');
  },
  
  run: function() {
    stdin.setEncoding('utf8');
    process.stdout.write('noding ... loading ...\n');
    process.stdout.write(cli.prompt);
    
    stdin.addListener('data', function (chunk) {
      if (chunk == 'quit') {
        stdin.end();
      }
      process.stdout.write(chunk);
      process.stdout.write(cli.prompt);
    });

    stdin.addListener('end', function () {
      process.stdout.write(cli.info('end'));
    });
  }
  
};

cli.run();