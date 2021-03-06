# XFDF
A Node.js module for creating Adobe XFDF files.

[![Build Status](https://travis-ci.org/ScottONeal/xfdf.svg?branch=master)](https://travis-ci.org/ScottONeal/xfdf)

## Installation
```
npm install xfdf
```
Always good to run tests
```
npm test
```

#### Synoptic
```
var xfdf = require('xfdf')

var builder = new xfdf({ pdf: 'Document.pdf' });

builder.addField('firstname', 'John');

console.log(builder.generate());
```

calling generate() will create:

```
<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
  <f href="Document.pdf"/>
  <fields>
    <field name="firstname">
      <value>John</value>
    </field>
  </fields>
</xfdf>
```

## Options

When constructing an xfdf builder there are several options that can be passed.
```
  new xfdf({
    pdf: 'path/to/document.pdf',
    translateBools: true,
    format: {
      pretty: false,
      indent: '  ',
      newline: '\r\n'
    }
  });
```

#### pdf
This is the location of the template pdf to be refrenced in the xfdf document.

#### translateBools
This will translate booleans in a javascript literal to 'Yes' or 'Off', which are used to flag checkboxes or radios in Adobe forms

*default:* true

#### format
This module uses [xmlbuilder](https://github.com/oozcitak/xmlbuilder-js) to construct the xfdf xml document. xmlbuilder has several formating options which can be specified when creating the xml document. You can see those options [here](https://github.com/oozcitak/xmlbuilder-js/wiki#converting-to-string)

*default:* 
```
  pretty: true
  indent: '  '
  newline: '\n'
```

## Methods

#### addField('fieldname', 'fieldvalue')

Will add a field to xfdf document.
Argument should be a hash with two keys: name, value;
```
  builder.addField('FieldName', 'FieldValue');
```

#### fromJSON({data})

You can use this method to pass an entire javascript literal to be consumed by the XFDF builder.
Format of object should be:
```
  {
    fields: {
      age: 32,
      tall: true,
      name: 'John Doe'
    }
  }
```

#### fromJSONFile('path', callback)

Used to slurp a correctly formatted json file.

**Usage:** *see test/resources/test.json for a properly formatted file.*
```
  builder.fromJSONFile('/path/to/data.json', function(err) {
    if ( !err ) 
      builder.generate(); 
  });
```
