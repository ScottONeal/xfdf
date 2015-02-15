var should = require('should'),
    XFDF   = require('../index.js'),
    xml2js = require('xml2js');

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

  it('#fromFile()', function() {
    xfdf.fromFile.should.be.a.Function;
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
    var data = [{name: 'fname', value: 'Scott'}, {name: 'lname', value: "O'Neal"}, { name: 'MALE', value: true }];
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
          field[i].value[0].should.equal(val);
        }
        //console.log(JSON.stringify(result, null, 2));
        //console.log(generation);
        done();
      });
    });
  });
});

// fromFile should return a promise, since its doing IO
