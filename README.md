# AngularJS Template loader for [webpack](http://webpack.github.io/)

Based on [ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader)

Includes your AngularJS templates into your webpack Javascript Bundle.

SimpleNgTemplate loader does not minify or process your HTML at all, and instead uses the standard loaders such as [html-loader](https://github.com/webpack-contrib/html-loader)
or [raw-loader](https://github.com/webpack-contrib/raw-loader). This gives you the flexibility to pick and choose your HTML loaders.

## Install

`npm install simple-ngtemplate-loader --save-dev`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

SimpleNgTemplate loader will export the path of the HTML file, so you can use require directly AngularJS with templateUrl parameters e.g. 

``` javascript
var templateUrl = require('simple-ngtemplate-loader!html!./test.html');

app.directive('testDirective', function() {
    return {
        restrict: 'E',
        templateUrl: templateUrl
    }
});
```


To remove the extra `require`, check out the [Baggage Example](#baggage-example) below.

## Beware of requiring from the directive definition

The following code is wrong, Because it'll operate only after angular bootstraps:
```
app.directive('testDirective', function() {
    return {
        restrict: 'E',
        templateUrl: require('simple-ngtemplate-loader!html!./test.html') // <- WRONG !
    }
});
```

### `relativeTo` and `prefix`

You can set the base path of your templates using `relativeTo` and `prefix` parameters. `relativeTo` is used
to strip a matching prefix from the absolute path of the input html file. `prefix` is then appended to path.

The prefix of the path up to and including the first `relativeTo` match is stripped, e.g.

``` javascript
require('!simple-ngtemplate-loader?relativeTo=/src/!html!/test/src/test.html');
// c.put('test.html', ...)
```

To match the from the start of the absolute path prefix a '//', e.g.

``` javascript
require('!simple-ngtemplate-loader?relativeTo=//Users/WearyMonkey/project/test/!html!/test/src/test.html');
// c.put('src/test.html', ...)
```

You can combine `relativeTo` and `prefix` to replace the prefix in the absolute path, e.g.

``` javascript
require('!simple-ngtemplate-loader?relativeTo=src/&prefix=build/!html!/test/src/test.html');
// c.put('build/test.html', ...)
```

### Parameter Interpolation

`relativeTo` and `prefix` parameters are interpolated using 
[Webpack's standard interpolation rules](https://github.com/webpack/loader-utils#interpolatename).
Interpolation regular expressions can be passed using the extra parameters `relativeToRegExp` 
and `prefixRegExp` which apply to single parameters, or `regExp` which will apply to all three parameters. 


### Path Separators (Or using on Windows)

 By default, SimpleNgTemplate loader will assume you are using unix style path separators '/' for html paths in your project.
 e.g. `templateUrl: '/views/app.html'`. If however you want to use Window's style path separators '\'
 e.g. `templateUrl: '\\views\\app.html'` you can override the separator by providing the pathSep parameter.

 ```javascript
 require('simple-ngtemplate-loader?pathSep=\\!html!.\\test.html')
 ```

 Make sure you use the same path separator for the `prefix` and `relativeTo` parameters, all templateUrls and in your webpack.config.js file.

## Webpack Config

It's recommended to adjust your `webpack.config` so `simple-ngtemplate-loader!html!` is applied automatically on all files ending with `.html`. For Webpack 1 this would be something like:

``` javascript
module.exports = {
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'simple-ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './app')) + '/!html'
      }
    ]
  }
};
```
For Webpack 2 this would be something like:

``` javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          { loader:'simple-ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './app')) },
          { loader: 'html-loader' }
        ]
      }
    ]
  }
};
```
Make sure you already have `html-loader` installed. Then you only need to write: `require('file.html')`.

## Baggage Example

SimpleNgTemplate loader works well with the [Baggage Loader](https://github.com/deepsweet/baggage-loader) to remove all those 
extra HTML and CSS requires. See an example of a directive and webpack.config.js below. Or take a look at more complete
example in the examples/baggage folder.

With a folder structure:

```
app/
├── app.js
├── index.html
├── webpack.config.js
└── my-directive/
    ├── my-directive.js
    ├── my-directive.css
    └── my-directive.html
```

and a webpack.config.js for webpack 1 like:

``` javascript
module.exports = {
  module: {
    preLoaders: [
      { 
        test: /\.js$/, 
        loader: 'baggage?[file].html&[file].css' 
      }
    ],
    loaders: [
      {
        test: /\.html$/,
        loader: 'simple-ngtemplate-loader?relativeTo=' + __dirname + '/!html'
      }
    ]
  }
};
```

For webpack 2 like:

``` javascript
module.exports = {
  module: {
    rules: [
      { 
        test: /\.js$/, 
        enforce: 'pre',
        use: [{ loader:'baggage?[file].html&[file].css'  }]
      },
      {
        test: /\.html$/,
        use: [
          { loader: 'simple-ngtemplate-loader?relativeTo=' + __dirname + '/' },
          { loader: 'html-loader' }]
        ]
      }
    ]
  }
};
```

You can now skip the initial require of html and css like so:

``` javascript
app.directive('myDirective', function() {
    return {
        restrict: 'E',
        templateUrl: require('./my-directive.html')
    }
});
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
