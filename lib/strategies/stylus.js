var fs = require('fs');

module.exports = function(Stylus, config){
  var exports = {};

  exports.inputFileExtensions = ['.styl'];

  exports.outputFileExtension = '.css';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      var compilerOptions = {
        filename: filePath,
        paths: [config.sourceDir]
      };

      Stylus.render(content.toString(), compilerOptions, function(err, output){
        if (err) return callback(err);
        callback(null, output);
      });
    });
  }

  return exports;
}