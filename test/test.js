var should = require('should'),
    XFDF   = require('../index.js');

describe('xfdf instantiation', function() {
  var xfdf = new XFDF();
  it('should be an instance of object', function() {
    xfdf.should.be.an.instanceOf(Object);
  });

  it('#addField()', function() {
    xfdf.addField.should.be.a.Function;
  });

  it('#addFields()', function() {
    xfdf.addFields.should.be.a.Function;
  });

  it('#addAnnotation()', function() {
    xfdf.addAnnotation.should.be.a.Function;
  });

  it('#addAnnotations()', function() {
    xfdf.addAnnotations.should.be.a.Function;
  });

  it('#fromFile()', function() {
    xfdf.fromFile.should.be.a.Function;
  });

  it('#validate()', function() {
    xfdf.validate.should.be.a.Function;
  });

  it('#generate()', function() {
    xfdf.generate.should.be.a.Function;
  });

});

// fromFile should return a promise, since its doing IO
