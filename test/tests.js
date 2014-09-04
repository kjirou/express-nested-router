var assert = require('power-assert');
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
      })
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
