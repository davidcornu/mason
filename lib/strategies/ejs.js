var path = require('path');
var fs   = require('fs');

module.exports = function(Ejs, config){
  var exports = {};

  exports.inputFileExtensions = ['.ejs'];

  exports.outputFileExtension = '.js';

  exports.process = function(filePath, callback){
    fs.readFile(filePath, function(err, content){
      if (err) return callback(err);

      var template;

      typeof config['ejs'].client == 'boolean' || (config['ejs'].client = true);
      config['ejs'].filename = filePath;

      var wrapper = [
        'window.JST || (window.JST = {});',
        'JST["' + path.relative(config._mason.sourceDir, filePath) + '"] = '
      ].join('\n');

      try {
        template = Ejs.compile(content.toString(), config['ejs']);
      } catch (e) { callback(e); }

      delete config['ejs'].filename;

      callback(null, wrapper + template);
    });
  }

  return exports;
}