var builder = require('xmlbuilder'),
    fs      = require('fs'),
    _       = require('lodash');

module.exports = XFDF;

function XFDF(opts) {
  var self = this;
  if (!(this instanceof XFDF)) return new XFDF(opts);
  if (!opts) opts = {};

  // Load options and set defaults
  self._opts                = {};
  self._opts.format         = opts.format || { pretty: true, indent: '  ', newline: '\n' };
  self._opts.translateBools = opts.translateBools === false ? false : true;
  self._opts.pdf            = opts.pdf || null;

  self._fields      = [];
  self._annotations = [];
  return self;
}

XFDF.prototype.addField = function(field, value) {

  // Throw error if no field provided
  if ( !field ) {
    throw new Error('addField() called, but no field argument was supplied');
  }

  // Check if value Exists
  if ( !value && typeof value !== 'boolean' ) {
    throw new Error('addField() called, but no value argument supplied');
  }

  // Check if current field is invalid, if it is, throw an error
  if ( !this.validField(field, value) ) {
    throw new Error('Trying to add a field, but field is invalid: ' + JSON.stringify(field, null, 2));
  }

  // Everything looks good, push field onto fields array

  // Check if value is an array that needs to be pushed
  if ( value instanceof Array ) {
    for ( var i = 0; i < value.length; i++ ) {
      this._fields.push({ name: field, value: value[i] });
    }
  }
  // Push single value
  else {
    this._fields.push({ name: field, value: value});
  }

  return this;

};

XFDF.prototype.addAnnotation = function(annotations) {
  //TODO
};

// Semantic shorthand for addAnnotation w/ array
XFDF.prototype.addAnnotations = function(annotations) {
  //TODO
};

XFDF.prototype.fromJSON = function(obj) {

  var self = this;

  if ( !obj || typeof obj !== 'object' ) {
    throw new Error('Calling fromJSON(), but argument supplied is not an object.');
  }

  if ( !obj.fields ) {
    throw new Error('Calling fromJSON(), but object provided does not have "field" key.');
  }

  // Loop over fields and add them to current object
  _.forEach(obj.fields, function(value, field) {
    self.addField(field, value);
  });

  // TODO add annotations loop

  return this;
};

XFDF.prototype.fromJSONFile = function(path, callback) {

  var self = this;

  if ( !path || typeof path !== 'string' ) {
    throw new Error('Calling fromJSONFile(), but no file path argument provided.');
  }

  if ( !callback || typeof callback !== 'function' ) {
    throw new Error('Calling fromJSONFile(), but no callback argument provided.');
  }

  fs.readFile(path, 'utf8', function(err, data) {

    // Check if error during read
    if ( err ) {
      return callback(err);
    }

    // Lets try to JSON parse the file contents
    var obj;

    try {
      obj = JSON.parse(data);
    }
    catch (error) {
      // Erp! Die
      return callback(error);
    }

    // Slurp went well, sent data object to #fromJSON()
    self.fromJSON(obj);

    return callback(null);

  });

};

// This method is used to validate a field object, it only tests to make sure name and values
//  exists as keys
XFDF.prototype.validField = function(field, value) {

  if ( !field || ( !value && typeof value !== 'boolean') ) return false;

  if ( typeof field !== 'string' ) return false;

  return true;
};

XFDF.prototype.generate = function() {
  var self = this;

  if ( self._fields.length === 0 ) {
    throw new Error('Calling generate() but no fields have been added.');
  }

  // Declare Root
  var rootEle = builder.create('xfdf',
    { version: '1.0', encoding: 'UTF-8'});

  // Add XFDF require attributes
  rootEle.att({ xmlns: 'http://ns.adobe.com/xfdf/'});
  rootEle.att({'xml:space': 'preserve' });

  // Create f element, if a pdf was supplied
  if ( self._opts.pdf ) {
    rootEle.ele('f', { href: this._opts.pdf });
  }

  // Create <fields> element
  var fieldsEle = rootEle.ele('fields');

  // Iterate through fields and write each one out
  _.forEach(self._fields, function(field) {
    var name  = field.name,
        value = field.value;

    // Create field element with attribute of name
    var currentFieldEle = fieldsEle.ele('field', { name: name });

    // translateBool if set
    if ( self._opts.translateBools && typeof value === 'boolean' ) {

      // XFDF Translates a true to 'Yes' and a false to 'Off' for checkboxes and radios
      value = value ? 'Yes' : 'Off';
    }

    // Create value element inside of field element
    currentFieldEle.ele('value', {}, value);
  });

  return rootEle.end(self._opts.format);

};

XFDF.prototype.generateToFile = function(path, callback) {

  // Generate and get xfdf string
  var xfdfString = this.generate();

  // Write file out
  fs.writeFile(path, xfdfString, callback);

};
