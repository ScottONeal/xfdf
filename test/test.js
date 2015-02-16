var should = require('should'),
    XFDF   = require('../index.js'),
    xml2js = require('xml2js'),
    fs     = require('fs');

// Test data
var data = [
  { name: 'First_Name', value: 'John'},
  { name: 'Last_Name' , value: "Doe"},
  { name: 'MALE'      , value: true },
  { name: 'Address_1' , value: '123 Work Street' },
  { name: 'City'      , value: 'Annapolis' },
  { name: 'STATE'     , value: 'MD' },
  { name: 'ZIP'       , value: 27233 }
];

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

  it('#addFields()', function() {
    xfdf.addFields.should.be.a.Function;
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
      (function() {xfdf.addField({nme: 'Bad Key', value: 'Good Key'})}).should.throw(Error);
    });

    it('should add field to _fields array', function() {
      xfdf.addField({name: 'name', value: 'John'});
      xfdf._fields.should.have.length(1);
    });

    it('should forward to #addFields() if argument is an array.', function() {
      xfdf.addField([{name: 'name', value: 'John'}, {name: 'lname', value: 'Doe'}]);
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

    it('should add multiple fields to _fields array', function() {
      xfdf.addFields([{name: 'name', value: 'John'}, {name: 'lname', value: 'Doe'}]);
      xfdf._fields.should.have.length(2);
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


  describe('#generate() empty test', function() {
    it('should throw an error if no fields have been added', function() {
      (function() {xfdf.generate()}).should.throw(Error);
    });
  });

  describe('#generate()', function() {

    var generation;
    beforeEach(function() {
      generation = xfdf.addFields(data).generate();
    });

    it('should successfully return a parsable xml object', function(done) {
      var parsed = xml2js.parseString(generation, function(err, result) {
        should(err).not.exist;
        result.xfdf.should.have.keys(['$', 'fields']);

        done();
      });
    });

    it('should successfully generate a proper xfdf structured document', function(done) {
      var parsed = xml2js.parseString(generation, function(err, result) {
        should(err).not.exist;
        result.xfdf.should.have.keys(['$', 'fields']);
        result.xfdf.fields.should.be.an.Array;

        result.xfdf.fields[0].should.have.key('field');
        result.xfdf.fields[0].field.should.be.an.Array;
        var field = result.xfdf.fields[0].field;

        //Loop through different fields
        for ( var i = 0; i < field.length; i++ ) {
          field[i].should.have.keys(['$','value']);
          field[i].$.should.have.key('name');

          var val = data[i].value;
          if ( typeof val === 'boolean' ) { val = val ? 'Yes' : 'Off'; }
          field[i].value[0].should.equal(val.toString());
        }
        //console.log(JSON.stringify(result, null, 2));
        //console.log(generation);
        done();
      });
    });
  });

  describe('#generateToFile()', function() {

    var generation;
    beforeEach(function() {
      generation = xfdf.addFields(data).generate();
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

    var jsonObj = {
      fields: data
    };

    it('should throw an error if argument does not exist or is not an object.', function() {
      (function() {xfdf.fromJSON()}).should.throw(Error);
      (function() {xfdf.fromJSON('this should throw')}).should.throw(Error);
    });

    it('should die on an imporly formated json object', function() {
      (function() {xfdf.fromJSON(data)}).should.throw(Error);
    });

    it('should accept a properly formatted javascript literal.', function() {
      xfdf.fromJSON(jsonObj)._fields.should.have.length(7);
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
        should(err).be.Null;
        console.log(xfdf.generate());
        done();
      })
    });

  });
});
