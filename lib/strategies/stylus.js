var fs = require('fs');

module.exports = function(Stylus, config){
  var exports = {};

  exports.inputFileExtensions = ['.styl'];

  exports.outputFileExtension = '.css';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      config['stylus'].paths || (config['stylus'].paths = [config._mason.sourceDir]);
      config['stylus'].filename = filePath;

      Stylus.render(content.toString(), config['stylus'], function(err, output){
        if (err) return callback(err);
        callback(null, output);
        delete config['stylus'].filename;
      });
    });
  }

  return exports;
}