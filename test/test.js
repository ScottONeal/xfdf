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

  it('#validField()', function() {
    xfdf.validField.should.be.a.Function;
  });

  it('#generate()', function() {
    xfdf.generate.should.be.a.Function;
  });

});

describe('xfdf', function() {

  var xfdf;

  beforeEach(function() {
    xfdf = new XFDF();
  });

  describe('#addField()', function() {

    it('should throw an error if no field argument supplied', function() {
      (function() {xfdf.addField()}).should.throw(Error);
    });

    it('should forward to #addFields() if argument is an array.', function() {
      xfdf.addFields([{name: 'name', value: 'John'}, {name: 'lname', value: 'Doe'}]);
      xfdf._fields.should.have.length(2);
    });
  });

  describe('#addFields()', function() {

    it('should throw an error if no fields argument supplied', function() {
      (function() {xfdf.addFields()}).should.throw(Error);
    });

    it('should throw an error if fields argument is not an instance of Array', function() {
      (function() {xfdf.addFields('test')}).should.throw(Error);
    });

  });

  describe('#validField()', function() {
    it('should return false if not a valid field type', function() {
      xfdf.validField('invalid').should.not.be.ok;
    });
    it('should return true if field passed has name and value keys', function() {
      xfdf.validField({name: 'test', value: 'true'}).should.be.ok;
    });
  });
});

// fromFile should return a promise, since its doing IO
