express-nested-router [![Build Status](https://travis-ci.org/kjirou/express-nested-router.svg?branch=master)](https://travis-ci.org/kjirou/express-nested-router)
=====================

Router combines namespace independent for the [express](https://github.com/strongloop/express) 3.x.


## Examples
### Routing
```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var routes = router.namespace({
  index: function(req, res, next){},
  foo: function(req, res, next){},
  bar: function(req, res, next){}
});

routes.resolve(app);

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

var fooRoutes = router.namespace({
  index: function(req, res, next){},
  create: function(req, res, next){},
  show: function(req, res, next){}
});

var routes = router.namespace({
  index: function(req, res, next){},
  foo: fooRoutes,
  bar: function(req, res, next){}
});

routes.resolve(app);

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
var fooRoutes = router.namespace(fooControllers);

var routes = router.namespace({
  index: function(req, res, next){},
  foo: fooRoutes,
});

routes.reverseLookUp(fooControllers.show);  // -> ['/foo/show']
routes.reverseLookUp(fooRoutes);  // -> ['/foo']
```

### Middlewares
```
var express = require('express');
var router = require('express-nested-router');

var app = express();

var rountes = router.namespace({
  index: function(req, res, next){
    next();
  }
});

// Set middlewares applying before for each controllers and after.
rountes.pushBeforeMiddleware(function(req, res, next){
  next();
});
rountes.pushAfterMiddleware(function(req, res, next){
  next();
});

rountes.resolve(app);
```

### Chain middlewares to single controller by connect-chain
```
var chain = require('connect-chain');
var express = require('express');
var router = require('express-nested-router');

var app = express();

var indexController = function(req, res, next){};
var beforeMiddleware = function(req, res, next){};
var afterMiddleware = function(req, res, next){};

var chainedController = chain(beforeMiddleware, indexController, afterMiddleware);

var routes = router.namespace({
  index: chainedController
});

routes.resolve(app);
```


## Development
- `node ~0.10.0`
  - If you use the `0.11`, `power-assert` does not work correctly.
