express-nested-router [![Build Status](https://travis-ci.org/kjirou/express-nested-router.svg?branch=master)](https://travis-ci.org/kjirou/express-nested-router)
=====================

Router combines namespace independent for the [express](https://github.com/strongloop/express) 3.x.


## Examples

### Routing

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
//   '/'
//   '/bar'
//   '/foo'
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
//   '/'
//   '/bar'
//   '/foo/'
//   '/foo/create'
//   '/foo/show'
//
```

```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var fooControllers = {
  index: function(req, res, next){},
  show: function(req, res, next){}
};
var fooNamespace = router.namespace(fooControllers);

var namespace = router.namespace({
  index: function(req, res, next){},
  foo: fooNamespace,
});

namespace.reverseLookUp(fooControllers.show);  // -> ['/foo/show']
namespace.reverseLookUp(fooNamespace);  // -> ['/foo']
```

### Middlewares

```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var namespace = router.namespace({
  index: function(req, res, next){
    next();
  }
});

// Set middlewares applying before for each controllers and after.
namespace.pushBeforeMiddleware(function(req, res, next){
  next();
});
namespace.pushAfterMiddleware(function(req, res, next){
  next();
});

namespace.resolve(app);
```


## Development

- `node ~0.10.0`
  - If you use the `0.11`, `power-assert` does not work correctly.
