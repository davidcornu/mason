# Mason

A lightweight asset management middleware for Node.js.

Mason does not depend on any of its supported libraries. Instead, these are
loaded from your application if they are detected, leaving you to decide what
formats you wish to support.

The default behaviour is to serve files from the `./assets` directory when
requested with their target filename:

`./assets/sidebar.coffee` &rarr; `http://127.0.0.1:3000/sidebar.js`

`./assets/stylesheets/footer.styl` &rarr; `http://127.0.0.1:3000/stylesheets/footer.css`

In the case of templating libraries, they are compiled and wrapped into a
global `window.JST` object, and served under a `.js` file extension.

`./assets/templates/comment.eco` &rarr; `http://127.0.0.1:3000/templates/comment.js`

They can then be accessed by passing their relative path to `JST`.

```javascript
var templateVariables = { name: 'Bob' };
var html = JST['templates/comment'](templateVariables);
```

**Warning**

Mason is an extremely young project and should be treated as such. Bug reports
feature requests and contributions are most welcome.

## Usage

```javascript
var path  = require('path');
var mason = require('mason');

mason.configure({
  sourceDir: path.join(__dirname, 'assets'), // [./assets]
  targetDir: path.join(__dirname, 'public'), // [./public]
  saveFiles: true // [true]
});

mason.configure('coffee-script', { noWrap: true }); // Customize compiler options

app.use(mason.middleware(module));
```

Passing `module` to `mason.middleware` is what allows Mason to load dependencies
from your application's context instead of its own.

Setting `saveFiles` to true causes Mason to write the output of source files to the
target directory when they are accessed. This allows you to have a continuously up
to date version of your compiled assets availble.

## Supported Libraries

**Complete**

- [CoffeeScript](https://github.com/jashkenas/coffee-script) - `.coffee`
- [Less](https://github.com/cloudhead/less.js) - `.less`
- [Stylus](https://github.com/LearnBoost/stylus) - `.styl`
- [Eco](https://github.com/sstephenson/eco) - `.eco`
- [EJS](https://github.com/visionmedia/ejs) - `.ejs`
- [Hogan](https://github.com/twitter/hogan.js) - `.mustache`
- [Handlebars](https://github.com/wycats/handlebars.js/) - `.handlebars`

**Planned** (descending priority)

- [UglifyJS](https://github.com/mishoo/UglifyJS)
- [Haml Coffee](https://github.com/netzpirat/haml-coffee)
- [Iced CoffeeScript](https://github.com/maxtaco/coffee-script/)
- [Coco](https://github.com/satyr/coco)
- [Pure](https://github.com/pure/pure)
- [doT](https://github.com/olado/doT)
- [CoffeeKup](https://github.com/mauricemach/coffeekup)

## TODO

- Simple directives (`//= require 'jquery.min.js'`)
- Caching based on last-modified for when `saveFiles` is set to true.
  - Cache hit: Call `next()` and let static middleware serve the file
  - Cache miss: Compile, serve and save the file, update cache.