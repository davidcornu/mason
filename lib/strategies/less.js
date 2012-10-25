var fs = require('fs');

module.exports = function(Less, config){
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

      var parser = new less.Parser(compilerOptions);

      parser.parse(content.toString(), function(err, tree){
        if (err) return callback(err);
        callback(null, tree.toCSS());
      });
    });
  }

  return exports;
}