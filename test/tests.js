var assert = require('power-assert');
var express = require('express');
var router = require('../index');


describe('express-nested-router', function(){

  it('Module definition', function(){
    assert(typeof router === 'object');
  });

  describe('Static Methods', function(){
    it('_joinPath', function(){
      assert.strictEqual(router._joinPath('', '/foo'), '/foo');
      assert.strictEqual(router._joinPath('', 'foo'), '/foo');
      assert.strictEqual(router._joinPath('', 'foo/bar'), '/foo/bar');
      assert.strictEqual(router._joinPath('', 'index'), '');
      assert.strictEqual(router._joinPath('', '/index'), '');
      assert.strictEqual(router._joinPath('foo', 'index'), 'foo');
      assert.strictEqual(router._joinPath('', 'index/foo'), '/foo');
      assert.strictEqual(router._joinPath('', '/index/foo'), '/foo');
      assert.strictEqual(router._joinPath('', 'index/foo/bar'), '/foo/bar');
      assert.strictEqual(router._joinPath('index', 'foo'), 'index/foo');
      assert.strictEqual(router._joinPath('index', 'index'), 'index');
    });
  });

  describe('Namespace Class', function(){
    it('Should be initialized correctly', function(){
      var namespace;

      // No args
      namespace = new router.Namespace();
      assert(typeof namespace === 'object');
      assert.deepEqual(namespace._routes, {});

      // Args exist
      namespace = new router.Namespace({
        foo: {},
        bar: {}
      });
      assert.deepEqual(namespace._routes, {
        foo: {},
        bar: {}
      });
    });

    it('getRoutes', function(){
      var namespace;
      namespace = new router.Namespace();
      assert.deepEqual(namespace.getRoutes(), {});
      var fooController = function(){},
        barController = function(){};
      namespace = new router.Namespace({
        foo: fooController,
        bar: barController
      });
      assert.deepEqual(namespace.getRoutes(), {
        foo: fooController,
        bar: barController
      });
    });

    it('addRoute', function(){
      var namespace = new router.Namespace(),
        indexController = function(){},
        fooController = function(){},
        fooBarController = function(){};
      namespace.addRoute('', indexController);
      namespace.addRoute('foo', fooController);
      namespace.addRoute('foo/bar', fooBarController);
      assert.deepEqual(namespace.getRoutes(), {
        '': indexController,
        foo: fooController,
        'foo/bar': fooBarController
      });

      // Allow overwriting
      var controller = function(){};
      namespace.addRoute('foo', controller);
      assert.strictEqual(namespace.getRoutes().foo, controller);
    });

    it('removeRoute', function(){
      var namespace = new router.Namespace();
      namespace.addRoute('foo', function(){});
      assert('foo' in namespace.getRoutes());
      namespace.removeRoute('foo');
      assert('foo' in namespace.getRoutes() === false);
      assert.throws(function(){
        namespace.removeRoute('not_defined_key');
      }, /Path/i);
    });

    describe('_resolveRoutes', function(){
      it('Should create only a top route.', function(){
        var topController = function(){};
        var namespace = new router.namespace({index:topController})
        var routes = namespace._resolveRoutes();
        assert.deepEqual(routes, [['', topController]]);
      });

      it('一名前空間にトップと複数のルートがある', function(){
        var controllers = {
          index: function(){},
          foo: function(){},
          bar: function(){}
        };
        var namespace = new router.Namespace(controllers);
        var routes = namespace._resolveRoutes().sort(function(a, b){
          return a[0] > b[0];
        });
        assert.deepEqual(routes, [
          ['', controllers.index],
          ['/bar', controllers.bar],
          ['/foo', controllers.foo]
        ]);
      });

      it('トップ名前空間の下に子名前空間とコントローラがある', function(){
        var fooIndexController = function(){},
          fooCreateController = function(){};
        var fooNamespace = new router.Namespace({
          index: fooIndexController,
          create: fooCreateController
        });

        var indexController = function(){},
          barController = function(){};
        var topNamespace = new router.Namespace({
          index: indexController,
          foo: fooNamespace,
          bar: barController
        });

        var routes = topNamespace._resolveRoutes().sort(function(a, b){
          return a[0] > b[0];
        });
        assert.deepEqual(routes, [
          ['', indexController],
          ['/bar', barController],
          ['/foo', fooIndexController],
          ['/foo/create', fooCreateController]
        ]);
      });
    });

    describe('resolve', function(){
      it('express上でroutesを定義できる', function(){
        var app = express();
        var indexController = function(){},
          fooController = function(){};
        var namespace = new router.Namespace({
          index: indexController,
          foo: fooController
        });
        namespace.resolve(app);

        var getMethodPaths = app.routes.get.slice()
          .sort(function(a, b){
            return a.path > b.path;
          }).map(function(v){
            return v.path;
          });
        assert.deepEqual(['/', '/foo'], getMethodPaths);
      });
    });
  });

  describe('APIs', function(){
    it('Namespace', function(){
      assert(typeof router.Namespace === 'function');
    });

    it('namespace', function(){
      var namespace = router.namespace();
      assert(namespace instanceof router.Namespace);
    });
  });
});
