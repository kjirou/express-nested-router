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
