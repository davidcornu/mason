var fs = require('fs');

module.exports = function(Less, config){
  var exports = {};

  exports.inputFileExtensions = ['.styl'];

  exports.outputFileExtension = '.css';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      config['less'].paths || (config['less'].paths = [config._mason.sourceDir]);
      config['less'].filename = filePath;

      var parser = new less.Parser(config['less']);

      parser.parse(content.toString(), function(err, tree){
        if (err) return callback(err);
        callback(null, tree.toCSS());
        delete config['less'].filename;
      });
    });
  }

  return exports;
}