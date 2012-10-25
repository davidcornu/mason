var path = require('path');
var fs   = require('fs');

module.exports = function(Eco, config){
  var exports = {};

  exports.inputFileExtensions = ['.eco'];

  exports.outputFileExtension = '.js';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      var output;
      var template = [
        'window.JST || (window.JST = {});',
        'JST["' + path.relative(config.sourceDir, filePath) + '"] = '
      ].join('\n');

      try {
        output = Eco.precompile(content.toString());
      } catch (e) { callback(e); }

      callback(null, template + output);
    });
  }

  return exports;
}