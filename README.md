express-nested-router
=====================


## Examples

```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var namespace = router.namespace({
  index: function(req, res, next){},
  foo: function(req, res, next){},
  bar: function(req, res, next){}
});

namespace.resolve(app);

//
// Routes:
//   ''
//   '/foo'
//   '/bar'
//
```

```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var fooNamespace = router.namespace({
  index: function(req, res, next){},
  create: function(req, res, next){},
  show: function(req, res, next){}
});

var namespace = router.namespace({
  index: function(req, res, next){},
  foo: fooNamespace,
  bar: function(req, res, next){}
});

namespace.resolve(app);

//
// Routes:
//   ''
//   '/foo/'
//   '/foo/create'
//   '/foo/show'
//   '/bar'
//
```


## Development

- `node ~0.10.0`
  - `~0.10.0` is for `power-assert` output, `0.11` cannot output correctly.
