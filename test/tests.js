var expect = require('expect.js');
var router = require('../index');


describe('express-nested-router', function(){
  it('Module definition', function(){
    expect(router).to.be.a('object');
  });

  describe('Static Methods', function(){
    it('_joinPath', function(){
      expect(router._joinPath('', '/foo')).to.be('/foo');
      expect(router._joinPath('', 'foo')).to.be('/foo');
      expect(router._joinPath('', 'foo/bar')).to.be('/foo/bar');
      expect(router._joinPath('', 'index')).to.be('');
      expect(router._joinPath('', '/index')).to.be('');
      expect(router._joinPath('foo', 'index')).to.be('foo');
      expect(router._joinPath('', 'index/foo')).to.be('/foo');
      expect(router._joinPath('', '/index/foo')).to.be('/foo');
      expect(router._joinPath('', 'index/foo/bar')).to.be('/foo/bar');
      expect(router._joinPath('index', 'foo')).to.be('index/foo');
      expect(router._joinPath('index', 'index')).to.be('index');
    });
  });

  describe('Namespace Class', function(){
    it('Should be initialized correctly', function(){
      var namespace;

      // No args
      namespace = new router.Namespace();
      expect(namespace).to.be.a('object');
      expect(namespace._routes).to.eql({});

      // Args exist
      namespace = new router.Namespace({
        foo: {},
        bar: {}
      });
      expect(namespace._routes).to.eql({
        foo: {},
        bar: {}
      });
    });

    it('getRoutes', function(){
      var namespace;
      namespace = new router.Namespace();
      expect(namespace.getRoutes()).to.eql({});
      namespace = new router.Namespace({a:function(){}, b:function(){}});
      expect(Object.keys(namespace.getRoutes()).sort()).to.eql(['a', 'b']);
    });

    it('addRoute', function(){
      var namespace = new router.Namespace();
      namespace.addRoute('', function(){});
      namespace.addRoute('foo', function(){});
      namespace.addRoute('foo/bar', function(){});
      expect(Object.keys(namespace.getRoutes()).sort()).to.eql(['', 'foo', 'foo/bar']);

      // Allow overwriting
      var controller = function(){};
      namespace.addRoute('foo', controller);
      expect(namespace.getRoutes().foo).to.be(controller);
    });
  });

  describe('APIs', function(){
    it('Namespace', function(){
      expect(router.Namespace).to.be.a('function');
    });

    it('namespace', function(){
      var namespace = router.namespace();
      expect(namespace).to.be.a(router.Namespace);
    });
  });
});
