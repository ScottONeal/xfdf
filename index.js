var builder = require('xmlbuilder');

module.exports = XFDF;

function XFDF(opts) {
  var self = this;
  if (!(this instanceof XFDF)) return new XFDF(opts);
  if (!opts) opts = {};

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
  if ( typeof field === 'array' ) {
    return this.addFields(field);
  }


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

    var field = fields[i];

    // Check if current field is valid
    if ( this.validField(field) ) {
      // Field valid, send field to addField()
      this.addField(field);
    }
    else {
      // Field invalid throw an Error
      throw new Error('Trying to add a field from addFields(), but field is invalid');
    }

  }
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

};
