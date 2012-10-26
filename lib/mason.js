var mkdirp = require('mkdirp');
var async  = require('async');
var path   = require('path');
var url    = require('url');
var fs     = require('fs');

var supportedModules = fs.readdirSync(path.join(__dirname, 'strategies'))
  .filter(function(f){ return f.split('')[0] != '.'; })
  .map(function(f){ return f.replace('.js', ''); });

var config = { _mason: {}, saveFiles: true };
supportedModules.forEach(function(m){ config[m] = {}; });

function configure(){
  var args = Array.prototype.slice.call(arguments);
  if (args.length == 0 || args.length > 2) throw new Error('Wrong number of arguments');

  var target, options;

  if (args.length == 2) {
    target  = args[0];
    options = args[1];
  } else {
    target  = '_mason';
    options = args[0];
  }

  if (!config[target]) throw new Error(target + ' is not supported');

  options.forEach(function(value, key){ config[target][key] = value; });
}

exports.configure = configure;

exports.middleware = function(context){

  if (!(context && context.constructor.name == 'Module')) throw new Error('Module must be passed to middleware function');

  var contextDir = path.dirname(context.filename);

  config._mason.sourceDir || (config._mason.sourceDir = path.join(contextDir, 'assets'));
  config._mason.targetDir || (config._mason.targetDir = path.join(contextDir, 'public'));

  if (!fs.existsSync(config._mason.sourceDir)) throw new Error('sourceDir does not exist');
  if (!fs.existsSync(config._mason.targetDir)) throw new Error('targetDir does not exist');

  var loadedModules = {};
  var strategies    = {};
  var conversions   = {};

  supportedModules.forEach(function(m){
    try { loadedModules[m] = context.require(m); } catch (e) {}
  });

  Object.keys(loadedModules).forEach(function(k){
    var strategyPath = path.join(__dirname, 'strategies', k);
    var strategy = require(strategyPath)(loadedModules[k], config);

    strategy.inputFileExtensions.forEach(function(e){ strategies[e] = strategy; });

    var ofe = strategy.outputFileExtension;
    conversions[ofe] || (conversions[ofe] = []);
    Array.prototype.push.apply(conversions[ofe], strategy.inputFileExtensions);
  });

  return function(req, res, next){
    var pathname      = url.parse(req.url).pathname;
    var fileExtension = path.extname(pathname);
    if(!conversions[fileExtension]) return next();

    async.map(conversions[fileExtension], function(e, callback){
      var filePath = path.join.apply(this, [
        sourceDir,
        path.dirname(pathname),
        path.basename(pathname, fileExtension) + e
      ]);
      fs.exists(filePath, function(exists){
        callback(null, exists ? filePath : null);
      });
    }, function(err, files){
      if (err) return next(err);

      var validFiles = files.filter(function(f){ return !!f; });
      if (validFiles.length == 0) return next();
      if (validFiles.length > 1) return next(new Error('Multiple matches found for ' + pathname));

      var targetFile  = validFiles[0];
      var sourceExtension = path.extname(targetFile);
      strategies[sourceExtension].process(targetFile, function(err, output){
        if (err) return next(err);
        res.setHeader('Content-Type', mimeType(fileExtension));
        res.end(output);
        if (config._mason.saveFiles) updateFile(path.join(targetDir, pathname), output);
      });
    });
  }
}

function mimeType(fileExtension) {
  if (fileExtension == '.js')  return 'application/javascript';
  if (fileExtension == '.css') return 'text/css';
  return 'text/plain';
}

function updateFile(fileName, content) {
  async.waterfall([
    function(done){ setTimeout(done, 0); },
    function(done){ mkdirp(path.dirname(fileName), done); },
    function(done){ fs.writeFile(fileName, content, 'utf-8', done); },
  ], function(err){ if (err) return console.error(err); });
}