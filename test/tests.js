var expect = require('expect.js');
var router = require('../index');


describe('express-nested-router', function(){
  it('モジュールが定義されている', function(){
    expect(router).to.be.a('object');
  });
});
