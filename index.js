var builder = require('xmlbuilder');

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

XFDF.prototype.addField = function(field) {

  // Throw error if no field provided
  if ( !field ) {
    throw new Error('addField() called, but no field argument was supplied');
  }

  // If field is actually an array, then send it to addFields()
  if ( field instanceof Array ) {
    return this.addFields(field);
  }

  // Check if current field is invalid, if it is, throw an error
  if ( !this.validField(field) ) {
    throw new Error('Trying to add a field, but field is invalid: ' + JSON.stringify(field, null, 2));
  }

  // Everything looks good, push field onto fields array
  this._fields.push(field);

  return this;

};

// Semantic shorthand for addField w/ array
XFDF.prototype.addFields = function(fields) {

  // Throw error if no fields provided
  if ( !fields ) {
    throw new Error('addFields() called, but no fields argument was supplied');
  }

  // If fields argument is not an array, throw an error
  if ( !(fields instanceof Array) ) {
    throw new Error('addFields() called with an argument, but type was not an array');
  }

  // Loop through fields
  for ( var i = 0; i < fields.length; i++ )  {
    // Send current field to addFields()
    this.addField(fields[i]);
  }

  return this;

};

XFDF.prototype.addAnnotation = function(annotations) {

};

// Semantic shorthand for addAnnotation w/ array
XFDF.prototype.addAnnotations = function(annotations) {

};

XFDF.prototype.fromFile = function() {

};

XFDF.prototype.validate = function() {

};

// This method is used to validate a field object, it only tests to make sure name and values
//  exists as keys
XFDF.prototype.validField = function(field) {
  if ( !(field instanceof Object) ) return false;

  return  field.name && field.value ? true : false;
};

XFDF.prototype.generate = function() {
  if ( this._fields.length === 0 ) {
    throw new Error('Calling generate() but not fields have been added.');
  }

  // Declare Root
  var rootEle = builder.create('xfdf',
    { version: '1.0', encoding: 'UTF-8'});

  // Add XFDF require attributes
  rootEle.att({ xmlns: 'http://ns.adobe.com/xfdf/'});
  rootEle.att({'xml:space': 'preserve' });

  // Create f element, if a pdf was supplied
  if ( this._opts.pdf ) {
    rootEle.ele('f', { href: this._opts.pdf });
  }

  // Create <fields> element
  var fieldsEle = rootEle.ele('fields');

  // Iterate through fields and write each one out
  for ( var i = 0; i<this._fields.length; i++ ) {
    var currentField = this._fields[i];

    // Create field element with attribute of name
    var currentFieldEle = fieldsEle.ele('field', { name: currentField.name });

    // Create value element inside of field element
    currentFieldEle.ele('value', {}, currentField.value);
  }

  return rootEle.end(this._opts.format);

};
