var path = require('path');
var fs   = require('fs');

module.exports = function(Eco, config){
  var exports = {};

  exports.inputFileExtensions = ['.eco'];

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
        template = Eco.precompile(content.toString());
      } catch (e) { callback(e); }

      callback(null, wrapper + template);
    });
  }

  return exports;
}