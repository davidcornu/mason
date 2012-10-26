var path = require('path');
var fs   = require('fs');

module.exports = function(Handlebars, config){
  var exports = {};

  exports.inputFileExtensions = ['.handlebars'];

  exports.outputFileExtension = '.js';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      var template;
      var wrapper = [
        'window.JST || (window.JST = {});',
        'JST["' + path.relative(config._mason.sourceDir, filePath) + '"] = '
      ].join('\n');

      try {
        template = Handlebars.compile(content.toString());
      } catch (e) { callback(e); }

      callback(null, wrapper + template);
    });
  }

  return exports;
}