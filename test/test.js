var should = require('should'),
    XFDF   = require('../index.js'),
    xml2js = require('xml2js'),
    _      = require('lodash'),
    fs     = require('fs');

// test data
var data = {
  fields: {
    'First_Name': 'John',
    'Last_Name' : 'Doe',
    'MALE'      : true,
    'Address_1' : '123 Work Street',
    'City'      : 'Annapolis',
    'STATE'     : 'MD',
    'ZIP'       : 27233,
    'Checkgroup': [true, false, true],
    'Array'     : ['One', 'Bull', 'Landon']
  }
}

describe('xfdf instantiation', function() {
  var xfdf = new XFDF();

  it('should be an instance of object', function() {
    xfdf.should.be.an.instanceOf(Object);
  });

  it('should set default options', function() {
    xfdf._opts.format.pretty.should.be.ok;
    xfdf._opts.format.indent.should.equal('  ');
    xfdf._opts.format.newline.should.equal('\n');
    should(xfdf._opts.pdf).not.exist;
    xfdf._opts.translateBools.should.be.ok;
  });

  it('should let you set custom options', function() {
    var xfdf = new XFDF({format: { pretty: false, indent: '', newline: '\r\n' }, pdf: 'Document.pdf', translateBools: false});
    xfdf._opts.format.pretty.should.not.be.ok;
    xfdf._opts.format.indent.should.equal('');
    xfdf._opts.format.newline.should.equal('\r\n');
    xfdf._opts.pdf.should.equal('Document.pdf');
    xfdf._opts.translateBools.should.not.be.ok;
  });

  it('#addField()', function() {
    xfdf.addField.should.be.a.Function;
  });

  it('#addAnnotation()', function() {
    xfdf.addAnnotation.should.be.a.Function;
  });

  it('#addAnnotations()', function() {
    xfdf.addAnnotations.should.be.a.Function;
  });

  it('#fromJSON()', function() {
    xfdf.fromJSON.should.be.a.Function;
  });

  it('#fromJSONFile()', function() {
    xfdf.fromJSONFile.should.be.a.Function;
  });

  it('#validField()', function() {
    xfdf.validField.should.be.a.Function;
  });

  it('#generate()', function() {
    xfdf.generate.should.be.a.Function;
  });

  it('#generateToFile()', function() {
    xfdf.generateToFile.should.be.a.Function;
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

    it('should throw an error if invalid field argument', function() {
      (function() {xfdf.addField({}, 'Bad Key')}).should.throw(Error);
    });

    it('should throw an error if no value argument', function() {
      (function() {xfdf.addField('field')}).should.throw(Error);
    });

    it('should add field to _fields array', function() {
      xfdf.addField('name', 'John');
      xfdf._fields.should.have.length(1);
    });

    it('should add multiple fields to _fields array if value is an array', function() {
      xfdf.addField('colors', ['red', 'blue', 'yellow']);
      xfdf._fields.should.have.length(3);
    });

  });

  describe('#validField()', function() {
    it('should return false if field name is not a string', function() {
      xfdf.validField({}, 'value').should.not.be.ok;
    });

    it('should return true if field passed has name and value keys', function() {
      xfdf.validField('test', true).should.be.ok;
    });
  });


  describe('#generate() empty test', function() {
    it('should throw an error if no fields have been added', function() {
      (function() {xfdf.generate()}).should.throw(Error);
    });
  });

  describe('#generate()', function() {

    var generation;
    beforeEach(function() {
      generation = xfdf.fromJSON(data).generate();
    });

    it('should successfully return a parsable xml object', function(done) {
      var parsed = xml2js.parseString(generation, function(err, result) {
        should(err).not.exist;
        result.xfdf.should.have.keys(['$', 'fields']);

        done();
      });
    });

  });

  describe('#generateToFile()', function() {

    var generation;
    beforeEach(function() {
      generation = xfdf.fromJSON(data).generate();
    });

    it('should throw an error if no filename is provided', function() {
      (function() {xfdf.generateToFile()}).should.throw(Error);
    });

    it('should write a file to path specified.', function() {
      xfdf.generateToFile('test/tmp.xfdf', function(err) {
        should(err).not.exist;
        var contents = fs.readFileSync('test/tmp.xfdf', 'utf8');
        contents.should.be.a.String;
        fs.unlink('test/tmp.xfdf');

      });
    });

  });

  describe('#fromJSON', function() {

    it('should throw an error if argument does not exist or is not an object.', function() {
      (function() {xfdf.fromJSON()}).should.throw(Error);
      (function() {xfdf.fromJSON('this should throw')}).should.throw(Error);
    });

    it('should die on an imporly formated json object', function() {
      (function() {xfdf.fromJSON({ badKeys: data})}).should.throw(Error);
    });

    it('should accept a properly formatted javascript literal.', function() {
      xfdf.fromJSON(data)._fields.should.have.length(13);
    });
  });

  describe('#fromJSONFile', function() {

    it('should throw an error if no path argument was provided', function() {
      (function() {xfdf.fromJSONFile()}).should.throw(Error);
    });

    it('should throw an error if no callback argument was provided', function() {
      (function() {xfdf.fromJSONFile('test/resources/test.json')}).should.throw(Error);
    });

    it('should throw an error if file cannot be opened for reading', function(done) {
      xfdf.fromJSONFile('test/resources/doesntexist.json', function(err) {
        err.should.be.an.Error;
        done();
      });
    });

    it('should throw an error if file is malformed JSON.', function(done) {
      xfdf.fromJSONFile('test/resources/malformed.json', function(err) {
        err.should.be.an.Error;
        done();
      });
    });

    it('should accept well formed json file', function(done) {
      xfdf.fromJSONFile('test/resources/test.json', function(err) {
        console.log(xfdf.generate());
        should(err).be.Null;
        done();
      })
    });

  });
});
