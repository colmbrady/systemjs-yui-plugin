# Systemjs Yui Adapter

SystemJS's yui loading plugin. Uses the YUI Loader to load YUI modules and exposes them as CJS modules.

## Installing

For SystemJS use, locate `index.js` in the application, and then locate it with map configuration:

```javascript
System.config({
  map: {
    yui: "path/to/index.js"
  }
});
```

For installing with jspm, run `jspm install systemjs-yui-plugin`.

## Basic Use

```javascript
System.import('my-yui-module!yui').then((module) = > {
  console.log(module);
});
```

## Testing

Easiest way to test is to start a webserver in the root directory of this NPM module.

```shell
cd <path-to-npm>
npm i
python -m SimpleHTTPServer 8000
```

Navigate to http://localhost:8000/test/index.html. You can confirm that the console said "Hello".
