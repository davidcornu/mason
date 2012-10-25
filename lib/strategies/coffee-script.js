var fs = require('fs');

module.exports = function(CoffeeScript, config){
  var exports = {};

  exports.inputFileExtensions = ['.coffee'];

  exports.outputFileExtension = '.js';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      var output;
      var compilerOptions = {};

      try {
        output = CoffeeScript.compile(content.toString(), compilerOptions);
      } catch (e) { callback(e); }

      callback(null, output);
    });
  }

  return exports;
}