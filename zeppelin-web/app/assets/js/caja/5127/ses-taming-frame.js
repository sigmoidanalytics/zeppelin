// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * This file is concatenated into the top of the iframe scripts that caja.js
 * loads. It supplies the current build version of Caja. This is interpolated
 * into this file via build.xml rules.
 *
 * @provides cajaBuildVersion
 * @overrides window
 */

var cajaBuildVersion = '5127';

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['cajaBuildVersion'] = cajaBuildVersion;
}
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @overrides Date, String, Number, Boolean, JSON
 * @provides json_sans_eval
 */

/**
 * This file combines the JSON.parse method defined by the original
 * json_sans_eval.js with the stringify method from the original
 * json2.js. Like json2.js, it defines a JSON object if one does not
 * already exist, and it initializes its parse and stringify methods
 * only if JSON does not currently have such methods (functions at
 * those property names). Additionally, if there is no
 * <tt>Date.prototype.toJSON</tt>, this file defines an ES5 compliant
 * one as well as the <tt>toJSON</tt> methods for <tt>String</tt>,
 * <tt>Number</tt>, and <tt>Boolean</tt>. The latter three are no
 * longer part of ES5, but are expected by the parts of this file
 * derived from json2.js.
 *
 * Of course, the reason this is included in the Caja distribution is
 * so that Caja can expose an ES5 compliant but Caja-safe JSON object
 * to cajoled code. Caja's wrapping of the provided JSON therefore
 * must work with either a real ES5 JSON or the one defined in this
 * file. To do so, Caja uses the replacer and reviver
 * hooks. Fortunately, ES5 and json2.js both specify that only own
 * properties of an object are stringified, and the the replacer is
 * called on the result of a <tt>toJSON</tt> call, making it possible
 * for the replacer to do its job.
 *
 * Comment from original json2.js:
 *
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    Based on json2.js from http://www.JSON.org/js.html
    but with the parse method to be provided by json_sans_eval.js

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
 *
 * Comment from original json_sans_eval.js:
 *
 * Parses a string of well-formed JSON text.
 *
 * If the input is not well-formed, then behavior is undefined, but it is
 * deterministic and is guaranteed not to modify any object other than its
 * return value.
 *
 * This does not use `eval` so is less likely to have obscure security bugs than
 * json2.js.
 * It is optimized for speed, so is much faster than json_parse.js.
 *
 * This library should be used whenever security is a concern (when JSON may
 * come from an untrusted source), speed is a concern, and erroring on malformed
 * JSON is *not* a concern.
 *
 *                      Pros                   Cons
 *                    +-----------------------+-----------------------+
 * json_sans_eval.js  | Fast, secure          | Not validating        |
 *                    +-----------------------+-----------------------+
 * json_parse.js      | Validating, secure    | Slow                  |
 *                    +-----------------------+-----------------------+
 * json2.js           | Fast, some validation | Potentially insecure  |
 *                    +-----------------------+-----------------------+
 *
 * json2.js is very fast, but potentially insecure since it calls `eval` to
 * parse JSON data, so an attacker might be able to supply strange JS that
 * looks like JSON, but that executes arbitrary javascript.
 * If you do have to use json2.js with untrusted data, make sure you keep
 * your version of json2.js up to date so that you get patches as they're
 * released.
 *
 * @param {string} json per RFC 4627
 * @param {function} opt_reviver optional function that reworks JSON objects
 *     post-parse per Chapter 15.12 of EcmaScript3.1.
 *     If supplied, the function is called with a string key, and a value.
 *     The value is the property of 'this'.  The reviver should return
 *     the value to use in its place.  So if dates were serialized as
 *     {@code { "type": "Date", "time": 1234 }}, then a reviver might look like
 *     {@code
 *     function (key, value) {
 *       if (value && typeof value === 'object' && 'Date' === value.type) {
 *         return new Date(value.time);
 *       } else {
 *         return value;
 *       }
 *     }}.
 *     If the reviver returns {@code undefined} then the property named by key
 *     will be deleted from its container.
 *     {@code this} is bound to the object containing the specified property.
 * @return {Object|Array}
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

if (typeof Date.prototype.toJSON !== 'function') {
  Date.prototype.toJSON = function (key) {
    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    return isFinite(this.valueOf()) ?
    this.getUTCFullYear()   + '-' +
    f(this.getUTCMonth() + 1) + '-' +
    f(this.getUTCDate())      + 'T' +
    f(this.getUTCHours())     + ':' +
    f(this.getUTCMinutes())   + ':' +
    f(this.getUTCSeconds())   + 'Z' : null;
  };

  String.prototype.toJSON =
  Number.prototype.toJSON =
  Boolean.prototype.toJSON = function (key) {
    return this.valueOf();
  };
}

var json_sans_eval = (function() {

   var hop = Object.hasOwnProperty;

   ///////////////////// from json2.js //////////////////////////


   var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
   escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
   gap,
   indent,
   meta = {    // table of character substitutions
     '\b': '\\b',
     '\t': '\\t',
     '\n': '\\n',
     '\f': '\\f',
     '\r': '\\r',
     '"' : '\\"',
     '\\': '\\\\'
   },
   rep;


   function quote(string) {

     // If the string contains no control characters, no quote
     // characters, and no
     // backslash characters, then we can safely slap some quotes around it.
     // Otherwise we must also replace the offending characters with safe escape
     // sequences.

     escapable.lastIndex = 0;
     return escapable.test(string) ?
       '"' + string.replace(escapable, function (a) {
                              var c = meta[a];
                              return typeof c === 'string' ? c :
                                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                            }) + '"' :
     '"' + string + '"';
   }


   function str(key, holder) {

     // Produce a string from holder[key].

     var i,          // The loop counter.
     k,          // The member key.
     v,          // The member value.
     length,
     mind = gap,
     partial,
     value = holder[key];

     // If the value has a toJSON method, call it to obtain a replacement value.

     if (value && typeof value === 'object' &&
         typeof value.toJSON === 'function') {
       value = value.toJSON(key);
     }

     // If we were called with a replacer function, then call the replacer to
     // obtain a replacement value.

     if (typeof rep === 'function') {
       value = rep.call(holder, key, value);
     }

     // What happens next depends on the value's type.

     switch (typeof value) {
     case 'string':
       return quote(value);

     case 'number':

       // JSON numbers must be finite. Encode non-finite numbers as null.

       return isFinite(value) ? String(value) : 'null';

     case 'boolean':
     case 'null':

       // If the value is a boolean or null, convert it to a string. Note:
       // typeof null does not produce 'null'. The case is included here in
       // the remote chance that this gets fixed someday.

       return String(value);

       // If the type is 'object', we might be dealing with an object
       // or an array or
       // null.

     case 'object':

       // Due to a specification blunder in ECMAScript, typeof null is 'object',
       // so watch out for that case.

       if (!value) {
         return 'null';
       }

       // Make an array to hold the partial results of stringifying
       // this object value.

       gap += indent;
       partial = [];

       // Is the value an array?

       if (Object.prototype.toString.apply(value) === '[object Array]') {

         // The value is an array. Stringify every element. Use null
         // as a placeholder
         // for non-JSON values.

         length = value.length;
         for (i = 0; i < length; i += 1) {
           partial[i] = str(i, value) || 'null';
         }

         // Join all of the elements together, separated with commas,
         // and wrap them in
         // brackets.

         v = partial.length === 0 ? '[]' :
           gap ? '[\n' + gap +
           partial.join(',\n' + gap) + '\n' +
           mind + ']' :
           '[' + partial.join(',') + ']';
         gap = mind;
         return v;
       }

       // If the replacer is an array, use it to select the members to
       // be stringified.

       if (rep && typeof rep === 'object') {
         length = rep.length;
         for (i = 0; i < length; i += 1) {
           k = rep[i];
           if (typeof k === 'string') {
             v = str(k, value);
             if (v) {
               partial.push(quote(k) + (gap ? ': ' : ':') + v);
             }
           }
         }
       } else {

         // Otherwise, iterate through all of the keys in the object.

         for (k in value) {
           if (hop.call(value, k)) {
             v = str(k, value);
             if (v) {
               partial.push(quote(k) + (gap ? ': ' : ':') + v);
             }
           }
         }
       }

       // Join all of the member texts together, separated with commas,
       // and wrap them in braces.

       v = partial.length === 0 ? '{}' :
         gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
         mind + '}' : '{' + partial.join(',') + '}';
       gap = mind;
       return v;
     }
   }

   function stringify (value, replacer, space) {

     // The stringify method takes a value and an optional replacer,
     // and an optional space parameter, and returns a JSON
     // text. The replacer can be a function that can replace
     // values, or an array of strings that will select the keys. A
     // default replacer method can be provided. Use of the space
     // parameter can produce text that is more easily readable.

     var i;
     gap = '';
     indent = '';

     // If the space parameter is a number, make an indent string
     // containing that
     // many spaces.

     if (typeof space === 'number') {
       for (i = 0; i < space; i += 1) {
         indent += ' ';
       }

       // If the space parameter is a string, it will be used as the
       // indent string.

     } else if (typeof space === 'string') {
       indent = space;
     }

     // If there is a replacer, it must be a function or an array.
     // Otherwise, throw an error.

     rep = replacer;
     if (replacer && typeof replacer !== 'function' &&
         (typeof replacer !== 'object' ||
          typeof replacer.length !== 'number')) {
       throw new Error('json_sans_eval.stringify');
     }

     // Make a fake root object containing our value under the key of ''.
     // Return the result of stringifying the value.

     return str('', {'': value});
   }

   var number
       = '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
   var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]'
       + '|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
   var string = '(?:\"' + oneChar + '*\")';

   // Will match a value in a well-formed JSON file.
   // If the input is not well-formed, may match strangely, but not in an unsafe
   // way.
   // Since this only matches value tokens, it does not match
   // whitespace, colons,
   // or commas.
   var significantToken = new RegExp(
       '(?:false|true|null|[\\{\\}\\[\\]]'
       + '|' + number
       + '|' + string
       + ')', 'g');

   // Matches escape sequences in a string literal
   var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');

   // Decodes escape sequences in object literals
   var escapes = {
     '"': '"',
     '/': '/',
     '\\': '\\',
     'b': '\b',
     'f': '\f',
     'n': '\n',
     'r': '\r',
     't': '\t'
   };
   function unescapeOne(_, ch, hex) {
     return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
   }

   // A non-falsy value that coerces to the empty string when used as a key.
   var EMPTY_STRING = new String('');
   var SLASH = '\\';

   var completeToken = new RegExp(
       '(?:false|true|null|[ \t\r\n]+|[\\{\\}\\[\\],:]'
       + '|' + number
       + '|' + string
       + '|.)', 'g');

   function blank(arr, s, e) { while (--e >= s) { arr[e] = ''; } }

   function checkSyntax(text, keyFilter) {
     var toks = ('' + text).match(completeToken);
     var i = 0, n = toks.length;
     checkArray();
     if (i < n) {
       throw new Error('Trailing tokens ' + toks.slice(i - 1).join(''));
     }
     return toks.join('');

     function checkArray() {
       while (i < n) {
         var t = toks[i++];
         switch (t) {
           case ']': return;
           case '[': checkArray(); break;
           case '{': checkObject(); break;
         }
       }
     }
     function checkObject() {
       // For the tokens    {  "a"  :  null  ,  "b" ...
       // the state is         0    1  2     3  0
       var state = 0;
       // If we need to sanitize instead of validating, uncomment:
       // var skip = 0;  // The index of the first token to skip or 0.
       while (i < n) {
         var t = toks[i++];
         switch (t.charCodeAt(0)) {
           case 0x09: case 0x0a: case 0x0d: case 0x20: continue; // space chars
           case 0x22: // "
             var len = t.length;
             if (len === 1) { throw new Error(t); }
             if (state === 0) {
               if (keyFilter && !keyFilter(
                       t.substring(1, len - 1)
                       .replace(escapeSequence, unescapeOne))) {
                 throw new Error(t);
                 // If we need to sanitize instead of validating, uncomment:
                 // skip = i - 1;
               }
             } else if (state !== 2) { throw new Error(t); }
             break;
           case 0x27: throw new Error(t);  // '
           case 0x2c: // ,
             if (state !== 3) { throw new Error(t); }
             state = 0;
             // If we need to sanitize instead of validating, uncomment:
             // if (skip) { blank(toks, skip, i); skip = 0; }
             continue;
           case 0x3a: // :
             if (state !== 1) { throw new Error(t); }
             break;
           case 0x5b:  // [
             if (state !== 2) { throw new Error(t); }
             checkArray();
             break;
           case 0x7b:  // {
             if (state !== 2) { throw new Error(t); }
             checkObject();
             break;
           case 0x7d:  // }
             // If we need to sanitize instead of validating, uncomment:
             // if (skip) { blank(toks, skip, i - 1); skip = 0; }
             return;
           default:
             if (state !== 2) { throw new Error(t); }
             break;
         }
         ++state;
       }
     }
   };

   function parse (json, opt_reviver) {
     // Split into tokens
     var toks = json.match(significantToken);
     // Construct the object to return
     var result;
     var tok = toks[0];
     if ('{' === tok) {
       result = {};
     } else if ('[' === tok) {
       result = [];
     } else {
       throw new Error(tok);
     }

     // If undefined, the key in an object key/value record to use
     // for the next
     // value parsed.
     var key = void 0;
     // Loop over remaining tokens maintaining a stack of
     // uncompleted objects and
     // arrays.
     var stack = [result];
     for (var i = 1, n = toks.length; i < n; ++i) {
       tok = toks[i];

       var cont;
       switch (tok.charCodeAt(0)) {
       default:  // sign or digit
         cont = stack[0];
         cont[key || cont.length] = +(tok);
         key = void 0;
         break;
       case 0x22:  // '"'
         tok = tok.substring(1, tok.length - 1);
         if (tok.indexOf(SLASH) !== -1) {
           tok = tok.replace(escapeSequence, unescapeOne);
         }
         cont = stack[0];
         if (!key) {
           if (cont instanceof Array) {
             key = cont.length;
           } else {
             key = tok || EMPTY_STRING;  // Use as key for next value seen.
             break;
           }
         }
         cont[key] = tok;
         key = void 0;
         break;
       case 0x5b:  // '['
         cont = stack[0];
         stack.unshift(cont[key || cont.length] = []);
         key = void 0;
         break;
       case 0x5d:  // ']'
         stack.shift();
         break;
       case 0x66:  // 'f'
         cont = stack[0];
         cont[key || cont.length] = false;
         key = void 0;
         break;
       case 0x6e:  // 'n'
         cont = stack[0];
         cont[key || cont.length] = null;
         key = void 0;
         break;
       case 0x74:  // 't'
         cont = stack[0];
         cont[key || cont.length] = true;
         key = void 0;
         break;
       case 0x7b:  // '{'
         cont = stack[0];
         stack.unshift(cont[key || cont.length] = {});
         key = void 0;
         break;
       case 0x7d:  // '}'
         stack.shift();
         break;
       }
     }
     // Fail if we've got an uncompleted object.
     if (stack.length) { throw new Error(); }

     if (opt_reviver) {
       // Based on walk as implemented in http://www.json.org/json2.js
       var walk = function (holder, key) {
         var value = holder[key];
         if (value && typeof value === 'object') {
           var toDelete = null;
           for (var k in value) {
             if (hop.call(value, k) && value !== holder) {
               // Recurse to properties first.  This has the effect of causing
               // the reviver to be called on the object graph depth-first.

               // Since 'this' is bound to the holder of the property, the
               // reviver can access sibling properties of k including ones
               // that have not yet been revived.

               // The value returned by the reviver is used in place of the
               // current value of property k.
               // If it returns undefined then the property is deleted.
               var v = walk(value, k);
               if (v !== void 0) {
                 value[k] = v;
               } else {
                 // Deleting properties inside the loop has vaguely defined
                 // semantics in ES3.
                 if (!toDelete) { toDelete = []; }
                 toDelete.push(k);
               }
             }
           }
           if (toDelete) {
             for (var i = toDelete.length; --i >= 0;) {
               delete value[toDelete[i]];
             }
           }
         }
         return opt_reviver.call(holder, key, value);
       };
       result = walk({ '': result }, '');
     }

     return result;
   }

   return {
     checkSyntax: checkSyntax,
     parse: parse,
     stringify: stringify
   };
})();

if (typeof JSON === 'undefined') { var JSON = {}; }
if (typeof JSON.stringify !== 'function') {
  JSON.stringify = json_sans_eval.stringify;
}
if (typeof JSON.parse !== 'function') {
  JSON.parse = json_sans_eval.parse;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Configure initSES to operate as expected by caja.js
 * taming and guest frames.
 *
 * In particular, we disable the maximum-problem-severity check, because
 * caja.js will check the security itself and we want our code to
 * not fail partway through loading.
 *
 * TODO(kpreid): This strategy is insufficient to deal with non-ES5-capable
 * browsers, because we will crash partway through loading Domado or its deps.
 * Instead, we need to wrap code-after-initSES in a function and not run it
 * if SES failed, or load a separate frame to probe SES status in, or load
 * initSES with a callback and then load Domado etc. afterward.
 *
 * @author kpreid@switchb.org (Kevin Reid)
 * @overrides ses
 */

var ses;
if (!ses) { ses = {}; }
ses.maxAcceptableSeverityName = 'NEW_SYMPTOM';
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Exports a {@code ses.logger} which logs to the
 * console if one exists.
 *
 * <p>This <code>logger.js</code> file both defines the logger API and
 * provides default implementations for its methods. Because
 * <code>logger.js</code> is normally packaged in
 * <code>initSES.js</code>, it is built to support being overridden by
 * a script run <i>earlier</i>. For example, for better diagnostics,
 * consider loading and initializing <code>useHTMLLogger.js</code> first.
 *
 * <p>The {@code ses.logger} API consists of
 * <dl>
 *   <dt>log, info, warn, and error methods</dt>
 *     <dd>each of which take a list of arguments which should be
 *         stringified and appended together. The logger should
 *         display this string associated with that severity level. If
 *         any of the arguments has an associated stack trace
 *         (presumably Error objects), then the logger <i>may</i> also
 *         show this stack trace. If no {@code ses.logger} already
 *         exists, the default provided here forwards to the
 *         pre-existing global {@code console} if one
 *         exists. Otherwise, all four of these do nothing. If we
 *         default to forwarding to the pre-existing {@code console} ,
 *         we prepend an empty string as first argument since we do
 *         not want to obligate all loggers to implement the console's
 *         "%" formatting. </dd>
 *   <dt>classify(postSeverity)</dt>
 *     <dd>where postSeverity is a severity
 *         record as defined by {@code ses.severities} in
 *         <code>repairES5.js</code>, and returns a helpful record
 *         consisting of a
 *         <dl>
 *           <dt>consoleLevel:</dt>
 *             <dd>which is one of 'log', 'info', 'warn', or
 *                 'error', which can be used to select one of the above
 *                 methods.</dd>
 *           <dt>note:</dt>
 *             <dd>containing some helpful text to display
 *                 explaining the impact of this severity on SES.</dd>
 *         </dl>
 *   <dt>reportRepairs(reports)</dt>
 *     <dd>where {@code reports} is the list of repair reports, each
 *         of which contains
 *       <dl>
 *         <dt>description:</dt>
 *           <dd>a string describing the problem</dd>
 *         <dt>preSeverity:</dt>
 *           <dd>a severity record (as defined by {@code
 *               ses.severities} in <code>repairES5.js</code>)
 *               indicating the level of severity of this problem if
 *               unrepaired. Or, if !canRepair, then the severity
 *               whether or not repaired.</dd>
 *         <dt>canRepair:</dt>
 *           <dd>a boolean indicating "if the repair exists and the test
 *               subsequently does not detect a problem, are we now ok?"</dd>
 *         <dt>urls:</dt>
 *           <dd>a list of URL strings, each of which points at a page
 *               relevant for documenting or tracking the bug in
 *               question. These are typically into bug-threads in issue
 *               trackers for the various browsers.</dd>
 *         <dt>sections:</dt>
 *           <dd>a list of strings, each of which is a relevant ES5.1
 *               section number.</dd>
 *         <dt>tests:</dt>
 *           <dd>a list of strings, each of which is the name of a
 *               relevant test262 or sputnik test case.</dd>
 *         <dt>postSeverity:</dt>
 *           <dd>a severity record (as defined by {@code
 *               ses.severities} in <code>repairES5.js</code>)
 *               indicating the level of severity of this problem
 *               after all repairs have been attempted.</dd>
 *         <dt>beforeFailure:</dt>
 *           <dd>The outcome of the test associated with this record
 *               as run before any attempted repairs. If {@code
 *               false}, it means there was no failure. If {@code
 *               true}, it means that the test fails in some way that
 *               the authors of <code>repairES5.js</code>
 *               expected. Otherwise it returns a string describing
 *               the symptoms of an unexpected form of failure. This
 *               is typically considered a more severe form of failure
 *               than {@code true}, since the authors have not
 *               anticipated the consequences and safety
 *               implications.</dd>
 *         <dt>afterFailure:</dt>
 *           <dd>The outcome of the test associated with this record
 *               as run after all attempted repairs.</dd>
 *       </dl>
 *       The default behavior here is to be silent.</dd>
 *   <dt>reportMax()</dt>
 *     <dd>Displays only a summary of the worst case
 *         severity seen so far, according to {@code ses.maxSeverity} as
 *         interpreted by {@code ses.logger.classify}.</dd>
 *   <dt>reportDiagnosis(severity, status, problemList)</dt>
 *     <dd>where {@code severity} is a severity record, {@code status}
 *         is a brief string description of a list of problems, and
 *         {@code problemList} is a list of strings, each of which is
 *         one occurrence of the described problem.
 *         The default behavior here should only the number of
 *         problems, not the individual problems.</dd>
 * </dl>
 *
 * <p>Assumes only ES3. Compatible with ES5, ES5-strict, or
 * anticipated ES6.
 *
 * //provides ses.logger
 * @author Mark S. Miller
 * @requires console
 * @overrides ses, loggerModule
 */
var ses;
if (!ses) { ses = {}; }

(function loggerModule() {
  "use strict";

  var logger;
  function logNowhere(str) {}

  var slice = [].slice;
  var apply = slice.apply;



  if (ses.logger) {
    logger = ses.logger;

  } else if (typeof console !== 'undefined' && 'log' in console) {
    // We no longer test (typeof console.log === 'function') since,
    // on IE9 and IE10preview, in violation of the ES5 spec, it
    // is callable but has typeof "object".
    // See https://connect.microsoft.com/IE/feedback/details/685962/
    //   console-log-and-others-are-callable-but-arent-typeof-function

    // We manually wrap each call to a console method because <ul>
    // <li>On some platforms, these methods depend on their
    //     this-binding being the console.
    // <li>All this has to work on platforms that might not have their
    //     own {@code Function.prototype.bind}, and has to work before
    //     we install an emulated bind.
    // </ul>

    var forward = function(level, args) {
      args = slice.call(args, 0);
      // We don't do "console.apply" because "console" is not a function
      // on IE 10 preview 2 and it has no apply method. But it is a
      // callable that Function.prototype.apply can successfully apply.
      // This code most work on ES3 where there's no bind. When we
      // decide support defensiveness in contexts (frames) with mutable
      // primordials, we will need to revisit the "call" below.
      apply.call(console[level], console, [''].concat(args));

      // See debug.js
      var getStack = ses.getStack;
      if (getStack) {
        for (var i = 0, len = args.length; i < len; i++) {
          var stack = getStack(args[i]);
          if (stack) {
            console[level]('', stack);
          }
        }
      }
    };

    logger = {
      log:   function log(var_args)   { forward('log', arguments); },
      info:  function info(var_args)  { forward('info', arguments); },
      warn:  function warn(var_args)  { forward('warn', arguments); },
      error: function error(var_args) { forward('error', arguments); }
    };
  } else {
    logger = {
      log:   logNowhere,
      info:  logNowhere,
      warn:  logNowhere,
      error: logNowhere
    };
  }

  /**
   * Returns a record that's helpful for displaying a severity.
   *
   * <p>The record contains {@code consoleLevel} and {@code note}
   * properties whose values are strings. The {@code consoleLevel} is
   * {@code "log", "info", "warn", or "error"}, which can be used as
   * method names for {@code logger}, or, in an html context, as a css
   * class name. The {@code note} is a string stating the severity
   * level and its consequences for SES.
   */
  function defaultClassify(postSeverity) {
    var MAX_SES_SAFE = ses.severities.SAFE_SPEC_VIOLATION;

    var consoleLevel = 'log';
    var note = '';
    if (postSeverity.level > ses.severities.SAFE.level) {
      consoleLevel = 'info';
      note = postSeverity.description + '(' + postSeverity.level + ')';
      if (postSeverity.level > ses.maxAcceptableSeverity.level) {
        consoleLevel = 'error';
        note += ' is not suitable for SES';
      } else if (postSeverity.level > MAX_SES_SAFE.level) {
        consoleLevel = 'warn';
        note += ' is not SES-safe';
      }
      note += '.';
    }
    return {
      consoleLevel: consoleLevel,
      note: note
    };
  }

  if (!logger.classify) {
    logger.classify = defaultClassify;
  }

  /**
   * By default is chatty
   */
  function defaultReportRepairs(reports) {
    for (var i = 0; i < reports.length; i++) {
      var report = reports[i];
      if (report.status !== 'All fine') {
        logger.warn(report.status + ': ' + report.description);
      }
    }
  }

  if (!logger.reportRepairs) {
    logger.reportRepairs = defaultReportRepairs;
  }

  /**
   * By default, logs a report suitable for display on the console.
   */
  function defaultReportMax() {
    if (ses.maxSeverity.level > ses.severities.SAFE.level) {
      var maxClassification = ses.logger.classify(ses.maxSeverity);
      logger[maxClassification.consoleLevel](
        'Max Severity: ' + maxClassification.note);
    }
  }

  if (!logger.reportMax) {
    logger.reportMax = defaultReportMax;
  }

  function defaultReportDiagnosis(severity, status, problemList) {
    var classification = ses.logger.classify(severity);
    ses.logger[classification.consoleLevel](
      problemList.length + ' ' + status);
  }

  if (!logger.reportDiagnosis) {
    logger.reportDiagnosis = defaultReportDiagnosis;
  }

  ses.logger = logger;

})();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Monkey patch almost ES5 platforms into a closer
 * emulation of full <a href=
 * "http://code.google.com/p/es-lab/wiki/SecureableES5">Secureable
 * ES5</a>.
 *
 * <p>Assumes only ES3, but only proceeds to do useful repairs when
 * the platform is close enough to ES5 to be worth attempting
 * repairs. Compatible with almost-ES5, ES5, ES5-strict, and
 * anticipated ES6.
 *
 * <p>Ignore the "...requires ___global_test_function___" below. We
 * create it, use it, and delete it all within this module. But we
 * need to lie to the linter since it can't tell.
 *
 * //provides ses.statuses, ses.ok, ses.is, ses.makeDelayedTamperProof
 * //provides ses.makeCallerHarmless, ses.makeArgumentsHarmless
 * //provides ses.severities, ses.maxSeverity, ses.updateMaxSeverity
 * //provides ses.maxAcceptableSeverityName, ses.maxAcceptableSeverity
 *
 * @author Mark S. Miller
 * @requires ___global_test_function___, ___global_valueOf_function___
 * @requires JSON, navigator, this, eval, document
 * @overrides ses, RegExp, WeakMap, Object, parseInt, repairES5Module
 */
var RegExp;
var ses;

/**
 * <p>Qualifying platforms generally include all JavaScript platforms
 * shown on <a href="http://kangax.github.com/es5-compat-table/"
 * >ECMAScript 5 compatibility table</a> that implement {@code
 * Object.getOwnPropertyNames}. At the time of this writing,
 * qualifying browsers already include the latest released versions of
 * Internet Explorer (9), Firefox (4), Chrome (11), and Safari
 * (5.0.5), their corresponding standalone (e.g., server-side) JavaScript
 * engines, Rhino 1.73, and BESEN.
 *
 * <p>On such not-quite-ES5 platforms, some elements of these
 * emulations may lose SES safety, as enumerated in the comment on
 * each kludge record in the {@code kludges} array below. The platform
 * must at least provide {@code Object.getOwnPropertyNames}, because
 * it cannot reasonably be emulated.
 *
 * <p>This file is useful by itself, as it has no dependencies on the
 * rest of SES. It creates no new global bindings, but merely repairs
 * standard globals or standard elements reachable from standard
 * globals. If the future-standard {@code WeakMap} global is present,
 * as it is currently on FF7.0a1, then it will repair it in place. The
 * one non-standard element that this file uses is {@code console} if
 * present, in order to report the repairs it found necessary, in
 * which case we use its {@code log, info, warn}, and {@code error}
 * methods. If {@code console.log} is absent, then this file performs
 * its repairs silently.
 *
 * <p>Generally, this file should be run as the first script in a
 * JavaScript context (i.e. a browser frame), as it relies on other
 * primordial objects and methods not yet being perturbed.
 *
 * <p>TODO(erights): This file tries to protect itself from some
 * post-initialization perturbation by stashing some of the
 * primordials it needs for later use, but this attempt is currently
 * incomplete. We need to revisit this when we support Confined-ES5,
 * as a variant of SES in which the primordials are not frozen. See
 * previous failed attempt at <a
 * href="http://codereview.appspot.com/5278046/" >Speeds up
 * WeakMap. Preparing to support unfrozen primordials.</a>. From
 * analysis of this failed attempt, it seems that the only practical
 * way to support CES is by use of two frames, where most of initSES
 * runs in a SES frame, and so can avoid worrying about most of these
 * perturbations.
 */
(function repairES5Module(global) {
  "use strict";

  /**
   * The severity levels.
   *
   * <dl>
   *   <dt>MAGICAL_UNICORN</dt><dd>Unachievable magical mode used for testing.
   *   <dt>SAFE</dt><dd>no problem.
   *   <dt>SAFE_SPEC_VIOLATION</dt>
   *     <dd>safe (in an integrity sense) even if unrepaired. May
   *         still lead to inappropriate failures.</dd>
   *   <dt>NO_KNOWN_EXPLOIT_SPEC_VIOLATION</dt>
   *     <dd>known to introduce an indirect safety issue which,
   *     however, is not known to be exploitable.</dd>
   *   <dt>UNSAFE_SPEC_VIOLATION</dt>
   *     <dd>a safety issue only indirectly, in that this spec
   *         violation may lead to the corruption of assumptions made
   *         by other security critical or defensive code.</dd>
   *   <dt>NOT_OCAP_SAFE</dt>
   *     <dd>a violation of object-capability rules among objects
   *         within a coarse-grained unit of isolation.</dd>
   *   <dt>NOT_ISOLATED</dt>
   *     <dd>an inability to reliably sandbox even coarse-grain units
   *         of isolation.</dd>
   *   <dt>NEW_SYMPTOM</dt>
   *     <dd>some test failed in a way we did not expect.</dd>
   *   <dt>NOT_SUPPORTED</dt>
   *     <dd>this platform cannot even support SES development in an
   *         unsafe manner.</dd>
   * </dl>
   */
  ses.severities = {
    MAGICAL_UNICORN:       { level: -1, description: 'Testing only' },
    SAFE:                  { level: 0, description: 'Safe' },
    SAFE_SPEC_VIOLATION:   { level: 1, description: 'Safe spec violation' },
    NO_KNOWN_EXPLOIT_SPEC_VIOLATION: {
        level: 2, description: 'Unsafe spec violation but no known exploits' },
    UNSAFE_SPEC_VIOLATION: { level: 3, description: 'Unsafe spec violation' },
    NOT_OCAP_SAFE:         { level: 4, description: 'Not ocap safe' },
    NOT_ISOLATED:          { level: 5, description: 'Not isolated' },
    NEW_SYMPTOM:           { level: 6, description: 'New symptom' },
    NOT_SUPPORTED:         { level: 7, description: 'Not supported' }
  };

  /**
   * Statuses.
   *
   * <dl>
   *   <dt>ALL_FINE</dt>
   *     <dd>test passed before and after.</dd>
   *   <dt>REPAIR_FAILED</dt>
   *     <dd>test failed before and after repair attempt.</dd>
   *   <dt>NOT_REPAIRED</dt>
   *     <dd>test failed before and after, with no repair to attempt.</dd>
   *   <dt>REPAIRED_UNSAFELY</dt>
   *     <dd>test failed before and passed after repair attempt, but
   *         the repair is known to be inadequate for security, so the
   *         real problem remains.</dd>
   *   <dt>REPAIRED</dt>
   *     <dd>test failed before and passed after repair attempt,
   *         repairing the problem (canRepair was true).</dd>
   *   <dt>ACCIDENTALLY_REPAIRED</dt>
   *      <dd>test failed before and passed after, despite no repair
   *          to attempt. (Must have been fixed by some other
   *          attempted repair.)</dd>
   *   <dt>BROKEN_BY_OTHER_ATTEMPTED_REPAIRS</dt>
   *      <dd>test passed before and failed after, indicating that
   *          some other attempted repair created the problem.</dd>
   * </dl>
   */
  ses.statuses = {
    ALL_FINE:                          'All fine',
    REPAIR_FAILED:                     'Repair failed',
    NOT_REPAIRED:                      'Not repaired',
    REPAIRED_UNSAFELY:                 'Repaired unsafely',
    REPAIRED:                          'Repaired',
    ACCIDENTALLY_REPAIRED:             'Accidentally repaired',
    BROKEN_BY_OTHER_ATTEMPTED_REPAIRS: 'Broken by other attempted repairs'
  };


  var logger = ses.logger;

  /**
   * As we start to repair, this will track the worst post-repair
   * severity seen so far.
   */
  ses.maxSeverity = ses.severities.SAFE;

  /**
   * {@code ses.maxAcceptableSeverity} is the max post-repair severity
   * that is considered acceptable for proceeding with the SES
   * verification-only strategy.
   *
   * <p>Although <code>repairES5.js</code> can be used standalone for
   * partial ES5 repairs, its primary purpose is to repair as a first
   * stage of <code>initSES.js</code> for purposes of supporting SES
   * security. In support of that purpose, we initialize
   * {@code ses.maxAcceptableSeverity} to the post-repair severity
   * level at which we should report that we are unable to adequately
   * support SES security. By default, this is set to
   * {@code ses.severities.SAFE_SPEC_VIOLATION}, which is the maximum
   * severity that we believe results in no loss of SES security.
   *
   * <p>If {@code ses.maxAcceptableSeverityName} is already set (to a
   * severity property name of a severity below {@code
   * ses.NOT_SUPPORTED}), then we use that setting to initialize
   * {@code ses.maxAcceptableSeverity} instead. For example, if we are
   * using SES only for isolation, then we could set it to
   * 'NOT_OCAP_SAFE', in which case repairs that are inadequate for
   * object-capability (ocap) safety would still be judged safe for
   * our purposes.
   *
   * <p>As repairs proceed, they update {@code ses.maxSeverity} to
   * track the worst case post-repair severity seen so far. When
   * {@code ses.ok()} is called, it return whether {@code
   * ses.maxSeverity} is still less than or equal to
   * {@code ses.maxAcceptableSeverity}, indicating that this platform
   * still seems adequate for supporting SES. In the Caja context, we
   * have the choice of using SES on those platforms which we judge to
   * be adequately repairable, or otherwise falling back to Caja's
   * ES5/3 translator.
   */
  ses.maxAcceptableSeverityName = 
    validateSeverityName(ses.maxAcceptableSeverityName);
  ses.maxAcceptableSeverity = ses.severities[ses.maxAcceptableSeverityName];

  function validateSeverityName(severityName) {
    if (severityName) {
      var sev = ses.severities[severityName];
      if (sev && typeof sev.level === 'number' &&
        sev.level >= ses.severities.SAFE.level &&
        sev.level < ses.severities.NOT_SUPPORTED.level) {
        // do nothing
      } else {
        logger.error('Ignoring bad severityName: ' +
                   severityName + '.');
        severityName = 'SAFE_SPEC_VIOLATION';
      }
    } else {
      severityName = 'SAFE_SPEC_VIOLATION';
    }
    return severityName;
  }
  function severityNameToLevel(severityName) {
    return ses.severities[validateSeverityName(severityName)];
  }

  /**
   * Once this returns false, we can give up on the SES
   * verification-only strategy and fall back to ES5/3 translation.
   */
  ses.ok = function ok(maxSeverity) {
    if ("string" === typeof maxSeverity) {
      maxSeverity = ses.severities[maxSeverity];
    }
    if (!maxSeverity) {
      maxSeverity = ses.maxAcceptableSeverity;
    }
    return ses.maxSeverity.level <= maxSeverity.level;
  };

  /**
   * Update the max based on the provided severity.
   *
   * <p>If the provided severity exceeds the max so far, update the
   * max to match.
   */
  ses.updateMaxSeverity = function updateMaxSeverity(severity) {
    if (severity.level > ses.maxSeverity.level) {
      ses.maxSeverity = severity;
    }
  };

  //////// Prepare for "caller" and "argument" testing and repair /////////

  /**
   * Needs to work on ES3, since repairES5.js may be run on an ES3
   * platform.
   */
  function strictForEachFn(list, callback) {
    for (var i = 0, len = list.length; i < len; i++) {
      callback(list[i], i);
    }
  }

  /**
   * Needs to work on ES3, since repairES5.js may be run on an ES3
   * platform.
   *
   * <p>Also serves as our representative strict function, by contrast
   * to builtInMapMethod below, for testing what the "caller" and
   * "arguments" properties of a strict function reveals.
   */
  function strictMapFn(list, callback) {
    var result = [];
    for (var i = 0, len = list.length; i < len; i++) {
      result.push(callback(list[i], i));
    }
    return result;
  }

  var objToString = Object.prototype.toString;

  /**
   * Sample map early, to obtain a representative built-in for testing.
   *
   * <p>There is no reliable test for whether a function is a
   * built-in, and it is possible some of the tests below might
   * replace the built-in Array.prototype.map, though currently none
   * do. Since we <i>assume</i> (but with no reliable way to check)
   * that repairES5.js runs in its JavaScript context before anything
   * which might have replaced map, we sample it now. The map method
   * is a particularly nice one to sample, since it can easily be used
   * to test what the "caller" and "arguments" properties on a
   * in-progress built-in method reveals.
   */
  var builtInMapMethod = Array.prototype.map;

  var builtInForEach = Array.prototype.forEach;

  /**
   * http://wiki.ecmascript.org/doku.php?id=harmony:egal
   */
  var is = ses.is = Object.is || function(x, y) {
    if (x === y) {
      // 0 === -0, but they are not identical
      return x !== 0 || 1 / x === 1 / y;
    }

    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
  };


  /**
   * By the time this module exits, either this is repaired to be a
   * function that is adequate to make the "caller" property of a
   * strict or built-in function harmess, or this module has reported
   * a failure to repair.
   *
   * <p>Start off with the optimistic assumption that nothing is
   * needed to make the "caller" property of a strict or built-in
   * function harmless. We are not concerned with the "caller"
   * property of non-strict functions. It is not the responsibility of
   * this module to actually make these "caller" properties
   * harmless. Rather, this module only provides this function so
   * clients such as startSES.js can use it to do so on the functions
   * they whitelist.
   *
   * <p>If the "caller" property of strict functions are not already
   * harmless, then this platform cannot be repaired to be
   * SES-safe. The only reason why {@code makeCallerHarmless} must
   * work on strict functions in addition to built-in is that some of
   * the other repairs below will replace some of the built-ins with
   * strict functions, so startSES.js will apply {@code
   * makeCallerHarmless} blindly to both strict and built-in
   * functions. {@code makeCallerHarmless} simply need not to complete
   * without breaking anything when given a strict function argument.
   */
  ses.makeCallerHarmless = function assumeCallerHarmless(func, path) {
    return 'Apparently fine';
  };

  /**
   * By the time this module exits, either this is repaired to be a
   * function that is adequate to make the "arguments" property of a
   * strict or built-in function harmess, or this module has reported
   * a failure to repair.
   *
   * Exactly analogous to {@code makeCallerHarmless}, but for
   * "arguments" rather than "caller".
   */
  ses.makeArgumentsHarmless = function assumeArgumentsHarmless(func, path) {
    return 'Apparently fine';
  };

  /**
   * "makeTamperProof()" returns a "tamperProof(obj)" function that
   * acts like "Object.freeze(obj)", except that, if obj is a
   * <i>prototypical</i> object (defined below), it ensures that the
   * effect of freezing properties of obj does not suppress the
   * ability to override these properties on derived objects by simple
   * assignment.
   *
   * <p>Because of lack of sufficient foresight at the time, ES5
   * unfortunately specified that a simple assignment to a
   * non-existent property must fail if it would override a
   * non-writable data property of the same name. (In retrospect, this
   * was a mistake, but it is now too late and we must live with the
   * consequences.) As a result, simply freezing an object to make it
   * tamper proof has the unfortunate side effect of breaking
   * previously correct code that is considered to have followed JS
   * best practices, if this previous code used assignment to
   * override.
   *
   * <p>To work around this mistake, tamperProof(obj) detects if obj
   * is <i>prototypical</i>, i.e., is an object whose own
   * "constructor" is a function whose "prototype" is this obj. For example,
   * Object.prototype and Function.prototype are prototypical.  If so,
   * then when tamper proofing it, prior to freezing, replace all its
   * configurable own data properties with accessor properties which
   * simulate what we should have specified -- that assignments to
   * derived objects succeed if otherwise possible.
   *
   * <p>Some platforms (Chrome and Safari as of this writing)
   * implement the assignment semantics ES5 should have specified
   * rather than what it did specify.
   * "test_ASSIGN_CAN_OVERRIDE_FROZEN()" below tests whether we are on
   * such a platform. If so, "repair_ASSIGN_CAN_OVERRIDE_FROZEN()"
   * replaces "makeTamperProof" with a function that simply returns
   * "Object.freeze", since the complex workaround here is not needed
   * on those platforms.
   *
   * <p>"makeTamperProof" should only be called after the trusted
   * initialization has done all the monkey patching that it is going
   * to do on the Object.* methods, but before any untrusted code runs
   * in this context.
   */
  var makeTamperProof = function defaultMakeTamperProof() {

    // Sample these after all trusted monkey patching initialization
    // but before any untrusted code runs in this frame.
    var gopd = Object.getOwnPropertyDescriptor;
    var gopn = Object.getOwnPropertyNames;
    var getProtoOf = Object.getPrototypeOf;
    var freeze = Object.freeze;
    var isFrozen = Object.isFrozen;
    var defProp = Object.defineProperty;

    function tamperProof(obj) {
      if (obj !== Object(obj)) { return obj; }
      var func;
      if (typeof obj === 'object' &&
          !!gopd(obj, 'constructor') &&
          typeof (func = obj.constructor) === 'function' &&
          func.prototype === obj &&
          !isFrozen(obj)) {
        strictForEachFn(gopn(obj), function(name) {
          var value;
          function getter() {
            if (obj === this) { return value; }
            if (this === void 0 || this === null) { return void 0; }
            var thisObj = Object(this);
            if (!!gopd(thisObj, name)) { return this[name]; }
            // TODO(erights): If we can reliably uncurryThis() in
            // repairES5.js, the next line should be:
            //   return callFn(getter, getProtoOf(thisObj));
            return getter.call(getProtoOf(thisObj));
          }
          function setter(newValue) {
            if (obj === this) {
              throw new TypeError('Cannot set virtually frozen property: ' +
                                  name);
            }
            if (!!gopd(this, name)) {
              this[name] = newValue;
            }
            // TODO(erights): Do all the inherited property checks
            defProp(this, name, {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
          var desc = gopd(obj, name);
          if (desc.configurable && 'value' in desc) {
            value = desc.value;
            getter.prototype = null;
            setter.prototype = null;
            defProp(obj, name, {
              get: getter,
              set: setter,
              // We should be able to omit the enumerable line, since it
              // should default to its existing setting.
              enumerable: desc.enumerable,
              configurable: false
            });
          }
        });
      }
      return freeze(obj);
    }
    return tamperProof;
  };


  var needToTamperProof = [];
  /**
   * Various repairs may expose non-standard objects that are not
   * reachable from startSES's root, and therefore not freezable by
   * startSES's normal whitelist traversal. However, freezing these
   * during repairES5.js may be too early, as it is before WeakMap.js
   * has had a chance to monkey patch Object.freeze if necessary, in
   * order to install hidden properties for its own use before the
   * object becomes non-extensible.
   */
  function rememberToTamperProof(obj) {
    needToTamperProof.push(obj);
  }

  /**
   * Makes and returns a tamperProof(obj) function, and uses it to
   * tamper proof all objects whose tamper proofing had been delayed.
   *
   * <p>"makeDelayedTamperProof()" must only be called once.
   */
  var makeDelayedTamperProofCalled = false;
  ses.makeDelayedTamperProof = function makeDelayedTamperProof() {
    if (makeDelayedTamperProofCalled) {
      throw "makeDelayedTamperProof() must only be called once.";
    }
    var tamperProof = makeTamperProof();
    strictForEachFn(needToTamperProof, tamperProof);
    needToTamperProof = void 0;
    makeDelayedTamperProofCalled = true;
    return tamperProof;
  };

  /**
   * Where the "that" parameter represents a "this" that should have
   * been bound to "undefined" but may be bound to a global or
   * globaloid object.
   *
   * <p>The "desc" parameter is a string to describe the "that" if it
   * is something unexpected.
   */
  function testGlobalLeak(desc, that) {
    if (that === void 0) { return false; }
    if (that === global) { return true; }
    if (objToString.call(that) === '[object Window]') { return true; }
    return desc + ' leaked as: ' + that;
  }

  ////////////////////// Tests /////////////////////
  //
  // Each test is a function of no arguments that should not leave any
  // significant side effects, which tests for the presence of a
  // problem. It returns either
  // <ul>
  // <li>false, meaning that the problem does not seem to be present.
  // <li>true, meaning that the problem is present in a form that we expect.
  // <li>a non-empty string, meaning that there seems to be a related
  //     problem, but we're seeing a symptom different than what we
  //     expect. The string should describe the new symptom. It must
  //     be non-empty so that it is truthy.
  // </ul>
  // All the tests are run first to determine which corresponding
  // repairs to attempt. Then these repairs are run. Then all the
  // tests are rerun to see how they were effected by these repair
  // attempts. Finally, we report what happened.

  /**
   * If {@code Object.getOwnPropertyNames} is missing, we consider
   * this to be an ES3 browser which is unsuitable for attempting to
   * run SES.
   *
   * <p>If {@code Object.getOwnPropertyNames} is missing, there is no
   * way to emulate it.
   */
  function test_MISSING_GETOWNPROPNAMES() {
    return !('getOwnPropertyNames' in Object);
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=64250
   *
   * <p>No workaround attempted. Just reporting that this platform is
   * not SES-safe.
   */
  function test_GLOBAL_LEAKS_FROM_GLOBAL_FUNCTION_CALLS() {
    global.___global_test_function___ = function() { return this; };
    var that = ___global_test_function___();
    delete global.___global_test_function___;
    return testGlobalLeak('Global func "this"', that);
  }

  /**
   * Detects whether the most painful ES3 leak is still with us.
   */
  function test_GLOBAL_LEAKS_FROM_ANON_FUNCTION_CALLS() {
    var that = (function(){ return this; })();
    return testGlobalLeak('Anon func "this"', that);
  }

  var strictThis = this;

  /**
   *
   */
  function test_GLOBAL_LEAKS_FROM_STRICT_THIS() {
    return testGlobalLeak('Strict "this"', strictThis);
  }

  /**
   * Detects
   * https://bugs.webkit.org/show_bug.cgi?id=51097
   * https://bugs.webkit.org/show_bug.cgi?id=58338
   * http://code.google.com/p/v8/issues/detail?id=1437
   *
   * <p>No workaround attempted. Just reporting that this platform is
   * not SES-safe.
   */
  function test_GLOBAL_LEAKS_FROM_BUILTINS() {
    var v = {}.valueOf;
    var that = 'dummy';
    try {
      that = v();
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'valueOf() threw: ' + err;
    }
    if (that === void 0) {
      // Should report as a safe spec violation
      return false;
    }
    return testGlobalLeak('valueOf()', that);
  }

  /**
   *
   */
  function test_GLOBAL_LEAKS_FROM_GLOBALLY_CALLED_BUILTINS() {
    global.___global_valueOf_function___ = {}.valueOf;
    var that = 'dummy';
    try {
      that = ___global_valueOf_function___();
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'valueOf() threw: ' + err;
    } finally {
      delete global.___global_valueOf_function___;
    }
    if (that === void 0) {
      // Should report as a safe spec violation
      return false;
    }
    return testGlobalLeak('Global valueOf()', that);
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=55736
   *
   * <p>As of this writing, the only major browser that does implement
   * Object.getOwnPropertyNames but not Object.freeze etc is the
   * released Safari 5 (JavaScriptCore). The Safari beta 5.0.4
   * (5533.20.27, r84622) already does implement freeze, which is why
   * this WebKit bug is listed as closed. When the released Safari has
   * this fix, we can retire this kludge.
   *
   * <p>This kludge is <b>not</b> safety preserving. The emulations it
   * installs if needed do not actually provide the safety that the
   * rest of SES relies on.
   */
  function test_MISSING_FREEZE_ETC() {
    return !('freeze' in Object);
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1530
   *
   * <p>Detects whether the value of a function's "prototype" property
   * as seen by normal object operations might deviate from the value
   * as seem by the reflective {@code Object.getOwnPropertyDescriptor}
   */
  function test_FUNCTION_PROTOTYPE_DESCRIPTOR_LIES() {
    function foo() {}
    Object.defineProperty(foo, 'prototype', { value: {} });
    return foo.prototype !==
      Object.getOwnPropertyDescriptor(foo, 'prototype').value;
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=55537
   *
   * This bug is fixed on the latest Safari beta 5.0.5 (5533.21.1,
   * r88603). When the released Safari has this fix, we can retire
   * this kludge.
   *
   * <p>This kludge is safety preserving.
   */
  function test_MISSING_CALLEE_DESCRIPTOR() {
    function foo(){}
    if (Object.getOwnPropertyNames(foo).indexOf('callee') < 0) { return false; }
    if (foo.hasOwnProperty('callee')) {
      return 'Empty strict function has own callee';
    }
    return true;
  }

  /**
   * A strict delete should either succeed, returning true, or it
   * should fail by throwing a TypeError. Under no circumstances
   * should a strict delete return false.
   *
   * <p>This case occurs on IE10preview2.
   */
  function test_STRICT_DELETE_RETURNS_FALSE() {
    if (!RegExp.hasOwnProperty('rightContext')) { return false; }
    var deleted;
    try {
      deleted = delete RegExp.rightContext;
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Deletion failed with: ' + err;
    }
    if (deleted) { return false; }
    return true;
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=591846
   * as applied to the RegExp constructor.
   *
   * <p>Note that Mozilla lists this bug as closed. But reading that
   * bug thread clarifies that is partially because the code in {@code
   * repair_REGEXP_CANT_BE_NEUTERED} enables us to work around the
   * non-configurability of the RegExp statics.
   */
  function test_REGEXP_CANT_BE_NEUTERED() {
    if (!RegExp.hasOwnProperty('leftContext')) { return false; }
    var deleted;
    try {
      deleted = delete RegExp.leftContext;
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'Deletion failed with: ' + err;
    }
    if (!RegExp.hasOwnProperty('leftContext')) { return false; }
    if (deleted) {
      return 'Deletion of RegExp.leftContext did not succeed.';
    } else {
      // This case happens on IE10preview2, as demonstrated by
      // test_STRICT_DELETE_RETURNS_FALSE.
      return true;
    }
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1393
   *
   * <p>This kludge is safety preserving.
   */
  function test_REGEXP_TEST_EXEC_UNSAFE() {
    (/foo/).test('xfoox');
    var match = new RegExp('(.|\r|\n)*','').exec()[0];
    if (match === 'undefined') { return false; }
    if (match === 'xfoox') { return true; }
    return 'regExp.exec() does not match against "undefined".';
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=26382
   *
   * <p>As of this writing, the only major browser that does implement
   * Object.getOwnPropertyNames but not Function.prototype.bind is
   * Safari 5 (JavaScriptCore), including the current Safari beta
   * 5.0.4 (5533.20.27, r84622).
   *
   * <p>This kludge is safety preserving. But see
   * https://bugs.webkit.org/show_bug.cgi?id=26382#c25 for why this
   * kludge cannot faithfully implement the specified semantics.
   *
   * <p>See also https://bugs.webkit.org/show_bug.cgi?id=42371
   */
  function test_MISSING_BIND() {
    return !('bind' in Function.prototype);
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=892
   *
   * <p>This tests whether the built-in bind method violates the spec
   * by calling the original using its current .apply method rather
   * than the internal [[Call]] method. The workaround is the same as
   * for test_MISSING_BIND -- to replace the built-in bind with one
   * written in JavaScript. This introduces a different bug though: As
   * https://bugs.webkit.org/show_bug.cgi?id=26382#c29 explains, a
   * bind written in JavaScript cannot emulate the specified currying
   * over the construct behavior, and so fails to enable a var-args
   * {@code new} operation.
   */
  function test_BIND_CALLS_APPLY() {
    if (!('bind' in Function.prototype)) { return false; }
    var applyCalled = false;
    function foo() { return [].slice.call(arguments,0).join(','); }
    foo.apply = function fakeApply(self, args) {
      applyCalled = true;
      return Function.prototype.apply.call(this, self, args);
    };
    var b = foo.bind(33,44);
    var answer = b(55,66);
    if (applyCalled) { return true; }
    if (answer === '44,55,66') { return false; }
    return 'Bind test returned "' + answer + '" instead of "44,55,66".';
  }

  /**
   * Demonstrates the point made by comment 29
   * https://bugs.webkit.org/show_bug.cgi?id=26382#c29
   *
   * <p>Tests whether Function.prototype.bind curries over
   * construction ({@code new}) behavior. A built-in bind should. A
   * bind emulation written in ES5 can't.
   */
  function test_BIND_CANT_CURRY_NEW() {
    function construct(f, args) {
      var bound = Function.prototype.bind.apply(f, [null].concat(args));
      return new bound();
    }
    var d;
    try {
      d = construct(Date, [1957, 4, 27]);
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'Curries construction failed with: ' + err;
    }
    if (typeof d === 'string') { return true; } // Opera
    var str = objToString.call(d);
    if (str === '[object Date]') { return false; }
    return 'Unexpected ' + str + ': ' + d;
  }

  /**
   * Detects http://code.google.com/p/google-caja/issues/detail?id=1362
   *
   * <p>This is an unfortunate oversight in the ES5 spec: Even if
   * Date.prototype is frozen, it is still defined to be a Date, and
   * so has mutable state in internal properties that can be mutated
   * by the primordial mutation methods on Date.prototype, such as
   * {@code Date.prototype.setFullYear}.
   *
   * <p>This kludge is safety preserving.
   */
  function test_MUTABLE_DATE_PROTO() {
    try {
      Date.prototype.setFullYear(1957);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Mutating Date.prototype failed with: ' + err;
    }
    var v = Date.prototype.getFullYear();
    Date.prototype.setFullYear(NaN); // hopefully undoes the damage
    if (v !== v && typeof v === 'number') {
      // NaN indicates we're probably ok.
      // TODO(erights) Should we report this as a symptom anyway, so
      // that we get the repair which gives us a reliable TypeError?
      return false;
    }
    if (v === 1957) { return true; }
    return 'Mutating Date.prototype did not throw';
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=656828
   *
   * <p>A bug in the current FF6.0a1 implementation: Even if
   * WeakMap.prototype is frozen, it is still defined to be a WeakMap,
   * and so has mutable state in internal properties that can be
   * mutated by the primordial mutation methods on WeakMap.prototype,
   * such as {@code WeakMap.prototype.set}.
   *
   * <p>This kludge is safety preserving.
   *
   * <p>TODO(erights): Update the ES spec page to reflect the current
   * agreement with Mozilla.
   */
  function test_MUTABLE_WEAKMAP_PROTO() {
    if (typeof WeakMap !== 'function') { return false; }
    var x = {};
    try {
      WeakMap.prototype.set(x, 86);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Mutating WeakMap.prototype failed with: ' + err;
    }
    var v = WeakMap.prototype.get(x);
    // Since x cannot escape, there's no observable damage to undo.
    if (v === 86) { return true; }
    return 'Mutating WeakMap.prototype did not throw';
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1447
   *
   * <p>This bug is fixed as of V8 r8258 bleeding-edge, but is not yet
   * available in the latest dev-channel Chrome (13.0.782.15 dev).
   *
   * <p>Unfortunately, an ES5 strict method wrapper cannot emulate
   * absence of a [[Construct]] behavior, as specified for the Chapter
   * 15 built-in methods. The installed wrapper relies on {@code
   * Function.prototype.apply}, as inherited by original, obeying its
   * contract.
   *
   * <p>This kludge is safety preserving but non-transparent, in that
   * the real forEach is frozen even in the success case, since we
   * have to freeze it in order to test for this failure. We could
   * repair this non-transparency by replacing it with a transparent
   * wrapper (as http://codereview.appspot.com/5278046/ does), but
   * since the SES use of this will freeze it anyway and the
   * indirection is costly, we choose not to for now.
   */
  function test_NEED_TO_WRAP_FOREACH() {
    if (!('freeze' in Object)) {
      // Object.freeze is still absent on released Android and would
      // cause a bogus bug detection in the following try/catch code.
      return false;
    }
    if (Array.prototype.forEach !== builtInForEach) {
      // If it is already wrapped, we are confident the problem does
      // not occur, and we need to skip the test to avoid freezing the
      // wrapper.
      return false;
    }
    try {
      ['z'].forEach(function(){ Object.freeze(Array.prototype.forEach); });
      return false;
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'freezing forEach failed with ' + err;
    }
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=2273
   *
   * A strict mode function should receive a non-coerced 'this'
   * value. That is, in strict mode, if 'this' is a primitive, it
   * should not be boxed
   */
  function test_FOREACH_COERCES_THISOBJ() {
    "use strict";
    var needsWrapping = true;
    [1].forEach(function(){ needsWrapping = ("string" != typeof this); }, "f");
    return needsWrapping;
  }

  /**
   * <p>Sometimes, when trying to freeze an object containing an
   * accessor property with a getter but no setter, Chrome <= 17 fails
   * with <blockquote>Uncaught TypeError: Cannot set property ident___
   * of #<Object> which has only a getter</blockquote>. So if
   * necessary, this kludge overrides {@code Object.defineProperty} to
   * always install a dummy setter in lieu of the absent one.
   *
   * <p>Since this problem seems to have gone away as of Chrome 18, it
   * is no longer as important to isolate and report it.
   *
   * <p>TODO(erights): We should also override {@code
   * Object.getOwnPropertyDescriptor} to hide the presence of the
   * dummy setter, and instead report an absent setter.
   */
  function test_NEEDS_DUMMY_SETTER() {
    if (NEEDS_DUMMY_SETTER_repaired) { return false; }
    if (typeof navigator === 'undefined') { return false; }
    var ChromeMajorVersionPattern = (/Chrome\/(\d*)\./);
    var match = ChromeMajorVersionPattern.exec(navigator.userAgent);
    if (!match) { return false; }
    var ver = +match[1];
    return ver <= 17;
  }
  /** we use this variable only because we haven't yet isolated a test
   * for the problem. */
  var NEEDS_DUMMY_SETTER_repaired = false;

  /**
   * Detects http://code.google.com/p/chromium/issues/detail?id=94666
   */
  function test_FORM_GETTERS_DISAPPEAR() {
    function getter() { return 'gotten'; }

    if (typeof document === 'undefined' ||
       typeof document.createElement !== 'function') {
      // likely not a browser environment
      return false;
    }
    var f = document.createElement("form");
    try {
      Object.defineProperty(f, 'foo', {
        get: getter,
        set: void 0
      });
    } catch (err) {
      // Happens on Safari 5.0.2 on IPad2.
      return 'defining accessor on form failed with: ' + err;
    }
    var desc = Object.getOwnPropertyDescriptor(f, 'foo');
    if (desc.get === getter) { return false; }
    if (desc.get === void 0) { return true; }
    return 'Getter became ' + desc.get;
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=637994
   *
   * <p>On Firefox 4 an inherited non-configurable accessor property
   * appears to be an own property of all objects which inherit this
   * accessor property. This is fixed as of Forefox Nightly 7.0a1
   * (2011-06-21).
   *
   * <p>Our workaround wraps hasOwnProperty, getOwnPropertyNames, and
   * getOwnPropertyDescriptor to heuristically decide when an accessor
   * property looks like it is apparently own because of this bug, and
   * suppress reporting its existence.
   *
   * <p>However, it is not feasible to likewise wrap JSON.stringify,
   * and this bug will cause JSON.stringify to be misled by inherited
   * enumerable non-configurable accessor properties. To prevent this,
   * we wrap defineProperty, freeze, and seal to prevent the creation
   * of <i>enumerable</i> non-configurable accessor properties on
   * those platforms with this bug.
   *
   * <p>A little known fact about JavaScript is that {@code
   * Object.prototype.propertyIsEnumerable} actually tests whether a
   * property is both own and enumerable. Assuming that our wrapping
   * of defineProperty, freeze, and seal prevents the occurrence of an
   * enumerable non-configurable accessor property, it should also
   * prevent the occurrence of this bug for any enumerable property,
   * and so we do not need to wrap propertyIsEnumerable.
   *
   * <p>This kludge seems to be safety preserving, but the issues are
   * delicate and not well understood.
   */
  function test_ACCESSORS_INHERIT_AS_OWN() {
    var base = {};
    var derived = Object.create(base);
    function getter() { return 'gotten'; }
    Object.defineProperty(base, 'foo', { get: getter });
    if (!derived.hasOwnProperty('foo') &&
        Object.getOwnPropertyDescriptor(derived, 'foo') === void 0 &&
        Object.getOwnPropertyNames(derived).indexOf('foo') < 0) {
      return false;
    }
    if (!derived.hasOwnProperty('foo') ||
        Object.getOwnPropertyDescriptor(derived, 'foo').get !== getter ||
        Object.getOwnPropertyNames(derived).indexOf('foo') < 0) {
      return 'Accessor properties partially inherit as own properties.';
    }
    Object.defineProperty(base, 'bar', { get: getter, configurable: true });
    if (!derived.hasOwnProperty('bar') &&
        Object.getOwnPropertyDescriptor(derived, 'bar') === void 0 &&
        Object.getOwnPropertyNames(derived).indexOf('bar') < 0) {
      return true;
    }
    return 'Accessor properties inherit as own even if configurable.';
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1360
   *
   * Our workaround wraps {@code sort} to wrap the comparefn.
   */
  function test_SORT_LEAKS_GLOBAL() {
    var that = 'dummy';
    [2,3].sort(function(x,y) { that = this; return x - y; });
    if (that === void 0) { return false; }
    if (that === global) { return true; }
    return 'sort called comparefn with "this" === ' + that;
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1360
   *
   * <p>Our workaround wraps {@code replace} to wrap the replaceValue
   * if it's a function.
   */
  function test_REPLACE_LEAKS_GLOBAL() {
    var that = 'dummy';
    function capture() { that = this; return 'y';}
    'x'.replace(/x/, capture);
    if (that === void 0) { return false; }
    if (that === capture) {
      // This case happens on IE10preview2. See
      // https://connect.microsoft.com/IE/feedback/details/685928/
      //   bad-this-binding-for-callback-in-string-prototype-replace
      // TODO(erights): When this happens, the kludge.description is
      // wrong.
      return true;
    }
    if (that === global) { return true; }
    return 'Replace called replaceValue function with "this" === ' + that;
  }

  /**
   * Detects
   * https://connect.microsoft.com/IE/feedback/details/
   *   685436/getownpropertydescriptor-on-strict-caller-throws
   *
   * <p>Object.getOwnPropertyDescriptor must work even on poisoned
   * "caller" properties.
   */
  function test_CANT_GOPD_CALLER() {
    var desc = null;
    try {
      desc = Object.getOwnPropertyDescriptor(function(){}, 'caller');
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'getOwnPropertyDescriptor failed with: ' + err;
    }
    if (desc &&
        typeof desc.get === 'function' &&
        typeof desc.set === 'function' &&
        !desc.configurable) {
      return false;
    }
    if (desc &&
        desc.value === null &&
        !desc.writable &&
        !desc.configurable) {
      // Seen in IE9. Harmless by itself
      return false;
    }
    return 'getOwnPropertyDesciptor returned unexpected caller descriptor';
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=63398
   *
   * <p>A strict function's caller should be poisoned only in a way
   * equivalent to an accessor property with a throwing getter and
   * setter.
   *
   * <p>Seen on Safari 5.0.6 through WebKit Nightly r93670
   */
  function test_CANT_HASOWNPROPERTY_CALLER() {
    var answer = void 0;
    try {
      answer = function(){}.hasOwnProperty('caller');
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'hasOwnProperty failed with: ' + err;
    }
    if (answer) { return false; }
    return 'strict_function.hasOwnProperty("caller") was false';
  }

  /**
   * Protect an 'in' with a try/catch to workaround a bug in Safari
   * WebKit Nightly Version 5.0.5 (5533.21.1, r89741).
   *
   * <p>See https://bugs.webkit.org/show_bug.cgi?id=63398
   *
   * <p>Notes: We're seeing exactly
   * <blockquote>
   *   New symptom (c): ('caller' in &lt;a bound function&gt;) threw:
   *   TypeError: Cannot access caller property of a strict mode
   *   function<br>
   *   New symptom (c): ('arguments' in &lt;a bound function&gt;)
   *   threw: TypeError: Can't access arguments object of a strict
   *   mode function
   * </blockquote>
   * which means we're skipping both the catch and the finally in
   * {@code has} while hitting the catch in {@code has2}. Further, if
   * we remove one of these finally clauses (forget which) and rerun
   * the example, if we're under the debugger the browser crashes. If
   * we're not, then the TypeError escapes both catches.
   */
  function has(base, name, baseDesc) {
    var result = void 0;
    var finallySkipped = true;
    try {
      result = name in base;
    } catch (err) {
      logger.error('New symptom (a): (\'' +
                   name + '\' in <' + baseDesc + '>) threw: ', err);
      // treat this as a safe absence
      result = false;
      return false;
    } finally {
      finallySkipped = false;
      if (result === void 0) {
        logger.error('New symptom (b): (\'' +
                     name + '\' in <' + baseDesc + '>) failed');
      }
    }
    if (finallySkipped) {
      logger.error('New symptom (e): (\'' +
                   name + '\' in <' + baseDesc +
                   '>) inner finally skipped');
    }
    return !!result;
  }

  function has2(base, name, baseDesc) {
    var result = void 0;
    var finallySkipped = true;
    try {
      result = has(base, name, baseDesc);
    } catch (err) {
      logger.error('New symptom (c): (\'' +
                   name + '\' in <' + baseDesc + '>) threw: ', err);
      // treat this as a safe absence
      result = false;
      return false;
    } finally {
      finallySkipped = false;
      if (result === void 0) {
        logger.error('New symptom (d): (\'' +
                     name + '\' in <' + baseDesc + '>) failed');
      }
    }
    if (finallySkipped) {
      logger.error('New symptom (f): (\'' +
                   name + '\' in <' + baseDesc +
                   '>) outer finally skipped');
    }
    return !!result;
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=63398
   *
   * <p>If this reports a problem in the absence of "New symptom (a)",
   * it means the error thrown by the "in" in {@code has} is skipping
   * past the first layer of "catch" surrounding that "in". This is in
   * fact what we're currently seeing on Safari WebKit Nightly Version
   * 5.0.5 (5533.21.1, r91108).
   */
  function test_CANT_IN_CALLER() {
    var answer = void 0;
    try {
      answer = has2(function(){}, 'caller', 'strict_function');
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return '("caller" in strict_func) failed with: ' + err;
    } finally {}
    if (answer) { return false; }
    return '("caller" in strict_func) was false.';
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=63398
   *
   * <p>If this reports a problem in the absence of "New symptom (a)",
   * it means the error thrown by the "in" in {@code has} is skipping
   * past the first layer of "catch" surrounding that "in". This is in
   * fact what we're currently seeing on Safari WebKit Nightly Version
   * 5.0.5 (5533.21.1, r91108).
   */
  function test_CANT_IN_ARGUMENTS() {
    var answer = void 0;
    try {
      answer = has2(function(){}, 'arguments', 'strict_function');
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return '("arguments" in strict_func) failed with: ' + err;
    } finally {}
    if (answer) { return false; }
    return '("arguments" in strict_func) was false.';
  }

  /**
   * Detects whether strict function violate caller anonymity.
   */
  function test_STRICT_CALLER_NOT_POISONED() {
    if (!has2(strictMapFn, 'caller', 'a strict function')) { return false; }
    function foo(m) { return m.caller; }
    // using Function so it'll be non-strict
    var testfn = Function('m', 'f', 'return m([m], f)[0];');
    var caller;
    try {
      caller = testfn(strictMapFn, foo);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Strict "caller" failed with: ' + err;
    }
    if (testfn === caller) {
      // Seen on IE 9
      return true;
    }
    return 'Unexpected "caller": ' + caller;
  }

  /**
   * Detects whether strict functions are encapsulated.
   */
  function test_STRICT_ARGUMENTS_NOT_POISONED() {
    if (!has2(strictMapFn, 'arguments', 'a strict function')) { return false; }
    function foo(m) { return m.arguments; }
    // using Function so it'll be non-strict
    var testfn = Function('m', 'f', 'return m([m], f)[0];');
    var args;
    try {
      args = testfn(strictMapFn, foo);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Strict "arguments" failed with: ' + err;
    }
    if (args[1] === foo) {
      // Seen on IE 9
      return true;
    }
    return 'Unexpected arguments: ' + arguments;
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=591846 as
   * applied to "caller"
   */
  function test_BUILTIN_LEAKS_CALLER() {
    if (!has2(builtInMapMethod, 'caller', 'a builtin')) { return false; }
    function foo(m) { return m.caller; }
    // using Function so it'll be non-strict
    var testfn = Function('a', 'f', 'return a.map(f)[0];');
    var a = [builtInMapMethod];
    a.map = builtInMapMethod;
    var caller;
    try {
      caller = testfn(a, foo);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Built-in "caller" failed with: ' + err;
    }
    if (null === caller || void 0 === caller) { return false; }
    if (testfn === caller) { return true; }
    return 'Unexpected "caller": ' + caller;
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=591846 as
   * applied to "arguments"
   */
  function test_BUILTIN_LEAKS_ARGUMENTS() {
    if (!has2(builtInMapMethod, 'arguments', 'a builtin')) { return false; }
    function foo(m) { return m.arguments; }
    // using Function so it'll be non-strict
    var testfn = Function('a', 'f', 'return a.map(f)[0];');
    var a = [builtInMapMethod];
    a.map = builtInMapMethod;
    var args;
    try {
      args = testfn(a, foo);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Built-in "arguments" failed with: ' + err;
    }
    if (args === void 0 || args === null) { return false; }
    return true;
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=893
   */
  function test_BOUND_FUNCTION_LEAKS_CALLER() {
    if (!('bind' in Function.prototype)) { return false; }
    function foo() { return bar.caller; }
    var bar = foo.bind({});
    if (!has2(bar, 'caller', 'a bound function')) { return false; }
    // using Function so it'll be non-strict
    var testfn = Function('b', 'return b();');
    var caller;
    try {
      caller = testfn(bar);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Bound function "caller" failed with: ' + err;
    }
    if (caller === void 0 || caller === null) { return false; }
    if (caller === testfn) { return true; }
    return 'Unexpected "caller": ' + caller;
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=893
   */
  function test_BOUND_FUNCTION_LEAKS_ARGUMENTS() {
    if (!('bind' in Function.prototype)) { return false; }
    function foo() { return bar.arguments; }
    var bar = foo.bind({});
    if (!has2(bar, 'arguments', 'a bound function')) { return false; }
    // using Function so it'll be non-strict
    var testfn = Function('b', 'return b();');
    var args;
    try {
      args = testfn(bar);
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Bound function "arguments" failed with: ' + err;
    }
    if (args === void 0 || args === null) { return false; }
    return true;
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=70207
   *
   * <p>After deleting a built-in, the problem is that
   * getOwnPropertyNames still lists the name as present, but it seems
   * absent in all other ways.
   */
  function test_DELETED_BUILTINS_IN_OWN_NAMES() {
    if (!('__defineSetter__' in Object.prototype)) { return false; }
    var desc = Object.getOwnPropertyDescriptor(Object.prototype,
                                               '__defineSetter__');
    try {
      try {
        delete Object.prototype.__defineSetter__;
      } catch (err1) {
        return false;
      }
      var names = Object.getOwnPropertyNames(Object.prototype);
      if (names.indexOf('__defineSetter__') === -1) { return false; }
      if ('__defineSetter__' in Object.prototype) {
        // If it's still there, it bounced back. Which is still a
        // problem, but not the problem we're testing for here.
        return false;
      }
      return true;
    } finally {
      Object.defineProperty(Object.prototype, '__defineSetter__', desc);
    }
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1769
   */
  function test_GETOWNPROPDESC_OF_ITS_OWN_CALLER_FAILS() {
    try {
      Object.getOwnPropertyDescriptor(Object.getOwnPropertyDescriptor,
                                      'caller');
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'getOwnPropertyDescriptor threw: ' + err;
    }
    return false;
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=621
   *
   */
  function test_JSON_PARSE_PROTO_CONFUSION() {
    var x;
    try {
      x = JSON.parse('{"__proto__":[]}');
    } catch (err) {
      if (err instanceof TypeError) {
        // We consider it acceptable to fail this case with a
        // TypeError, as our repair below will cause it to do.
        return false;
      }
      return 'JSON.parse failed with: ' + err;
    }
    if (Object.getPrototypeOf(x) !== Object.prototype) { return true; }
    if (Array.isArray(x.__proto__)) { return false; }
    return 'JSON.parse did not set "__proto__" as a regular property';
  }

  /**
   * Detects https://bugs.webkit.org/show_bug.cgi?id=65832
   *
   * <p>On a non-extensible object, it must not be possible to change
   * its internal [[Prototype]] property, i.e., which object it
   * inherits from.
   *
   * TODO(erights): investigate the following:
   * At http://goo.gl/ycCmo Mike Stay says
   * <blockquote>
   * Kevin notes in domado.js that on some versions of FF, event
   * objects switch prototypes when moving between frames. You should
   * probably check out their behavior around freezing and sealing.
   * </blockquote>
   * But I couldn't find it.
   */
  function test_PROTO_NOT_FROZEN() {
    if (!('freeze' in Object)) {
      // Object.freeze and its ilk (including preventExtensions) are
      // still absent on released Android and would
      // cause a bogus bug detection in the following try/catch code.
      return false;
    }
    var x = Object.preventExtensions({});
    if (x.__proto__ === void 0 && !('__proto__' in x)) { return false; }
    var y = {};
    try {
      x.__proto__ = y;
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Mutating __proto__ failed with: ' + err;
    }
    if (y.isPrototypeOf(x)) { return true; }
    return 'Mutating __proto__ neither failed nor succeeded';
  }

  /**
   * Like test_PROTO_NOT_FROZEN but using defineProperty rather than
   * assignment.
   */
  function test_PROTO_REDEFINABLE() {
    if (!('freeze' in Object)) {
      // Object.freeze and its ilk (including preventExtensions) are
      // still absent on released Android and would
      // cause a bogus bug detection in the following try/catch code.
      return false;
    }
    var x = Object.preventExtensions({});
    if (x.__proto__ === void 0 && !('__proto__' in x)) { return false; }
    var y = {};
    try {
      Object.defineProperty(x, '__proto__', { value: y });
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Defining __proto__ failed with: ' + err;
    }
    if (y.isPrototypeOf(x)) { return true; }
    return 'Defining __proto__ neither failed nor succeeded';
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1624
   *
   * <p>Both a direct strict eval operator and an indirect strict eval
   * function must not leak top level declarations in the string being
   * evaluated into their containing context.
   */
  function test_STRICT_EVAL_LEAKS_GLOBALS() {
    (1,eval)('"use strict"; var ___global_test_variable___ = 88;');
    if ('___global_test_variable___' in global) {
      delete global.___global_test_variable___;
      return true;
    }
    return false;
  }

  /**
   * Detects http://code.google.com/p/v8/issues/detail?id=1645
   */
  function test_PARSEINT_STILL_PARSING_OCTAL() {
    var n = parseInt('010');
    if (n === 10) { return false; }
    if (n === 8)  { return true; }
    return 'parseInt("010") returned ' + n;
  }

  /**
   * Detects https://bugzilla.mozilla.org/show_bug.cgi?id=695577
   *
   * <p>When E4X syntax is accepted in strict code, then without
   * parsing, we cannot prevent untrusted code from expressing E4X
   * literals and so obtaining access to shared E4X prototypes,
   * despite the absence of these prototypes from our whitelist. While
   * https://bugzilla.mozilla.org/show_bug.cgi?id=695579 is also
   * open, we cannot even repair the situation, leading to unpluggable
   * capability leaks. However, we do not test for this additional
   * problem, since E4X is such a can of worms that 695577 is adequate
   * by itself for us to judge this platform to be insecurable without
   * parsing.
   */
  function test_STRICT_E4X_LITERALS_ALLOWED() {
    var x;
    try {
      x = eval('"use strict";(<foo/>);');
    } catch (err) {
      if (err instanceof SyntaxError) { return false; }
      return 'E4X test failed with: ' + err;
    }
    if (x !== void 0) { return true; }
    return 'E4X literal expression had no value';
  }

  /**
   * Detects whether assignment can override an inherited
   * non-writable, non-configurable data property.
   *
   * <p>According to ES5.1, assignment should not be able to do so,
   * which is unfortunate for SES, as the tamperProof function must
   * kludge expensively to ensure that legacy assignments that don't
   * violate best practices continue to work. Ironically, on platforms
   * in which this bug is present, tamperProof can just be cheaply
   * equivalent to Object.freeze.
   */
  function test_ASSIGN_CAN_OVERRIDE_FROZEN() {
    var x = Object.freeze({foo: 88});
    var y = Object.create(x);
    try {
      y.foo = 99;
    } catch (err) {
      if (err instanceof TypeError) { return false; }
      return 'Override failed with: ' + err;
    }
    if (y.foo === 99) { return true; }
    if (y.foo === 88) { return 'Override failed silently'; }
    return 'Unexpected override outcome: ' + y.foo;
  }

  /**
   * Detects whether callng pop on a frozen array can modify the array.
   * See https://bugs.webkit.org/show_bug.cgi?id=75788
   */
  function test_POP_IGNORES_FROZEN() {
    var x = [1,2];
    Object.freeze(x);
    try {
      x.pop();
    } catch (e) {
      if (x.length !== 2) { return 'Unexpected modification of frozen array'; }
      if (x[0] === 1 && x[1] === 2) { return false; }
    }
    if (x.length !== 2 || x[0] !== 1 || x[1] !== 2) {
      return 'Unexpected silent modification of frozen array';
    }
    // Should report silent failure as a safe spec violation
    return false;
  }

  /**
   * In some browsers, assigning to array length can delete
   * non-configurable properties.
   * https://bugzilla.mozilla.org/show_bug.cgi?id=590690
   * TODO(felix8a): file bug for chrome
   */
  function test_ARRAYS_TOO_MUTABLE() {
    var x = [];
    Object.defineProperty(x, 0, { value: 3, configurable: false });
    try {
      x.length = 0;
    } catch (e) {}
    return x.length !== 1 || x[0] !== 3;
  }

  /**
   *
   */
  function test_CANT_REDEFINE_NAN_TO_ITSELF() {
    var descNaN = Object.getOwnPropertyDescriptor(global, 'NaN');
    try {
      Object.defineProperty(global, 'NaN', descNaN);
    } catch (err) {
      if (err instanceof TypeError) { return true; }
      return 'defineProperty of NaN failed with: ' + err;
    }
    return false;
  }

  /**		
   * In Firefox 15+, Object.freeze and Object.isFrozen only work for		
   * descendents of that same Object.		
   */		
  function test_FIREFOX_15_FREEZE_PROBLEM() {		
    if (!document || !document.createElement) { return false; }		
    var iframe = document.createElement('iframe');		
    var where = document.getElementsByTagName('script')[0];		
    where.parentNode.insertBefore(iframe, where);		
    var otherObject = iframe.contentWindow.Object;		
    where.parentNode.removeChild(iframe);		
    var obj = {};		
    otherObject.freeze(obj);		
    return !Object.isFrozen(obj);		
  }

  /**
   * These are all the own properties that appear on Error instances
   * on various ES5 platforms as of this writing.
   *
   * <p>Due to browser bugs, some of these are absent from
   * getOwnPropertyNames (gopn). TODO(erights): File bugs with various
   * browser makers for any own properties that we know to be present
   * but not reported by gopn.
   *
   * <p>TODO(erights): do intelligence with the various browser
   * implementors to find out what other properties are provided by
   * their implementation but absent from gopn, whether on Errors or
   * anything else. Every one of these are potentially fatal to our
   * security until we can examine these.
   *
   * <p>The source form is a list rather than a map so that we can list a
   * name like "message" for each browser section we think it goes in.
   *
   * <p>We thank the following people, projects, and websites for
   * providing some useful intelligence of what property names we
   * should suspect:<ul>
   * <li><a href="http://stacktracejs.com">stacktracejs.com</a>
   * <li>TODO(erights): find message on es-discuss list re
   * "   stack". credit author.
   * </ul>
   */
  var errorInstanceWhitelist = [
    // at least Chrome 16
    'arguments',
    'message',
    'stack',
    'type',

    // at least FF 9
    'fileName',
    'lineNumber',
    'message',
    'stack',

    // at least Safari, WebKit 5.1
    'line',
    'message',
    'sourceId',
    'sourceURL',

    // at least IE 10 preview 2
    'description',
    'message',
    'number',

    // at least Opera 11.60
    'message',
    'stack',
    'stacktrace'
  ];

  var errorInstanceBlacklist = [
    // seen in a Firebug on FF
    'category',
    'context',
    'href',
    'lineNo',
    'msgId',
    'source',
    'trace',
    'correctSourcePoint',
    'correctWithStackTrace',
    'getSourceLine',
    'resetSource'
  ];

  /** Return a fresh one so client can mutate freely */
  function freshErrorInstanceWhiteMap() {
    var result = Object.create(null);
    strictForEachFn(errorInstanceWhitelist, function(name) {
      // We cannot yet use StringMap so do it manually
      // We do this naively here assuming we don't need to worry about
      // __proto__
      result[name] = true;
    });
    return result;
  }

  /**
   * Do Error instances on those platform carry own properties that we
   * haven't yet examined and determined to be SES-safe?
   *
   * <p>A new property should only be added to the
   * errorInstanceWhitelist after inspecting the consequences of that
   * property to determine that it does not compromise SES safety. If
   * some platform maker does add an Error own property that does
   * compromise SES safety, that might be a severe problem, if we
   * can't find a way to deny untrusted code access to that property.
   */
  function test_UNEXPECTED_ERROR_PROPERTIES() {
    var errs = [new Error('e1')];
    try { null.foo = 3; } catch (err) { errs.push(err); }
    var result = false;

    var approvedNames = freshErrorInstanceWhiteMap();

    strictForEachFn(errs, function(err) {
      strictForEachFn(Object.getOwnPropertyNames(err), function(name) {
         if (!(name in approvedNames)) {
           result = 'Unexpected error instance property: ' + name;
           // would be good to terminate early
         }
      });
    });
    return result;
  }

  /**
   * On Firefox 14+ (and probably earlier), error instances have magical
   * properties that do not appear in getOwnPropertyNames until you refer
   * to the property.  This makes test_UNEXPECTED_ERROR_PROPERTIES
   * unreliable, so we can't assume that passing that test is safe.
   */
  function test_ERRORS_HAVE_INVISIBLE_PROPERTIES() {
    var gopn = Object.getOwnPropertyNames;
    var gopd = Object.getOwnPropertyDescriptor;

    var errors = [new Error('e1')];
    try { null.foo = 3; } catch (err) { errors.push(err); }
    for (var i = 0; i < errors.length; i++) {
      var err = errors[i];
      var found = Object.create(null);
      strictForEachFn(gopn(err), function (prop) {
        found[prop] = true;
      });
      var j, prop;
      for (j = 0; j < errorInstanceWhitelist.length; j++) {
        prop = errorInstanceWhitelist[j];
        if (gopd(err, prop) && !found[prop]) {
          return true;
        }
      }
      for (j = 0; j < errorInstanceBlacklist.length; j++) {
        prop = errorInstanceBlacklist[j];
        if (gopd(err, prop) && !found[prop]) {
          return true;
        }
      }
    }
    return false;
  }

  ////////////////////// Repairs /////////////////////
  //
  // Each repair_NAME function exists primarily to repair the problem
  // indicated by the corresponding test_NAME function. But other test
  // failures can still trigger a given repair.


  var call = Function.prototype.call;
  var apply = Function.prototype.apply;

  var hop = Object.prototype.hasOwnProperty;
  var slice = Array.prototype.slice;
  var concat = Array.prototype.concat;
  var getPrototypeOf = Object.getPrototypeOf;

  function patchMissingProp(base, name, missingFunc) {
    if (!(name in base)) {
      Object.defineProperty(base, name, {
        value: missingFunc,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  function repair_MISSING_FREEZE_ETC() {
    patchMissingProp(Object, 'freeze',
                     function fakeFreeze(obj) { return obj; });
    patchMissingProp(Object, 'seal',
                     function fakeSeal(obj) { return obj; });
    patchMissingProp(Object, 'preventExtensions',
                     function fakePreventExtensions(obj) { return obj; });
    patchMissingProp(Object, 'isFrozen',
                     function fakeIsFrozen(obj) { return false; });
    patchMissingProp(Object, 'isSealed',
                     function fakeIsSealed(obj) { return false; });
    patchMissingProp(Object, 'isExtensible',
                     function fakeIsExtensible(obj) { return true; });
  }

  function repair_FUNCTION_PROTOTYPE_DESCRIPTOR_LIES() {
    var unsafeDefProp = Object.defineProperty;
    function repairedDefineProperty(base, name, desc) {
      if (typeof base === 'function' &&
          name === 'prototype' &&
          'value' in desc) {
        try {
          base.prototype = desc.value;
        } catch (err) {
          logger.warn('prototype fixup failed', err);
        }
      }
      return unsafeDefProp(base, name, desc);
    }
    Object.defineProperty(Object, 'defineProperty', {
      value: repairedDefineProperty
    });
  }

  function repair_MISSING_CALLEE_DESCRIPTOR() {
    var realGOPN = Object.getOwnPropertyNames;
    Object.defineProperty(Object, 'getOwnPropertyNames', {
      value: function calleeFix(base) {
        var result = realGOPN(base);
        if (typeof base === 'function') {
          var i = result.indexOf('callee');
          if (i >= 0 && !hop.call(base, 'callee')) {
            result.splice(i, 1);
          }
        }
        return result;
      }
    });
  }

  function repair_REGEXP_CANT_BE_NEUTERED() {
    var UnsafeRegExp = RegExp;
    var FakeRegExp = function RegExpWrapper(pattern, flags) {
      switch (arguments.length) {
        case 0: {
          return UnsafeRegExp();
        }
        case 1: {
          return UnsafeRegExp(pattern);
        }
        default: {
          return UnsafeRegExp(pattern, flags);
        }
      }
    };
    Object.defineProperty(FakeRegExp, 'prototype', {
      value: UnsafeRegExp.prototype
    });
    Object.defineProperty(FakeRegExp.prototype, 'constructor', {
      value: FakeRegExp
    });
    RegExp = FakeRegExp;
  }

  function repair_REGEXP_TEST_EXEC_UNSAFE() {
    var unsafeRegExpExec = RegExp.prototype.exec;
    var unsafeRegExpTest = RegExp.prototype.test;

    Object.defineProperty(RegExp.prototype, 'exec', {
      value: function fakeExec(specimen) {
        return unsafeRegExpExec.call(this, String(specimen));
      }
    });
    Object.defineProperty(RegExp.prototype, 'test', {
      value: function fakeTest(specimen) {
        return unsafeRegExpTest.call(this, String(specimen));
      }
    });
  }

  function repair_MISSING_BIND() {

    /**
     * Actual bound functions are not supposed to have a prototype, and
     * are supposed to curry over both the [[Call]] and [[Construct]]
     * behavior of their original function. However, in ES5,
     * functions written in JavaScript cannot avoid having a 'prototype'
     * property, and cannot reliably distinguish between being called as
     * a function vs as a constructor, i.e., by {@code new}.
     *
     * <p>Since the repair_MISSING_BIND emulation produces a bound
     * function written in JavaScript, it cannot faithfully emulate
     * either the lack of a 'prototype' property nor the currying of the
     * [[Construct]] behavior. So instead, we use BOGUS_BOUND_PROTOTYPE
     * to reliably give an error for attempts to {@code new} a bound
     * function. Since we cannot avoid exposing BOGUS_BOUND_PROTOTYPE
     * itself, it is possible to pass in a this-binding which inherits
     * from it without using {@code new}, which will also trigger our
     * error case. Whether this latter error is appropriate or not, it
     * still fails safe.
     *
     * <p>By making the 'prototype' of the bound function be the same as
     * the current {@code thisFunc.prototype}, we could have emulated
     * the [[HasInstance]] property of bound functions. But even this
     * would have been inaccurate, since we would be unable to track
     * changes to the original {@code thisFunc.prototype}. (We cannot
     * make 'prototype' into an accessor to do this tracking, since
     * 'prototype' on a function written in JavaScript is
     * non-configurable.) And this one partially faithful emulation
     * would have come at the cost of no longer being able to reasonably
     * detect construction, in order to safely reject it.
     */
    var BOGUS_BOUND_PROTOTYPE = {
      toString: function BBPToString() { return 'bogus bound prototype'; }
    };
    rememberToTamperProof(BOGUS_BOUND_PROTOTYPE);
    BOGUS_BOUND_PROTOTYPE.toString.prototype = null;
    rememberToTamperProof(BOGUS_BOUND_PROTOTYPE.toString);

    var defProp = Object.defineProperty;
    defProp(Function.prototype, 'bind', {
      value: function fakeBind(self, var_args) {
        var thisFunc = this;
        var leftArgs = slice.call(arguments, 1);
        function funcBound(var_args) {
          if (this === Object(this) &&
              getPrototypeOf(this) === BOGUS_BOUND_PROTOTYPE) {
            throw new TypeError(
              'Cannot emulate "new" on pseudo-bound function.');
          }
          var args = concat.call(leftArgs, slice.call(arguments, 0));
          return apply.call(thisFunc, self, args);
        }
        defProp(funcBound, 'prototype', {
          value: BOGUS_BOUND_PROTOTYPE,
          writable: false,
          configurable: false
        });
        return funcBound;
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  /**
   * Return a function suitable for using as a forEach argument on a
   * list of method names, where that function will monkey patch each
   * of these names methods on {@code constr.prototype} so that they
   * can't be called on a {@code constr.prototype} itself even across
   * frames.
   *
   * <p>This only works when {@code constr} corresponds to an internal
   * [[Class]] property whose value is {@code classString}. To test
   * for {@code constr.prototype} cross-frame, we observe that for all
   * objects of this [[Class]], only the prototypes directly inherit
   * from an object that does not have this [[Class]].
   */
  function makeMutableProtoPatcher(constr, classString) {
    var proto = constr.prototype;
    var baseToString = objToString.call(proto);
    if (baseToString !== '[object ' + classString + ']') {
      throw new TypeError('unexpected: ' + baseToString);
    }
    var grandProto = getPrototypeOf(proto);
    var grandBaseToString = objToString.call(grandProto);
    if (grandBaseToString === '[object ' + classString + ']') {
      throw new TypeError('malformed inheritance: ' + classString);
    }
    if (grandProto !== Object.prototype) {
      logger.log('unexpected inheritance: ' + classString);
    }
    function mutableProtoPatcher(name) {
      if (!hop.call(proto, name)) { return; }
      var originalMethod = proto[name];
      function replacement(var_args) {
        var parent = getPrototypeOf(this);
        if (parent !== proto) {
          // In the typical case, parent === proto, so the above test
          // lets the typical case succeed quickly.
          // Note that, even if parent === proto, that does not
          // necessarily mean that the method application will
          // succeed, since, for example, a non-Date can still inherit
          // from Date.prototype. However, in such cases, the built-in
          // method application will fail on its own without our help.
          if (objToString.call(parent) !== baseToString) {
            // As above, === baseToString does not necessarily mean
            // success, but the built-in failure again would not need
            // our help.
            var thisToString = objToString.call(this);
            if (thisToString === baseToString) {
              throw new TypeError('May not mutate internal state of a ' +
                                  classString + '.prototype');
            } else {
              throw new TypeError('Unexpected: ' + thisToString);
            }
          }
        }
        return originalMethod.apply(this, arguments);
      }
      Object.defineProperty(proto, name, { value: replacement });
    }
    return mutableProtoPatcher;
  }


  function repair_MUTABLE_DATE_PROTO() {
    // Note: coordinate this list with maintenance of whitelist.js
    ['setYear',
     'setTime',
     'setFullYear',
     'setUTCFullYear',
     'setMonth',
     'setUTCMonth',
     'setDate',
     'setUTCDate',
     'setHours',
     'setUTCHours',
     'setMinutes',
     'setUTCMinutes',
     'setSeconds',
     'setUTCSeconds',
     'setMilliseconds',
     'setUTCMilliseconds'].forEach(makeMutableProtoPatcher(Date, 'Date'));
  }

  function repair_MUTABLE_WEAKMAP_PROTO() {
    // Note: coordinate this list with maintanence of whitelist.js
    ['set',
     'delete'].forEach(makeMutableProtoPatcher(WeakMap, 'WeakMap'));
  }

  function repair_NEED_TO_WRAP_FOREACH() {
    Object.defineProperty(Array.prototype, 'forEach', {
      // Taken from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
      value: function(callback, thisArg) { 
        var T, k;
        if (this === null || this === undefined) {
          throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (objToString.call(callback) !== "[object Function]") {
          throw new TypeError(callback + " is not a function");
        }
        T = thisArg;
        k = 0;
        while(k < len) {
          var kValue;
          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }
          k++;
        }
      }
    });
  }


  function repair_NEEDS_DUMMY_SETTER() {
    var defProp = Object.defineProperty;
    var gopd = Object.getOwnPropertyDescriptor;

    function dummySetter(newValue) {
      throw new TypeError('no setter for assigning: ' + newValue);
    }
    dummySetter.prototype = null;
    rememberToTamperProof(dummySetter);

    defProp(Object, 'defineProperty', {
      value: function setSetterDefProp(base, name, desc) {
        if (typeof desc.get === 'function' && desc.set === void 0) {
          var oldDesc = gopd(base, name);
          if (oldDesc) {
            var testBase = {};
            defProp(testBase, name, oldDesc);
            defProp(testBase, name, desc);
            desc = gopd(testBase, name);
            if (desc.set === void 0) { desc.set = dummySetter; }
          } else {
            if (objToString.call(base) === '[object HTMLFormElement]') {
              // This repair was triggering bug
              // http://code.google.com/p/chromium/issues/detail?id=94666
              // on Chrome, causing
              // http://code.google.com/p/google-caja/issues/detail?id=1401
              // so if base is an HTMLFormElement we skip this
              // fix. Since this repair and this situation are both
              // Chrome only, it is ok that we're conditioning this on
              // the unspecified [[Class]] value of base.
              //
              // To avoid the further bug identified at Comment 2
              // http://code.google.com/p/chromium/issues/detail?id=94666#c2
              // We also have to reconstruct the requested desc so that
              // the setter is absent. This is why we additionally
              // condition this special case on the absence of an own
              // name property on base.
              var desc2 = { get: desc.get };
              if ('enumerable' in desc) {
                desc2.enumerable = desc.enumerable;
              }
              if ('configurable' in desc) {
                desc2.configurable = desc.configurable;
              }
              var result = defProp(base, name, desc2);
              var newDesc = gopd(base, name);
              if (newDesc.get === desc.get) {
                return result;
              }
            }
            desc.set = dummySetter;
          }
        }
        return defProp(base, name, desc);
      }
    });
    NEEDS_DUMMY_SETTER_repaired = true;
  }


  function repair_ACCESSORS_INHERIT_AS_OWN() {
    // restrict these
    var defProp = Object.defineProperty;
    var freeze = Object.freeze;
    var seal = Object.seal;

    // preserve illusion
    var gopn = Object.getOwnPropertyNames;
    var gopd = Object.getOwnPropertyDescriptor;

    var complaint = 'Workaround for ' +
      'https://bugzilla.mozilla.org/show_bug.cgi?id=637994 ' +
      ' prohibits enumerable non-configurable accessor properties.';

    function isBadAccessor(derived, name) {
      var desc = gopd(derived, name);
      if (!desc || !('get' in desc)) { return false; }
      var base = getPrototypeOf(derived);
      if (!base) { return false; }
      var superDesc = gopd(base, name);
      if (!superDesc || !('get' in superDesc)) { return false; }
      return (desc.get &&
              !desc.configurable && !superDesc.configurable &&
              desc.get === superDesc.get &&
              desc.set === superDesc.set &&
              desc.enumerable === superDesc.enumerable);
    }

    defProp(Object, 'defineProperty', {
      value: function definePropertyWrapper(base, name, desc) {
        var oldDesc = gopd(base, name);
        var testBase = {};
        if (oldDesc && !isBadAccessor(base, name)) {
          defProp(testBase, name, oldDesc);
        }
        defProp(testBase, name, desc);
        var fullDesc = gopd(testBase, name);
         if ('get' in fullDesc &&
            fullDesc.enumerable &&
            !fullDesc.configurable) {
          logger.warn(complaint);
          throw new TypeError(complaint
              + " (Object: " + base + " Property: " + name + ")");
        }
        return defProp(base, name, fullDesc);
      }
    });

    function ensureSealable(base) {
      gopn(base).forEach(function(name) {
        var desc = gopd(base, name);
        if ('get' in desc && desc.enumerable) {
          if (!desc.configurable) {
            logger.error('New symptom: ' +
                         '"' + name + '" already non-configurable');
          }
          logger.warn(complaint);
          throw new TypeError(complaint + " (During sealing. Object: "
              + base + " Property: " + name + ")");
        }
      });
    }

    defProp(Object, 'freeze', {
      value: function freezeWrapper(base) {
        ensureSealable(base);
        return freeze(base);
      }
    });

    defProp(Object, 'seal', {
      value: function sealWrapper(base) {
        ensureSealable(base);
        return seal(base);
      }
    });

    defProp(Object.prototype, 'hasOwnProperty', {
      value: function hasOwnPropertyWrapper(name) {
        return hop.call(this, name) && !isBadAccessor(this, name);
      }
    });

    defProp(Object, 'getOwnPropertyDescriptor', {
      value: function getOwnPropertyDescriptorWrapper(base, name) {
        if (isBadAccessor(base, name)) { return void 0; }
        return gopd(base, name);
      }
    });

    defProp(Object, 'getOwnPropertyNames', {
      value: function getOwnPropertyNamesWrapper(base) {
        return gopn(base).filter(function(name) {
          return !isBadAccessor(base, name);
        });
      }
    });
  }

  function repair_SORT_LEAKS_GLOBAL() {
    var unsafeSort = Array.prototype.sort;
    function sortWrapper(opt_comparefn) {
      function comparefnWrapper(x, y) {
        return opt_comparefn(x, y);
      }
      if (arguments.length === 0) {
        return unsafeSort.call(this);
      } else {
        return unsafeSort.call(this, comparefnWrapper);
      }
    }
    Object.defineProperty(Array.prototype, 'sort', {
      value: sortWrapper
    });
  }

  function repair_REPLACE_LEAKS_GLOBAL() {
    var unsafeReplace = String.prototype.replace;
    function replaceWrapper(searchValue, replaceValue) {
      var safeReplaceValue = replaceValue;
      function replaceValueWrapper(m1, m2, m3) {
        return replaceValue(m1, m2, m3);
      }
      if (typeof replaceValue === 'function') {
        safeReplaceValue = replaceValueWrapper;
      }
      return unsafeReplace.call(this, searchValue, safeReplaceValue);
    }
    Object.defineProperty(String.prototype, 'replace', {
      value: replaceWrapper
    });
  }

  function repair_CANT_GOPD_CALLER() {
    var unsafeGOPD = Object.getOwnPropertyDescriptor;
    function gopdWrapper(base, name) {
      try {
        return unsafeGOPD(base, name);
      } catch (err) {
        if (err instanceof TypeError &&
            typeof base === 'function' &&
            (name === 'caller' || name === 'arguments')) {
          return (function(message) {
             function fakePoison() { throw new TypeError(message); }
             fakePoison.prototype = null;
             return {
               get: fakePoison,
               set: fakePoison,
               enumerable: false,
               configurable: false
             };
           })(err.message);
        }
        throw err;
      }
    }
    Object.defineProperty(Object, 'getOwnPropertyDescriptor', {
      value: gopdWrapper
    });
  }

  function repair_CANT_HASOWNPROPERTY_CALLER() {
    Object.defineProperty(Object.prototype, 'hasOwnProperty', {
      value: function hopWrapper(name) {
        return !!Object.getOwnPropertyDescriptor(this, name);
      }
    });
  }

  function makeHarmless(magicName, func, path) {
    function poison() {
      throw new TypeError('Cannot access property ' + path);
    }
    poison.prototype = null;
    var desc = Object.getOwnPropertyDescriptor(func, magicName);
    if ((!desc && Object.isExtensible(func)) || desc.configurable) {
      try {
        Object.defineProperty(func, magicName, {
          get: poison,
          set: poison,
          configurable: false
        });
      } catch (cantPoisonErr) {
        return 'Poisoning failed with ' + cantPoisonErr;
      }
      desc = Object.getOwnPropertyDescriptor(func, magicName);
      if (desc &&
          desc.get === poison &&
          desc.set === poison &&
          !desc.configurable) {
        return 'Apparently poisoned';
      }
      return 'Not poisoned';
    }
    if ('get' in desc || 'set' in desc) {
      return 'Apparently safe';
    }
    try {
      Object.defineProperty(func, magicName, {
        value: desc.value === null ? null : void 0,
        writable: false,
        configurable: false
      });
    } catch (cantFreezeHarmlessErr) {
      return 'Freezing harmless failed with ' + cantFreezeHarmlessErr;
    }
    desc = Object.getOwnPropertyDescriptor(func, magicName);
    if (desc &&
        (desc.value === null || desc.value === void 0) &&
        !desc.writable &&
        !desc.configurable) {
      return 'Apparently frozen harmless';
    }
    return 'Did not freeze harmless';
  }

  function repair_BUILTIN_LEAKS_CALLER() {
    // The call to .bind as a method here is fine since it happens
    // after all repairs which might fix .bind and before any
    // untrusted code runs.
    ses.makeCallerHarmless = makeHarmless.bind(void 0, 'caller');
    //logger.info(ses.makeCallerHarmless(builtInMapMethod));
  }

  function repair_BUILTIN_LEAKS_ARGUMENTS() {
    // The call to .bind as a method here is fine since it happens
    // after all repairs which might fix .bind and before any
    // untrusted code runs.
    ses.makeArgumentsHarmless = makeHarmless.bind(void 0, 'arguments');
    //logger.info(ses.makeArgumentsHarmless(builtInMapMethod));
  }

  function repair_DELETED_BUILTINS_IN_OWN_NAMES() {
    var realGOPN = Object.getOwnPropertyNames;
    var repairedHop = Object.prototype.hasOwnProperty;
    function getOnlyRealOwnPropertyNames(base) {
      return realGOPN(base).filter(function(name) {
        return repairedHop.call(base, name);
      });
    }
    Object.defineProperty(Object, 'getOwnPropertyNames', {
      value: getOnlyRealOwnPropertyNames
    });
  }

  function repair_GETOWNPROPDESC_OF_ITS_OWN_CALLER_FAILS() {
    var realGOPD = Object.getOwnPropertyDescriptor;
    function GOPDWrapper(base, name) {
      return realGOPD(base, name);
    }
    Object.defineProperty(Object, 'getOwnPropertyDescriptor', {
      value: GOPDWrapper
    });
  }

  function repair_JSON_PARSE_PROTO_CONFUSION() {
    var unsafeParse = JSON.parse;
    function validate(plainJSON) {
      if (plainJSON !== Object(plainJSON)) {
        // If we were trying to do a full validation, we would
        // validate that it is not NaN, Infinity, -Infinity, or
        // (if nested) undefined. However, we are currently only
        // trying to repair
        // http://code.google.com/p/v8/issues/detail?id=621
        // That's why this special case validate function is private
        // to this repair.
        return;
      }
      var proto = getPrototypeOf(plainJSON);
      if (proto !== Object.prototype && proto !== Array.prototype) {
        throw new TypeError(
          'Parse resulted in invalid JSON. ' +
            'See http://code.google.com/p/v8/issues/detail?id=621');
      }
      Object.keys(plainJSON).forEach(function(key) {
        validate(plainJSON[key]);
      });
    }
    Object.defineProperty(JSON, 'parse', {
      value: function parseWrapper(text, opt_reviver) {
        var result = unsafeParse(text);
        validate(result);
        if (opt_reviver) {
          return unsafeParse(text, opt_reviver);
        } else {
          return result;
        }
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  function repair_PARSEINT_STILL_PARSING_OCTAL() {
    var badParseInt = parseInt;
    function goodParseInt(n, radix) {
      n = '' + n;
      // This turns an undefined radix into a NaN but is ok since NaN
      // is treated as undefined by badParseInt
      radix = +radix;
      var isHexOrOctal = /^\s*[+-]?\s*0(x?)/.exec(n);
      var isOct = isHexOrOctal ? isHexOrOctal[1] !== 'x' : false;

      if (isOct && (radix !== radix || 0 === radix)) {
        return badParseInt(n, 10);
      }
      return badParseInt(n, radix);
    }
    parseInt = goodParseInt;
  }

  function repair_ASSIGN_CAN_OVERRIDE_FROZEN() {
    makeTamperProof = function simpleMakeTamperProof() {
      return Object.freeze;
    };
  }

  function repair_CANT_REDEFINE_NAN_TO_ITSELF() {
    var defProp = Object.defineProperty;
    // 'value' handled separately
    var attrs = ['writable', 'get', 'set', 'enumerable', 'configurable'];

    defProp(Object, 'defineProperty', {
      value: function(base, name, desc) {
        try {
          return defProp(base, name, desc);
        } catch (err) {
          var oldDesc = Object.getOwnPropertyDescriptor(base, name);
          for (var i = 0, len = attrs.length; i < len; i++) {
            var attr = attrs[i];
            if (attr in desc && desc[attr] !== oldDesc[attr]) { throw err; }
          }
          if (!('value' in desc) || is(desc.value, oldDesc.value)) {
            return base;
          }
          throw err;
        }
      }
    });
  }


  ////////////////////// Kludge Records /////////////////////
  //
  // Each kludge record has a <dl>
  //   <dt>description:</dt>
  //     <dd>a string describing the problem</dd>
  //   <dt>test:</dt>
  //     <dd>a predicate testing for the presence of the problem</dd>
  //   <dt>repair:</dt>
  //     <dd>a function which attempts repair, or undefined if no
  //         repair is attempted for this problem</dd>
  //   <dt>preSeverity:</dt>
  //     <dd>an enum (see below) indicating the level of severity of
  //         this problem if unrepaired. Or, if !canRepair, then
  //         the severity whether or not repaired.</dd>
  //   <dt>canRepair:</dt>
  //     <dd>a boolean indicating "if the repair exists and the test
  //         subsequently does not detect a problem, are we now ok?"</dd>
  //   <dt>urls:</dt>
  //     <dd>a list of URL strings, each of which points at a page
  //         relevant for documenting or tracking the bug in
  //         question. These are typically into bug-threads in issue
  //         trackers for the various browsers.</dd>
  //   <dt>sections:</dt>
  //     <dd>a list of strings, each of which is a relevant ES5.1
  //         section number.</dd>
  //   <dt>tests:</dt>
  //     <dd>a list of strings, each of which is the name of a
  //         relevant test262 or sputnik test case.</dd>
  // </dl>
  // These kludge records are the meta-data driving the testing and
  // repairing.

  var severities = ses.severities;
  var statuses = ses.statuses;

  /**
   * First test whether the platform can even support our repair
   * attempts.
   */
  var baseKludges = [
    {
      description: 'Missing getOwnPropertyNames',
      test: test_MISSING_GETOWNPROPNAMES,
      repair: void 0,
      preSeverity: severities.NOT_SUPPORTED,
      canRepair: false,
      urls: [],
      sections: ['15.2.3.4'],
      tests: ['15.2.3.4-0-1']
    }
  ];

  /**
   * Run these only if baseKludges report success.
   */
  var supportedKludges = [
    {
      description: 'Global object leaks from global function calls',
      test: test_GLOBAL_LEAKS_FROM_GLOBAL_FUNCTION_CALLS,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=64250'],
      sections: ['10.2.1.2', '10.2.1.2.6'],
      tests: ['10.4.3-1-8gs']
    },
    {
      description: 'Global object leaks from anonymous function calls',
      test: test_GLOBAL_LEAKS_FROM_ANON_FUNCTION_CALLS,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: [],
      sections: ['10.4.3'],
      tests: ['S10.4.3_A1']
    },
    {
      description: 'Global leaks through strict this',
      test: test_GLOBAL_LEAKS_FROM_STRICT_THIS,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: [],
      sections: ['10.4.3'],
      tests: ['10.4.3-1-8gs', '10.4.3-1-8-s']
    },
    {
      description: 'Global object leaks from built-in methods',
      test: test_GLOBAL_LEAKS_FROM_BUILTINS,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=51097',
             'https://bugs.webkit.org/show_bug.cgi?id=58338',
             'http://code.google.com/p/v8/issues/detail?id=1437',
             'https://connect.microsoft.com/IE/feedback/details/' +
               '685430/global-object-leaks-from-built-in-methods'],
      sections: ['15.2.4.4'],
      tests: ['S15.2.4.4_A14']
    },
    {
      description: 'Global object leaks from globally called built-in methods',
      test: test_GLOBAL_LEAKS_FROM_GLOBALLY_CALLED_BUILTINS,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: [],
      sections: ['10.2.1.2', '10.2.1.2.6', '15.2.4.4'],
      tests: ['S15.2.4.4_A15']
    },
    {
      description: 'Object.freeze is missing',
      test: test_MISSING_FREEZE_ETC,
      repair: repair_MISSING_FREEZE_ETC,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: false,           // repair for development, not safety
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=55736'],
      sections: ['15.2.3.9'],
      tests: ['15.2.3.9-0-1']
    },
    {
      description: 'A function.prototype\'s descriptor lies',
      test: test_FUNCTION_PROTOTYPE_DESCRIPTOR_LIES,
      repair: repair_FUNCTION_PROTOTYPE_DESCRIPTOR_LIES,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1530',
             'http://code.google.com/p/v8/issues/detail?id=1570'],
      sections: ['15.2.3.3', '15.2.3.6', '15.3.5.2'],
      tests: ['S15.3.3.1_A4']
    },
    {
      description: 'Phantom callee on strict functions',
      test: test_MISSING_CALLEE_DESCRIPTOR,
      repair: repair_MISSING_CALLEE_DESCRIPTOR,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=55537'],
      sections: ['15.2.3.4'],
      tests: ['S15.2.3.4_A1_T1']
    },
    {
      description: 'Strict delete returned false rather than throwing',
      test: test_STRICT_DELETE_RETURNS_FALSE,
      repair: void 0,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://connect.microsoft.com/IE/feedback/details/' +
               '685432/strict-delete-sometimes-returns-false-' +
               'rather-than-throwing'],
      sections: ['11.4.1'],
      tests: ['S11.4.1_A5']
    },
    {
      description: 'Non-deletable RegExp statics are a' +
        ' global communication channel',
      test: test_REGEXP_CANT_BE_NEUTERED,
      repair: repair_REGEXP_CANT_BE_NEUTERED,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=591846',
             'http://wiki.ecmascript.org/doku.php?id=' +
               'conventions:make_non-standard_properties_configurable',
             'https://connect.microsoft.com/IE/feedback/details/' +
               '685439/non-deletable-regexp-statics-are-a-global-' +
               'communication-channel'],
      sections: ['11.4.1'],
      tests: ['S11.4.1_A5']
    },
    {
      description: 'RegExp.exec leaks match globally',
      test: test_REGEXP_TEST_EXEC_UNSAFE,
      repair: repair_REGEXP_TEST_EXEC_UNSAFE,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1393',
             'http://code.google.com/p/chromium/issues/detail?id=75740',
             'https://bugzilla.mozilla.org/show_bug.cgi?id=635017',
             'http://code.google.com/p/google-caja/issues/detail?id=528'],
      sections: ['15.10.6.2'],
      tests: ['S15.10.6.2_A12']
    },
    {
      description: 'Function.prototype.bind is missing',
      test: test_MISSING_BIND,
      repair: repair_MISSING_BIND,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=26382',
             'https://bugs.webkit.org/show_bug.cgi?id=42371'],
      sections: ['15.3.4.5'],
      tests: ['S15.3.4.5_A3']
    },
    {
      description: 'Function.prototype.bind calls .apply rather than [[Call]]',
      test: test_BIND_CALLS_APPLY,
      repair: repair_MISSING_BIND,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=892',
             'http://code.google.com/p/v8/issues/detail?id=828'],
      sections: ['15.3.4.5.1'],
      tests: ['S15.3.4.5_A4']
    },
    {
      description: 'Function.prototype.bind does not curry construction',
      test: test_BIND_CANT_CURRY_NEW,
      repair: void 0, // JS-based repair essentially impossible
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=26382#c29'],
      sections: ['15.3.4.5.2'],
      tests: ['S15.3.4.5_A5']
    },
    {
      description: 'Date.prototype is a global communication channel',
      test: test_MUTABLE_DATE_PROTO,
      repair: repair_MUTABLE_DATE_PROTO,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/google-caja/issues/detail?id=1362'],
      sections: ['15.9.5'],
      tests: []
    },
    {
      description: 'WeakMap.prototype is a global communication channel',
      test: test_MUTABLE_WEAKMAP_PROTO,
      repair: repair_MUTABLE_WEAKMAP_PROTO,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=656828'],
      sections: [],
      tests: []
    },
    {
      description: 'Array forEach cannot be frozen while in progress',
      test: test_NEED_TO_WRAP_FOREACH,
      repair: repair_NEED_TO_WRAP_FOREACH,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1447'],
      sections: ['15.4.4.18'],
      tests: ['S15.4.4.18_A1', 'S15.4.4.18_A2']
    },
    {
      description: 'Array forEach converts primitive thisObj arg to object',
      test: test_FOREACH_COERCES_THISOBJ,
      repair: repair_NEED_TO_WRAP_FOREACH,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=2273',
          'https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach'],
      sections: ['15.4.4.18'],
      tests: []
    },
    {
      description: 'Workaround undiagnosed need for dummy setter',
      test: test_NEEDS_DUMMY_SETTER,
      repair: repair_NEEDS_DUMMY_SETTER,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: [],
      sections: [],
      tests: []
    },
    {
      description: 'Getter on HTMLFormElement disappears',
      test: test_FORM_GETTERS_DISAPPEAR,
      repair: repair_NEEDS_DUMMY_SETTER,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/chromium/issues/detail?id=94666',
             'http://code.google.com/p/v8/issues/detail?id=1651',
             'http://code.google.com/p/google-caja/issues/detail?id=1401'],
      sections: ['15.2.3.6'],
      tests: ['S15.2.3.6_A1']
    },
    {
      description: 'Accessor properties inherit as own properties',
      test: test_ACCESSORS_INHERIT_AS_OWN,
      repair: repair_ACCESSORS_INHERIT_AS_OWN,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=637994'],
      sections: ['8.6.1', '15.2.3.6'],
      tests: ['S15.2.3.6_A2']
    },
    {
      description: 'Array sort leaks global',
      test: test_SORT_LEAKS_GLOBAL,
      repair: repair_SORT_LEAKS_GLOBAL,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1360'],
      sections: ['15.4.4.11'],
      tests: ['S15.4.4.11_A8']
    },
    {
      description: 'String replace leaks global',
      test: test_REPLACE_LEAKS_GLOBAL,
      repair: repair_REPLACE_LEAKS_GLOBAL,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1360',
             'https://connect.microsoft.com/IE/feedback/details/' +
               '685928/bad-this-binding-for-callback-in-string-' +
               'prototype-replace'],
      sections: ['15.5.4.11'],
      tests: ['S15.5.4.11_A12']
    },
    {
      description: 'getOwnPropertyDescriptor on strict "caller" throws',
      test: test_CANT_GOPD_CALLER,
      repair: repair_CANT_GOPD_CALLER,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://connect.microsoft.com/IE/feedback/details/' +
               '685436/getownpropertydescriptor-on-strict-caller-throws'],
      sections: ['15.2.3.3', '13.2', '13.2.3'],
      tests: ['S13.2_A6_T1']
    },
    {
      description: 'strict_function.hasOwnProperty("caller") throws',
      test: test_CANT_HASOWNPROPERTY_CALLER,
      repair: repair_CANT_HASOWNPROPERTY_CALLER,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=63398#c3'],
      sections: ['15.2.4.5', '13.2', '13.2.3'],
      tests: ['S13.2_A7_T1']
    },
    {
      description: 'Cannot "in" caller on strict function',
      test: test_CANT_IN_CALLER,
      repair: void 0,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=63398'],
      sections: ['11.8.7', '13.2', '13.2.3'],
      tests: ['S13.2_A8_T1']
    },
    {
      description: 'Cannot "in" arguments on strict function',
      test: test_CANT_IN_ARGUMENTS,
      repair: void 0,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=63398'],
      sections: ['11.8.7', '13.2', '13.2.3'],
      tests: ['S13.2_A8_T2']
    },
    {
      description: 'Strict "caller" not poisoned',
      test: test_STRICT_CALLER_NOT_POISONED,
      repair: void 0,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: false,
      urls: [],
      sections: ['13.2'],
      tests: ['S13.2.3_A1']
    },
    {
      description: 'Strict "arguments" not poisoned',
      test: test_STRICT_ARGUMENTS_NOT_POISONED,
      repair: void 0,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: false,
      urls: [],
      sections: ['13.2'],
      tests: ['S13.2.3_A1']
    },
    {
      description: 'Built in functions leak "caller"',
      test: test_BUILTIN_LEAKS_CALLER,
      repair: repair_BUILTIN_LEAKS_CALLER,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1643',
             'http://code.google.com/p/v8/issues/detail?id=1548',
             'https://bugzilla.mozilla.org/show_bug.cgi?id=591846',
             'http://wiki.ecmascript.org/doku.php?id=' +
               'conventions:make_non-standard_properties_configurable'],
      sections: [],
      tests: ['Sbp_A10_T1']
    },
    {
      description: 'Built in functions leak "arguments"',
      test: test_BUILTIN_LEAKS_ARGUMENTS,
      repair: repair_BUILTIN_LEAKS_ARGUMENTS,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1643',
             'http://code.google.com/p/v8/issues/detail?id=1548',
             'https://bugzilla.mozilla.org/show_bug.cgi?id=591846',
             'http://wiki.ecmascript.org/doku.php?id=' +
               'conventions:make_non-standard_properties_configurable'],
      sections: [],
      tests: ['Sbp_A10_T2']
    },
    {
      description: 'Bound functions leak "caller"',
      test: test_BOUND_FUNCTION_LEAKS_CALLER,
      repair: repair_MISSING_BIND,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=893',
             'https://bugs.webkit.org/show_bug.cgi?id=63398'],
      sections: ['15.3.4.5'],
      tests: ['S13.2.3_A1', 'S15.3.4.5_A1']
    },
    {
      description: 'Bound functions leak "arguments"',
      test: test_BOUND_FUNCTION_LEAKS_ARGUMENTS,
      repair: repair_MISSING_BIND,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=893',
             'https://bugs.webkit.org/show_bug.cgi?id=63398'],
      sections: ['15.3.4.5'],
      tests: ['S13.2.3_A1', 'S15.3.4.5_A2']
    },
    {
      description: 'Deleting built-in leaves phantom behind',
      test: test_DELETED_BUILTINS_IN_OWN_NAMES,
      repair: repair_DELETED_BUILTINS_IN_OWN_NAMES,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=70207'],
      sections: ['15.2.3.4'],
      tests: []
    },
    {
      description: 'getOwnPropertyDescriptor on its own "caller" fails',
      test: test_GETOWNPROPDESC_OF_ITS_OWN_CALLER_FAILS,
      repair: repair_GETOWNPROPDESC_OF_ITS_OWN_CALLER_FAILS,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1769'],
      sections: ['13.2', '15.2.3.3'],
      tests: []
    },
    {
      description: 'JSON.parse confused by "__proto__"',
      test: test_JSON_PARSE_PROTO_CONFUSION,
      repair: repair_JSON_PARSE_PROTO_CONFUSION,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=621',
             'http://code.google.com/p/v8/issues/detail?id=1310'],
      sections: ['15.12.2'],
      tests: ['S15.12.2_A1']
    },
    {
      description: 'Prototype still mutable on non-extensible object',
      test: test_PROTO_NOT_FROZEN,
      repair: void 0,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=65832'],
      sections: ['8.6.2'],
      tests: ['S8.6.2_A8']
    },
    {
      description: 'Prototype still redefinable on non-extensible object',
      test: test_PROTO_REDEFINABLE,
      repair: void 0,
      preSeverity: severities.NOT_OCAP_SAFE,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=65832'],
      sections: ['8.6.2'],
      tests: ['S8.6.2_A8']
    },
    {
      description: 'Strict eval function leaks variable definitions',
      test: test_STRICT_EVAL_LEAKS_GLOBALS,
      repair: void 0,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1624'],
      sections: ['10.4.2.1'],
      tests: ['S10.4.2.1_A1']
    },
    {
      description: 'parseInt still parsing octal',
      test: test_PARSEINT_STILL_PARSING_OCTAL,
      repair: repair_PARSEINT_STILL_PARSING_OCTAL,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1645'],
      sections: ['15.1.2.2'],
      tests: ['S15.1.2.2_A5.1_T1']
    },
    {
      description: 'E4X literals allowed in strict code',
      test: test_STRICT_E4X_LITERALS_ALLOWED,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=695577',
             'https://bugzilla.mozilla.org/show_bug.cgi?id=695579'],
      sections: [],
      tests: []
    },
    {
      description: 'Assignment can override frozen inherited property',
      test: test_ASSIGN_CAN_OVERRIDE_FROZEN,
      repair: repair_ASSIGN_CAN_OVERRIDE_FROZEN,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['http://code.google.com/p/v8/issues/detail?id=1169',
             'https://mail.mozilla.org/pipermail/es-discuss/' +
               '2011-November/017997.html'],
      sections: ['8.12.4'],
      tests: ['15.2.3.6-4-405']
    },
    {
      description: 'Array.prototype.pop ignores frozeness',
      test: test_POP_IGNORES_FROZEN,
      repair: void 0,
      preSeverity: severities.UNSAFE_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://bugs.webkit.org/show_bug.cgi?id=75788'],
      sections: ['15.4.4.6'],
      tests: [] // TODO(erights): Add to test262
    },
    {
      description: 'Setting [].length can delete non-configurable elements',
      test: test_ARRAYS_TOO_MUTABLE,
      repair: void 0,
      preSeverity: severities.NO_KNOWN_EXPLOIT_SPEC_VIOLATION,
      canRepair: false,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=590690'],
      sections: ['15.4.5.2'],
      tests: [] // TODO(erights): Add to test262
    },
    {
      description: 'Cannot redefine global NaN to itself',
      test: test_CANT_REDEFINE_NAN_TO_ITSELF,
      repair: repair_CANT_REDEFINE_NAN_TO_ITSELF,
      preSeverity: severities.SAFE_SPEC_VIOLATION,
      canRepair: true,
      urls: [], // Seen on WebKit Nightly. TODO(erights): report
      sections: ['8.12.9', '15.1.1.1'],
      tests: [] // TODO(erights): Add to test262
    },
    {
      description: 'Firefox 15 cross-frame freeze problem',
      test: test_FIREFOX_15_FREEZE_PROBLEM,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: ['https://bugzilla.mozilla.org/show_bug.cgi?id=784892',
             'https://bugzilla.mozilla.org/show_bug.cgi?id=674195'],
      sections: [],
      tests: []
    },
    {
      description: 'Error instances have unexpected properties',
      test: test_UNEXPECTED_ERROR_PROPERTIES,
      repair: void 0,
      preSeverity: severities.NEW_SYMPTOM,
      canRepair: false,
      urls: [],
      sections: [],
      tests: []
    },
    {
      description: 'Error instances may have invisible properties',
      test: test_ERRORS_HAVE_INVISIBLE_PROPERTIES,
      repair: void 0,
      preSeverity: severities.NOT_ISOLATED,
      canRepair: false,
      urls: [],  // TODO(felix8a): need bugs filed
      sections: [],
      tests: []
    }
  ];

  ////////////////////// Testing, Repairing, Reporting ///////////

  var aboutTo = void 0;

  /**
   * Run a set of tests & repairs, and report results.
   *
   * <p>First run all the tests before repairing anything.
   * Then repair all repairable failed tests.
   * Some repair might fix multiple problems, but run each repair at most once.
   * Then run all the tests again, in case some repairs break other tests.
   * And finally return a list of records of results.
   */
  function testRepairReport(kludges) {
    var beforeFailures = strictMapFn(kludges, function(kludge) {
      aboutTo = ['pre test: ', kludge.description];
      return kludge.test();
    });
    var repairs = [];
    strictForEachFn(kludges, function(kludge, i) {
      if (beforeFailures[i]) {
        var repair = kludge.repair;
        if (repair && repairs.lastIndexOf(repair) === -1) {
          aboutTo = ['repair: ', kludge.description];
          repair();
          repairs.push(repair);
        }
      }
    });
    var afterFailures = strictMapFn(kludges, function(kludge) {
      aboutTo = ['post test: ', kludge.description];
      return kludge.test();
    });

    if (Object.isFrozen && Object.isFrozen(Array.prototype.forEach)) {
      // Need to do it anyway, to repair the sacrificial freezing we
      // needed to do to test. Once we can permanently retire this
      // test, we can also retire the redundant repair.
      repair_NEED_TO_WRAP_FOREACH();
    }

    return strictMapFn(kludges, function(kludge, i) {
      var status = statuses.ALL_FINE;
      var postSeverity = severities.SAFE;
      var beforeFailure = beforeFailures[i];
      var afterFailure = afterFailures[i];
      if (beforeFailure) { // failed before
        if (afterFailure) { // failed after
          if (kludge.repair) {
            postSeverity = kludge.preSeverity;
            status = statuses.REPAIR_FAILED;
          } else {
            if (!kludge.canRepair) {
              postSeverity = kludge.preSeverity;
            } // else no repair + canRepair -> problem isn't safety issue
            status = statuses.NOT_REPAIRED;
          }
        } else { // succeeded after
          if (kludge.repair) {
            if (!kludge.canRepair) {
              // repair for development, not safety
              postSeverity = kludge.preSeverity;
              status = statuses.REPAIRED_UNSAFELY;
            } else {
              status = statuses.REPAIRED;
            }
          } else {
            status = statuses.ACCIDENTALLY_REPAIRED;
          }
        }
      } else { // succeeded before
        if (afterFailure) { // failed after
          if (kludge.repair || !kludge.canRepair) {
            postSeverity = kludge.preSeverity;
          } // else no repair + canRepair -> problem isn't safety issue
          status = statuses.BROKEN_BY_OTHER_ATTEMPTED_REPAIRS;
        } else { // succeeded after
          // nothing to see here, move along
        }
      }

      if (typeof beforeFailure === 'string') {
        logger.error('New Symptom: ' + beforeFailure);
        postSeverity = severities.NEW_SYMPTOM;
      }
      if (typeof afterFailure === 'string') {
        logger.error('New Symptom: ' + afterFailure);
        postSeverity = severities.NEW_SYMPTOM;
      }

      ses.updateMaxSeverity(postSeverity);

      return {
        description:   kludge.description,
        preSeverity:   kludge.preSeverity,
        canRepair:     kludge.canRepair,
        urls:          kludge.urls,
        sections:      kludge.sections,
        tests:         kludge.tests,
        status:        status,
        postSeverity:  postSeverity,
        beforeFailure: beforeFailure,
        afterFailure:  afterFailure
      };
    });
  }

  try {
    var reports = testRepairReport(baseKludges);
    if (ses.ok()) {
      reports.push.apply(reports, testRepairReport(supportedKludges));
    }
    logger.reportRepairs(reports);
  } catch (err) {
    ses.updateMaxSeverity(ses.severities.NOT_SUPPORTED);
    var during = aboutTo ? '(' + aboutTo.join('') + ') ' : '';
    logger.error('ES5 Repair ' + during + 'failed with: ', err);
  }

  logger.reportMax();

})(this);
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Install a leaky WeakMap emulation on platforms that
 * don't provide a built-in one.
 *
 * <p>Assumes that an ES5 platform where, if {@code WeakMap} is
 * already present, then it conforms to the anticipated ES6
 * specification. To run this file on an ES5 or almost ES5
 * implementation where the {@code WeakMap} specification does not
 * quite conform, run <code>repairES5.js</code> first.
 *
 * @author Mark S. Miller
 * @requires ses, crypto, ArrayBuffer, Uint8Array
 * @overrides WeakMap, WeakMapModule
 */

/**
 * This {@code WeakMap} emulation is observably equivalent to the
 * ES-Harmony WeakMap, but with leakier garbage collection properties.
 *
 * <p>As with true WeakMaps, in this emulation, a key does not
 * retain maps indexed by that key and (crucially) a map does not
 * retain the keys it indexes. A map by itself also does not retain
 * the values associated with that map.
 *
 * <p>However, the values associated with a key in some map are
 * retained so long as that key is retained and those associations are
 * not overridden. For example, when used to support membranes, all
 * values exported from a given membrane will live for the lifetime
 * they would have had in the absence of an interposed membrane. Even
 * when the membrane is revoked, all objects that would have been
 * reachable in the absence of revocation will still be reachable, as
 * far as the GC can tell, even though they will no longer be relevant
 * to ongoing computation.
 *
 * <p>The API implemented here is approximately the API as implemented
 * in FF6.0a1 and agreed to by MarkM, Andreas Gal, and Dave Herman,
 * rather than the offially approved proposal page. TODO(erights):
 * upgrade the ecmascript WeakMap proposal page to explain this API
 * change and present to EcmaScript committee for their approval.
 *
 * <p>The first difference between the emulation here and that in
 * FF6.0a1 is the presence of non enumerable {@code get___, has___,
 * set___, and delete___} methods on WeakMap instances to represent
 * what would be the hidden internal properties of a primitive
 * implementation. Whereas the FF6.0a1 WeakMap.prototype methods
 * require their {@code this} to be a genuine WeakMap instance (i.e.,
 * an object of {@code [[Class]]} "WeakMap}), since there is nothing
 * unforgeable about the pseudo-internal method names used here,
 * nothing prevents these emulated prototype methods from being
 * applied to non-WeakMaps with pseudo-internal methods of the same
 * names.
 *
 * <p>Another difference is that our emulated {@code
 * WeakMap.prototype} is not itself a WeakMap. A problem with the
 * current FF6.0a1 API is that WeakMap.prototype is itself a WeakMap
 * providing ambient mutability and an ambient communications
 * channel. Thus, if a WeakMap is already present and has this
 * problem, repairES5.js wraps it in a safe wrappper in order to
 * prevent access to this channel. (See
 * PATCH_MUTABLE_FROZEN_WEAKMAP_PROTO in repairES5.js).
 */
var WeakMap;

/**
 * If this is a full <a href=
 * "http://code.google.com/p/es-lab/wiki/SecureableES5"
 * >secureable ES5</a> platform and the ES-Harmony {@code WeakMap} is
 * absent, install an approximate emulation.
 *
 * <p>If this is almost a secureable ES5 platform, then WeakMap.js
 * should be run after repairES5.js.
 *
 * <p>See {@code WeakMap} for documentation of the garbage collection
 * properties of this WeakMap emulation.
 */
(function WeakMapModule() {
  "use strict";

  if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
    // already too broken, so give up
    return;
  }

  if (typeof WeakMap === 'function') {
    // assumed fine, so we're done.
    return;
  }

  var hop = Object.prototype.hasOwnProperty;
  var gopn = Object.getOwnPropertyNames;
  var defProp = Object.defineProperty;

  /**
   * Holds the orginal static properties of the Object constructor,
   * after repairES5 fixes these if necessary to be a more complete
   * secureable ES5 environment, but before installing the following
   * WeakMap emulation overrides and before any untrusted code runs.
   */
  var originalProps = {};
  gopn(Object).forEach(function(name) {
    originalProps[name] = Object[name];
  });

  /**
   * Security depends on HIDDEN_NAME being both <i>unguessable</i> and
   * <i>undiscoverable</i> by untrusted code.
   *
   * <p>Given the known weaknesses of Math.random() on existing
   * browsers, it does not generate unguessability we can be confident
   * of.
   *
   * <p>It is the monkey patching logic in this file that is intended
   * to ensure undiscoverability. The basic idea is that there are
   * three fundamental means of discovering properties of an object:
   * The for/in loop, Object.keys(), and Object.getOwnPropertyNames(),
   * as well as some proposed ES6 extensions that appear on our
   * whitelist. The first two only discover enumerable properties, and
   * we only use HIDDEN_NAME to name a non-enumerable property, so the
   * only remaining threat should be getOwnPropertyNames and some
   * proposed ES6 extensions that appear on our whitelist. We monkey
   * patch them to remove HIDDEN_NAME from the list of properties they
   * returns.
   *
   * <p>TODO(erights): On a platform with built-in Proxies, proxies
   * could be used to trap and thereby discover the HIDDEN_NAME, so we
   * need to monkey patch Proxy.create, Proxy.createFunction, etc, in
   * order to wrap the provided handler with the real handler which
   * filters out all traps using HIDDEN_NAME.
   *
   * <p>TODO(erights): Revisit Mike Stay's suggestion that we use an
   * encapsulated function at a not-necessarily-secret name, which
   * uses the Stiegler shared-state rights amplification pattern to
   * reveal the associated value only to the WeakMap in which this key
   * is associated with that value. Since only the key retains the
   * function, the function can also remember the key without causing
   * leakage of the key, so this doesn't violate our general gc
   * goals. In addition, because the name need not be a guarded
   * secret, we could efficiently handle cross-frame frozen keys.
   */
  var HIDDEN_NAME_PREFIX = 'weakmap:';
  var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';

  if (typeof crypto !== 'undefined' &&
      typeof crypto.getRandomValues === 'function' &&
      typeof ArrayBuffer === 'function' &&
      typeof Uint8Array === 'function') {
    var ab = new ArrayBuffer(25);
    var u8s = new Uint8Array(ab);
    crypto.getRandomValues(u8s);
    HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' +
      Array.prototype.map.call(u8s, function(u8) {
        return (u8 % 36).toString(36);
      }).join('') + '___';
  }

  /**
   * Monkey patch getOwnPropertyNames to avoid revealing the
   * HIDDEN_NAME.
   *
   * <p>The ES5.1 spec requires each name to appear only once, but as
   * of this writing, this requirement is controversial for ES6, so we
   * made this code robust against this case. If the resulting extra
   * search turns out to be expensive, we can probably relax this once
   * ES6 is adequately supported on all major browsers, iff no browser
   * versions we support at that time have relaxed this constraint
   * without providing built-in ES6 WeakMaps.
   */
  defProp(Object, 'getOwnPropertyNames', {
    value: function fakeGetOwnPropertyNames(obj) {
      return gopn(obj).filter(function(name) {
        return !(
          name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX &&
            name.substr(name.length - 3) === '___');
      });
    }
  });

  /**
   * getPropertyNames is not in ES5 but it is proposed for ES6 and
   * does appear in our whitelist, so we need to clean it too.
   */
  if ('getPropertyNames' in Object) {
    defProp(Object, 'getPropertyNames', {
      value: function fakeGetPropertyNames(obj) {
        return originalProps.getPropertyNames(obj).filter(function(name) {
          return name !== HIDDEN_NAME;
        });
      }
    });
  }

  /**
   * <p>To treat objects as identity-keys with reasonable efficiency
   * on ES5 by itself (i.e., without any object-keyed collections), we
   * need to add a hidden property to such key objects when we
   * can. This raises several issues:
   * <ul>
   * <li>Arranging to add this property to objects before we lose the
   *     chance, and
   * <li>Hiding the existence of this new property from most
   *     JavaScript code.
   * <li>Preventing <i>certification theft</i>, where one object is
   *     created falsely claiming to be the key of an association
   *     actually keyed by another object.
   * <li>Preventing <i>value theft</i>, where untrusted code with
   *     access to a key object but not a weak map nevertheless
   *     obtains access to the value associated with that key in that
   *     weak map.
   * </ul>
   * We do so by
   * <ul>
   * <li>Making the name of the hidden property unguessable, so "[]"
   *     indexing, which we cannot intercept, cannot be used to access
   *     a property without knowing the name.
   * <li>Making the hidden property non-enumerable, so we need not
   *     worry about for-in loops or {@code Object.keys},
   * <li>monkey patching those reflective methods that would
   *     prevent extensions, to add this hidden property first,
   * <li>monkey patching those methods that would reveal this
   *     hidden property.
   * </ul>
   * Unfortunately, because of same-origin iframes, we cannot reliably
   * add this hidden property before an object becomes
   * non-extensible. Instead, if we encounter a non-extensible object
   * without a hidden record that we can detect (whether or not it has
   * a hidden record stored under a name secret to us), then we just
   * use the key object itself to represent its identity in a brute
   * force leaky map stored in the weak map, losing all the advantages
   * of weakness for these.
   */
  function getHiddenRecord(key) {
    if (key !== Object(key)) {
      throw new TypeError('Not an object: ' + key);
    }
    var hiddenRecord = key[HIDDEN_NAME];
    if (hiddenRecord && hiddenRecord.key === key) { return hiddenRecord; }
    if (!originalProps.isExtensible(key)) {
      // Weak map must brute force, as explained in doc-comment above.
      return void 0;
    }
    var gets = [];
    var vals = [];
    hiddenRecord = {
      key: key,   // self pointer for quick own check above.
      gets: gets, // get___ methods identifying weak maps
      vals: vals  // values associated with this key in each
                  // corresponding weak map.
    };
    defProp(key, HIDDEN_NAME, {
      value: hiddenRecord,
      writable: false,
      enumerable: false,
      configurable: false
    });
    return hiddenRecord;
  }


  /**
   * Monkey patch operations that would make their argument
   * non-extensible.
   *
   * <p>The monkey patched versions throw a TypeError if their
   * argument is not an object, so it should only be done to functions
   * that should throw a TypeError anyway if their argument is not an
   * object.
   */
  (function(){
    var oldFreeze = Object.freeze;
    defProp(Object, 'freeze', {
      value: function identifyingFreeze(obj) {
        getHiddenRecord(obj);
        return oldFreeze(obj);
      }
    });
    var oldSeal = Object.seal;
    defProp(Object, 'seal', {
      value: function identifyingSeal(obj) {
        getHiddenRecord(obj);
        return oldSeal(obj);
      }
    });
    var oldPreventExtensions = Object.preventExtensions;
    defProp(Object, 'preventExtensions', {
      value: function identifyingPreventExtensions(obj) {
        getHiddenRecord(obj);
        return oldPreventExtensions(obj);
      }
    });
  })();


  function constFunc(func) {
    func.prototype = null;
    return Object.freeze(func);
  }

  // Right now (12/25/2012) the histogram supports the current
  // representation. We should check this occasionally, as a true
  // constant time representation is easy.
  // var histogram = [];

  WeakMap = function() {
    // We are currently (12/25/2012) never encountering any prematurely
    // non-extensible keys.
    var keys = []; // brute force for prematurely non-extensible keys.
    var vals = []; // brute force for corresponding values.

    function get___(key, opt_default) {
      var hr = getHiddenRecord(key);
      var i, vs;
      if (hr) {
        i = hr.gets.indexOf(get___);
        vs = hr.vals;
      } else {
        i = keys.indexOf(key);
        vs = vals;
      }
      return (i >= 0) ? vs[i] : opt_default;
    }

    function has___(key) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
      } else {
        i = keys.indexOf(key);
      }
      return i >= 0;
    }

    function set___(key, value) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
        if (i >= 0) {
          hr.vals[i] = value;
        } else {
//          i = hr.gets.length;
//          histogram[i] = (histogram[i] || 0) + 1;
          hr.gets.push(get___);
          hr.vals.push(value);
        }
      } else {
        i = keys.indexOf(key);
        if (i >= 0) {
          vals[i] = value;
        } else {
          keys.push(key);
          vals.push(value);
        }
      }
    }

    function delete___(key) {
      var hr = getHiddenRecord(key);
      var i;
      if (hr) {
        i = hr.gets.indexOf(get___);
        if (i >= 0) {
          hr.gets.splice(i, 1);
          hr.vals.splice(i, 1);
        }
      } else {
        i = keys.indexOf(key);
        if (i >= 0) {
          keys.splice(i, 1);
          vals.splice(i, 1);
        }
      }
      return true;
    }

    return Object.create(WeakMap.prototype, {
      get___:    { value: constFunc(get___) },
      has___:    { value: constFunc(has___) },
      set___:    { value: constFunc(set___) },
      delete___: { value: constFunc(delete___) }
    });
  };
  WeakMap.prototype = Object.create(Object.prototype, {
    get: {
      /**
       * Return the value most recently associated with key, or
       * opt_default if none.
       */
      value: function get(key, opt_default) {
        return this.get___(key, opt_default);
      },
      writable: true,
      configurable: true
    },

    has: {
      /**
       * Is there a value associated with key in this WeakMap?
       */
      value: function has(key) {
        return this.has___(key);
      },
      writable: true,
      configurable: true
    },

    set: {
      /**
       * Associate value with key in this WeakMap, overwriting any
       * previous association if present.
       */
      value: function set(key, value) {
        this.set___(key, value);
      },
      writable: true,
      configurable: true
    },

    'delete': {
      /**
       * Remove any association for key in this WeakMap, returning
       * whether there was one.
       *
       * <p>Note that the boolean return here does not work like the
       * {@code delete} operator. The {@code delete} operator returns
       * whether the deletion succeeds at bringing about a state in
       * which the deleted property is absent. The {@code delete}
       * operator therefore returns true if the property was already
       * absent, whereas this {@code delete} method returns false if
       * the association was already absent.
       */
      value: function remove(key) {
        return this.delete___(key);
      },
      writable: true,
      configurable: true
    }
  });

})();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview An optional part of the SES initialization process
 * that saves potentially valuable debugging aids on the side before
 * startSES.js would remove these, and adds a debugging API which uses
 * these without compromising SES security.
 *
 * <p>NOTE: The currently exposed debugging API is far from
 * settled. This module is currently in an exploratory phase.
 *
 * <p>Meant to be run sometime after repairs are done and a working
 * WeakMap is available, but before startSES.js. initSES.js includes
 * this. initSESPlus.js does not.
 *
 * //provides ses.UnsafeError,
 * //provides ses.getCWStack ses.stackString ses.getStack
 * @author Mark S. Miller
 * @requires WeakMap, this
 * @overrides Error, ses, debugModule
 */

var Error;
var ses;

(function debugModule(global) {
   "use strict";


   /**
    * Save away the original Error constructor as ses.UnsafeError and
    * make it otherwise unreachable. Replace it with a reachable
    * wrapping constructor with the same standard behavior.
    *
    * <p>When followed by the rest of SES initialization, the
    * UnsafeError we save off here is exempt from whitelist-based
    * extra property removal and primordial freezing. Thus, we can
    * use any platform specific APIs defined on Error for privileged
    * debugging operations, unless explicitly turned off below.
    */
   var UnsafeError = Error;
   ses.UnsafeError = Error;
   function FakeError(message) {
     return UnsafeError(message);
   }
   FakeError.prototype = UnsafeError.prototype;
   FakeError.prototype.constructor = FakeError;

   Error = FakeError;

   /**
    * Should be a function of an argument object (normally an error
    * instance) that returns the stack trace associated with argument
    * in Causeway format.
    *
    * <p>See http://wiki.erights.org/wiki/Causeway_Platform_Developer
    *
    * <p>Currently, there is no one portable technique for doing
    * this. So instead, each platform specific branch of the if below
    * should assign something useful to getCWStack.
    */
   ses.getCWStack = function uselessGetCWStack(err) { return void 0; };

   if ('captureStackTrace' in UnsafeError) {
     (function() {
       // Assuming http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
       // So this section is v8 specific.

       UnsafeError.prepareStackTrace = function(err, sst) {
         ssts.set(err, sst);
         return void 0;
       };

       var unsafeCaptureStackTrace = UnsafeError.captureStackTrace;

       // TODO(erights): This seems to be write only. Can this be made
       // safe enough to expose to untrusted code?
       UnsafeError.captureStackTrace = function(obj, opt_MyError) {
         var wasFrozen = Object.isFrozen(obj);
         var stackDesc = Object.getOwnPropertyDescriptor(obj, 'stack');
         try {
           var result = unsafeCaptureStackTrace(obj, opt_MyError);
           var ignore = obj.stack;
           return result;
         } finally {
           if (wasFrozen && !Object.isFrozen(obj)) {
             if (stackDesc) {
               Object.defineProperty(obj, 'stack', stackDesc);
             } else {
               delete obj.stack;
             }
             Object.freeze(obj);
           }
         }
       };

       var ssts = WeakMap(); // error -> sst

       /**
        * Returns a stack in Causeway format.
        *
        * <p>Based on
        * http://code.google.com/p/causeway/source/browse/trunk/src/js/com/teleometry/causeway/purchase_example/workers/makeCausewayLogger.js
        */
       function getCWStack(err) {
         var sst = ssts.get(err);
         if (sst === void 0 && err instanceof Error) {
           // We hope it triggers prepareStackTrace
           var ignore = err.stack;
           sst = ssts.get(err);
         }
         if (sst === void 0) { return void 0; }

         return { calls: sst.map(function(frame) {
           return {
             name: '' + (frame.getFunctionName() ||
                         frame.getMethodName() || '?'),
             source: '' + (frame.getFileName() || '?'),
             span: [ [ frame.getLineNumber(), frame.getColumnNumber() ] ]
           };
         })};
       };
       ses.getCWStack = getCWStack;
     })();

   } else if (global.opera) {
     (function() {
       // Since pre-ES5 browsers are disqualified, we can assume a
       // minimum of Opera 11.60.
     })();


   } else if (new Error().stack) {
     (function() {
       var FFFramePattern = (/^([^@]*)@(.*?):?(\d*)$/);

       // stacktracejs.org suggests that this indicates FF. Really?
       function getCWStack(err) {
         var stack = err.stack;
         if (!stack) { return void 0; }
         var lines = stack.split('\n');
         var frames = lines.map(function(line) {
           var match = FFFramePattern.exec(line);
           if (match) {
             return {
               name: match[1].trim() || '?',
               source: match[2].trim() || '?',
               span: [[+match[3]]]
             };
           } else {
             return {
               name: line.trim() || '?',
               source: '?',
               span: []
             };
           }
         });
         return { calls: frames };
       }

       ses.getCWStack = getCWStack;
     })();

   } else {
     (function() {
       // Including Safari and IE10.
     })();

   }

   /**
    * Turn a Causeway stack into a v8-like stack traceback string.
    */
   function stackString(cwStack) {
     if (!cwStack) { return void 0; }
     var calls = cwStack.calls;

     var result = calls.map(function(call) {

       var spanString = call.span.map(function(subSpan) {
         return subSpan.join(':');
       }).join('::');
       if (spanString) { spanString = ':' + spanString; }

       return '  at ' + call.name + ' (' + call.source + spanString + ')';

     });
     return result.join('\n');
   };
   ses.stackString = stackString;

   /**
    * Return the v8-like stack traceback string associated with err.
    */
   function getStack(err) {
     if (err !== Object(err)) { return void 0; }
     var cwStack = ses.getCWStack(err);
     if (!cwStack) { return void 0; }
     var result = ses.stackString(cwStack);
     if (err instanceof Error) { result = err + '\n' + result; }
     return result;
   };
   ses.getStack = getStack;

 })(this);;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Implements StringMap - a map api for strings.
 *
 * @author Mark S. Miller
 * @author Jasvir Nagra
 * @overrides StringMap
 */

var StringMap;

(function() {
   "use strict";

   var create = Object.create;
   var freeze = Object.freeze;
   function constFunc(func) {
     func.prototype = null;
     return freeze(func);
   }

   function assertString(x) {
     if ('string' !== typeof(x)) {
       throw new TypeError('Not a string: ' + String(x));
     }
     return x;
   }

   StringMap = function StringMap() {

     var objAsMap = create(null);

     return freeze({
       get: constFunc(function(key) {
         return objAsMap[assertString(key) + '$'];
       }),
       set: constFunc(function(key, value) {
         objAsMap[assertString(key) + '$'] = value;
       }),
       has: constFunc(function(key) {
         return (assertString(key) + '$') in objAsMap;
       }),
       'delete': constFunc(function(key) {
         return delete objAsMap[assertString(key) + '$'];
       })
     });
   };

 })();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Exports {@code ses.whitelist}, a recursively defined
 * JSON record enumerating all the naming paths in the ES5.1 spec,
 * those de-facto extensions that we judge to be safe, and SES and
 * Dr. SES extensions provided by the SES runtime.
 *
 * <p>Assumes only ES3. Compatible with ES5, ES5-strict, or
 * anticipated ES6.
 *
 * //provides ses.whitelist
 * @author Mark S. Miller,
 * @overrides ses, whitelistModule
 */
var ses;

/**
 * <p>Each JSON record enumerates the disposition of the properties on
 * some corresponding primordial object, with the root record
 * representing the global object. For each such record, the values
 * associated with its property names can be
 * <ul>
 * <li>Another record, in which case this property is simply
 *     whitelisted and that next record represents the disposition of
 *     the object which is its value. For example, {@code "Object"}
 *     leads to another record explaining what properties {@code
 *     "Object"} may have and how each such property, if present,
 *     and its value should be tamed.
 * <li>true, in which case this property is simply whitelisted. The
 *     value associated with that property is still traversed and
 *     tamed, but only according to the taming of the objects that
 *     object inherits from. For example, {@code "Object.freeze"} leads
 *     to true, meaning that the {@code "freeze"} property of {@code
 *     Object} should be whitelisted and the value of the property (a
 *     function) should be further tamed only according to the
 *     markings of the other objects it inherits from, like {@code
 *     "Function.prototype"} and {@code "Object.prototype").
 * <li>"*", in which case this property on this object is whitelisted,
 *     as is this property as inherited by all objects that inherit
 *     from this object. The values associated with all such properties
 *     are still traversed and tamed, but only according to the taming
 *     of the objects that object inherits from. For example, {@code
 *     "Object.prototype.constructor"} leads to "*", meaning that we
 *     whitelist the {@code "constructor"} property on {@code
 *     Object.prototype} and on every object that inherits from {@code
 *     Object.prototype} that does not have a conflicting mark. Each
 *     of these is tamed as if with true, so that the value of the
 *     property is further tamed according to what other objects it
 *     inherits from.
 * <li>"skip", in which case this property on this object is simply
 *     whitelisted, as is this property as inherited by all objects
 *     that inherit from this object, but we avoid taming the value
 *     associated with that property. For example, as of this writing
 *     {@code "Function.prototype.caller"} leads to "skip" because
 *     some current browser bugs prevent us from removing or even
 *     traversing this property on some platforms of interest.
 * </ul>
 *
 * The "skip" markings are workarounds for browser bugs or other
 * temporary problems. For each of these, there should be an
 * explanatory comment explaining why or a bug citation. Ideally, we
 * can retire all "skip" entries by the time SES is ready for secure
 * production use.
 *
 * The members of the whitelist are either
 * <ul>
 * <li>(uncommented) defined by the ES5.1 normative standard text,
 * <li>(questionable) provides a source of non-determinism, in
 *     violation of pure object-capability rules, but allowed anyway
 *     since we've given up on restricting JavaScript to a
 *     deterministic subset.
 * <li>(ES5 Appendix B) common elements of de facto JavaScript
 *     described by the non-normative Appendix B.
 * <li>(Harmless whatwg) extensions documented at
 *     <a href="http://wiki.whatwg.org/wiki/Web_ECMAScript"
 *     >http://wiki.whatwg.org/wiki/Web_ECMAScript</a> that seem to be
 *     harmless. Note that the RegExp constructor extensions on that
 *     page are <b>not harmless</b> and so must not be whitelisted.
 * <li>(ES-Harmony proposal) accepted as "proposal" status for
 *     EcmaScript-Harmony.
 * <li>(Marked as "skip") See above.
 * </ul>
 *
 * <p>With the above encoding, there are some sensible whitelists we
 * cannot express, such as marking a property both with "*" and a JSON
 * record. This is an expedient decision based only on not having
 * encountered such a need. Should we need this extra expressiveness,
 * we'll need to refactor to enable a different encoding.
 *
 * <p>We factor out {@code true} into the variable {@code t} just to
 * get a bit better compression from simple minifiers.
 */
(function whitelistModule() {
  "use strict";

  if (!ses) { ses = {}; }

  var t = true;
  ses.whitelist = {
    cajaVM: {                        // Caja support
      log: t,
      tamperProof: t,
      constFunc: t,
      def: t,
      is: t,

      compileExpr: t,
      compileModule: t,              // experimental
      compileProgram: t,             // Cannot be implemented in just ES5.1.
      eval: t,
      Function: t,

      sharedImports: t,
      makeImports: t,
      copyToImports: t,

      callWithEjector: t,
      eject: t,
      GuardT: {
        coerce: t
      },
      makeTableGuard: t,
      Trademark: {
        stamp: t
      },
      guard: t,
      passesGuard: t,
      stamp: t,
      makeSealerUnsealerPair: t,

      makeArrayLike: {}
    },
    WeakMap: {       // ES-Harmony proposal as currently implemented by FF6.0a1
      prototype: {
        // Note: coordinate this list with maintenance of repairES5.js
        get: t,
        set: t,
        has: t,
        'delete': t
      }
    },
    StringMap: {  // A specialized approximation of ES-Harmony's Map.
      prototype: {} // Technically, the methods should be on the prototype,
                    // but doing so while preserving encapsulation will be
                    // needlessly expensive for current usage.
    },
// As of this writing, the WeakMap emulation in WeakMap.js relies on
// the unguessability and undiscoverability of HIDDEN_NAME, a
// secret property name. However, on a platform with built-in
// Proxies, if whitelisted but not properly monkey patched, proxies
// could be used to trap and thereby discover HIDDEN_NAME. So until we
// (TODO(erights)) write the needed monkey patching of proxies, we
// omit them from our whitelist.
//    Proxy: {                         // ES-Harmony proposal
//      create: t,
//      createFunction: t
//    },
    escape: t,                       // ES5 Appendix B
    unescape: t,                     // ES5 Appendix B
    Object: {
      // If any new methods are added here that may reveal the
      // HIDDEN_NAME within WeakMap.js, such as the proposed
      // getOwnPropertyDescriptors or getPropertyDescriptors, then
      // extend WeakMap.js to monkey patch these to avoid revealing
      // HIDDEN_NAME.
      getPropertyDescriptor: t,      // ES-Harmony proposal
      getPropertyNames: t,           // ES-Harmony proposal
      is: t,                         // ES-Harmony proposal
      prototype: {

        // Whitelisted only to work around a Chrome debugger
        // stratification bug (TODO(erights): report). These are
        // redefined in startSES.js in terms of standard methods, so
        // that we can be confident they introduce no non-standard
        // possibilities.
        __defineGetter__: t,
        __defineSetter__: t,
        __lookupGetter__: t,
        __lookupSetter__: t,

        constructor: '*',
        toString: '*',
        toLocaleString: '*',
        valueOf: t,
        hasOwnProperty: t,
        isPrototypeOf: t,
        propertyIsEnumerable: t
      },
      getPrototypeOf: t,
      getOwnPropertyDescriptor: t,
      getOwnPropertyNames: t,
      create: t,
      defineProperty: t,
      defineProperties: t,
      seal: t,
      freeze: t,
      preventExtensions: t,
      isSealed: t,
      isFrozen: t,
      isExtensible: t,
      keys: t
    },
    NaN: t,
    Infinity: t,
    undefined: t,
    // eval: t,                      // Whitelisting under separate control
                                     // by TAME_GLOBAL_EVAL in startSES.js
    parseInt: t,
    parseFloat: t,
    isNaN: t,
    isFinite: t,
    decodeURI: t,
    decodeURIComponent: t,
    encodeURI: t,
    encodeURIComponent: t,
    Function: {
      prototype: {
        apply: t,
        call: t,
        bind: t,
        prototype: '*',
        length: '*',
        arity: '*',                  // non-std, deprecated in favor of length
        name: '*'                    // non-std
      }
    },
    Array: {
      prototype: {
        concat: t,
        join: t,
        pop: t,
        push: t,
        reverse: t,
        shift: t,
        slice: t,
        sort: t,
        splice: t,
        unshift: t,
        indexOf: t,
        lastIndexOf: t,
        every: t,
        some: t,
        forEach: t,
        map: t,
        filter: t,
        reduce: t,
        reduceRight: t,
        length: 'skip'               // can't be redefined on Mozilla
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=591059
        // and https://bugzilla.mozilla.org/show_bug.cgi?id=598996
      },
      isArray: t
    },
    String: {
      prototype: {
        substr: t,                   // ES5 Appendix B
        anchor: t,                   // Harmless whatwg
        big: t,                      // Harmless whatwg
        blink: t,                    // Harmless whatwg
        bold: t,                     // Harmless whatwg
        fixed: t,                    // Harmless whatwg
        fontcolor: t,                // Harmless whatwg
        fontsize: t,                 // Harmless whatwg
        italics: t,                  // Harmless whatwg
        link: t,                     // Harmless whatwg
        small: t,                    // Harmless whatwg
        strike: t,                   // Harmless whatwg
        sub: t,                      // Harmless whatwg
        sup: t,                      // Harmless whatwg
        trimLeft: t,                 // non-standard
        trimRight: t,                // non-standard
        valueOf: t,
        charAt: t,
        charCodeAt: t,
        concat: t,
        indexOf: t,
        lastIndexOf: t,
        localeCompare: t,
        match: t,
        replace: t,
        search: t,
        slice: t,
        split: t,
        substring: t,
        toLowerCase: t,
        toLocaleLowerCase: t,
        toUpperCase: t,
        toLocaleUpperCase: t,
        trim: t,
        length: '*'
      },
      fromCharCode: t
    },
    Boolean: {
      prototype: {
        valueOf: t
      }
    },
    Number: {
      prototype: {
        valueOf: t,
        toFixed: t,
        toExponential: t,
        toPrecision: t
      },
      MAX_VALUE: t,
      MIN_VALUE: t,
      NaN: t,
      NEGATIVE_INFINITY: t,
      POSITIVE_INFINITY: t
    },
    Math: {
      E: t,
      LN10: t,
      LN2: t,
      LOG2E: t,
      LOG10E: t,
      PI: t,
      SQRT1_2: t,
      SQRT2: t,

      abs: t,
      acos: t,
      asin: t,
      atan: t,
      atan2: t,
      ceil: t,
      cos: t,
      exp: t,
      floor: t,
      log: t,
      max: t,
      min: t,
      pow: t,
      random: t,                     // questionable
      round: t,
      sin: t,
      sqrt: t,
      tan: t
    },
    Date: {                          // no-arg Date constructor is questionable
      prototype: {
        // Note: coordinate this list with maintanence of repairES5.js
        getYear: t,                  // ES5 Appendix B
        setYear: t,                  // ES5 Appendix B
        toGMTString: t,              // ES5 Appendix B
        toDateString: t,
        toTimeString: t,
        toLocaleString: t,
        toLocaleDateString: t,
        toLocaleTimeString: t,
        valueOf: t,
        getTime: t,
        getFullYear: t,
        getUTCFullYear: t,
        getMonth: t,
        getUTCMonth: t,
        getDate: t,
        getUTCDate: t,
        getDay: t,
        getUTCDay: t,
        getHours: t,
        getUTCHours: t,
        getMinutes: t,
        getUTCMinutes: t,
        getSeconds: t,
        getUTCSeconds: t,
        getMilliseconds: t,
        getUTCMilliseconds: t,
        getTimezoneOffset: t,
        setTime: t,
        setFullYear: t,
        setUTCFullYear: t,
        setMonth: t,
        setUTCMonth: t,
        setDate: t,
        setUTCDate: t,
        setHours: t,
        setUTCHours: t,
        setMinutes: t,
        setUTCMinutes: t,
        setSeconds: t,
        setUTCSeconds: t,
        setMilliseconds: t,
        setUTCMilliseconds: t,
        toUTCString: t,
        toISOString: t,
        toJSON: t
      },
      parse: t,
      UTC: t,
      now: t                         // questionable
    },
    RegExp: {
      prototype: {
        exec: t,
        test: t,
        source: '*',
        global: '*',
        ignoreCase: '*',
        multiline: '*',
        lastIndex: '*',
        sticky: '*'                  // non-std
      }
    },
    Error: {
      prototype: {
        name: '*',
        message: '*'
      }
    },
    EvalError: {
      prototype: t
    },
    RangeError: {
      prototype: t
    },
    ReferenceError: {
      prototype: t
    },
    SyntaxError: {
      prototype: t
    },
    TypeError: {
      prototype: t
    },
    URIError: {
      prototype: t
    },
    JSON: {
      parse: t,
      stringify: t
    }
  };
})();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Export a {@code ses.atLeastFreeVarNames} function for
 * internal use by the SES-on-ES5 implementation, which enumerates at
 * least the identifiers which occur freely in a source text string.
 *
 * <p>Assumes only ES3. Compatible with ES5, ES5-strict, or
 * anticipated ES6.
 *
 * // provides ses.atLeastFreeVarNames
 * @author Mark S. Miller
 * @requires StringMap
 * @overrides ses, atLeastFreeVarNamesModule
 */
var ses;

/**
 * Calling {@code ses.atLeastFreeVarNames} on a {@code programSrc}
 * string argument, the result should include at least all the free
 * variable names of {@code programSrc} as own properties. It is
 * harmless to include other strings as well.
 *
 * <p>Assuming a programSrc that parses as a strict Program,
 * atLeastFreeVarNames(programSrc) returns a Record whose enumerable
 * own property names must include the names of all the free variables
 * occuring in programSrc. It can include as many other strings as is
 * convenient so long as it includes these. The value of each of these
 * properties should be {@code true}.
 *
 * <p>TODO(erights): On platforms that support Proxies (currently only
 * FF4 and later), we should stop using atLeastFreeVarNames, since a
 * {@code with(aProxy) {...}} should reliably intercept all free
 * variable accesses without needing any prior scan.
 */
(function atLeastFreeVarNamesModule() {
  "use strict";

   if (!ses) { ses = {}; }

  /////////////// KLUDGE SWITCHES ///////////////

  // Section 7.2 ES5 recognizes the following whitespace characters
  // FEFF           ; BOM
  // 0009 000B 000C ; White_Space # Cc
  // 0020           ; White_Space # Zs       SPACE
  // 00A0           ; White_Space # Zs       NO-BREAK SPACE
  // 1680           ; White_Space # Zs       OGHAM SPACE MARK
  // 180E           ; White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
  // 2000..200A     ; White_Space # Zs  [11] EN QUAD..HAIR SPACE
  // 2028           ; White_Space # Zl       LINE SEPARATOR
  // 2029           ; White_Space # Zp       PARAGRAPH SEPARATOR
  // 202F           ; White_Space # Zs       NARROW NO-BREAK SPACE
  // 205F           ; White_Space # Zs       MEDIUM MATHEMATICAL SPACE
  // 3000           ; White_Space # Zs       IDEOGRAPHIC SPACE

  // Unicode characters which have the Zs property are an open set and can
  // grow.  Not all versions of a browser treat Zs characters the same.
  // The trade off is as follows:
  //   * if SES treats a character as non-whitespace which the browser
  //      treats as whitespace, a sandboxed program would be able to
  //      break out of the sandbox.  SES avoids this by encoding any
  //      characters outside the range of well understood characters
  //      and disallowing unusual whitespace characters which are
  //      rarely used and may be treated non-uniformly by browsers.
  //   * if SES treats a character as whitespace which the browser
  //      treats as non-whitespace, a sandboxed program will be able
  //      to break out of the SES sandbox.  However, at worst it might
  //      be able to read, write and execute globals which have the
  //      corresponding whitespace character.  This is a limited
  //      breach because it is exceedingly rare for browser functions
  //      or powerful host functions to have names which contain
  //      potential whitespace characters.  At worst, sandboxed
  //      programs would be able to communicate with each other.
  //
  // We are conservative with the whitespace characters we accept.  We
  // deny whitespace > u00A0 to make unexpected functional differences
  // in sandboxed programs on browsers even if it was safe to allow them.
  var OTHER_WHITESPACE = new RegExp(
    '[\\uFEFF\\u1680\\u180E\\u2000-\\u2009\\u200a'
    + '\\u2028\\u2029\\u200f\\u205F\\u3000]');

  /**
   * We use this to limit the input text to ascii only text.  All other
   * characters are encoded using backslash-u escapes.
   */
  function LIMIT_SRC(programSrc) {
    if (OTHER_WHITESPACE.test(programSrc)) {
      throw new EvalError(
        'Disallowing unusual unicode whitespace characters');
    }
    programSrc = programSrc.replace(/([\u0080-\u009f\u00a1-\uffff])/g,
      function(_, u) {
        return '\\u' + ('0000' + u.charCodeAt(0).toString(16)).slice(-4);
      });
    return programSrc;
  }

  /**
   * Return a regexp that can be used repeatedly to scan for the next
   * identifier. It works correctly in concert with LIMIT_SRC above.
   *
   * If this regexp is changed compileExprLater.js should be checked for
   * correct escaping of freeNames.
   */
  function SHOULD_MATCH_IDENTIFIER() {
    return /(\w|\\u\d{4}|\$)+/g;
  }

  //////////////// END KLUDGE SWITCHES ///////////

  ses.DISABLE_SECURITY_FOR_DEBUGGER = false;

  ses.atLeastFreeVarNames = function atLeastFreeVarNames(programSrc) {
    programSrc = String(programSrc);
    programSrc = LIMIT_SRC(programSrc);
    // Now that we've temporarily limited our attention to ascii...
    var regexp = SHOULD_MATCH_IDENTIFIER();
    // Once we decide this file can depends on ES5, the following line
    // should say "... = Object.create(null);" rather than "... = {};"
    var result = [];
    var found = StringMap();
    // webkit js debuggers rely on ambient global eval
    // http://code.google.com/p/chromium/issues/detail?id=145871
    if (ses.DISABLE_SECURITY_FOR_DEBUGGER) {
      found.set('eval', true);
    }
    var a;
    while ((a = regexp.exec(programSrc))) {
      // Note that we could have avoided the while loop by doing
      // programSrc.match(regexp), except that then we'd need
      // temporary storage proportional to the total number of
      // apparent identifiers, rather than the total number of
      // apparently unique identifiers.
      var name = a[0];

      if (!found.has(name)) {
        result.push(name);
        found.set(name, true);
      }
    }
    return result;
  };

})();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Make this frame SES-safe or die trying.
 *
 * <p>Assumes ES5 plus a WeakMap that conforms to the anticipated ES6
 * WeakMap spec. Compatible with ES5-strict or anticipated ES6.
 *
 * //provides ses.startSES
 * @author Mark S. Miller,
 * @author Jasvir Nagra
 * @requires WeakMap
 * @overrides ses, console, eval, Function, cajaVM
 */
var ses;


/**
 * The global {@code eval} function available to script code, which
 * may or not be made safe.
 *
 * <p>The original global binding of {@code eval} is not
 * SES-safe. {@code cajaVM.eval} is a safe wrapper around this
 * original eval, enforcing SES language restrictions.
 *
 * <p>If {@code TAME_GLOBAL_EVAL} is true, both the global {@code
 * eval} variable and {@code sharedImports.eval} are set to the safe
 * wrapper. If {@code TAME_GLOBAL_EVAL} is false, in order to work
 * around a bug in the Chrome debugger, then the global {@code eval}
 * is unaltered and no {@code "eval"} property is available on {@code
 * sharedImports}. In either case, SES-evaled-code and SES-script-code
 * can both access the safe eval wrapper as {@code cajaVM.eval}.
 *
 * <p>By making the safe eval available on {@code sharedImports} only
 * when we also make it be the genuine global eval, we preserve the
 * property that SES-evaled-code differs from SES-script-code only by
 * having a subset of the same variables in globalish scope. This is a
 * nice-to-have that makes explanation easier rather than a hard
 * requirement. With this property, any SES-evaled-code that does not
 * fail to access a global variable (or to test whether it could)
 * should operate the same way when run as SES-script-code.
 *
 * <p>See doc-comment on cajaVM for the restriction on this API needed
 * to operate under Caja translation on old browsers.
 */
var eval;

/**
 * The global {@code Function} constructor is always replaced with a
 * safe wrapper, which is also made available as
 * {@code sharedImports.Function}.
 *
 * <p>Both the original Function constructor and this safe wrapper
 * point at the original {@code Function.prototype}, so {@code
 * instanceof} works fine with the wrapper. {@code
 * Function.prototype.constructor} is set to point at the safe
 * wrapper, so that only it, and not the unsafe original, is
 * accessible.
 *
 * <p>See doc-comment on cajaVM for the restriction on this API needed
 * to operate under Caja translation on old browsers.
 */
var Function;

/**
 * A new global exported by SES, intended to become a mostly
 * compatible API between server-side Caja translation for older
 * browsers and client-side SES verification for newer browsers.
 *
 * <p>Under server-side Caja translation for old pre-ES5 browsers, the
 * synchronous interface of the evaluation APIs (currently {@code
 * eval, Function, cajaVM.{compileExpr, compileModule, eval, Function}})
 * cannot reasonably be provided. Instead, under translation we expect
 * <ul>
 * <li>Not to have a binding for {@code "eval"} on
 *     {@code sharedImports}, just as we would not if
 *     {@code TAME_GLOBAL_EVAL} is false.
 * <li>The global {@code eval} seen by scripts is either unaltered (to
 *     work around the Chrome debugger bug if {@code TAME_GLOBAL_EVAL}
 *     is false), or is replaced by a function that throws an
 *     appropriate EvalError diagnostic (if {@code TAME_GLOBAL_EVAL}
 *     is true).
 * <li>The global {@code Function} constructor, both as seen by script
 *     code and evaled code, to throw an appropriate diagnostic.
 * <li>The {@code Q} API to always be available, to handle
 *     asynchronous, promise, and remote requests.
 * <li>The evaluating methods on {@code cajaVM} -- currently {@code
 *     compileExpr, compileModule, eval, and Function} -- to be remote
 *     promises for their normal interfaces, which therefore must be
 *     invoked with {@code Q.post}.
 * <li>Since {@code Q.post} can be used for asynchronously invoking
 *     non-promises, invocations like
 *     {@code Q.post(cajaVM, 'eval', ['2+3'])}, for example,
 *     will return a promise for a 5. This should work both under Caja
 *     translation and (TODO(erights)) under SES verification when
 *     {@code Q} is also installed, and so is the only portable
 *     evaluating API that SES code should use during this transition
 *     period.
 * <li>TODO(erights): {@code Q.post(cajaVM, 'compileModule',
 *     [moduleSrc]} should eventually pre-load the transitive
 *     synchronous dependencies of moduleSrc before resolving the
 *     promise for its result. It currently would not, instead
 *     requiring its client to do so manually.
 * </ul>
 */
var cajaVM;

/**
 * <p>{@code ses.startSES} should be called before any other potentially
 * dangerous script is executed in this frame.
 *
 * <p>If {@code ses.startSES} succeeds, the evaluation operations on
 * {@code cajaVM}, the global {@code Function} contructor, and perhaps
 * the {@code eval} function (see doc-comment on {@code eval} and
 * {@code cajaVM}) will only load code according to the <i>loader
 * isolation</i> rules of the object-capability model, suitable for
 * loading untrusted code. If all other (trusted) code executed
 * directly in this frame (i.e., other than through these safe
 * evaluation operations) takes care to uphold object-capability
 * rules, then untrusted code loaded via these safe evaluation
 * operations will be constrained by those rules. TODO(erights):
 * explain concretely what the trusted code must do or avoid doing to
 * uphold object-capability rules.
 *
 * <p>On a pre-ES5 platform, this script will fail cleanly, leaving
 * the frame intact. Otherwise, if this script fails, it may leave
 * this frame in an unusable state. All following description assumes
 * this script succeeds and that the browser conforms to the ES5
 * spec. The ES5 spec allows browsers to implement more than is
 * specified as long as certain invariants are maintained. We further
 * assume that these extensions are not maliciously designed to obey
 * the letter of these invariants while subverting the intent of the
 * spec. In other words, even on an ES5 conformant browser, we do not
 * presume to defend ourselves from a browser that is out to get us.
 *
 * @param global ::Record(any) Assumed to be the real global object
 *        for some frame. Since {@code ses.startSES} will allow global
 *        variable references that appear at the top level of the
 *        whitelist, our safety depends on these variables being
 *        frozen as a side effect of freezing the corresponding
 *        properties of {@code global}. These properties are also
 *        duplicated onto the virtual global objects which are
 *        provided as the {@code this} binding for the safe
 *        evaluation calls -- emulating the safe subset of the normal
 *        global object.
 *        TODO(erights): Currently, the code has only been tested when
 *        {@code global} is the global object of <i>this</i>
 *        frame. The code should be made to work for cross-frame use.
 * @param whitelist ::Record(Permit) where Permit = true | "*" |
 *        "skip" | Record(Permit).  Describes the subset of naming
 *        paths starting from {@code sharedImports} that should be
 *        accessible. The <i>accessible primordials</i> are all values
 *        found by navigating these paths starting from {@code
 *        sharedImports}. All non-whitelisted properties of accessible
 *        primordials are deleted, and then {@code sharedImports}
 *        and all accessible primordials are frozen with the
 *        whitelisted properties frozen as data properties.
 *        TODO(erights): fix the code and documentation to also
 *        support confined-ES5, suitable for confining potentially
 *        offensive code but not supporting defensive code, where we
 *        skip this last freezing step. With confined-ES5, each frame
 *        is considered a separate protection domain rather that each
 *        individual object.
 * @param atLeastFreeVarNames ::F([string], Record(true))
 *        Given the sourceText for a strict Program,
 *        atLeastFreeVarNames(sourceText) returns a Record whose
 *        enumerable own property names must include the names of all the
 *        free variables occuring in sourceText. It can include as
 *        many other strings as is convenient so long as it includes
 *        these. The value of each of these properties should be
 *        {@code true}. TODO(erights): On platforms with Proxies
 *        (currently only Firefox 4 and after), use {@code
 *        with(aProxy) {...}} to intercept free variables rather than
 *        atLeastFreeVarNames.
 * @param extensions ::F([], Record(any)]) A function returning a
 *        record whose own properties will be copied onto cajaVM. This
 *        is used for the optional components which bring SES to
 *        feature parity with the ES5/3 runtime at the price of larger
 *        code size. At the time that {@code startSES} calls {@code
 *        extensions}, {@code cajaVM} exists but should not yet be
 *        used. In particular, {@code extensions} should not call
 *        {@code cajaVM.def} during this setup, because def would then
 *        freeze priordials before startSES cleans them (removes
 *        non-whitelisted properties). The methods that
 *        {@code extensions} contributes can, of course, use
 *        {@code cajaVM}, since those methods will only be called once
 *        {@code startSES} finishes.
 */
ses.startSES = function(global,
                        whitelist,
                        atLeastFreeVarNames,
                        extensions) {
  "use strict";

  /////////////// KLUDGE SWITCHES ///////////////

  /////////////////////////////////
  // The following are only the minimal kludges needed for the current
  // Firefox or the current Chrome Beta. At the time of
  // this writing, these are Firefox 4.0 and Chrome 12.0.742.5 dev
  // As these move forward, kludges can be removed until we simply
  // rely on ES5.

  /**
   * <p>TODO(erights): isolate and report this.
   *
   * <p>Workaround for Chrome debugger's own use of 'eval'
   *
   * <p>This kludge is safety preserving but not semantics
   * preserving. When {@code TAME_GLOBAL_EVAL} is false, no {@code
   * sharedImports.eval} is available, and the 'eval' available as a
   * global to trusted (script) code is the original 'eval', and so is
   * not safe.
   */
  //var TAME_GLOBAL_EVAL = true;
  var TAME_GLOBAL_EVAL = false;

  /**
   * If this is true, then we redefine these to work around a
   * stratification bug in the Chrome debugger. To allow this, we have
   * also whitelisted these four properties in whitelist.js
   */
  //var EMULATE_LEGACY_GETTERS_SETTERS = false;
  var EMULATE_LEGACY_GETTERS_SETTERS = true;

  //////////////// END KLUDGE SWITCHES ///////////


  var dirty = true;

  var hop = Object.prototype.hasOwnProperty;

  var getProto = Object.getPrototypeOf;
  var defProp = Object.defineProperty;
  var gopd = Object.getOwnPropertyDescriptor;
  var gopn = Object.getOwnPropertyNames;
  var keys = Object.keys;
  var freeze = Object.freeze;
  var create = Object.create;

  /**
   * Use to tamper proof a function which is not intended to ever be
   * used as a constructor, since it nulls out the function's
   * prototype first.
   */
  function constFunc(func) {
    func.prototype = null;
    return freeze(func);
  }


  function fail(str) {
    debugger;
    throw new EvalError(str);
  }

  if (typeof WeakMap === 'undefined') {
    fail('No built-in WeakMaps, so WeakMap.js must be loaded first');
  }


  if (EMULATE_LEGACY_GETTERS_SETTERS) {
    (function(){
      function legacyDefineGetter(sprop, getter) {
        sprop = '' + sprop;
        if (hop.call(this, sprop)) {
          defProp(this, sprop, { get: getter });
        } else {
          defProp(this, sprop, {
            get: getter,
            set: undefined,
            enumerable: true,
            configurable: true
          });
        }
      }
      legacyDefineGetter.prototype = null;
      defProp(Object.prototype, '__defineGetter__', {
        value: legacyDefineGetter,
        writable: false,
        enumerable: false,
        configurable: false
      });

      function legacyDefineSetter(sprop, setter) {
        sprop = '' + sprop;
        if (hop.call(this, sprop)) {
          defProp(this, sprop, { set: setter });
        } else {
          defProp(this, sprop, {
            get: undefined,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
      }
      legacyDefineSetter.prototype = null;
      defProp(Object.prototype, '__defineSetter__', {
        value: legacyDefineSetter,
        writable: false,
        enumerable: false,
        configurable: false
      });

      function legacyLookupGetter(sprop) {
        sprop = '' + sprop;
        var base = this, desc = void 0;
        while (base && !(desc = gopd(base, sprop))) { base = getProto(base); }
        return desc && desc.get;
      }
      legacyLookupGetter.prototype = null;
      defProp(Object.prototype, '__lookupGetter__', {
        value: legacyLookupGetter,
        writable: false,
        enumerable: false,
        configurable: false
      });

      function legacyLookupSetter(sprop) {
        sprop = '' + sprop;
        var base = this, desc = void 0;
        while (base && !(desc = gopd(base, sprop))) { base = getProto(base); }
        return desc && desc.set;
      }
      legacyLookupSetter.prototype = null;
      defProp(Object.prototype, '__lookupSetter__', {
        value: legacyLookupSetter,
        writable: false,
        enumerable: false,
        configurable: false
      });
    })();
  } else {
    delete Object.prototype.__defineGetter__;
    delete Object.prototype.__defineSetter__;
    delete Object.prototype.__lookupGetter__;
    delete Object.prototype.__lookupSetter__;
  }


  /**
   * By this time, WeakMap has already monkey patched Object.freeze if
   * necessary, so we can do the tamperProofing delayed from
   * repairES5.js
   */
  var tamperProof = ses.makeDelayedTamperProof();

  /**
   * Code being eval'ed by {@code cajaVM.eval} sees {@code
   * sharedImports} as its top-level {@code this}, as if {@code
   * sharedImports} were the global object.
   *
   * <p>{@code sharedImports}'s properties are exactly the whitelisted
   * global variable references. These properties, both as they appear
   * on the global object and on this {@code sharedImports} object,
   * are frozen and so cannot diverge. This preserves the illusion.
   *
   * <p>For code being evaluated by {@code cajaVM.compileExpr} and its
   * ilk, the {@code imports} provided to the compiled function is bound
   * to the top-level {@code this} of the evaluated code. For sanity,
   * this {@code imports} should first be initialized with a copy of the
   * properties of {@code sharedImports}, but nothing enforces this.
   */
  var sharedImports = create(null);

  (function startSESPrelude() {

    /**
     * The unsafe* variables hold precious values that must not escape
     * to untrusted code. When {@code eval} is invoked via {@code
     * unsafeEval}, this is a call to the indirect eval function, not
     * the direct eval operator.
     */
    var unsafeEval = eval;
    var UnsafeFunction = Function;

    /**
     * Fails if {@code programSrc} does not parse as a strict Program
     * production, or, almost equivalently, as a FunctionBody
     * production.
     *
     * <p>We use Crock's trick of simply passing {@code programSrc} to
     * the original {@code Function} constructor, which will throw a
     * SyntaxError if it does not parse as a FunctionBody. We used to
     * use Ankur's trick (need link) which is more correct, in that it
     * will throw if {@code programSrc} does not parse as a Program
     * production, which is the relevant question. However, the
     * difference -- whether return statements are accepted -- does
     * not matter for our purposes. And testing reveals that Crock's
     * trick executes over 100x faster on V8.
     */
    function verifyStrictProgram(programSrc) {
      try {
        UnsafeFunction('"use strict";' + programSrc);
      } catch (err) {
        // debugger; // Useful for debugging -- to look at programSrc
        throw err;
      }
    }

    /**
     * Fails if {@code exprSource} does not parse as a strict
     * Expression production.
     *
     * <p>To verify that exprSrc parses as a strict Expression, we
     * verify that (when followed by ";") it parses as a strict
     * Program, and that when surrounded with parens it still parses
     * as a strict Program. We place a newline before the terminal
     * token so that a "//" comment cannot suppress the close paren.
     */
    function verifyStrictExpression(exprSrc) {
      verifyStrictProgram(exprSrc + ';');
      verifyStrictProgram('( ' + exprSrc + '\n);');
    }

    /**
     * Make a virtual global object whose initial own properties are
     * a copy of the own properties of {@code sharedImports}.
     *
     * <p>Further uses of {@code copyToImports} to copy properties
     * onto this imports object will overwrite, effectively shadowing
     * the {@code sharedImports}. You should shadow by overwriting
     * rather than inheritance so that shadowing makes the original
     * binding inaccessible.
     *
     * <p>The returned imports object is extensible and all its
     * properties are configurable and non-enumerable. Once fully
     * initialized, the caller can of course freeze the imports
     * objects if desired. A reason not to do so it to emulate
     * traditional JavaScript intermodule linkage by side effects to a
     * shared (virtual) global object.
     *
     * <p>See {@code copyToImports} for the precise semantic of the
     * property copying.
     */
    function makeImports() {
      var imports = create(null);
      copyToImports(imports, sharedImports);
      return imports;
    }

    /**
     * For all the own properties of {@code from}, copy their
     * descriptors to {@code imports}, except that each property
     * added to {@code imports} is unconditionally configurable
     * and non-enumerable.
     *
     * <p>By copying descriptors rather than values, any accessor
     * properties of {@code env} become accessors of {@code imports}
     * with the same getter and setter. If these do not use their
     * {@code this} value, then the original and any copied properties
     * are effectively joined. If the getter/setter do use their
     * {@code this}, when accessed with {@code imports} as the base,
     * their {@code this} will be bound to the {@code imports} rather
     * than {@code from}. If {@code from} contains writable value
     * properties, this will copy the current value of the property,
     * after which they may diverge.
     *
     * <p>We make these configurable so that {@code imports} can
     * be further configured before being frozen. We make these
     * non-enumerable in order to emulate the normal behavior of
     * built-in properties of typical global objects, such as the
     * browser's {@code window} object.
     */
    function copyToImports(imports, from) {
      gopn(from).forEach(function(name) {
        var desc = gopd(from, name);
        desc.enumerable = false;
        desc.configurable = true;
        defProp(imports, name, desc);
      });
      return imports;
    }

    /**
     * Make a frozen scope object which reflects all access onto
     * {@code imports}, for use by {@code with} to prevent
     * access to any {@code freeNames} other than those found on the.
     * {@code imports}.
     */
    function makeScopeObject(imports, freeNames) {
      var scopeObject = create(null);
      // Note: Although this loop is a bottleneck on some platforms,
      // it does not help to turn it into a for(;;) loop, since we
      // still need an enclosing function per accessor property
      // created, to capture its own unique binding of
      // "name". (Embarrasing fact: despite having often written about
      // this very danger, I engaged in this mistake in a misbegotten
      // optimization attempt here.)
      freeNames.forEach(function interceptName(name) {
        var desc = gopd(imports, name);
        if (!desc || desc.writable !== false || desc.configurable) {
          // If there is no own property, or it isn't a non-writable
          // value property, or it is configurable. Note that this
          // case includes accessor properties. The reason we wrap
          // rather than copying over getters and setters is so the
          // this-binding of the original getters and setters will be
          // the imports rather than the scopeObject.
          desc = {
            get: function scopedGet() {
              if (name in imports) {
                var result = imports[name];
                if (typeof result === 'function') {
                  // If it were possible to know that the getter call
                  // was on behalf of a simple function call to the
                  // gotten function, we could instead return that
                  // function as bound to undefined. Unfortunately,
                  // without parsing (or possibly proxies?), that isn't
                  // possible.
                }
                return result;
              }
              // if it were possible to know that the getter call was on
              // behalf of a typeof expression, we'd return the string
              // "undefined" here instead. Unfortunately, without
              // parsing or proxies, that isn't possible.
              throw new ReferenceError('"' + name + '" blocked by Caja');
            },
            set: function scopedSet(newValue) {
              if (name in imports) {
                imports[name] = newValue;
                return newValue;
              }
              throw new TypeError('Cannot set "' + name + '"');
            },
            enumerable: false
          };
        }
        desc.enumerable = false;
        defProp(scopeObject, name, desc);
      });
      return freeze(scopeObject);
    }


    /**
     * Given SES source text that must not be run directly using any
     * of the built-in unsafe evaluators on this platform, we instead
     * surround it with a prelude and postlude.
     *
     * <p>Evaluating the resulting expression return a function that
     * <i>can</i>be called to execute the original expression safely,
     * in a controlled scope. See "makeCompiledExpr" for precisely the
     * pattern that must be followed to call the resulting function
     * safely.
     *
     * Notice that the source text placed around {@code exprSrc}
     * <ul>
     * <li>brings no variable names into scope, avoiding any
     *     non-hygienic name capture issues, and
     * <li>does not introduce any newlines preceding exprSrc, so
     *     that all line number which a debugger might report are
     *     accurate wrt the original source text. And except for the
     *     first line, all the column numbers are accurate too.
     * </ul>
     *
     * <p>TODO(erights): Find out if any platforms have any way to
     * associate a file name and line number with eval'ed text, so
     * that we can do something useful with the optional {@code
     * opt_sourcePosition} to better support debugging.
     */
    function securableWrapperSrc(exprSrc, opt_sourcePosition) {
      verifyStrictExpression(exprSrc);

      return '(function() { ' +
        // non-strict code, where this === scopeObject
        '  with (this) { ' +
        '    return function() { ' +
        '      "use strict"; ' +
        '      return ( ' +
        // strict code, where this === imports
        '        ' + exprSrc + '\n' +
        '      );\n' +
        '    };\n' +
        '  }\n' +
        '})';
    }
    ses.securableWrapperSrc = securableWrapperSrc;


    /**
     * Given a wrapper function, such as the result of evaluating the
     * source that securableWrapperSrc returns, and a list of all the
     * names that we want to intercept to redirect to the imports,
     * return a corresponding <i>compiled expr</i> function.
     *
     * <p>A compiled expr function, when called on an imports
     * object, evaluates the original expression in a context where
     * all its free variable references that appear in freeNames are
     * redirected to the corresponding property of imports.
     */
    function makeCompiledExpr(wrapper, freeNames) {
      if (dirty) { fail('Initial cleaning failed'); }

      function compiledCode(imports) {
        var scopeObject = makeScopeObject(imports, freeNames);
        return wrapper.call(scopeObject).call(imports);
      };
      compiledCode.prototype = null;
      return compiledCode;
    }
    ses.makeCompiledExpr = makeCompiledExpr;

    /**
     * Compiles {@code exprSrc} as a strict expression into a function
     * of an {@code imports}, that when called evaluates {@code
     * exprSrc} in a virtual global environment whose {@code this} is
     * bound to that {@code imports}, and whose free variables
     * refer only to the properties of that {@code imports}.
     *
     * <p>When SES is provided primitively, it should provide an
     * analogous {@code compileProgram} function that accepts a
     * Program and return a function that evaluates it to the
     * Program's completion value. Unfortunately, this is not
     * practical as a library without some non-standard support from
     * the platform such as a parser API that provides an AST.
     *
     * <p>Thanks to Mike Samuel and Ankur Taly for this trick of using
     * {@code with} together with RegExp matching to intercept free
     * variable access without parsing.
     */
    function compileExpr(exprSrc, opt_sourcePosition) {
      var wrapperSrc = securableWrapperSrc(exprSrc, opt_sourcePosition);
      var wrapper = unsafeEval(wrapperSrc);
      var freeNames = atLeastFreeVarNames(exprSrc);
      var result = makeCompiledExpr(wrapper, freeNames);
      return freeze(result);
    }


    var directivePattern = (/^['"](?:\w|\s)*['"]$/m);

    /**
     * A stereotyped form of the CommonJS require statement.
     */
    var requirePattern = (/^(?:\w*\s*(?:\w|\$|\.)*\s*=)?\s*require\s*\(\s*['"]((?:\w|\$|\.|\/)+)['"]\s*\)$/m);

    /**
     * As an experiment, recognize a stereotyped prelude of the
     * CommonJS module system.
     */
    function getRequirements(modSrc) {
      var result = [];
      var stmts = modSrc.split(';');
      var stmt;
      var i = 0, ilen = stmts.length;
      for (; i < ilen; i++) {
        stmt = stmts[i].trim();
        if (stmt !== '') {
          if (!directivePattern.test(stmt)) { break; }
        }
      }
      for (; i < ilen; i++) {
        stmt = stmts[i].trim();
        if (stmt !== '') {
          var m = requirePattern.exec(stmt);
          if (!m) { break; }
          result.push(m[1]);
        }
      }
      return freeze(result);
    }

    /**
     * A module source is actually any valid FunctionBody, and thus
     * any valid Program.
     *
     * <p>In addition, in case the module source happens to begin with
     * a streotyped prelude of the CommonJS module system, the
     * function resulting from module compilation has an additional
     * {@code "requirements"} property whose value is a list of the
     * module names being required by that prelude. These requirements
     * are the module's "immediate synchronous dependencies".
     *
     * <p>This {@code "requirements"} property is adequate to
     * bootstrap support for a CommonJS module system, since a loader
     * can first load and compile the transitive closure of an initial
     * module's synchronous depencies before actually executing any of
     * these module functions.
     *
     * <p>With a similarly lightweight RegExp, we should be able to
     * similarly recognize the {@code "load"} syntax of <a href=
     * "http://wiki.ecmascript.org/doku.php?id=strawman:simple_modules#syntax"
     * >Sam and Dave's module proposal for ES-Harmony</a>. However,
     * since browsers do not currently accept this syntax,
     * {@code getRequirements} above would also have to extract these
     * from the text to be compiled.
     */
    function compileModule(modSrc, opt_sourcePosition) {
      var exprSrc = '(function() {' + modSrc + '}).call(this)';

      // Follow the pattern in compileExpr
      var wrapperSrc = securableWrapperSrc(exprSrc, opt_sourcePosition);
      var wrapper = unsafeEval(wrapperSrc);
      var freeNames = atLeastFreeVarNames(exprSrc);
      var moduleMaker = makeCompiledExpr(wrapper, freeNames);

      moduleMaker.requirements = getRequirements(modSrc);
      return freeze(moduleMaker);
    }

    /**
     * A safe form of the {@code Function} constructor, which
     * constructs strict functions that can only refer freely to the
     * {@code sharedImports}.
     *
     * <p>The returned function is strict whether or not it declares
     * itself to be.
     */
    function FakeFunction(var_args) {
      var params = [].slice.call(arguments, 0);
      var body = params.pop();
      body = String(body || '');
      params = params.join(',');
      var exprSrc = '(function(' + params + '\n){' + body + '})';
      return compileExpr(exprSrc)(sharedImports);
    }
    FakeFunction.prototype = UnsafeFunction.prototype;
    FakeFunction.prototype.constructor = FakeFunction;
    global.Function = FakeFunction;

    /**
     * A safe form of the indirect {@code eval} function, which
     * evaluates {@code src} as strict code that can only refer freely
     * to the {@code sharedImports}.
     *
     * <p>Given our parserless methods of verifying untrusted sources,
     * we unfortunately have no practical way to obtain the completion
     * value of a safely evaluated Program. Instead, we adopt a
     * compromise based on the following observation. All Expressions
     * are valid Programs, and all Programs are valid
     * FunctionBodys. If {@code src} parses as a strict expression,
     * then we evaluate it as an expression and correctly return its
     * completion value, since that is simply the value of the
     * expression.
     *
     * <p>Otherwise, we evaluate {@code src} as a FunctionBody and
     * return what that would return from its implicit enclosing
     * function. If {@code src} is simply a Program, then it would not
     * have an explicit {@code return} statement, and so we fail to
     * return its completion value.
     *
     * <p>When SES {@code eval} is provided primitively, it should
     * accept a Program and evaluate it to the Program's completion
     * value. Unfortunately, this is not possible on ES5 without
     * parsing.
     */
    function fakeEval(src) {
      try {
        verifyStrictExpression(src);
      } catch (x) {
        src = '(function() {' + src + '\n}).call(this)';
      }
      return compileExpr(src)(sharedImports);
    }

    if (TAME_GLOBAL_EVAL) {
      global.eval = fakeEval;
    }

    var defended = WeakMap();
    var defending = WeakMap();
    /**
     * To define a defended object is to tamperProof it and all objects
     * transitively reachable from it via transitive reflective
     * property and prototype traversal.
     */
    function def(node) {
      var defendingList = [];
      function recur(val) {
        if (!val) { return; }
        var t = typeof val;
        if (t === 'number' || t === 'string' || t === 'boolean') { return; }
        if (defended.get(val) || defending.get(val)) { return; }
        defending.set(val, true);
        defendingList.push(val);

        tamperProof(val);

        recur(getProto(val));

        // How to optimize? This is a performance sensitive loop, but
        // forEach seems to be faster on Chrome 18 Canary but a
        // for(;;) loop seems better on FF 12 Nightly.
        gopn(val).forEach(function(p) {
          if (typeof val === 'function' &&
              (p === 'caller' || p === 'arguments')) {
            return;
          }
          var desc = gopd(val, p);
          recur(desc.value);
          recur(desc.get);
          recur(desc.set);
        });
      }
      try {
        recur(node);
      } catch (err) {
        defending = WeakMap();
        throw err;
      }
      defendingList.forEach(function(obj) {
        defended.set(obj, true);
      });
      return node;
    }


    /**
     * makeArrayLike() produces a constructor for the purpose of
     * taming things like nodeLists.  The result, ArrayLike, takes an
     * instance of ArrayLike and two functions, getItem and getLength,
     * which put it in a position to do taming on demand.
     *
     * <p>The constructor returns a new object that inherits from the
     * {@code proto} passed in.
     */
    var makeArrayLike;
    (function() {
      var itemMap = WeakMap(), lengthMap = WeakMap();
      function lengthGetter() {
        var getter = lengthMap.get(this);
        return getter ? getter() : void 0;
      }
      constFunc(lengthGetter);

      var nativeProxies = global.Proxy && (function () {
        var obj = {0: 'hi'};
        var p = global.Proxy.create({
          get: function () {
            var P = arguments[0];
            if (typeof P !== 'string') { P = arguments[1]; }
            return obj[P];
          }
        });
        return p[0] === 'hi';
      })();
      if (nativeProxies) {
        (function () {
          function ArrayLike(proto, getItem, getLength) {
            if (typeof proto !== 'object') {
              throw new TypeError('Expected proto to be an object.');
            }
            if (!(proto instanceof ArrayLike)) {
              throw new TypeError('Expected proto to be instanceof ArrayLike.');
            }
            var obj = create(proto);
            itemMap.set(obj, getItem);
            lengthMap.set(obj, getLength);
            return obj;
          }

          function ownPropDesc(P) {
            P = '' + P;
            if (P === 'length') {
              return { get: lengthGetter };
            } else if (typeof P === 'number' || P === '' + (+P)) {
              return {
                get: constFunc(function() {
                  var getter = itemMap.get(this);
                  return getter ? getter(+P) : void 0;
                }),
                enumerable: true,
                configurable: true
              };
            }
            return void 0;
          }
          function propDesc(P) {
            var opd = ownPropDesc(P);
            if (opd) {
              return opd;
            } else {
              return gopd(Object.prototype, P);
            }
          }
          function has(P) {
            P = '' + P;
            return (P === 'length') ||
                (typeof P === 'number') ||
                (P === '' + +P) ||
                (P in Object.prototype);
          }
          function hasOwn(P) {
            P = '' + P;
            return (P === 'length') ||
                (typeof P === 'number') ||
                (P === '' + +P);
          }
          function getPN() {
            var result = getOwnPN ();
            var objPropNames = gopn(Object.prototype);
            result.push.apply(result, objPropNames);
            return result;
          }
          function getOwnPN() {
            var lenGetter = lengthMap.get(this);
            if (!lenGetter) { return void 0; }
            var len = lenGetter();
            var result = ['length'];
            for (var i = 0; i < len; ++i) {
              result.push('' + i);
            }
            return result;
          };
          function del(P) {
            P = '' + P;
            if ((P === 'length') || ('' + +P === P)) { return false; }
            return true;
          }

          ArrayLike.prototype = global.Proxy.create({
            getPropertyDescriptor: propDesc,
            getOwnPropertyDescriptor: ownPropDesc,
            has: has,
            hasOwn: hasOwn,
            getPropertyNames: getPN,
            getOwnPropertyNames: getOwnPN,
            'delete': del,
            fix: function() { return void 0; }
          }, Object.prototype);
          tamperProof(ArrayLike);
          makeArrayLike = function() { return ArrayLike; };
        })();
      } else {
        (function() {
          // Make BiggestArrayLike.prototype be an object with a fixed
          // set of numeric getters.  To tame larger lists, replace
          // BiggestArrayLike and its prototype using
          // makeArrayLike(newLength).

          // See
          // http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
          function nextUInt31PowerOf2(v) {
            v &= 0x7fffffff;
            v |= v >> 1;
            v |= v >> 2;
            v |= v >> 4;
            v |= v >> 8;
            v |= v >> 16;
            return v + 1;
          }

          // The current function whose prototype has the most numeric getters.
          var BiggestArrayLike = void 0;
          var maxLen = 0;
          makeArrayLike = function(length) {
            if (!BiggestArrayLike || length > maxLen) {
              var len = nextUInt31PowerOf2(length);
              // Create a new ArrayLike constructor to replace the old one.
              var BAL = function(proto, getItem, getLength) {
                if (typeof(proto) !== 'object') {
                  throw new TypeError('Expected proto to be an object.');
                }
                if (!(proto instanceof BAL)) {
                  throw new TypeError(
                      'Expected proto to be instanceof ArrayLike.');
                }
                var obj = create(proto);
                itemMap.set(obj, getItem);
                lengthMap.set(obj, getLength);
                return obj;
              };
              // Install native numeric getters.
              for (var i = 0; i < len; i++) {
                (function(j) {
                  function get() {
                    return itemMap.get(this)(j);
                  }
                  defProp(BAL.prototype, j, {
                    get: constFunc(get),
                    enumerable: true
                  });
                })(i);
              }
              // Install native length getter.
              defProp(BAL.prototype, 'length', { get: lengthGetter });
              // TamperProof and cache the result
              tamperProof(BAL);
              tamperProof(BAL.prototype);
              BiggestArrayLike = BAL;
              maxLen = len;
            }
            return BiggestArrayLike;
          };
        })();
      }
    })();

    global.cajaVM = { // don't freeze here

      /**
       * This is about to be deprecated once we expose ses.logger.
       *
       * <p>In the meantime, privileged code should use ses.logger.log
       * instead of cajaVM.log.
       */
      log: constFunc(function log(str) {
        if (typeof console !== 'undefined' && 'log' in console) {
          // We no longer test (typeof console.log === 'function') since,
          // on IE9 and IE10preview, in violation of the ES5 spec, it
          // is callable but has typeof "object". See
          // https://connect.microsoft.com/IE/feedback/details/685962/
          //   console-log-and-others-are-callable-but-arent-typeof-function
          console.log(str);
        }
      }),
      tamperProof: constFunc(tamperProof),
      constFunc: constFunc(constFunc),
      // def: see below
      is: constFunc(ses.is),

      compileExpr: constFunc(compileExpr),
      compileModule: constFunc(compileModule),
      // compileProgram: compileProgram, // Cannot be implemented in ES5.1.
      eval: fakeEval,               // don't freeze here
      Function: FakeFunction,       // don't freeze here,

      sharedImports: sharedImports, // don't freeze here
      makeImports: constFunc(makeImports),
      copyToImports: constFunc(copyToImports),

      makeArrayLike: constFunc(makeArrayLike),
      inES5Mode: true
    };
    var extensionsRecord = extensions();
    gopn(extensionsRecord).forEach(function (p) {
      defProp(cajaVM, p,
              gopd(extensionsRecord, p));
    });

    // Move this down here so it is not available during the call to
    // extensions().
    global.cajaVM.def = constFunc(def);

  })();

  var propertyReports = {};

  /**
   * Report how a property manipulation went.
   */
  function reportProperty(severity, status, path) {
    ses.updateMaxSeverity(severity);
    var group = propertyReports[status] || (propertyReports[status] = {
      severity: severity,
      list: []
    });
    group.list.push(path);
  }

  /**
   * Initialize accessible global variables and {@code sharedImports}.
   *
   * For each of the whitelisted globals, we read its value, freeze
   * that global property as a data property, and mirror that property
   * with a frozen data property of the same name and value on {@code
   * sharedImports}, but always non-enumerable. We make these
   * non-enumerable since ES5.1 specifies that all these properties
   * are non-enumerable on the global object.
   */
  keys(whitelist).forEach(function(name) {
    var desc = gopd(global, name);
    if (desc) {
      var permit = whitelist[name];
      if (permit) {
        var newDesc = {
          value: global[name],
          writable: false,
          configurable: false,
          enumerable: desc.enumerable // firefox bug 787262
        };
        try {
          defProp(global, name, newDesc);
        } catch (err) {
          reportProperty(ses.severities.NEW_SYMPTOM,
                         'Global ' + name + ' cannot be made readonly: ' + err);
        }
        defProp(sharedImports, name, newDesc);
      }
    }
  });
  if (TAME_GLOBAL_EVAL) {
    defProp(sharedImports, 'eval', {
      value: cajaVM.eval,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }

  /**
   * The whiteTable should map from each path-accessible primordial
   * object to the permit object that describes how it should be
   * cleaned.
   *
   * We initialize the whiteTable only so that {@code getPermit} can
   * process "*" and "skip" inheritance using the whitelist, by
   * walking actual superclass chains.
   */
  var whiteTable = WeakMap();
  function register(value, permit) {
    if (value !== Object(value)) { return; }
    if (typeof permit !== 'object') {
      return;
    }
    var oldPermit = whiteTable.get(value);
    if (oldPermit) {
      fail('primordial reachable through multiple paths');
    }
    whiteTable.set(value, permit);
    keys(permit).forEach(function(name) {
      if (permit[name] !== 'skip') {
        var sub = value[name];
        register(sub, permit[name]);
      }
    });
  }
  register(sharedImports, whitelist);

  /**
   * Should the property named {@code name} be whitelisted on the
   * {@code base} object, and if so, with what Permit?
   *
   * <p>If it should be permitted, return the Permit (where Permit =
   * true | "*" | "skip" | Record(Permit)), all of which are
   * truthy. If it should not be permitted, return false.
   */
  function getPermit(base, name) {
    var permit = whiteTable.get(base);
    if (permit) {
      if (hop.call(permit, name)) { return permit[name]; }
    }
    while (true) {
      base = getProto(base);
      if (base === null) { return false; }
      permit = whiteTable.get(base);
      if (permit && hop.call(permit, name)) {
        var result = permit[name];
        if (result === '*' || result === 'skip') {
          return result;
        } else {
          return false;
        }
      }
    }
  }

  var cleaning = WeakMap();

  /**
   * Delete the property if possible, else try to poison.
   */
  function cleanProperty(base, name, path) {
    function poison() {
      throw new TypeError('Cannot access property ' + path);
    }
    var diagnostic;

    if (typeof base === 'function') {
      if (name === 'caller') {
        diagnostic = ses.makeCallerHarmless(base, path);
        // We can use a severity of SAFE here since if this isn't
        // safe, it is the responsibility of repairES5.js to tell us
        // so. All the same, we should inspect the reports on all
        // platforms we care about to see if there are any surprises.
        reportProperty(ses.severities.SAFE,
                       diagnostic, path);
        return true;
      }
      if (name === 'arguments') {
        diagnostic = ses.makeArgumentsHarmless(base, path);
        // We can use a severity of SAFE here since if this isn't
        // safe, it is the responsibility of repairES5.js to tell us
        // so. All the same, we should inspect the reports on all
        // platforms we care about to see if there are any surprises.
        reportProperty(ses.severities.SAFE,
                       diagnostic, path);
        return true;
      }
    }

    var deleted = void 0;
    var err = void 0;
    try {
      deleted = delete base[name];
    } catch (er) { err = er; }
    var exists = hop.call(base, name);
    if (deleted) {
      if (!exists) {
        reportProperty(ses.severities.SAFE,
                       'Deleted', path);
        return true;
      }
      reportProperty(ses.severities.SAFE_SPEC_VIOLATION,
                     'Bounced back', path);
    } else if (deleted === false) {
      reportProperty(ses.severities.SAFE_SPEC_VIOLATION,
                     'Strict delete returned false rather than throwing', path);
    } else if (err instanceof TypeError) {
      // This is the normal abnormal case, so leave it to the next
      // section to emit a diagnostic.
      //
      // reportProperty(ses.severities.SAFE_SPEC_VIOLATION,
      //                'Cannot be deleted', path);
    } else {
      reportProperty(ses.severities.NEW_SYMPTOM,
                     'Delete failed with' + err, path);
    }

    try {
      defProp(base, name, {
        get: poison,
        set: poison,
        enumerable: false,
        configurable: false
      });
    } catch (cantPoisonErr) {
      try {
        // Perhaps it's writable non-configurable, in which case we
        // should still be able to freeze it in a harmless state.
        var value = gopd(base, name).value;
        defProp(base, name, {
          value: value === null ? null : void 0,
          writable: false,
          configurable: false
        });
      } catch (cantFreezeHarmless) {
        reportProperty(ses.severities.NOT_ISOLATED,
                       'Cannot be poisoned', path);
        return false;
      }
    }
    var desc2 = gopd(base, name);
    if (desc2.get === poison &&
        desc2.set === poison &&
        !desc2.configurable) {
      try {
        var dummy2 = base[name];
      } catch (expectedErr) {
        if (expectedErr instanceof TypeError) {
          reportProperty(ses.severities.SAFE,
                         'Successfully poisoned', path);
          return true;
        }
      }
    } else if ((desc2.value === void 0 || desc2.value === null) &&
               !desc2.writable &&
               !desc2.configurable) {
      reportProperty(ses.severities.SAFE,
                     'Frozen harmless', path);
      return false;
    }
    reportProperty(ses.severities.NEW_SYMPTOM,
                   'Failed to be poisoned', path);
    return false;
  }

  /**
   * Assumes all super objects are otherwise accessible and so will be
   * independently cleaned.
   */
  function clean(value, prefix) {
    if (value !== Object(value)) { return; }
    if (cleaning.get(value)) { return; }
    cleaning.set(value, true);
    gopn(value).forEach(function(name) {
      var path = prefix + (prefix ? '.' : '') + name;
      var p = getPermit(value, name);
      if (p) {
        if (p === 'skip') {
          reportProperty(ses.severities.SAFE,
                         'Skipped', path);
        } else {
          var sub = value[name];
          clean(sub, path);
        }
      } else {
        cleanProperty(value, name, path);
      }
    });
  }
  clean(sharedImports, '');

  /**
   * This protection is now gathered here, so that a future version
   * can skip it for non-defensive frames that must only be confined.
   */
  cajaVM.def(sharedImports);

  keys(propertyReports).sort().forEach(function(status) {
    var group = propertyReports[status];
    ses.logger.reportDiagnosis(group.severity, status, group.list);
  });

  ses.logger.reportMax();

  if (ses.ok(ses['severities'][ses.maxAcceptableSeverityName])) {
    // We succeeded. Enable safe Function, eval, and compile* to work.
    dirty = false;
    ses.logger.log('initSES succeeded.');
  } else {
    ses.logger.error('initSES failed.');
  }
};
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * This is a pure-ES5 implementation of ejectors, guards, and trademarks as
 * otherwise provided by ES5/3. It is incorporated into the cajaVM object by
 * hookupSESPlus.js.
 *
 * <p>Assumes ES5. Compatible with ES5-strict.
 *
 * // provides ses.ejectorsGuardsTrademarks
 * @author kpreid@switchb.org
 * @requires WeakMap, cajaVM
 * @overrides ses, ejectorsGuardsTrademarksModule
 */
var ses;

(function ejectorsGuardsTrademarksModule(){
  "use strict";

  ses.ejectorsGuardsTrademarks = function ejectorsGuardsTrademarks() {

    /**
     * During the call to {@code ejectorsGuardsTrademarks}, {@code
     * ejectorsGuardsTrademarks} must not call {@code cajaVM.def},
     * since startSES.js has not yet finished cleaning things. See the
     * doc-comments on the {@code extensions} parameter of
     * startSES.js.
     *
     * <p>Instead, we define here some conveniences for freezing just
     * enough without prematurely freezing primodial objects
     * transitively reachable from these.
     */
    var freeze = Object.freeze;
    var constFunc = cajaVM.constFunc;


    /**
     * Returns a new object whose only utility is its identity and (for
     * diagnostic purposes only) its name.
     */
    function Token(name) {
      name = '' + name;
      return freeze({
        toString: constFunc(function tokenToString() {
          return name;
        })
      });
    }


    ////////////////////////////////////////////////////////////////////////
    // Ejectors
    ////////////////////////////////////////////////////////////////////////

    /**
     * One-arg form is known in scheme as "call with escape
     * continuation" (call/ec).
     *
     * <p>In this analogy, a call to {@code callWithEjector} emulates a
     * labeled statement. The ejector passed to the {@code attemptFunc}
     * emulates the label part. The {@code attemptFunc} itself emulates
     * the statement being labeled. And a call to {@code eject} with
     * this ejector emulates the return-to-label statement.
     *
     * <p>We extend the normal notion of call/ec with an
     * {@code opt_failFunc} in order to give more the sense of a
     * {@code try/catch} (or similarly, the {@code escape} special
     * form in E). The {@code attemptFunc} is like the {@code try}
     * clause and the {@code opt_failFunc} is like the {@code catch}
     * clause. If omitted, {@code opt_failFunc} defaults to the
     * {@code identity} function.
     *
     * <p>{@code callWithEjector} creates a fresh ejector -- a one
     * argument function -- for exiting from this attempt. It then calls
     * {@code attemptFunc} passing that ejector as argument. If
     * {@code attemptFunc} completes without calling the ejector, then
     * this call to {@code callWithEjector} completes
     * likewise. Otherwise, if the ejector is called with an argument,
     * then {@code opt_failFunc} is called with that argument. The
     * completion of {@code opt_failFunc} is then the completion of the
     * {@code callWithEjector} as a whole.
     *
     * <p>The ejector stays live until {@code attemptFunc} is exited,
     * at which point the ejector is disabled. Calling a disabled
     * ejector throws.
     *
     * <p>Historic note: This was first invented by John C. Reynolds in
     * <a href="http://doi.acm.org/10.1145/800194.805852"
     * >Definitional interpreters for higher-order programming
     * languages</a>. Reynold's invention was a special form as in E,
     * rather than a higher order function as here and in call/ec.
     */
    function callWithEjector(attemptFunc, opt_failFunc) {
      var failFunc = opt_failFunc || function (x) { return x; };
      var disabled = false;
      var token = new Token('ejection');
      var stash = void 0;
      function ejector(result) {
        if (disabled) {
          throw new Error('ejector disabled');
        } else {
          // don't disable here.
          stash = result;
          throw token;
        }
      }
      constFunc(ejector);
      try {
        try {
          return attemptFunc(ejector);
        } finally {
          disabled = true;
        }
      } catch (e) {
        if (e === token) {
          return failFunc(stash);
        } else {
          throw e;
        }
      }
    }

    /**
     * Safely invokes {@code opt_ejector} with {@code result}.
     * <p>
     * If {@code opt_ejector} is falsy, disabled, or returns
     * normally, then {@code eject} throws. Under no conditions does
     * {@code eject} return normally.
     */
    function eject(opt_ejector, result) {
      if (opt_ejector) {
        opt_ejector(result);
        throw new Error('Ejector did not exit: ', opt_ejector);
      } else {
        throw new Error(result);
      }
    }

    ////////////////////////////////////////////////////////////////////////
    // Sealing and Unsealing
    ////////////////////////////////////////////////////////////////////////

    function makeSealerUnsealerPair() {
      var boxValues = new WeakMap(true); // use key lifetime

      function seal(value) {
        var box = freeze({});
        boxValues.set(box, value);
        return box;
      }
      function optUnseal(box) {
        return boxValues.has(box) ? [boxValues.get(box)] : null;
      }
      function unseal(box) {
        var result = optUnseal(box);
        if (result === null) {
          throw new Error("That wasn't one of my sealed boxes!");
        } else {
          return result[0];
        }
      }
      return freeze({
        seal: constFunc(seal),
        unseal: constFunc(unseal),
        optUnseal: constFunc(optUnseal)
      });
    }


    ////////////////////////////////////////////////////////////////////////
    // Trademarks
    ////////////////////////////////////////////////////////////////////////

    var stampers = new WeakMap(true);

    /**
     * Internal routine for making a trademark from a table.
     *
     * <p>To untangle a cycle, the guard made by {@code makeTrademark}
     * is not yet stamped. The caller of {@code makeTrademark} must
     * stamp it before allowing the guard to escape.
     *
     * <p>Note that {@code makeTrademark} is called during the call to
     * {@code ejectorsGuardsTrademarks}, and so must not call {@code
     * cajaVM.def}.
     */
    function makeTrademark(typename, table) {
      typename = '' + typename;

      var stamp = freeze({
        toString: constFunc(function() { return typename + 'Stamp'; })
      });

      stampers.set(stamp, function(obj) {
        table.set(obj, true);
        return obj;
      });

      return freeze({
        toString: constFunc(function() { return typename + 'Mark'; }),
        stamp: stamp,
        guard: freeze({
          toString: constFunc(function() { return typename + 'T'; }),
          coerce: constFunc(function(specimen, opt_ejector) {
            if (!table.get(specimen)) {
              eject(opt_ejector,
                    'Specimen does not have the "' + typename + '" trademark');
            }
            return specimen;
          })
        })
      });
    }

    /**
     * Objects representing guards should be marked as such, so that
     * they will pass the {@code GuardT} guard.
     * <p>
     * {@code GuardT} is generally accessible as
     * {@code cajaVM.GuardT}. However, {@code GuardStamp} must not be
     * made generally accessible, but rather only given to code trusted
     * to use it to deem as guards things that act in a guard-like
     * manner: A guard MUST be immutable and SHOULD be idempotent. By
     * "idempotent", we mean that<pre>
     *     var x = g(specimen, ej); // may fail
     *     // if we're still here, then without further failure
     *     g(x) === x
     * </pre>
     */
    var GuardMark = makeTrademark('Guard', new WeakMap());
    var GuardT = GuardMark.guard;
    var GuardStamp = GuardMark.stamp;
    stampers.get(GuardStamp)(GuardT);

    /**
     * The {@code Trademark} constructor makes a trademark, which is a
     * guard/stamp pair, where the stamp marks and freezes unfrozen
     * records as carrying that trademark and the corresponding guard
     * cerifies objects as carrying that trademark (and therefore as
     * having been marked by that stamp).
     *
     * <p>By convention, a guard representing the type-like concept
     * 'Foo' is named 'FooT'. The corresponding stamp is
     * 'FooStamp'. And the record holding both is 'FooMark'. Many
     * guards also have {@code of} methods for making guards like
     * themselves but parameterized by further constraints, which are
     * usually other guards. For example, {@code T.ListT} is the guard
     * representing frozen array, whereas {@code
     * T.ListT.of(cajaVM.GuardT)} represents frozen arrays of guards.
     */
    function Trademark(typename) {
      var result = makeTrademark(typename, new WeakMap());
      stampers.get(GuardStamp)(result.guard);
      return result;
    };

    /**
     * Given that {@code stamps} is a list of stamps and
     * {@code record} is a non-frozen object, this marks record with
     * the trademarks of all of these stamps, and then freezes and
     * returns the record.
     * <p>
     * If any of these conditions do not hold, this throws.
     */
    function stamp(stamps, record) {
      // TODO: Should nonextensible objects be stampable?
      if (Object.isFrozen(record)) {
        throw new TypeError("Can't stamp frozen objects: " + record);
      }
      stamps = Array.prototype.slice.call(stamps, 0);
      var numStamps = stamps.length;
      // First ensure that we will succeed before applying any stamps to
      // the record.
      var i;
      for (i = 0; i < numStamps; i++) {
        if (!stampers.has(stamps[i])) {
          throw new TypeError("Can't stamp with a non-stamp: " + stamps[i]);
        }
      }
      for (i = 0; i < numStamps; i++) {
        // Only works for real stamps, postponing the need for a
        // user-implementable auditing protocol.
        stampers.get(stamps[i])(record);
      }
      return freeze(record);
    };

    ////////////////////////////////////////////////////////////////////////
    // Guards
    ////////////////////////////////////////////////////////////////////////

    /**
     * First ensures that g is a guard; then does
     * {@code g.coerce(specimen, opt_ejector)}.
     */
    function guard(g, specimen, opt_ejector) {
      g = GuardT.coerce(g); // failure throws rather than ejects
      return g.coerce(specimen, opt_ejector);
    }

    /**
     * First ensures that g is a guard; then checks whether the specimen
     * passes that guard.
     * <p>
     * If g is a coercing guard, this only checks that g coerces the
     * specimen to something rather than failing. Note that trademark
     * guards are non-coercing, so if specimen passes a trademark guard,
     * then specimen itself has been marked with that trademark.
     */
    function passesGuard(g, specimen) {
      g = GuardT.coerce(g); // failure throws rather than ejects
      return callWithEjector(
        constFunc(function(opt_ejector) {
          g.coerce(specimen, opt_ejector);
          return true;
        }),
        constFunc(function(ignored) {
          return false;
        })
      );
    }


    /**
     * Create a guard which passes all objects present in {@code table}.
     * This may be used to define trademark-like systems which do not require
     * the object to be frozen.
     *
     * {@code typename} is used for toString and {@code errorMessage} is used
     * when an object does not pass the guard.
     */
    function makeTableGuard(table, typename, errorMessage) {
      var g = {
        toString: constFunc(function() { return typename + 'T'; }),
        coerce: constFunc(function(specimen, opt_ejector) {
          if (Object(specimen) === specimen && table.get(specimen)) {
            return specimen;
          }
          eject(opt_ejector, errorMessage);
        })
      };
      stamp([GuardStamp], g);
      return freeze(g);
    }

    ////////////////////////////////////////////////////////////////////////
    // Exporting
    ////////////////////////////////////////////////////////////////////////

    return freeze({
      callWithEjector: constFunc(callWithEjector),
      eject: constFunc(eject),
      makeSealerUnsealerPair: constFunc(makeSealerUnsealerPair),
      GuardT: GuardT,
      makeTableGuard: constFunc(makeTableGuard),
      Trademark: constFunc(Trademark),
      guard: constFunc(guard),
      passesGuard: constFunc(passesGuard),
      stamp: constFunc(stamp)
    });
  };
})();
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Call {@code ses.startSES} to turn this frame into a
 * SES environment following object-capability rules.
 *
 * <p>Assumes ES5 plus WeakMap. Compatible with ES5-strict or
 * anticipated ES6.
 *
 * @author Mark S. Miller
 * @requires this
 * @overrides ses, hookupSESPlusModule
 */

(function hookupSESPlusModule(global) {
  "use strict";

  if (!ses.ok()) {
    return;
  }

  try {
    ses.startSES(global,
                 ses.whitelist,
                 ses.atLeastFreeVarNames,
                 ses.ejectorsGuardsTrademarks);
  } catch (err) {
    ses.updateMaxSeverity(ses.severities.NOT_SUPPORTED);
    ses.logger.error('hookupSESPlus failed with: ', err);
  }
})(this);
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview
 * Unicode character classes.
 *
 * @see http://www.w3.org/TR/2000/REC-xml-20001006#CharClasses
 * @author mikesamuel@gmail.com
 * @provides unicode
 * @overrides window
 */


/** @namespace */
var unicode = {};

unicode.BASE_CHAR = (
    '\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF'
    + '\u0100-\u0131\u0134-\u013E\u0141-\u0148\u014A-\u017E\u0180-\u01C3'
    + '\u01CD-\u01F0\u01F4-\u01F5\u01FA-\u0217\u0250-\u02A8\u02BB-\u02C1'
    + '\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D6'
    + '\u03DA\u03DC\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C\u040E-\u044F'
    + '\u0451-\u045C\u045E-\u0481\u0490-\u04C4\u04C7-\u04C8\u04CB-\u04CC'
    + '\u04D0-\u04EB\u04EE-\u04F5\u04F8-\u04F9\u0531-\u0556\u0559'
    + '\u0561-\u0586\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0641-\u064A'
    + '\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D3\u06D5'
    + '\u06E5-\u06E6\u0905-\u0939\u093D\u0958-\u0961\u0985-\u098C'
    + '\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9'
    + '\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10'
    + '\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39'
    + '\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91'
    + '\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AE0'
    + '\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33'
    + '\u0B36-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A'
    + '\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F'
    + '\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C'
    + '\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60-\u0C61'
    + '\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9'
    + '\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28'
    + '\u0D2A-\u0D39\u0D60-\u0D61\u0E01-\u0E2E\u0E30\u0E32-\u0E33'
    + '\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D'
    + '\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB'
    + '\u0EAD-\u0EAE\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0F40-\u0F47'
    + '\u0F49-\u0F69\u10A0-\u10C5\u10D0-\u10F6\u1100\u1102-\u1103'
    + '\u1105-\u1107\u1109\u110B-\u110C\u110E-\u1112\u113C\u113E\u1140'
    + '\u114C\u114E\u1150\u1154-\u1155\u1159\u115F-\u1161\u1163\u1165'
    + '\u1167\u1169\u116D-\u116E\u1172-\u1173\u1175\u119E\u11A8\u11AB'
    + '\u11AE-\u11AF\u11B7-\u11B8\u11BA\u11BC-\u11C2\u11EB\u11F0\u11F9'
    + '\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45'
    + '\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D'
    + '\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC'
    + '\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC'
    + '\u2126\u212A-\u212B\u212E\u2180-\u2182\u3041-\u3094\u30A1-\u30FA'
    + '\u3105-\u312C\uAC00-\uD7A3');
unicode.IDEOGRAPHIC = '\u4E00-\u9FA5\u3007\u3021-\u3029';
unicode.LETTER = unicode.BASE_CHAR + unicode.IDEOGRAPHIC;
unicode.COMBINING_CHAR = (
    '\u0300-\u0345\u0360-\u0361\u0483-\u0486\u0591-\u05A1\u05A3-\u05B9'
    + '\u05BB-\u05BD\u05BF\u05C1-\u05C2\u05C4\u064B-\u0652\u0670'
    + '\u06D6-\u06DC\u06DD-\u06DF\u06E0-\u06E4\u06E7-\u06E8\u06EA-\u06ED'
    + '\u0901-\u0903\u093C\u093E-\u094C\u094D\u0951-\u0954\u0962-\u0963'
    + '\u0981-\u0983\u09BC\u09BE\u09BF\u09C0-\u09C4\u09C7-\u09C8'
    + '\u09CB-\u09CD\u09D7\u09E2-\u09E3\u0A02\u0A3C\u0A3E\u0A3F'
    + '\u0A40-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A70-\u0A71\u0A81-\u0A83'
    + '\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0B01-\u0B03\u0B3C'
    + '\u0B3E-\u0B43\u0B47-\u0B48\u0B4B-\u0B4D\u0B56-\u0B57\u0B82-\u0B83'
    + '\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03'
    + '\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C82-\u0C83'
    + '\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5-\u0CD6\u0D02-\u0D03'
    + '\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0E31\u0E34-\u0E3A'
    + '\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EC8-\u0ECD'
    + '\u0F18-\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84'
    + '\u0F86-\u0F8B\u0F90-\u0F95\u0F97\u0F99-\u0FAD\u0FB1-\u0FB7\u0FB9'
    + '\u20D0-\u20DC\u20E1\u302A-\u302F\u3099\u309A');
unicode.DIGIT = (
    '\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u0966-\u096F\u09E6-\u09EF'
    + '\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE7-\u0BEF\u0C66-\u0C6F'
    + '\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29');
unicode.EXTENDER = (
    '\u00B7\u02D0\u02D1\u0387\u0640\u0E46\u0EC6\u3005\u3031-\u3035'
    + '\u309D-\u309E\u30FC-\u30FE');

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['unicode'] = unicode;
}
;
/* Copyright Google Inc.
 * Licensed under the Apache Licence Version 2.0
 * Autogenerated at Sat Feb 08 11:14:38 KST 2014
 * \@overrides window
 * \@provides cssSchema, CSS_PROP_BIT_QUANTITY, CSS_PROP_BIT_HASH_VALUE, CSS_PROP_BIT_NEGATIVE_QUANTITY, CSS_PROP_BIT_QSTRING_CONTENT, CSS_PROP_BIT_QSTRING_URL, CSS_PROP_BIT_HISTORY_INSENSITIVE, CSS_PROP_BIT_Z_INDEX, CSS_PROP_BIT_ALLOWED_IN_LINK */
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_QUANTITY = 1;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_HASH_VALUE = 2;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_NEGATIVE_QUANTITY = 4;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_QSTRING_CONTENT = 8;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_QSTRING_URL = 16;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_HISTORY_INSENSITIVE = 32;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_Z_INDEX = 64;
/**
 * @const
 * @type {number}
 */
var CSS_PROP_BIT_ALLOWED_IN_LINK = 128;
var cssSchema = (function () {
    var s = [
      'rgb(?:\\(\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)|a\\(\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0(?:\\.\\d+)?|\\.\\d+|1(?:\\.0+)?|0|\\d+(?:\\.\\d+)?%)) *\\)'
    ], c = [ /^ *$/i, RegExp('^ *\\s*' + s[ 0 ] + ' *$', 'i'),
      RegExp('^ *(?:\\s*' + s[ 0 ] + '|(?:\\s*' + s[ 0 ] + ')?)+ *$', 'i') ], L
      = [ [ 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
        'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet',
        'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
        'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
        'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki',
        'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
        'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
        'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray',
        'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
        'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green',
        'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory',
        'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon',
        'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
        'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
        'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow',
        'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine',
        'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
        'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
        'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose',
        'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab',
        'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
        'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru',
        'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown',
        'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen',
        'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray',
        'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
        'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow',
        'yellowgreen' ], [ 'all-scroll', 'col-resize', 'crosshair', 'default',
        'e-resize', 'hand', 'help', 'move', 'n-resize', 'ne-resize', 'no-drop',
        'not-allowed', 'nw-resize', 'pointer', 'progress', 'row-resize',
        's-resize', 'se-resize', 'sw-resize', 'text', 'vertical-text',
        'w-resize', 'wait' ], [ '-moz-inline-box', '-moz-inline-stack',
        'block', 'inline', 'inline-block', 'inline-table', 'list-item',
        'run-in', 'table', 'table-caption', 'table-cell', 'table-column',
        'table-column-group', 'table-footer-group', 'table-header-group',
        'table-row', 'table-row-group' ], [ 'armenian', 'circle', 'decimal',
        'decimal-leading-zero', 'disc', 'georgian', 'lower-alpha',
        'lower-greek', 'lower-latin', 'lower-roman', 'square', 'upper-alpha',
        'upper-latin', 'upper-roman' ], [ '100', '200', '300', '400', '500',
        '600', '700', '800', '900', 'bold', 'bolder', 'lighter' ], [
        'condensed', 'expanded', 'extra-condensed', 'extra-expanded',
        'narrower', 'semi-condensed', 'semi-expanded', 'ultra-condensed',
        'ultra-expanded', 'wider' ], [ 'behind', 'center-left', 'center-right',
        'far-left', 'far-right', 'left-side', 'leftwards', 'right-side',
        'rightwards' ], [ 'large', 'larger', 'small', 'smaller', 'x-large',
        'x-small', 'xx-large', 'xx-small' ], [ '-moz-pre-wrap', '-o-pre-wrap',
        '-pre-wrap', 'nowrap', 'pre', 'pre-line', 'pre-wrap' ], [ 'dashed',
        'dotted', 'double', 'groove', 'outset', 'ridge', 'solid' ], [
        'baseline', 'middle', 'sub', 'super', 'text-bottom', 'text-top' ], [
        'caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar'
      ], [ 'fast', 'faster', 'slow', 'slower', 'x-fast', 'x-slow' ], [ 'above',
        'below', 'higher', 'level', 'lower' ], [ 'border-box', 'contain',
        'content-box', 'cover', 'padding-box' ], [ 'cursive', 'fantasy',
        'monospace', 'sans-serif', 'serif' ], [ 'loud', 'silent', 'soft',
        'x-loud', 'x-soft' ], [ 'no-repeat', 'repeat-x', 'repeat-y', 'round',
        'space' ], [ 'blink', 'line-through', 'overline', 'underline' ], [
        'high', 'low', 'x-high', 'x-low' ], [ 'absolute', 'relative', 'static'
      ], [ 'capitalize', 'lowercase', 'uppercase' ], [ 'child', 'female',
        'male' ], [ 'bidi-override', 'embed' ], [ 'bottom', 'top' ], [ 'clip',
        'ellipsis' ], [ 'continuous', 'digits' ], [ 'hide', 'show' ], [
        'inside', 'outside' ], [ 'italic', 'oblique' ], [ 'left', 'right' ], [
        'ltr', 'rtl' ], [ 'no-content', 'no-display' ], [ 'suppress',
        'unrestricted' ], [ 'thick', 'thin' ], [ ',' ], [ '/' ], [ 'always' ],
      [ 'auto' ], [ 'avoid' ], [ 'both' ], [ 'break-word' ], [ 'center' ], [
        'code' ], [ 'collapse' ], [ 'fixed' ], [ 'hidden' ], [ 'inherit' ], [
        'inset' ], [ 'invert' ], [ 'justify' ], [ 'local' ], [ 'medium' ], [
        'mix' ], [ 'none' ], [ 'normal' ], [ 'once' ], [ 'repeat' ], [ 'scroll'
      ], [ 'separate' ], [ 'small-caps' ], [ 'spell-out' ], [ 'transparent' ],
      [ 'visible' ] ];
    return {
      '-moz-border-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 36 ] ]
      },
      '-moz-border-radius-bottomleft': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-moz-border-radius-bottomright': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-moz-border-radius-topleft': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-moz-border-radius-topright': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-moz-box-shadow': {
        'cssExtra': c[ 2 ],
        'cssAlternates': [ 'boxShadow' ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 35 ], L[ 48 ], L[ 54 ] ]
      },
      '-moz-opacity': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 47 ] ]
      },
      '-moz-outline': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            49 ], L[ 52 ], L[ 54 ] ]
      },
      '-moz-outline-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 49 ] ]
      },
      '-moz-outline-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      '-moz-outline-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      '-o-text-overflow': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 25 ] ]
      },
      '-webkit-border-bottom-left-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-bottom-right-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 36 ] ]
      },
      '-webkit-border-radius-bottom-left': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-radius-bottom-right': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-radius-top-left': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-radius-top-right': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-top-left-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-border-top-right-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      '-webkit-box-shadow': {
        'cssExtra': c[ 2 ],
        'cssAlternates': [ 'boxShadow' ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 35 ], L[ 48 ], L[ 54 ] ]
      },
      'azimuth': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 6 ], L[ 30 ], L[ 42 ], L[ 47 ] ]
      },
      'background': {
        'cssExtra': RegExp('^ *(?:\\s*' + s[ 0 ] + '){0,2} *$', 'i'),
        'cssPropBits': 23,
        'cssLitGroup': [ L[ 0 ], L[ 14 ], L[ 17 ], L[ 24 ], L[ 30 ], L[ 35 ],
          L[ 36 ], L[ 38 ], L[ 42 ], L[ 45 ], L[ 47 ], L[ 51 ], L[ 54 ], L[ 57
          ], L[ 58 ], L[ 62 ] ]
      },
      'background-attachment': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 35 ], L[ 45 ], L[ 51 ], L[ 58 ] ]
      },
      'background-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 130,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'background-image': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 35 ], L[ 54 ] ]
      },
      'background-position': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 24 ], L[ 30 ], L[ 35 ], L[ 42 ] ]
      },
      'background-repeat': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 17 ], L[ 35 ], L[ 57 ] ]
      },
      'border': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            52 ], L[ 54 ], L[ 62 ] ]
      },
      'border-bottom': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            52 ], L[ 54 ], L[ 62 ] ]
      },
      'border-bottom-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'border-bottom-left-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      'border-bottom-right-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      'border-bottom-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'border-bottom-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'border-collapse': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 44 ], L[ 47 ], L[ 59 ] ]
      },
      'border-color': {
        'cssExtra': RegExp('^ *(?:\\s*' + s[ 0 ] + '){1,4} *$', 'i'),
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'border-left': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            52 ], L[ 54 ], L[ 62 ] ]
      },
      'border-left-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'border-left-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'border-left-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'border-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 36 ] ]
      },
      'border-right': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            52 ], L[ 54 ], L[ 62 ] ]
      },
      'border-right-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'border-right-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'border-right-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'border-spacing': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'border-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'border-top': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            52 ], L[ 54 ], L[ 62 ] ]
      },
      'border-top-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 62 ] ]
      },
      'border-top-left-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      'border-top-right-radius': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5
      },
      'border-top-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'border-top-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'border-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'bottom': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'box-shadow': {
        'cssExtra': c[ 2 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 35 ], L[ 48 ], L[ 54 ] ]
      },
      'caption-side': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 24 ], L[ 47 ] ]
      },
      'clear': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 30 ], L[ 40 ], L[ 47 ], L[ 54 ] ]
      },
      'clip': {
        'cssExtra':
        /^ *\s*rect\(\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto) *\) *$/i,
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 130,
        'cssLitGroup': [ L[ 0 ], L[ 47 ] ]
      },
      'content': { 'cssPropBits': 0 },
      'counter-increment': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'counter-reset': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'cue': {
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'cue-after': {
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'cue-before': {
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'cursor': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 144,
        'cssLitGroup': [ L[ 1 ], L[ 35 ], L[ 38 ], L[ 47 ] ]
      },
      'direction': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 31 ], L[ 47 ] ]
      },
      'display': {
        'cssPropBits': 32,
        'cssLitGroup': [ L[ 2 ], L[ 47 ], L[ 54 ] ]
      },
      'elevation': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 13 ], L[ 47 ] ]
      },
      'empty-cells': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 27 ], L[ 47 ] ]
      },
      'filter': {
        'cssExtra':
        /^ *(?:\s*alpha\(\s*opacity\s*=\s*(?:0|\d+(?:\.\d+)?%|[+\-]?\d+(?:\.\d+)?) *\))+ *$/i,
        'cssPropBits': 32
      },
      'float': {
        'cssAlternates': [ 'cssFloat', 'styleFloat' ],
        'cssPropBits': 32,
        'cssLitGroup': [ L[ 30 ], L[ 47 ], L[ 54 ] ]
      },
      'font': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 9,
        'cssLitGroup': [ L[ 4 ], L[ 7 ], L[ 11 ], L[ 15 ], L[ 29 ], L[ 35 ], L[
            36 ], L[ 47 ], L[ 52 ], L[ 55 ], L[ 60 ] ]
      },
      'font-family': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 8,
        'cssLitGroup': [ L[ 15 ], L[ 35 ], L[ 47 ] ]
      },
      'font-size': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 7 ], L[ 47 ], L[ 52 ] ]
      },
      'font-stretch': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 5 ], L[ 55 ] ]
      },
      'font-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 29 ], L[ 47 ], L[ 55 ] ]
      },
      'font-variant': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 47 ], L[ 55 ], L[ 60 ] ]
      },
      'font-weight': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 4 ], L[ 47 ], L[ 55 ] ]
      },
      'height': {
        'cssPropBits': 37,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'left': {
        'cssPropBits': 37,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'letter-spacing': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ], L[ 55 ] ]
      },
      'line-height': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 47 ], L[ 55 ] ]
      },
      'list-style': {
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 3 ], L[ 28 ], L[ 47 ], L[ 54 ] ]
      },
      'list-style-image': {
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'list-style-position': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 28 ], L[ 47 ] ]
      },
      'list-style-type': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 3 ], L[ 47 ], L[ 54 ] ]
      },
      'margin': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'margin-bottom': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'margin-left': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'margin-right': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'margin-top': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'max-height': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 38 ], L[ 47 ], L[ 54 ] ]
      },
      'max-width': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 38 ], L[ 47 ], L[ 54 ] ]
      },
      'min-height': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'min-width': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'opacity': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'outline': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 9 ], L[ 34 ], L[ 46 ], L[ 47 ], L[ 48 ], L[
            49 ], L[ 52 ], L[ 54 ] ]
      },
      'outline-color': {
        'cssExtra': c[ 1 ],
        'cssPropBits': 2,
        'cssLitGroup': [ L[ 0 ], L[ 47 ], L[ 49 ] ]
      },
      'outline-style': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 9 ], L[ 46 ], L[ 47 ], L[ 48 ], L[ 54 ] ]
      },
      'outline-width': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 34 ], L[ 47 ], L[ 52 ] ]
      },
      'overflow': {
        'cssPropBits': 32,
        'cssLitGroup': [ L[ 38 ], L[ 46 ], L[ 47 ], L[ 58 ], L[ 63 ] ]
      },
      'overflow-x': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 32 ], L[ 38 ], L[ 46 ], L[ 58 ], L[ 63 ] ]
      },
      'overflow-y': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 32 ], L[ 38 ], L[ 46 ], L[ 58 ], L[ 63 ] ]
      },
      'padding': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'padding-bottom': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'padding-left': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'padding-right': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'padding-top': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'page-break-after': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 30 ], L[ 37 ], L[ 38 ], L[ 39 ], L[ 47 ] ]
      },
      'page-break-before': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 30 ], L[ 37 ], L[ 38 ], L[ 39 ], L[ 47 ] ]
      },
      'page-break-inside': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 38 ], L[ 39 ], L[ 47 ] ]
      },
      'pause': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'pause-after': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'pause-before': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'pitch': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 19 ], L[ 47 ], L[ 52 ] ]
      },
      'pitch-range': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'play-during': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 16,
        'cssLitGroup': [ L[ 38 ], L[ 47 ], L[ 53 ], L[ 54 ], L[ 57 ] ]
      },
      'position': {
        'cssPropBits': 32,
        'cssLitGroup': [ L[ 20 ], L[ 47 ] ]
      },
      'quotes': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 47 ], L[ 54 ] ]
      },
      'richness': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'right': {
        'cssPropBits': 37,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'speak': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 47 ], L[ 54 ], L[ 55 ], L[ 61 ] ]
      },
      'speak-header': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 37 ], L[ 47 ], L[ 56 ] ]
      },
      'speak-numeral': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 26 ], L[ 47 ] ]
      },
      'speak-punctuation': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 43 ], L[ 47 ], L[ 54 ] ]
      },
      'speech-rate': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 12 ], L[ 47 ], L[ 52 ] ]
      },
      'stress': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'table-layout': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 38 ], L[ 45 ], L[ 47 ] ]
      },
      'text-align': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 30 ], L[ 42 ], L[ 47 ], L[ 50 ] ]
      },
      'text-decoration': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 18 ], L[ 47 ], L[ 54 ] ]
      },
      'text-indent': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ] ]
      },
      'text-overflow': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 25 ] ]
      },
      'text-shadow': {
        'cssExtra': c[ 2 ],
        'cssPropBits': 7,
        'cssLitGroup': [ L[ 0 ], L[ 35 ], L[ 48 ], L[ 54 ] ]
      },
      'text-transform': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 21 ], L[ 47 ], L[ 54 ] ]
      },
      'text-wrap': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 33 ], L[ 54 ], L[ 55 ] ]
      },
      'top': {
        'cssPropBits': 37,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'unicode-bidi': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 23 ], L[ 47 ], L[ 55 ] ]
      },
      'vertical-align': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 10 ], L[ 24 ], L[ 47 ] ]
      },
      'visibility': {
        'cssPropBits': 32,
        'cssLitGroup': [ L[ 44 ], L[ 46 ], L[ 47 ], L[ 63 ] ]
      },
      'voice-family': {
        'cssExtra': c[ 0 ],
        'cssPropBits': 8,
        'cssLitGroup': [ L[ 22 ], L[ 35 ], L[ 47 ] ]
      },
      'volume': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 16 ], L[ 47 ], L[ 52 ] ]
      },
      'white-space': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 8 ], L[ 47 ], L[ 55 ] ]
      },
      'width': {
        'cssPropBits': 33,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'word-spacing': {
        'cssPropBits': 5,
        'cssLitGroup': [ L[ 47 ], L[ 55 ] ]
      },
      'word-wrap': {
        'cssPropBits': 0,
        'cssLitGroup': [ L[ 41 ], L[ 55 ] ]
      },
      'z-index': {
        'cssPropBits': 69,
        'cssLitGroup': [ L[ 38 ], L[ 47 ] ]
      },
      'zoom': {
        'cssPropBits': 1,
        'cssLitGroup': [ L[ 55 ] ]
      }
    };
  })();
if (typeof window !== 'undefined') {
  window['cssSchema'] = cssSchema;
}
;
// Copyright Google Inc.
// Licensed under the Apache Licence Version 2.0
// Autogenerated at Sat Feb 08 11:14:41 KST 2014
// @overrides window
// @provides html4
var html4 = {};
html4.atype = {
  'NONE': 0,
  'URI': 1,
  'URI_FRAGMENT': 11,
  'SCRIPT': 2,
  'STYLE': 3,
  'HTML': 12,
  'ID': 4,
  'IDREF': 5,
  'IDREFS': 6,
  'GLOBAL_NAME': 7,
  'LOCAL_NAME': 8,
  'CLASSES': 9,
  'FRAME_TARGET': 10,
  'MEDIA_QUERY': 13
};
html4.ATTRIBS = {
  '*::class': 9,
  '*::dir': 0,
  '*::draggable': 0,
  '*::hidden': 0,
  '*::id': 4,
  '*::inert': 0,
  '*::itemprop': 0,
  '*::itemref': 6,
  '*::itemscope': 0,
  '*::lang': 0,
  '*::onblur': 2,
  '*::onchange': 2,
  '*::onclick': 2,
  '*::ondblclick': 2,
  '*::onfocus': 2,
  '*::onkeydown': 2,
  '*::onkeypress': 2,
  '*::onkeyup': 2,
  '*::onload': 2,
  '*::onmousedown': 2,
  '*::onmousemove': 2,
  '*::onmouseout': 2,
  '*::onmouseover': 2,
  '*::onmouseup': 2,
  '*::onreset': 2,
  '*::onscroll': 2,
  '*::onselect': 2,
  '*::onsubmit': 2,
  '*::onunload': 2,
  '*::spellcheck': 0,
  '*::style': 3,
  '*::title': 0,
  '*::translate': 0,
  'a::accesskey': 0,
  'a::coords': 0,
  'a::href': 1,
  'a::hreflang': 0,
  'a::name': 7,
  'a::onblur': 2,
  'a::onfocus': 2,
  'a::shape': 0,
  'a::tabindex': 0,
  'a::target': 10,
  'a::type': 0,
  'area::accesskey': 0,
  'area::alt': 0,
  'area::coords': 0,
  'area::href': 1,
  'area::nohref': 0,
  'area::onblur': 2,
  'area::onfocus': 2,
  'area::shape': 0,
  'area::tabindex': 0,
  'area::target': 10,
  'audio::controls': 0,
  'audio::loop': 0,
  'audio::mediagroup': 5,
  'audio::muted': 0,
  'audio::preload': 0,
  'bdo::dir': 0,
  'blockquote::cite': 1,
  'br::clear': 0,
  'button::accesskey': 0,
  'button::disabled': 0,
  'button::name': 8,
  'button::onblur': 2,
  'button::onfocus': 2,
  'button::tabindex': 0,
  'button::type': 0,
  'button::value': 0,
  'canvas::height': 0,
  'canvas::width': 0,
  'caption::align': 0,
  'col::align': 0,
  'col::char': 0,
  'col::charoff': 0,
  'col::span': 0,
  'col::valign': 0,
  'col::width': 0,
  'colgroup::align': 0,
  'colgroup::char': 0,
  'colgroup::charoff': 0,
  'colgroup::span': 0,
  'colgroup::valign': 0,
  'colgroup::width': 0,
  'command::checked': 0,
  'command::command': 5,
  'command::disabled': 0,
  'command::icon': 1,
  'command::label': 0,
  'command::radiogroup': 0,
  'command::type': 0,
  'data::value': 0,
  'del::cite': 1,
  'del::datetime': 0,
  'details::open': 0,
  'dir::compact': 0,
  'div::align': 0,
  'dl::compact': 0,
  'fieldset::disabled': 0,
  'font::color': 0,
  'font::face': 0,
  'font::size': 0,
  'form::accept': 0,
  'form::action': 1,
  'form::autocomplete': 0,
  'form::enctype': 0,
  'form::method': 0,
  'form::name': 7,
  'form::novalidate': 0,
  'form::onreset': 2,
  'form::onsubmit': 2,
  'form::target': 10,
  'h1::align': 0,
  'h2::align': 0,
  'h3::align': 0,
  'h4::align': 0,
  'h5::align': 0,
  'h6::align': 0,
  'hr::align': 0,
  'hr::noshade': 0,
  'hr::size': 0,
  'hr::width': 0,
  'iframe::align': 0,
  'iframe::frameborder': 0,
  'iframe::height': 0,
  'iframe::marginheight': 0,
  'iframe::marginwidth': 0,
  'iframe::width': 0,
  'img::align': 0,
  'img::alt': 0,
  'img::border': 0,
  'img::height': 0,
  'img::hspace': 0,
  'img::ismap': 0,
  'img::name': 7,
  'img::src': 1,
  'img::usemap': 11,
  'img::vspace': 0,
  'img::width': 0,
  'input::accept': 0,
  'input::accesskey': 0,
  'input::align': 0,
  'input::alt': 0,
  'input::autocomplete': 0,
  'input::checked': 0,
  'input::disabled': 0,
  'input::inputmode': 0,
  'input::ismap': 0,
  'input::list': 5,
  'input::max': 0,
  'input::maxlength': 0,
  'input::min': 0,
  'input::multiple': 0,
  'input::name': 8,
  'input::onblur': 2,
  'input::onchange': 2,
  'input::onfocus': 2,
  'input::onselect': 2,
  'input::placeholder': 0,
  'input::readonly': 0,
  'input::required': 0,
  'input::size': 0,
  'input::src': 1,
  'input::step': 0,
  'input::tabindex': 0,
  'input::type': 0,
  'input::usemap': 11,
  'input::value': 0,
  'ins::cite': 1,
  'ins::datetime': 0,
  'label::accesskey': 0,
  'label::for': 5,
  'label::onblur': 2,
  'label::onfocus': 2,
  'legend::accesskey': 0,
  'legend::align': 0,
  'li::type': 0,
  'li::value': 0,
  'map::name': 7,
  'menu::compact': 0,
  'menu::label': 0,
  'menu::type': 0,
  'meter::high': 0,
  'meter::low': 0,
  'meter::max': 0,
  'meter::min': 0,
  'meter::value': 0,
  'ol::compact': 0,
  'ol::reversed': 0,
  'ol::start': 0,
  'ol::type': 0,
  'optgroup::disabled': 0,
  'optgroup::label': 0,
  'option::disabled': 0,
  'option::label': 0,
  'option::selected': 0,
  'option::value': 0,
  'output::for': 6,
  'output::name': 8,
  'p::align': 0,
  'pre::width': 0,
  'progress::max': 0,
  'progress::min': 0,
  'progress::value': 0,
  'q::cite': 1,
  'select::autocomplete': 0,
  'select::disabled': 0,
  'select::multiple': 0,
  'select::name': 8,
  'select::onblur': 2,
  'select::onchange': 2,
  'select::onfocus': 2,
  'select::required': 0,
  'select::size': 0,
  'select::tabindex': 0,
  'source::type': 0,
  'table::align': 0,
  'table::bgcolor': 0,
  'table::border': 0,
  'table::cellpadding': 0,
  'table::cellspacing': 0,
  'table::frame': 0,
  'table::rules': 0,
  'table::summary': 0,
  'table::width': 0,
  'tbody::align': 0,
  'tbody::char': 0,
  'tbody::charoff': 0,
  'tbody::valign': 0,
  'td::abbr': 0,
  'td::align': 0,
  'td::axis': 0,
  'td::bgcolor': 0,
  'td::char': 0,
  'td::charoff': 0,
  'td::colspan': 0,
  'td::headers': 6,
  'td::height': 0,
  'td::nowrap': 0,
  'td::rowspan': 0,
  'td::scope': 0,
  'td::valign': 0,
  'td::width': 0,
  'textarea::accesskey': 0,
  'textarea::autocomplete': 0,
  'textarea::cols': 0,
  'textarea::disabled': 0,
  'textarea::inputmode': 0,
  'textarea::name': 8,
  'textarea::onblur': 2,
  'textarea::onchange': 2,
  'textarea::onfocus': 2,
  'textarea::onselect': 2,
  'textarea::placeholder': 0,
  'textarea::readonly': 0,
  'textarea::required': 0,
  'textarea::rows': 0,
  'textarea::tabindex': 0,
  'textarea::wrap': 0,
  'tfoot::align': 0,
  'tfoot::char': 0,
  'tfoot::charoff': 0,
  'tfoot::valign': 0,
  'th::abbr': 0,
  'th::align': 0,
  'th::axis': 0,
  'th::bgcolor': 0,
  'th::char': 0,
  'th::charoff': 0,
  'th::colspan': 0,
  'th::headers': 6,
  'th::height': 0,
  'th::nowrap': 0,
  'th::rowspan': 0,
  'th::scope': 0,
  'th::valign': 0,
  'th::width': 0,
  'thead::align': 0,
  'thead::char': 0,
  'thead::charoff': 0,
  'thead::valign': 0,
  'tr::align': 0,
  'tr::bgcolor': 0,
  'tr::char': 0,
  'tr::charoff': 0,
  'tr::valign': 0,
  'track::default': 0,
  'track::kind': 0,
  'track::label': 0,
  'track::srclang': 0,
  'ul::compact': 0,
  'ul::type': 0,
  'video::controls': 0,
  'video::height': 0,
  'video::loop': 0,
  'video::mediagroup': 5,
  'video::muted': 0,
  'video::poster': 1,
  'video::preload': 0,
  'video::width': 0
};
html4.eflags = {
  'OPTIONAL_ENDTAG': 1,
  'EMPTY': 2,
  'CDATA': 4,
  'RCDATA': 8,
  'UNSAFE': 16,
  'FOLDABLE': 32,
  'SCRIPT': 64,
  'STYLE': 128,
  'VIRTUALIZED': 256
};
html4.ELEMENTS = {
  'a': 0,
  'abbr': 0,
  'acronym': 0,
  'address': 0,
  'applet': 272,
  'area': 2,
  'article': 0,
  'aside': 0,
  'audio': 0,
  'b': 0,
  'base': 274,
  'basefont': 274,
  'bdi': 0,
  'bdo': 0,
  'big': 0,
  'blockquote': 0,
  'body': 305,
  'br': 2,
  'button': 0,
  'canvas': 0,
  'caption': 0,
  'center': 0,
  'cite': 0,
  'code': 0,
  'col': 2,
  'colgroup': 1,
  'command': 2,
  'data': 0,
  'datalist': 0,
  'dd': 1,
  'del': 0,
  'details': 0,
  'dfn': 0,
  'dialog': 272,
  'dir': 0,
  'div': 0,
  'dl': 0,
  'dt': 1,
  'em': 0,
  'fieldset': 0,
  'figcaption': 0,
  'figure': 0,
  'font': 0,
  'footer': 0,
  'form': 0,
  'frame': 274,
  'frameset': 272,
  'h1': 0,
  'h2': 0,
  'h3': 0,
  'h4': 0,
  'h5': 0,
  'h6': 0,
  'head': 305,
  'header': 0,
  'hgroup': 0,
  'hr': 2,
  'html': 305,
  'i': 0,
  'iframe': 4,
  'img': 2,
  'input': 2,
  'ins': 0,
  'isindex': 274,
  'kbd': 0,
  'keygen': 274,
  'label': 0,
  'legend': 0,
  'li': 1,
  'link': 274,
  'map': 0,
  'mark': 0,
  'menu': 0,
  'meta': 274,
  'meter': 0,
  'nav': 0,
  'nobr': 0,
  'noembed': 276,
  'noframes': 276,
  'noscript': 276,
  'object': 272,
  'ol': 0,
  'optgroup': 0,
  'option': 1,
  'output': 0,
  'p': 1,
  'param': 274,
  'pre': 0,
  'progress': 0,
  'q': 0,
  's': 0,
  'samp': 0,
  'script': 84,
  'section': 0,
  'select': 0,
  'small': 0,
  'source': 2,
  'span': 0,
  'strike': 0,
  'strong': 0,
  'style': 148,
  'sub': 0,
  'summary': 0,
  'sup': 0,
  'table': 0,
  'tbody': 1,
  'td': 1,
  'textarea': 8,
  'tfoot': 1,
  'th': 1,
  'thead': 1,
  'time': 0,
  'title': 280,
  'tr': 1,
  'track': 2,
  'tt': 0,
  'u': 0,
  'ul': 0,
  'var': 0,
  'video': 0,
  'wbr': 2
};
html4.ueffects = {
  'NOT_LOADED': 0,
  'SAME_DOCUMENT': 1,
  'NEW_DOCUMENT': 2
};
html4.URIEFFECTS = {
  'a::href': 2,
  'area::href': 2,
  'blockquote::cite': 0,
  'command::icon': 1,
  'del::cite': 0,
  'form::action': 2,
  'img::src': 1,
  'input::src': 1,
  'ins::cite': 0,
  'q::cite': 0,
  'video::poster': 1
};
html4.ltypes = {
  'UNSANDBOXED': 2,
  'SANDBOXED': 1,
  'DATA': 0
};
html4.LOADERTYPES = {
  'a::href': 2,
  'area::href': 2,
  'blockquote::cite': 2,
  'command::icon': 1,
  'del::cite': 2,
  'form::action': 2,
  'img::src': 1,
  'input::src': 1,
  'ins::cite': 2,
  'q::cite': 2,
  'video::poster': 1
};
// exports for Closure Compiler
html4['ATTRIBS'] = html4.ATTRIBS;
html4['ELEMENTS'] = html4.ELEMENTS;
html4['URIEFFECTS'] = html4.URIEFFECTS;
html4['LOADERTYPES'] = html4.LOADERTYPES;
html4['atype'] = html4.atype;
html4['eflags'] = html4.eflags;
html4['ltypes'] = html4.ltypes;
html4['ueffects'] = html4.ueffects;
if (typeof window !== 'undefined') {
  window['html4'] = html4;
}
;
// Copyright (C) 2008-2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Client-side HTML schema interface library.
 *
 * @author kpreid@switchb.org
 * @requires cajaVM, html4
 * @provides HtmlSchema, htmlSchema
 * @overrides window
 */

var HtmlSchema = (function() {
  'use strict';

  function HtmlSchema(html4) {
    var ELEMENTS = html4.ELEMENTS;
    var ATTRIBS = html4.ATTRIBS;
    var URIEFFECTS = html4.URIEFFECTS;
    var LOADERTYPES = html4.LOADERTYPES;
    var OPTIONAL_ENDTAG = html4.eflags.OPTIONAL_ENDTAG;
    var EMPTY = html4.eflags.EMPTY;
    var CDATA = html4.eflags.CDATA;
    var RCDATA = html4.eflags.RCDATA;
    var UNSAFE = html4.eflags.UNSAFE;
    var VIRTUALIZED = html4.eflags.VIRTUALIZED;

    var elemCache = {};
    var attrCache = {};

    var virtualizedElementEntry = cajaVM.def({
      allowed: true,
      isVirtualizedElementName: true,
      shouldVirtualize: false,
      empty: false,
      optionalEndTag: false,
      contentIsCDATA: false,
      contentIsRCDATA: false
    });
    var unknownElementEntry = cajaVM.def({
      allowed: false,
      isVirtualizedElementName: false,
      shouldVirtualize: true,
      empty: false,
      optionalEndTag: false,
      contentIsCDATA: false,
      contentIsRCDATA: false
    });

    var unknownAttributeEntry = cajaVM.def({
      type: undefined,
      loaderType: undefined,
      uriEffect: undefined
    });

    function makeAttributeFromSchema(attribKey) {
      return cajaVM.def({
        type: ATTRIBS[attribKey],
        loaderType: LOADERTYPES[attribKey],
        uriEffect: URIEFFECTS[attribKey]
      });
    }

    var VIRTUALIZED_ELEMENT_NAME_RE = /^caja-v-(.*)$/i;
    var VIRTUALIZED_ELEMENT_PREFIX = 'caja-v-';
    function isVirtualizedElementName(elementName) {
      return VIRTUALIZED_ELEMENT_NAME_RE.test(elementName);
    }
    function realToVirtualElementName(elementName) {
      var match = VIRTUALIZED_ELEMENT_NAME_RE.exec(elementName);
      return match ? match[1] : elementName;
    }
    function virtualToRealElementName(elementName) {
      if (htmlSchema.element(elementName).shouldVirtualize) {
        return VIRTUALIZED_ELEMENT_PREFIX + elementName;
      } else {
        return elementName;
      }
    }

    var htmlSchema = cajaVM.def({
      // may receive virtualized element names
      element: function(elementName) {
        if (typeof elementName !== 'string') {
          throw new Error('non-string ' + elementName + ' got to htmlSchema');
        }
        elementName = elementName.toLowerCase();

        if (isVirtualizedElementName(elementName)) {
          return virtualizedElementEntry;
        }

        var cacheKey = elementName + '$';
        if (cacheKey in elemCache) {
          return elemCache[cacheKey];
        } else {
          var entry;
          if (Object.prototype.hasOwnProperty.call(ELEMENTS, elementName)) {
            var eflags = ELEMENTS[elementName];
            entry = cajaVM.def({
              allowed: !(eflags & UNSAFE),
              isVirtualizedElementName: false,
              shouldVirtualize: !!(eflags & VIRTUALIZED),
              empty: !!(eflags & EMPTY),
              optionalEndTag: !!(eflags & OPTIONAL_ENDTAG),
              contentIsCDATA: !!(eflags & CDATA),
              contentIsRCDATA: !!(eflags & RCDATA)
            });
          } else {
            entry = unknownElementEntry;
          }
          return elemCache[cacheKey] = entry;
        }
      },

      // should not receive virtualized attribute names
      attribute: function(elementName, attribName) {
        if (typeof elementName !== 'string') {
          throw new Error('Domado internal: ' +
              'non-string ' + elementName + ' got to HtmlSchema');
        }
        if (typeof attribName !== 'string') {
          throw new Error('Domado internal: ' +
              'non-string ' + attribName + ' got to HtmlSchema');
        }
        elementName = elementName.toLowerCase();
        attribName = attribName.toLowerCase();

        var attribKey = elementName + '::' + attribName;
        if (attribKey in attrCache) {
          return attrCache[attribKey];
        } else {
          var entry;
          if (ATTRIBS.hasOwnProperty(attribKey)) {
            entry = makeAttributeFromSchema(attribKey);
          } else {
            var wildKey = '*::' + attribName;
            if (ATTRIBS.hasOwnProperty(wildKey)) {
              entry = makeAttributeFromSchema(wildKey);
            } else {
              entry = unknownAttributeEntry;
            }
          }
          return attrCache[attribKey] = entry;
        }
      },

      isVirtualizedElementName: isVirtualizedElementName,
      realToVirtualElementName: realToVirtualElementName,
      virtualToRealElementName: virtualToRealElementName
    });
    
    return htmlSchema;
  }

  return HtmlSchema;
})();

// TODO(kpreid): Refactor this into parameters.
var htmlSchema = new HtmlSchema(html4);

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['HtmlSchema'] = HtmlSchema;
  window['htmlSchema'] = htmlSchema;
}

;
// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * An HTML sanitizer that can satisfy a variety of security policies.
 *
 * <p>
 * The HTML sanitizer is built around a SAX parser and HTML element and
 * attributes schemas.
 *
 * If the cssparser is loaded, inline styles are sanitized using the
 * css property and value schemas.  Else they are remove during
 * sanitization.
 *
 * If it exists, uses parseCssDeclarations, sanitizeCssProperty,  cssSchema
 *
 * @author mikesamuel@gmail.com
 * @author jasvir@gmail.com
 * \@requires html4
 * \@overrides window
 * \@provides html, html_sanitize
 */

// The Turkish i seems to be a non-issue, but abort in case it is.
if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

/**
 * \@namespace
 */
var html = (function(html4) {

  // For closure compiler
  var parseCssDeclarations, sanitizeCssProperty, cssSchema;
  if ('undefined' !== typeof window) {
    parseCssDeclarations = window['parseCssDeclarations'];
    sanitizeCssProperty = window['sanitizeCssProperty'];
    cssSchema = window['cssSchema'];
  }

  // The keys of this object must be 'quoted' or JSCompiler will mangle them!
  var ENTITIES = {
    'lt': '<',
    'gt': '>',
    'amp': '&',
    'nbsp': '\240',
    'quot': '"',
    'apos': '\''
  };

  var decimalEscapeRe = /^#(\d+)$/;
  var hexEscapeRe = /^#x([0-9A-Fa-f]+)$/;
  /**
   * Decodes an HTML entity.
   *
   * {\@updoc
   * $ lookupEntity('lt')
   * # '<'
   * $ lookupEntity('GT')
   * # '>'
   * $ lookupEntity('amp')
   * # '&'
   * $ lookupEntity('nbsp')
   * # '\xA0'
   * $ lookupEntity('apos')
   * # "'"
   * $ lookupEntity('quot')
   * # '"'
   * $ lookupEntity('#xa')
   * # '\n'
   * $ lookupEntity('#10')
   * # '\n'
   * $ lookupEntity('#x0a')
   * # '\n'
   * $ lookupEntity('#010')
   * # '\n'
   * $ lookupEntity('#x00A')
   * # '\n'
   * $ lookupEntity('Pi')      // Known failure
   * # '\u03A0'
   * $ lookupEntity('pi')      // Known failure
   * # '\u03C0'
   * }
   *
   * @param {string} name the content between the '&' and the ';'.
   * @return {string} a single unicode code-point as a string.
   */
  function lookupEntity(name) {
    name = name.toLowerCase();  // TODO: &pi; is different from &Pi;
    if (ENTITIES.hasOwnProperty(name)) { return ENTITIES[name]; }
    var m = name.match(decimalEscapeRe);
    if (m) {
      return String.fromCharCode(parseInt(m[1], 10));
    } else if (!!(m = name.match(hexEscapeRe))) {
      return String.fromCharCode(parseInt(m[1], 16));
    }
    return '';
  }

  function decodeOneEntity(_, name) {
    return lookupEntity(name);
  }

  var nulRe = /\0/g;
  function stripNULs(s) {
    return s.replace(nulRe, '');
  }

  var ENTITY_RE_1 = /&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g;
  var ENTITY_RE_2 = /^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/;
  /**
   * The plain text of a chunk of HTML CDATA which possibly containing.
   *
   * {\@updoc
   * $ unescapeEntities('')
   * # ''
   * $ unescapeEntities('hello World!')
   * # 'hello World!'
   * $ unescapeEntities('1 &lt; 2 &amp;&AMP; 4 &gt; 3&#10;')
   * # '1 < 2 && 4 > 3\n'
   * $ unescapeEntities('&lt;&lt <- unfinished entity&gt;')
   * # '<&lt <- unfinished entity>'
   * $ unescapeEntities('/foo?bar=baz&copy=true')  // & often unescaped in URLS
   * # '/foo?bar=baz&copy=true'
   * $ unescapeEntities('pi=&pi;&#x3c0;, Pi=&Pi;\u03A0') // FIXME: known failure
   * # 'pi=\u03C0\u03c0, Pi=\u03A0\u03A0'
   * }
   *
   * @param {string} s a chunk of HTML CDATA.  It must not start or end inside
   *     an HTML entity.
   */
  function unescapeEntities(s) {
    return s.replace(ENTITY_RE_1, decodeOneEntity);
  }

  var ampRe = /&/g;
  var looseAmpRe = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;
  var ltRe = /[<]/g;
  var gtRe = />/g;
  var quotRe = /\"/g;

  /**
   * Escapes HTML special characters in attribute values.
   *
   * {\@updoc
   * $ escapeAttrib('')
   * # ''
   * $ escapeAttrib('"<<&==&>>"')  // Do not just escape the first occurrence.
   * # '&#34;&lt;&lt;&amp;&#61;&#61;&amp;&gt;&gt;&#34;'
   * $ escapeAttrib('Hello <World>!')
   * # 'Hello &lt;World&gt;!'
   * }
   */
  function escapeAttrib(s) {
    return ('' + s).replace(ampRe, '&amp;').replace(ltRe, '&lt;')
        .replace(gtRe, '&gt;').replace(quotRe, '&#34;');
  }

  /**
   * Escape entities in RCDATA that can be escaped without changing the meaning.
   * {\@updoc
   * $ normalizeRCData('1 < 2 &&amp; 3 > 4 &amp;& 5 &lt; 7&8')
   * # '1 &lt; 2 &amp;&amp; 3 &gt; 4 &amp;&amp; 5 &lt; 7&amp;8'
   * }
   */
  function normalizeRCData(rcdata) {
    return rcdata
        .replace(looseAmpRe, '&amp;$1')
        .replace(ltRe, '&lt;')
        .replace(gtRe, '&gt;');
  }

  // TODO(felix8a): validate sanitizer regexs against the HTML5 grammar at
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html

  // We initially split input so that potentially meaningful characters
  // like '<' and '>' are separate tokens, using a fast dumb process that
  // ignores quoting.  Then we walk that token stream, and when we see a
  // '<' that's the start of a tag, we use ATTR_RE to extract tag
  // attributes from the next token.  That token will never have a '>'
  // character.  However, it might have an unbalanced quote character, and
  // when we see that, we combine additional tokens to balance the quote.

  var ATTR_RE = new RegExp(
    '^\\s*' +
    '([-.:\\w]+)' +             // 1 = Attribute name
    '(?:' + (
      '\\s*(=)\\s*' +           // 2 = Is there a value?
      '(' + (                   // 3 = Attribute value
        // TODO(felix8a): maybe use backref to match quotes
        '(\")[^\"]*(\"|$)' +    // 4, 5 = Double-quoted string
        '|' +
        '(\')[^\']*(\'|$)' +    // 6, 7 = Single-quoted string
        '|' +
        // Positive lookahead to prevent interpretation of
        // <foo a= b=c> as <foo a='b=c'>
        // TODO(felix8a): might be able to drop this case
        '(?=[a-z][-\\w]*\\s*=)' +
        '|' +
        // Unquoted value that isn't an attribute name
        // (since we didn't match the positive lookahead above)
        '[^\"\'\\s]*' ) +
      ')' ) +
    ')?',
    'i');

  // false on IE<=8, true on most other browsers
  var splitWillCapture = ('a,b'.split(/(,)/).length === 3);

  // bitmask for tags with special parsing, like <script> and <textarea>
  var EFLAGS_TEXT = html4.eflags['CDATA'] | html4.eflags['RCDATA'];

  /**
   * Given a SAX-like event handler, produce a function that feeds those
   * events and a parameter to the event handler.
   *
   * The event handler has the form:{@code
   * {
   *   // Name is an upper-case HTML tag name.  Attribs is an array of
   *   // alternating upper-case attribute names, and attribute values.  The
   *   // attribs array is reused by the parser.  Param is the value passed to
   *   // the saxParser.
   *   startTag: function (name, attribs, param) { ... },
   *   endTag:   function (name, param) { ... },
   *   pcdata:   function (text, param) { ... },
   *   rcdata:   function (text, param) { ... },
   *   cdata:    function (text, param) { ... },
   *   startDoc: function (param) { ... },
   *   endDoc:   function (param) { ... }
   * }}
   *
   * @param {Object} handler a record containing event handlers.
   * @return {function(string, Object)} A function that takes a chunk of HTML
   *     and a parameter.  The parameter is passed on to the handler methods.
   */
  function makeSaxParser(handler) {
    // Accept quoted or unquoted keys (Closure compat)
    var hcopy = {
      cdata: handler.cdata || handler['cdata'],
      comment: handler.comment || handler['comment'],
      endDoc: handler.endDoc || handler['endDoc'],
      endTag: handler.endTag || handler['endTag'],
      pcdata: handler.pcdata || handler['pcdata'],
      rcdata: handler.rcdata || handler['rcdata'],
      startDoc: handler.startDoc || handler['startDoc'],
      startTag: handler.startTag || handler['startTag']
    };
    return function(htmlText, param) {
      return parse(htmlText, hcopy, param);
    };
  }

  // Parsing strategy is to split input into parts that might be lexically
  // meaningful (every ">" becomes a separate part), and then recombine
  // parts if we discover they're in a different context.

  // TODO(felix8a): Significant performance regressions from -legacy,
  // tested on
  //    Chrome 18.0
  //    Firefox 11.0
  //    IE 6, 7, 8, 9
  //    Opera 11.61
  //    Safari 5.1.3
  // Many of these are unusual patterns that are linearly slower and still
  // pretty fast (eg 1ms to 5ms), so not necessarily worth fixing.

  // TODO(felix8a): "<script> && && && ... <\/script>" is slower on all
  // browsers.  The hotspot is htmlSplit.

  // TODO(felix8a): "<p title='>>>>...'><\/p>" is slower on all browsers.
  // This is partly htmlSplit, but the hotspot is parseTagAndAttrs.

  // TODO(felix8a): "<a><\/a><a><\/a>..." is slower on IE9.
  // "<a>1<\/a><a>1<\/a>..." is faster, "<a><\/a>2<a><\/a>2..." is faster.

  // TODO(felix8a): "<p<p<p..." is slower on IE[6-8]

  var continuationMarker = {};
  function parse(htmlText, handler, param) {
    var m, p, tagName;
    var parts = htmlSplit(htmlText);
    var state = {
      noMoreGT: false,
      noMoreEndComments: false
    };
    parseCPS(handler, parts, 0, state, param);
  }

  function continuationMaker(h, parts, initial, state, param) {
    return function () {
      parseCPS(h, parts, initial, state, param);
    };
  }

  function parseCPS(h, parts, initial, state, param) {
    try {
      if (h.startDoc && initial == 0) { h.startDoc(param); }
      var m, p, tagName;
      for (var pos = initial, end = parts.length; pos < end;) {
        var current = parts[pos++];
        var next = parts[pos];
        switch (current) {
        case '&':
          if (ENTITY_RE_2.test(next)) {
            if (h.pcdata) {
              h.pcdata('&' + next, param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
            pos++;
          } else {
            if (h.pcdata) { h.pcdata("&amp;", param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          }
          break;
        case '<\/':
          if (m = /^([-\w:]+)[^\'\"]*/.exec(next)) {
            if (m[0].length === next.length && parts[pos + 1] === '>') {
              // fast case, no attribute parsing needed
              pos += 2;
              tagName = m[1].toLowerCase();
              if (h.endTag) {
                h.endTag(tagName, param, continuationMarker,
                  continuationMaker(h, parts, pos, state, param));
              }
            } else {
              // slow case, need to parse attributes
              // TODO(felix8a): do we really care about misparsing this?
              pos = parseEndTag(
                parts, pos, h, param, continuationMarker, state);
            }
          } else {
            if (h.pcdata) {
              h.pcdata('&lt;/', param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          }
          break;
        case '<':
          if (m = /^([-\w:]+)\s*\/?/.exec(next)) {
            if (m[0].length === next.length && parts[pos + 1] === '>') {
              // fast case, no attribute parsing needed
              pos += 2;
              tagName = m[1].toLowerCase();
              if (h.startTag) {
                h.startTag(tagName, [], param, continuationMarker,
                  continuationMaker(h, parts, pos, state, param));
              }
              // tags like <script> and <textarea> have special parsing
              var eflags = html4.ELEMENTS[tagName];
              if (eflags & EFLAGS_TEXT) {
                var tag = { name: tagName, next: pos, eflags: eflags };
                pos = parseText(
                  parts, tag, h, param, continuationMarker, state);
              }
            } else {
              // slow case, need to parse attributes
              pos = parseStartTag(
                parts, pos, h, param, continuationMarker, state);
            }
          } else {
            if (h.pcdata) {
              h.pcdata('&lt;', param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          }
          break;
        case '<\!--':
          // The pathological case is n copies of '<\!--' without '-->', and
          // repeated failure to find '-->' is quadratic.  We avoid that by
          // remembering when search for '-->' fails.
          if (!state.noMoreEndComments) {
            // A comment <\!--x--> is split into three tokens:
            //   '<\!--', 'x--', '>'
            // We want to find the next '>' token that has a preceding '--'.
            // pos is at the 'x--'.
            for (p = pos + 1; p < end; p++) {
              if (parts[p] === '>' && /--$/.test(parts[p - 1])) { break; }
            }
            if (p < end) {
              if (h.comment) {
                var comment = parts.slice(pos, p).join('');
                h.comment(
                  comment.substr(0, comment.length - 2), param,
                  continuationMarker,
                  continuationMaker(h, parts, p + 1, state, param));
              }
              pos = p + 1;
            } else {
              state.noMoreEndComments = true;
            }
          }
          if (state.noMoreEndComments) {
            if (h.pcdata) {
              h.pcdata('&lt;!--', param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          }
          break;
        case '<\!':
          if (!/^\w/.test(next)) {
            if (h.pcdata) {
              h.pcdata('&lt;!', param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          } else {
            // similar to noMoreEndComment logic
            if (!state.noMoreGT) {
              for (p = pos + 1; p < end; p++) {
                if (parts[p] === '>') { break; }
              }
              if (p < end) {
                pos = p + 1;
              } else {
                state.noMoreGT = true;
              }
            }
            if (state.noMoreGT) {
              if (h.pcdata) {
                h.pcdata('&lt;!', param, continuationMarker,
                  continuationMaker(h, parts, pos, state, param));
              }
            }
          }
          break;
        case '<?':
          // similar to noMoreEndComment logic
          if (!state.noMoreGT) {
            for (p = pos + 1; p < end; p++) {
              if (parts[p] === '>') { break; }
            }
            if (p < end) {
              pos = p + 1;
            } else {
              state.noMoreGT = true;
            }
          }
          if (state.noMoreGT) {
            if (h.pcdata) {
              h.pcdata('&lt;?', param, continuationMarker,
                continuationMaker(h, parts, pos, state, param));
            }
          }
          break;
        case '>':
          if (h.pcdata) {
            h.pcdata("&gt;", param, continuationMarker,
              continuationMaker(h, parts, pos, state, param));
          }
          break;
        case '':
          break;
        default:
          if (h.pcdata) {
            h.pcdata(current, param, continuationMarker,
              continuationMaker(h, parts, pos, state, param));
          }
          break;
        }
      }
      if (h.endDoc) { h.endDoc(param); }
    } catch (e) {
      if (e !== continuationMarker) { throw e; }
    }
  }

  // Split str into parts for the html parser.
  function htmlSplit(str) {
    // can't hoist this out of the function because of the re.exec loop.
    var re = /(<\/|<\!--|<[!?]|[&<>])/g;
    str += '';
    if (splitWillCapture) {
      return str.split(re);
    } else {
      var parts = [];
      var lastPos = 0;
      var m;
      while ((m = re.exec(str)) !== null) {
        parts.push(str.substring(lastPos, m.index));
        parts.push(m[0]);
        lastPos = m.index + m[0].length;
      }
      parts.push(str.substring(lastPos));
      return parts;
    }
  }

  function parseEndTag(parts, pos, h, param, continuationMarker, state) {
    var tag = parseTagAndAttrs(parts, pos);
    // drop unclosed tags
    if (!tag) { return parts.length; }
    if (h.endTag) {
      h.endTag(tag.name, param, continuationMarker,
        continuationMaker(h, parts, pos, state, param));
    }
    return tag.next;
  }

  function parseStartTag(parts, pos, h, param, continuationMarker, state) {
    var tag = parseTagAndAttrs(parts, pos);
    // drop unclosed tags
    if (!tag) { return parts.length; }
    if (h.startTag) {
      h.startTag(tag.name, tag.attrs, param, continuationMarker,
        continuationMaker(h, parts, tag.next, state, param));
    }
    // tags like <script> and <textarea> have special parsing
    if (tag.eflags & EFLAGS_TEXT) {
      return parseText(parts, tag, h, param, continuationMarker, state);
    } else {
      return tag.next;
    }
  }

  var endTagRe = {};

  // Tags like <script> and <textarea> are flagged as CDATA or RCDATA,
  // which means everything is text until we see the correct closing tag.
  function parseText(parts, tag, h, param, continuationMarker, state) {
    var end = parts.length;
    if (!endTagRe.hasOwnProperty(tag.name)) {
      endTagRe[tag.name] = new RegExp('^' + tag.name + '(?:[\\s\\/]|$)', 'i');
    }
    var re = endTagRe[tag.name];
    var first = tag.next;
    var p = tag.next + 1;
    for (; p < end; p++) {
      if (parts[p - 1] === '<\/' && re.test(parts[p])) { break; }
    }
    if (p < end) { p -= 1; }
    var buf = parts.slice(first, p).join('');
    if (tag.eflags & html4.eflags['CDATA']) {
      if (h.cdata) {
        h.cdata(buf, param, continuationMarker,
          continuationMaker(h, parts, p, state, param));
      }
    } else if (tag.eflags & html4.eflags['RCDATA']) {
      if (h.rcdata) {
        h.rcdata(normalizeRCData(buf), param, continuationMarker,
          continuationMaker(h, parts, p, state, param));
      }
    } else {
      throw new Error('bug');
    }
    return p;
  }

  // at this point, parts[pos-1] is either "<" or "<\/".
  function parseTagAndAttrs(parts, pos) {
    var m = /^([-\w:]+)/.exec(parts[pos]);
    var tag = {};
    tag.name = m[1].toLowerCase();
    tag.eflags = html4.ELEMENTS[tag.name];
    var buf = parts[pos].substr(m[0].length);
    // Find the next '>'.  We optimistically assume this '>' is not in a
    // quoted context, and further down we fix things up if it turns out to
    // be quoted.
    var p = pos + 1;
    var end = parts.length;
    for (; p < end; p++) {
      if (parts[p] === '>') { break; }
      buf += parts[p];
    }
    if (end <= p) { return void 0; }
    var attrs = [];
    while (buf !== '') {
      m = ATTR_RE.exec(buf);
      if (!m) {
        // No attribute found: skip garbage
        buf = buf.replace(/^[\s\S][^a-z\s]*/, '');

      } else if ((m[4] && !m[5]) || (m[6] && !m[7])) {
        // Unterminated quote: slurp to the next unquoted '>'
        var quote = m[4] || m[6];
        var sawQuote = false;
        var abuf = [buf, parts[p++]];
        for (; p < end; p++) {
          if (sawQuote) {
            if (parts[p] === '>') { break; }
          } else if (0 <= parts[p].indexOf(quote)) {
            sawQuote = true;
          }
          abuf.push(parts[p]);
        }
        // Slurp failed: lose the garbage
        if (end <= p) { break; }
        // Otherwise retry attribute parsing
        buf = abuf.join('');
        continue;

      } else {
        // We have an attribute
        var aName = m[1].toLowerCase();
        var aValue = m[2] ? decodeValue(m[3]) : aName;
        attrs.push(aName, aValue);
        buf = buf.substr(m[0].length);
      }
    }
    tag.attrs = attrs;
    tag.next = p + 1;
    return tag;
  }

  function decodeValue(v) {
    var q = v.charCodeAt(0);
    if (q === 0x22 || q === 0x27) { // " or '
      v = v.substr(1, v.length - 2);
    }
    return unescapeEntities(stripNULs(v));
  }

  /**
   * Returns a function that strips unsafe tags and attributes from html.
   * @param {function(string, Array.<string>): ?Array.<string>} tagPolicy
   *     A function that takes (tagName, attribs[]), where tagName is a key in
   *     html4.ELEMENTS and attribs is an array of alternating attribute names
   *     and values.  It should return a record (as follows), or null to delete
   *     the element.  It's okay for tagPolicy to modify the attribs array,
   *     but the same array is reused, so it should not be held between calls.
   *     Record keys:
   *        attribs: (required) Sanitized attributes array.
   *        tagName: Replacement tag name.
   * @return {function(string, Array)} A function that sanitizes a string of
   *     HTML and appends result strings to the second argument, an array.
   */
  function makeHtmlSanitizer(tagPolicy) {
    var stack;
    var ignoring;
    var emit = function (text, out) {
      if (!ignoring) { out.push(text); }
    };
    return makeSaxParser({
      'startDoc': function(_) {
        stack = [];
        ignoring = false;
      },
      'startTag': function(tagName, attribs, out) {
        if (ignoring) { return; }
        if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }
        var eflagsOrig = html4.ELEMENTS[tagName];
        if (eflagsOrig & html4.eflags['FOLDABLE']) {
          return;
        }

        var decision = tagPolicy(tagName, attribs);
        if (!decision) {
          ignoring = !(eflagsOrig & html4.eflags['EMPTY']);
          return;
        } else if (typeof decision !== 'object') {
          throw new Error('tagPolicy did not return object (old API?)');
        }
        if ('attribs' in decision) {
          attribs = decision['attribs'];
        } else {
          throw new Error('tagPolicy gave no attribs');
        }
        var eflagsRep;
        if ('tagName' in decision) {
          tagName = decision['tagName'];
          eflagsRep = html4.ELEMENTS[tagName];
        } else {
          eflagsRep = eflagsOrig;
        }
        // TODO(mikesamuel): relying on tagPolicy not to insert unsafe
        // attribute names.

        if (!(eflagsOrig & html4.eflags['EMPTY'])) {
          stack.push(tagName);
        }

        out.push('<', tagName);
        for (var i = 0, n = attribs.length; i < n; i += 2) {
          var attribName = attribs[i],
              value = attribs[i + 1];
          if (value !== null && value !== void 0) {
            out.push(' ', attribName, '="', escapeAttrib(value), '"');
          }
        }
        out.push('>');

        if ((eflagsOrig & html4.eflags['EMPTY'])
            && !(eflagsRep & html4.eflags['EMPTY'])) {
          // replacement is non-empty, synthesize end tag
          out.push('<\/', tagName, '>');
        }
      },
      'endTag': function(tagName, out) {
        if (ignoring) {
          ignoring = false;
          return;
        }
        if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }
        var eflags = html4.ELEMENTS[tagName];
        if (!(eflags & (html4.eflags['EMPTY'] | html4.eflags['FOLDABLE']))) {
          var index;
          if (eflags & html4.eflags['OPTIONAL_ENDTAG']) {
            for (index = stack.length; --index >= 0;) {
              var stackEl = stack[index];
              if (stackEl === tagName) { break; }
              if (!(html4.ELEMENTS[stackEl] &
                    html4.eflags['OPTIONAL_ENDTAG'])) {
                // Don't pop non optional end tags looking for a match.
                return;
              }
            }
          } else {
            for (index = stack.length; --index >= 0;) {
              if (stack[index] === tagName) { break; }
            }
          }
          if (index < 0) { return; }  // Not opened.
          for (var i = stack.length; --i > index;) {
            var stackEl = stack[i];
            if (!(html4.ELEMENTS[stackEl] &
                  html4.eflags['OPTIONAL_ENDTAG'])) {
              out.push('<\/', stackEl, '>');
            }
          }
          stack.length = index;
          out.push('<\/', tagName, '>');
        }
      },
      'pcdata': emit,
      'rcdata': emit,
      'cdata': emit,
      'endDoc': function(out) {
        for (; stack.length; stack.length--) {
          out.push('<\/', stack[stack.length - 1], '>');
        }
      }
    });
  }

  // From RFC3986
  var URI_SCHEME_RE = new RegExp(
      '^' +
      '(?:' +
        '([^:\/?# ]+)' +         // scheme
      ':)?'
  );

  var ALLOWED_URI_SCHEMES = /^(?:https?|mailto)$/i;

  function safeUri(uri, effect, ltype, hints, naiveUriRewriter) {
    if (!naiveUriRewriter) { return null; }
    var parsed = ('' + uri).match(URI_SCHEME_RE);
    if (parsed && (!parsed[1] || ALLOWED_URI_SCHEMES.test(parsed[1]))) {
      return naiveUriRewriter(uri, effect, ltype, hints);
    } else {
      return null;
    }
  }

  function log(logger, tagName, attribName, oldValue, newValue) {
    if (!attribName) {
      logger(tagName + " removed", {
        change: "removed",
        tagName: tagName
      });
    }
    if (oldValue !== newValue) {
      var changed = "changed";
      if (oldValue && !newValue) {
        changed = "removed";
      } else if (!oldValue && newValue)  {
        changed = "added";
      }
      logger(tagName + "." + attribName + " " + changed, {
        change: changed,
        tagName: tagName,
        attribName: attribName,
        oldValue: oldValue,
        newValue: newValue
      });
    }
  }

  function lookupAttribute(map, tagName, attribName) {
    var attribKey;
    attribKey = tagName + '::' + attribName;
    if (map.hasOwnProperty(attribKey)) {
      return map[attribKey];
    }
    attribKey = '*::' + attribName;
    if (map.hasOwnProperty(attribKey)) {
      return map[attribKey];
    }
    return void 0;
  }
  function getAttributeType(tagName, attribName) {
    return lookupAttribute(html4.ATTRIBS, tagName, attribName);
  }
  function getLoaderType(tagName, attribName) {
    return lookupAttribute(html4.LOADERTYPES, tagName, attribName);
  }
  function getUriEffect(tagName, attribName) {
    return lookupAttribute(html4.URIEFFECTS, tagName, attribName);
  }

  /**
   * Sanitizes attributes on an HTML tag.
   * @param {string} tagName An HTML tag name in lowercase.
   * @param {Array.<?string>} attribs An array of alternating names and values.
   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
   *     apply to URI attributes; it can return a new string value, or null to
   *     delete the attribute.  If unspecified, URI attributes are deleted.
   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
   *     to attributes containing HTML names, element IDs, and space-separated
   *     lists of classes; it can return a new string value, or null to delete
   *     the attribute.  If unspecified, these attributes are kept unchanged.
   * @return {Array.<?string>} The sanitized attributes as a list of alternating
   *     names and values, where a null value means to omit the attribute.
   */
  function sanitizeAttribs(tagName, attribs,
    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
    // TODO(felix8a): it's obnoxious that domado duplicates much of this
    // TODO(felix8a): maybe consistently enforce constraints like target=
    for (var i = 0; i < attribs.length; i += 2) {
      var attribName = attribs[i];
      var value = attribs[i + 1];
      var oldValue = value;
      var atype = null, attribKey;
      if ((attribKey = tagName + '::' + attribName,
           html4.ATTRIBS.hasOwnProperty(attribKey)) ||
          (attribKey = '*::' + attribName,
           html4.ATTRIBS.hasOwnProperty(attribKey))) {
        atype = html4.ATTRIBS[attribKey];
      }
      if (atype !== null) {
        switch (atype) {
          case html4.atype['NONE']: break;
          case html4.atype['SCRIPT']:
            value = null;
            if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
          case html4.atype['STYLE']:
            if ('undefined' === typeof parseCssDeclarations) {
              value = null;
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
	      }
              break;
            }
            var sanitizedDeclarations = [];
            parseCssDeclarations(
                value,
                {
                  declaration: function (property, tokens) {
                    var normProp = property.toLowerCase();
                    var schema = cssSchema[normProp];
                    if (!schema) {
                      return;
                    }
                    sanitizeCssProperty(
                        normProp, schema, tokens,
                        opt_naiveUriRewriter
                        ? function (url) {
                            return safeUri(
                                url, html4.ueffects.SAME_DOCUMENT,
                                html4.ltypes.SANDBOXED,
                                {
                                  "TYPE": "CSS",
                                  "CSS_PROP": normProp
                                }, opt_naiveUriRewriter);
                          }
                        : null);
                    sanitizedDeclarations.push(property + ': ' + tokens.join(' '));
                  }
                });
            value = sanitizedDeclarations.length > 0 ?
              sanitizedDeclarations.join(' ; ') : null;
            if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
          case html4.atype['ID']:
          case html4.atype['IDREF']:
          case html4.atype['IDREFS']:
          case html4.atype['GLOBAL_NAME']:
          case html4.atype['LOCAL_NAME']:
          case html4.atype['CLASSES']:
            value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
            if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
          case html4.atype['URI']:
            value = safeUri(value,
              getUriEffect(tagName, attribName),
              getLoaderType(tagName, attribName),
              {
                "TYPE": "MARKUP",
                "XML_ATTR": attribName,
                "XML_TAG": tagName
              }, opt_naiveUriRewriter);
              if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
          case html4.atype['URI_FRAGMENT']:
            if (value && '#' === value.charAt(0)) {
              value = value.substring(1);  // remove the leading '#'
              value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
              if (value !== null && value !== void 0) {
                value = '#' + value;  // restore the leading '#'
              }
            } else {
              value = null;
            }
            if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
          default:
            value = null;
            if (opt_logger) {
              log(opt_logger, tagName, attribName, oldValue, value);
            }
            break;
        }
      } else {
        value = null;
        if (opt_logger) {
          log(opt_logger, tagName, attribName, oldValue, value);
        }
      }
      attribs[i + 1] = value;
    }
    return attribs;
  }

  /**
   * Creates a tag policy that omits all tags marked UNSAFE in html4-defs.js
   * and applies the default attribute sanitizer with the supplied policy for
   * URI attributes and NMTOKEN attributes.
   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
   *     apply to URI attributes.  If not given, URI attributes are deleted.
   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
   *     to attributes containing HTML names, element IDs, and space-separated
   *     lists of classes.  If not given, such attributes are left unchanged.
   * @return {function(string, Array.<?string>)} A tagPolicy suitable for
   *     passing to html.sanitize.
   */
  function makeTagPolicy(
    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
    return function(tagName, attribs) {
      if (!(html4.ELEMENTS[tagName] & html4.eflags['UNSAFE'])) {
        return {
          'attribs': sanitizeAttribs(tagName, attribs,
            opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger)
        };
      } else {
        if (opt_logger) {
          log(opt_logger, tagName, undefined, undefined, undefined);
        }
      }
    };
  }

  /**
   * Sanitizes HTML tags and attributes according to a given policy.
   * @param {string} inputHtml The HTML to sanitize.
   * @param {function(string, Array.<?string>)} tagPolicy A function that
   *     decides which tags to accept and sanitizes their attributes (see
   *     makeHtmlSanitizer above for details).
   * @return {string} The sanitized HTML.
   */
  function sanitizeWithPolicy(inputHtml, tagPolicy) {
    var outputArray = [];
    makeHtmlSanitizer(tagPolicy)(inputHtml, outputArray);
    return outputArray.join('');
  }

  /**
   * Strips unsafe tags and attributes from HTML.
   * @param {string} inputHtml The HTML to sanitize.
   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
   *     apply to URI attributes.  If not given, URI attributes are deleted.
   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
   *     to attributes containing HTML names, element IDs, and space-separated
   *     lists of classes.  If not given, such attributes are left unchanged.
   */
  function sanitize(inputHtml,
    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
    var tagPolicy = makeTagPolicy(
      opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger);
    return sanitizeWithPolicy(inputHtml, tagPolicy);
  }

  // Export both quoted and unquoted names for Closure linkage.
  var html = {};
  html.escapeAttrib = html['escapeAttrib'] = escapeAttrib;
  html.makeHtmlSanitizer = html['makeHtmlSanitizer'] = makeHtmlSanitizer;
  html.makeSaxParser = html['makeSaxParser'] = makeSaxParser;
  html.makeTagPolicy = html['makeTagPolicy'] = makeTagPolicy;
  html.normalizeRCData = html['normalizeRCData'] = normalizeRCData;
  html.sanitize = html['sanitize'] = sanitize;
  html.sanitizeAttribs = html['sanitizeAttribs'] = sanitizeAttribs;
  html.sanitizeWithPolicy = html['sanitizeWithPolicy'] = sanitizeWithPolicy;
  html.unescapeEntities = html['unescapeEntities'] = unescapeEntities;
  return html;
})(html4);

var html_sanitize = html['sanitize'];

// Exports for Closure compiler.  Note this file is also cajoled
// for domado and run in an environment without 'window'
if (typeof window !== 'undefined') {
  window['html'] = html;
  window['html_sanitize'] = html_sanitize;
}
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * JavaScript support for TemplateCompiler.java and for a tamed version of
 * <code>document.write{,ln}</code>.
 * <p>
 * This handles the problem of making sure that only the bits of a Gadget's
 * static HTML which should be visible to a script are visible, and provides
 * mechanisms to reliably find elements using dynamically generated unique IDs
 * in the face of DOM modifications by untrusted scripts.
 *
 * @author mikesamuel@gmail.com
 * @author jasvir@gmail.com
 * @provides HtmlEmitter
 * @overrides window
 * @requires bridalMaker html htmlSchema cajaVM sanitizeStylesheet URI Q
 * @overrides window
 */

// The Turkish i seems to be a non-issue, but abort in case it is.
if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

/**
 * @param {function} makeDOMAccessible A function which will be called on base
 *     and every object retrieved from it, recursively. This hook is available
 *     in case HtmlEmitter is running in an environment such that unmodified DOM
 *     objects cannot be touched. makeDOMAccessible should be idempotent. Note
 *     that the contract here is stronger than for bridalMaker, in that
 *     this makeDOMAccessible may not return a different object.
 *     Except, this contract may be impossible to satisfy on IE<=8.
 *     TODO(felix8a): check all the implications of violating the contract.
 * @param base a node that is the ancestor of all statically generated HTML.
 * @param opt_domicile the domado instance that will receive a load event when
 *     the html-emitter is closed, and which will have the {@code writeHook}
 *     property set to the HtmlEmitter's document.write implementation.
 * @param opt_guestGlobal the object in the guest frame that is the global scope
 *     for guest code.
 */
function HtmlEmitter(makeDOMAccessible, base, opt_domicile, opt_guestGlobal) {
  if (!base) {
    throw new Error(
        'Host page error: Virtual document element was not provided');
  }
  base = makeDOMAccessible(base);
  var insertionPoint = base;
  var bridal = bridalMaker(makeDOMAccessible, base.ownerDocument);

  // TODO: Take into account <base> elements.

  /**
   * Contiguous pairs of ex-descendants of base, and their ex-parent.
   * The detached elements (even indices) are ordered depth-first.
   */
  var detached = null;
  /** Makes sure IDs are accessible within removed detached nodes. */
  var idMap = null;
  
  /** Hook from attach/detach to document.write logic. */
  var updateInsertionMode;

  var arraySplice = Array.prototype.splice;
  
  var HTML5_WHITESPACE_RE = /^[\u0009\u000a\u000c\u000d\u0020]*$/;

  function buildIdMap() {
    idMap = {};
    var descs = base.getElementsByTagName('*');
    for (var i = 0, desc; (desc = descs[i]); ++i) {
      desc = makeDOMAccessible(desc);
      var id = desc.getAttributeNode('id');
      id = makeDOMAccessible(id);
      // The key is decorated to avoid name conflicts and restrictions.
      if (id && id.value) { idMap[id.value + " map entry"] = desc; }
    }
  }
  /**
   * Returns the element with the given ID under the base node.
   * @param id an auto-generated ID since we cannot rely on user supplied IDs
   *     to be unique.
   * @return {Element|null} null if no such element exists.
   */
  function byId(id) {
    if (!idMap) { buildIdMap(); }
    var node = idMap[id + " map entry"];
    if (node) { return node; }
    for (; (node = base.ownerDocument.getElementById(id));) {
      if (base.contains
          ? base.contains(node)
          : (base.compareDocumentPosition(node) & 0x10)) {
        idMap[id + " map entry"] = node;
        return node;
      } else {
        node.id = '';
      }
    }
    return null;
  }

  /**
   * emitStatic allows the caller to inject the static HTML from JavaScript,
   * if the gadget host page's usage pattern requires it.
   */
  function emitStatic(htmlString) {
    if (!base) {
      throw new Error('Host page error: HtmlEmitter.emitStatic called after' +
          ' document finish()ed');
    }
    base.innerHTML += htmlString;
  }

  // Below we define the attach, detach, and finish operations.
  // These obey the conventions that:
  //   (1) All detached nodes, along with their ex-parents are in detached,
  //       and they are ordered depth-first.
  //   (2) When a node is specified by an ID, after the operation is performed,
  //       it is in the tree.
  //   (3) Each node is attached to the same parent regardless of what the
  //       script does.  Even if a node is removed from the DOM by a script,
  //       any of its children that appear after the script, will be added.
  // As an example, consider this HTML which has the end-tags removed since
  // they don't correspond to actual nodes.
  //   <table>
  //     <script>
  //     <tr>
  //       <td>Foo<script>Bar
  //       <th>Baz
  //   <script>
  //   <p>The-End
  // There are two script elements, and we need to make sure that each only
  // sees the bits of the DOM that it is supposed to be aware of.
  //
  // To make sure that things work when javascript is off, we emit the whole
  // HTML tree, and then detach everything that shouldn't be present.
  // We represent the removed bits as pairs of (removedNode, parentItWasPartOf).
  // Including both makes us robust against changes scripts make to the DOM.
  // In this case, the detach operation results in the tree
  //   <table>
  // and the detached list
  //   [<tr><td>FooBar<th>Baz in <table>, <p>The-End in (base)]

  // After the first script executes, we reattach the bits needed by the second
  // script, which gives us the DOM
  //   <table><tr><td>Foo
  // and the detached list
  //   ['Bar' in <td>, <th>Baz in <tr>, <p>The-End in (base)]
  // Note that we did not simply remove items from the old detached list.  Since
  // the second script was deeper than the first, we had to add only a portion
  // of the <tr>'s content which required doing a separate mini-detach operation
  // and push its operation on to the front of the detached list.

  // After the second script executes, we reattach the bits needed by the third
  // script, which gives us the DOM
  //   <table><tr><td>FooBar<th>Baz
  // and the detached list
  //   [<p>The-End in (base)]

  // After the third script executes, we reattached the rest of the detached
  // nodes, and we're done.

  // To perform a detach or reattach operation, we impose a depth-first ordering
  // on HTML start tags, and text nodes:
  //   [0: <table>, 1: <tr>, 2: <td>, 3: 'Foo', 4: 'Bar', 5: <th>, 6: 'Baz',
  //    7: <p>, 8: 'The-End']
  // Then the detach operation simply removes the minimal number of nodes from
  // the DOM to make sure that only a prefix of those nodes are present.
  // In the case above, we are detaching everything after item 0.
  // Then the reattach operation advances the number.  In the example above, we
  // advance the index from 0 to 3, and then from 3 to 6.
  // The finish operation simply reattaches the rest, advancing the counter from
  // 6 to the end.

  // The minimal detached list from the node with DFS index I is the ordered
  // list such that a (node, parent) pair (N, P) is on the list if
  // dfs-index(N) > I and there is no pair (P, GP) on the list.

  // To calculate the minimal detached list given a node representing a point in
  // that ordering, we rely on the following observations:
  //    The minimal detached list after a node, is the concatenation of
  //    (1) that node's children in order
  //    (2) the next sibling of that node and its later siblings,
  //        the next sibling of that node's parent and its later siblings,
  //        the next sibling of that node's grandparent and its later siblings,
  //        etc., until base is reached.

  function detachOnto(limit, out) {
    // Set detached to be the minimal set of nodes that have to be removed
    // to make sure that limit is the last attached node in DFS order as
    // specified above.

    // First, store all the children.
    for (var child = limit.firstChild, next; child; child = next) {
      child = makeDOMAccessible(child);
      next = child.nextSibling;  // removeChild kills nextSibling.
      out.push(child, limit);
      limit.removeChild(child);
    }

    // Second, store your ancestor's next siblings and recurse.
    for (var anc = limit, greatAnc; anc && anc !== base; anc = greatAnc) {
      greatAnc = anc.parentNode;
      greatAnc = makeDOMAccessible(greatAnc);
      for (var sibling = anc.nextSibling, next; sibling; sibling = next) {
        sibling = makeDOMAccessible(sibling);
        next = sibling.nextSibling;
        out.push(sibling, greatAnc);
        greatAnc.removeChild(sibling);
      }
    }
  }
  /**
   * Make sure that everything up to and including the node with the given ID
   * is attached, and that nothing that follows the node is attached.
   */
  function attach(id) {
    var limit = byId(id);
    if (detached) {
      // Build an array of arguments to splice so we can replace the reattached
      // nodes with the nodes detached from limit.
      var newDetached = [0, 0];
      // Since limit has no parent, detachOnto will bottom out at its sibling.
      detachOnto(limit, newDetached);
      // Find the node containing limit that appears on detached.
      var limitAnc = limit;
      for (var parent; (parent = limitAnc.parentNode);) {
        limitAnc = parent;
      }
      // Reattach up to and including limit ancestor.
      // If some browser quirk causes us to miss limit in detached, we'll
      // reattach everything and try to continue.
      var nConsumed = 0;
      while (nConsumed < detached.length) {
        // in IE, some types of nodes can't be standalone, and detaching
        // one will create new parentNodes for them.  so at this point,
        // limitAnc might be an ancestor of the node on detached.
        var reattach = detached[nConsumed];
        var reattAnc = reattach;
        for (; reattAnc.parentNode; reattAnc = reattAnc.parentNode) {}
        (detached[nConsumed + 1] /* the parent */).appendChild(reattach);
        nConsumed += 2;
        if (reattAnc === limitAnc) { break; }
      }
      // Replace the reattached bits with the ones detached from limit.
      newDetached[1] = nConsumed;  // splice's second arg is the number removed
      arraySplice.apply(detached, newDetached);
    } else {
      // The first time attach is called, the limit is actually part of the DOM.
      // There's no point removing anything when all scripts are deferred.
      detached = [];
      detachOnto(limit, detached);
    }
    // Keep track of the insertion point for document.write.
    // The tag was closed if there is no child waiting to be added.
    // FIXME(mikesamuel): This is not technically correct, since the script
    // element could have been the only child.
    var isLimitClosed = detached[1] !== limit;
    insertionPoint = isLimitClosed ? limit.parentNode : limit;
    updateInsertionMode();
    return limit;
  }
  /**
   * Removes a script place-holder.
   * When a text node immediately precedes a script block, the limit will be
   * a text node.  Text nodes can't be addressed by ID, so the TemplateCompiler
   * follows them with a {@code <span>} which must be removed to be semantics
   * preserving.
   */
  function discard(placeholder) {
    // An untrusted script block should not be able to access the wrapper before
    // it's removed since it won't be part of the DOM so there should be a
    // parentNode.
    placeholder.parentNode.removeChild(placeholder);
  }
  /**
   * Reattach any remaining detached bits, free resources.
   */
  function finish() {
    insertionPoint = null;
    if (detached) {
      for (var i = 0, n = detached.length; i < n; i += 2) {
        detached[i + 1].appendChild(detached[i]);
      }
    }
    // Release references so nodes can be garbage collected.
    idMap = detached = base = null;
    return this;
  }

  function signalLoaded() {
    // Signals the close of the document and fires any window.onload event
    // handlers.
    var domicile = opt_domicile;
    // Fire any deferred or async scripts and after they're all loaded,
    // fire any onload handlers.
    if (domicile) {
      delayScript(function () { domicile.signalLoaded(); });
    }
    execDelayedScripts();
    return this;
  }


  /**
   * Delayed scripts that should be evaluated before signalling that the
   * document is loaded.
   * Elements in this are one of<ul>
   * <li>null - script which has been executed.</li>
   * <li>UNSATISFIED - script which cannot yet be executed.</li>
   * <li>a function of zero arguments which encapsulates the script body.</li>
   * </ul>
   */
  var delayedScripts = [];

  var UNSATISFIED = {};

  function delayScript(fn) {
    if (delayedScripts) {
      delayedScripts.push(fn);
    } else {
      fn();
    }
  }

  // Execute any delayed scripts.
  function execDelayedScripts() {
    if (delayedScripts) {
      // Sample length each time in case one delayed scripts execution
      // causes another to fire.
      for (var i = 0; i < delayedScripts.length; ++i) {
        var delayedScript = delayedScripts[i];
        if (!delayedScript) { continue; }
        if (delayedScript === UNSATISFIED) { return; }
        delayedScripts[i] = null;
        try {
          delayedScript();
        } catch (_) {
          // Any dispatching to onerror should have been handled by
          // delayedScript so log.
          // TODO(mikesamuel): How do we log from this file.
          // Should domicile provide a log hook?
        }
      }
      delayedScripts = null;
    }
  }


  function handleEmbed(params) {
    if (!opt_guestGlobal) { return; }
    if (!opt_guestGlobal.cajaHandleEmbed) { return; }
    opt_guestGlobal.cajaHandleEmbed(params);
  }

  this.byId = byId;
  this.attach = attach;
  this.discard = discard;
  this.emitStatic = emitStatic;
  this.finish = finish;
  this.signalLoaded = signalLoaded;
  this.setAttr = bridal.setAttribute;
  this.rmAttr = function(el, attr) { return el.removeAttribute(attr); };
  this.handleEmbed = handleEmbed;

  (function (domicile) {
    if (!domicile || domicile.writeHook) {
      updateInsertionMode = function () {};
      return;
    }

    function concat(items) {
      return Array.prototype.join.call(items, '');
    }

    function evaluateUntrustedScript(
        scriptBaseUri, scriptInnerText, opt_delayed) {
      if (!opt_guestGlobal) { return; }

      if (opt_delayed) {
        delayScript(function () {
          evaluateUntrustedScript(scriptBaseUri, scriptInnerText, false);
        });
        return;
      }

      var errorMessage = "SCRIPT element evaluation failed";

      var cajaVM = opt_guestGlobal.cajaVM;
      if (cajaVM) {
        var compileModule = cajaVM.compileModule;
        if (compileModule) {
          try {
            var compiledModule = compileModule(scriptInnerText);
            try {
              compiledModule(opt_domicile.window);
              return;  // Do not trigger onerror below.
            } catch (runningEx) {
              errorMessage = String(runningEx);
            }
          } catch (compileEx) {
            errorMessage =
              String(compileEx && (compileEx.message || compileEx.description))
                || errorMessage;
          }
        }
      }

      // Dispatch to the onerror handler.
      try {
        // TODO: Should this happen inline or be dispatched out of band?
        opt_domicile.window.onerror(
            errorMessage,
            // URL where error was raised.
            // If this is an external load, then we need to use that URL,
            // but for inline scripts we maintain the illusion by using the
            // domicile.pseudoLocation.href which was passed here.
            scriptBaseUri,
            1  // Line number where error was raised.
            // TODO: remap by inspection of the error if possible.
            );
      } catch (_) {
        // Ignore problems dispatching error.
      }
    }

    function makeCssUriSanitizer(baseUri) {
      return function(uri, prop) {
          return (domicile && domicile.cssUri)
              ? domicile.cssUri(URI.utils.resolve(baseUri, uri), 'image/*', prop)
              : void 0;
      };
    }

    function defineUntrustedStylesheet(styleBaseUri, cssText) {
      if (domicile && domicile.emitCss) {
        domicile.emitCss(sanitizeStylesheet(styleBaseUri,
            cssText, domicile.suffixStr.replace(/^-/, ''), 
            makeCssUriSanitizer(styleBaseUri),
            domicile.tagPolicy));
      }
    }

    function resolveUntrustedExternal(
        func, url, mime, marker, continuation, opt_errorResult) {
      if (domicile && domicile.fetchUri) {
        domicile.fetchUri(url, mime,
          function (result) {
            if (result && result.html) {
              func(url, result.html);
            } else if (opt_errorResult) {
              func(url, opt_errorResult);
            } else {
              // TODO(jasvir): Thread logger and log the failure to fetch
            }
            if (continuation) {
              continuation();
            }
          });
        if (marker) {
          throw marker;
        }
      }
    }

    function defineUntrustedExternalStylesheet(url, marker, continuation) {
      resolveUntrustedExternal(
        defineUntrustedStylesheet, url, 'text/css', marker, continuation);
    }

    function evaluateUntrustedExternalScript(
        url, marker, continuation, delayed) {
      var handler;
      if (delayed && delayedScripts) {
        var idx = delayedScripts.length;
        delayedScripts[idx] = UNSATISFIED;
        handler = function (url, src) {
          delayedScripts[idx] = function () {
            evaluateUntrustedScript(url, src, true);
          };
          // TODO(mikesamuel): should this be done via timeout?
          execDelayedScripts();
        };
      } else {
        handler = evaluateUntrustedScript;
      }
      resolveUntrustedExternal(
        handler, url, 'text/javascript', marker, continuation,
        // TODO(mikesamuel): What is the appropriate voodoo here that triggers
        // dispatch to the module global onerror handler?
        // Can we prepackage a 'throw new Error("not loaded")' module, and load
        // that when loading otherwise fails?
        'throw new Error("not loaded")');
    }

    function lookupAttr(attribs, attr) {
      var srcIndex = 0;
      do {
        srcIndex = attribs.indexOf(attr, srcIndex) + 1;
      } while (srcIndex && !(srcIndex & 1));
      return srcIndex ? attribs[srcIndex] : undefined;
    }

    function resolveUriRelativeToDocument(href) {
      if (domicile && domicile.pseudoLocation && domicile.pseudoLocation.href) {
        return URI.utils.resolve(domicile.pseudoLocation.href, href);
      }
      return href;
    }

    // The content type of cdataContent; either 0 (inactive) or these constants.
    var cdataContentType = 0;
    var CDATA_SCRIPT = 1;
    var CDATA_STYLE = 2;
    // Chunks of CDATA content of the type above which need to be specially
    // processed and interpreted.
    var cdataContent = [];
    // The URL of any pending CDATA element, for example the value of the
    // <script src> attribute.
    var pendingExternal = undefined;
    // True iff the pending CDATA tag is defer or async.
    var pendingDelayed = false;
    var documentLoaded = undefined;
    var depth = 0;

    function normalInsert(virtualTagName, attribs) {
      var realTagName = htmlSchema.virtualToRealElementName(virtualTagName);

      // Extract attributes which we need to invoke side-effects on rather
      // than just sanitization; currently <body> event handlers.
      var slowPathAttribs = [];
      if (opt_domicile && virtualTagName === 'body') {
        for (var i = attribs.length - 2; i >= 0; i -= 2) {
          if (/^on/i.test(attribs[i])) {
            slowPathAttribs.push.apply(slowPathAttribs, attribs.splice(i, 2));
          }
        }
      }

      var vSchemaEl = htmlSchema.element(virtualTagName);
      var rSchemaEl = htmlSchema.element(realTagName);

      domicile.sanitizeAttrs(realTagName, attribs);

      if (!rSchemaEl.allowed) {
        throw new Error('HtmlEmitter internal: unsafe element ' + realTagName +
            ' slipped through virtualization!');
      }

      var el = bridal.createElement(realTagName, attribs);
      if (vSchemaEl.optionalEndTag && el.tagName === insertionPoint.tagName) {
        documentWriter.endTag(el.tagName.toLowerCase(), true);
        // TODO(kpreid): Replace this with HTML5 parsing model
      }
      insertionPoint.appendChild(el);
      if (!vSchemaEl.empty) { insertionPoint = el; }
      
      for (var i = slowPathAttribs.length - 2; i >= 0; i -= 2) {
        opt_domicile.tameNode(el, true).setAttribute(
          slowPathAttribs[i], slowPathAttribs[i+1]);
      }
    }

    function normalEndTag(tagName) {
      tagName = htmlSchema.virtualToRealElementName(tagName).toUpperCase();

      var anc = insertionPoint;
      while (anc !== base && !/\bvdoc-container___\b/.test(anc.className)) {
        var p = anc.parentNode;
        if (anc.tagName === tagName) {
          insertionPoint = p;
          return;
        }
        anc = p;
      }
    }

    function normalText(text) {
      insertionPoint.appendChild(insertionPoint.ownerDocument.createTextNode(
          html.unescapeEntities(text)));
    }

    // Per HTML5 spec
    function isHtml5NonWhitespace(text) {
      return !HTML5_WHITESPACE_RE.test(text);
    }
    var insertionModes = {
      initial: {
        toString: function () { return "initial"; },
        startTag: function (tagName, attribs) {
          insertionMode = insertionModes.beforeHtml;
          insertionMode.startTag.apply(undefined, arguments);
        },
        endTag: function (tagName) {
          insertionMode = insertionModes.beforeHtml;
          insertionMode.endTag.apply(undefined, arguments);
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            insertionMode = insertionModes.beforeHtml;
            insertionMode.text.apply(undefined, arguments);
          }
        }
      },
      beforeHtml: {
        toString: function () { return "before html"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            normalInsert(tagName, attribs);
            insertionMode = insertionModes.beforeHead;
          } else {
            normalInsert('html', []);
            insertionMode = insertionModes.beforeHead;
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'head' || tagName === 'body' || tagName === 'html' ||
              tagName === 'br') {
            normalInsert('html', []);
            insertionMode = insertionModes.beforeHead;
            insertionMode.endTag.apply(undefined, arguments);
          } else {
            // "Parse error. Ignore the token."
          }
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            normalInsert('html', []);
            insertionMode = insertionModes.beforeHead;
            insertionMode.text.apply(undefined, arguments);
          }
        }
      },
      beforeHead: {
        toString: function () { return "before head"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            insertionModes.inBody.startTag.apply(undefined, arguments);
          } else if (tagName === 'head') {
            normalInsert(tagName, attribs);
            insertionMode = insertionModes.inHead;
          } else {
            insertionMode.startTag('head', []);
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'head' || tagName === 'body' || tagName === 'html' ||
              tagName === 'br') {
            insertionMode.startTag('head', []);
            insertionMode.endTag.apply(undefined, arguments);
          } else {
            // "Parse error. Ignore the token."
          }
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            insertionMode.startTag('head', []);
            insertionMode.text.apply(undefined, arguments);
          }
        }
      },
      inHead: {
        toString: function () { return "in head"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            insertionModes.inBody.startTag.apply(undefined, arguments);
          } else if (tagName === 'base' || tagName === 'basefont' ||
              tagName === 'bgsound'  || tagName === 'command' ||
              tagName === 'link'     || tagName === 'meta' ||
              tagName === 'noscript' || tagName === 'noframes' ||
              tagName === 'style'    || tagName === 'script') {
            normalInsert(tagName, attribs);
          } else if (tagName === 'title') {
            normalInsert(tagName, attribs);
            originalInsertionMode = insertionMode;
            insertionMode = insertionModes.text;
          } else if (tagName === 'head') {
            // "Parse error. Ignore the token."
          } else {
            insertionMode.endTag('head');
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'head') {
            insertionPoint = insertionPoint.parentElement;
            insertionMode = insertionModes.afterHead;
          } else if (tagName === 'body' || tagName === 'html' ||
              tagName === 'br') {
            insertionMode.endTag('head');
            insertionMode.endTag.apply(undefined, arguments);
          } else {
            // "Parse error. Ignore the token."
          }
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            insertionMode.endTag('head');
            insertionMode.text.apply(undefined, arguments);
          }
        }
      },
      afterHead: {
        toString: function () { return "after head"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            insertionModes.inBody.startTag.apply(undefined, arguments);
          } else if (tagName === 'body') {
            normalInsert(tagName, attribs);
            insertionMode = insertionModes.inBody;
          // TODO(kpreid): Implement the "stuff that should be in head" case.
          } else if (tagName === 'head') {
            // "Parse error. Ignore the token."
          } else {
            insertionMode.startTag('body', []);
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'body' || tagName === 'html' || tagName === 'br') {
            insertionMode.startTag('body', []);
            insertionMode.endTag.apply(undefined, arguments);
          } else {
            // "Parse error. Ignore the token."
          }
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            insertionMode.startTag('body', []);
            insertionMode.text.apply(undefined, arguments);
          } else {
            normalText(text);
          }
        }
      },
      inBody: {
        toString: function () { return "in body"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            // TODO(kpreid): Implement
            // "Parse error. For each attribute on the token, check to see if
            //  the attribute is already present on the top element of the stack
            //  of open elements. If it is not, add the attribute and its
            //  corresponding value to that element."
          } else if (tagName === 'base' || tagName === 'basefont' ||
              tagName === 'bgsound'     || tagName === 'command' ||
              tagName === 'link'        || tagName === 'meta' || 
              tagName === 'noframes'    || tagName === 'script' ||
              tagName === 'style'       || tagName === 'title') {
            insertionModes.inHead.startTag.apply(undefined, arguments);
          } else if (tagName === 'body') {
            // "Parse error."
            // TODO(kpreid): Implement attribute merging etc.
          } else {
            normalInsert(tagName, attribs);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'body') {
            // Yes, we really aren't moving the insertion point.
            insertionMode = insertionModes.afterBody;
          } else if (tagName === 'html') {
            insertionMode.endTag('body');
            insertionMode.endTag.apply(undefined, arguments);
          } else {
            // TODO(kpreid): Confirm vs spec'd "Any other end tag" handling
            normalEndTag(tagName);
          }
        },
        text: function (text) {
          normalText(text);
        }
      },
      text: {
        toString: function () { return "text"; },
        startTag: function (tagName, attribs) {
          throw new Error("shouldn't happen: start tag <" + tagName +
              "...> while in text insertion mode for " +
              insertionPoint.tagName);
        },
        endTag: function (tagName) {
          normalEndTag(tagName);
          insertionMode = originalInsertionMode;
        },
        text: function (text) {
          normalText(text);
        }
      },
      afterBody: {
        toString: function () { return "after body"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            insertionModes.inBody.startTag.apply(undefined, arguments);
          } else {
            // "Parse error."
            insertionMode = insertionModes.inBody;
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          if (tagName === 'html') {
            insertionMode = insertionModes.afterAfterBody;
          } else {
            insertionMode = insertionModes.inBody;
            insertionMode.endTag.apply(undefined, arguments);
          }
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            // "Parse error."
            insertionMode = insertionModes.inBody;
          }
          insertionModes.inBody.text.apply(undefined, arguments);
        }
      },
      afterAfterBody: {
        toString: function () { return "after after body"; },
        startTag: function (tagName, attribs) {
          if (tagName === 'html') {
            insertionModes.inBody.startTag.apply(undefined, arguments);
          } else {
            // "Parse error."
            insertionMode = insertionModes.inBody;
            insertionMode.startTag.apply(undefined, arguments);
          }
        },
        endTag: function (tagName) {
          // "Parse error."
          insertionMode = insertionModes.inBody;
          insertionMode.endTag.apply(undefined, arguments);
        },
        text: function (text) {
          if (isHtml5NonWhitespace(text)) {
            // "Parse error."
            insertionMode = insertionModes.inBody;
            insertionMode.text.apply(undefined, arguments);
          } else {
            insertionModes.inBody.text.apply(undefined, arguments);
          }
        }
      }
    };
    var insertionMode = insertionModes.initial;
    var originalInsertionMode = null;

    /**
     * Given that attach() has updated the insertionPoint, change the
     * insertionMode to a suitable value.
     */
    updateInsertionMode = function updateInsertionMode() {
      // Note: This algorithm was made from scratch and does NOT reflect the
      // HTML5 specification.
      if (insertionPoint === base) {
        if (insertionPoint.lastChild) {
          insertionMode = insertionModes.afterAfterBody;
        } else {
          insertionMode = insertionModes.beforeHtml;
        }
      } else {
        for (var anc = insertionPoint; anc !== base; anc = anc.parentNode) {
          var tn =
              htmlSchema.realToVirtualElementName(anc.tagName).toLowerCase();
          switch (tn) {
            case 'head': insertionMode = insertionModes.inHead; break;
            case 'body': insertionMode = insertionModes.inBody; break;
            case 'html':
              var prevtn = htmlSchema.realToVirtualElementName(
                  (anc.lastChild || {}).tagName).toLowerCase();
              if (prevtn === undefined) {
                insertionMode = insertionModes.beforeHead;
              } else {
                switch (prevtn) {
                  case 'head': insertionMode = insertionModes.afterHead; break;
                  case 'body': insertionMode = insertionModes.afterBody; break;
                }
              }
              break;
            default: break;
          }
        }
      }
    };

    var documentWriter = {
      startDoc: function() {
        // TODO(jasvir): Fix recursive document.write
        if (depth == 0) {
          documentLoaded = Q.defer();
        }
        depth++;
      },
      endDoc: function () {
        depth--;
        if (depth == 0) {
          documentLoaded.resolve(true);
        }
      },
      startTag: function (tagName, attribs, params, marker, continuation) {
        var schemaElem = htmlSchema.element(tagName);
        if (!schemaElem.allowed) {
          // TODO(kpreid): Define the policy in a client-side HTML schema object
          if (tagName === 'script') {
            var scriptSrc = lookupAttr(attribs, 'src');
            if (!scriptSrc) {
              // A script tag without a script src - use child node for source
              cdataContentType = CDATA_SCRIPT;
              pendingExternal = undefined;
            } else {
              cdataContentType = CDATA_SCRIPT;
              pendingExternal = scriptSrc;
            }
            pendingDelayed = !!(lookupAttr(attribs, 'defer')
                                || lookupAttr(attribs, 'async'));
            return; // TODO(kpreid): Remove, allow virtualized element
          } else if (tagName === 'style') {
            cdataContentType = CDATA_STYLE;
            pendingExternal = undefined;
            pendingDelayed = false;
            return; // TODO(kpreid): Remove, allow virtualized element
          } else if (tagName === 'link') {
            // Link types are case insensitive
            var rel = lookupAttr(attribs, 'rel');
            var href = lookupAttr(attribs, 'href');
            var rels = rel ? String(rel).toLowerCase().split(' ') : [];
            if (href && rels.indexOf('stylesheet') >= 0) {
              var res = resolveUriRelativeToDocument(href);
              defineUntrustedExternalStylesheet(res, marker, continuation);
            }
            return; // TODO(kpreid): Remove, allow virtualized element
          } else if (tagName === 'base') {
            var baseHref = lookupAttr(attribs, 'href');
            if (baseHref && domicile) {
              domicile.setBaseUri(resolveUriRelativeToDocument(baseHref));
            }
            return; // TODO(kpreid): Remove, allow virtualized element
          } else if (schemaElem.shouldVirtualize) {
            // virtualization will be handled by normalInsert
          } else {
            // Ignore tags which are unsafe, not to be virtualized, and not
            // handled by one of the above special cases.
            return;
          }
        }
        insertionMode.startTag(tagName, attribs);
      },
      endTag: function (tagName, optional, marker, continuation) {
        // Close any open script or style element element.
        // TODO(kpreid): Move this stuff into the insertion mode logic
        if (cdataContentType) {
          var isScript = cdataContentType === CDATA_SCRIPT;
          cdataContentType = 0;
          if (pendingExternal) {
            if (isScript) {
              var res = resolveUriRelativeToDocument(pendingExternal);
              evaluateUntrustedExternalScript(
                res, marker, continuation, pendingDelayed);
            }
            pendingExternal = undefined;
          } else {
            var content = cdataContent.join("");
            cdataContent.length = 0;
            if (isScript) {
              // TODO: create a script node that does not execute the untrusted
              // script, but that has any ID attribute properly rewritten.
              // It is not horribly uncommon for scripts to look for the last
              // script element as a proxy for the insertion cursor.
              evaluateUntrustedScript(
                domicile.pseudoLocation.href, content, pendingDelayed);
            } else {
              defineUntrustedStylesheet(domicile.pseudoLocation.href, content);
            }
          }
          pendingDelayed = false;
        }
        insertionMode.endTag(tagName);
      },
      pcdata: function (text) {
        insertionMode.text(text);
      },
      cdata: function (text) {
        if (cdataContentType) {
          cdataContent.push(text);
        } else {
          documentWriter.pcdata(text);
        }
      }
    };
    documentWriter.rcdata = documentWriter.pcdata;

    var htmlParser = html.makeSaxParser(documentWriter);

    // Document.write and document.writeln behave as described at
    // http://www.w3.org/TR/2009/WD-html5-20090825/embedded-content-0.html#dom-document-write
    // but with a few differences:
    // (1) all HTML written is sanitized per the opt_domicile's HTML
    //     sanitizer
    // (2) HTML written cannot change where subsequent static HTML is emitted.
    // (3) if the document has been closed (insertion point is undefined) then
    //     the window will not be reopened.  Instead, execution will proceed at
    //     the end of the virtual document.  This is allowed by the spec but
    //     only if the onunload refuses to allow an unload, so we treat the
    //     virtual document as un-unloadable by document.write.
    // (4) document.write cannot be used to inject scripts, so the
    //     "if there is a pending external script" does not apply.
    //     TODO(kpreid): This is going to change in the SES/client-side case.
    /**
     * A tame version of document.write.
     * @param html_varargs according to HTML5, the input to document.write is
     *     varargs, and the HTML is the concatenation of all the arguments.
     */
    var tameDocWrite = function write(html_varargs) {
      // TODO: Do we need to fail early if documentLoaded is undefined.
      var htmlText = concat(arguments);
      if (!insertionPoint) {
        // Handles case 3 where the document has been closed.
        insertionPoint = base;
      }
      if (cdataContentType) {
        // A <script> or <style> element started in one document.write and
        // continues in this one as in
        //   document.write('<script>foo');
        //   document.write('(bar)</script>');
        // so we need to trick the SAX parser into a CDATA context.
        htmlText = (cdataContentType === CDATA_SCRIPT
                    ? '<script>' : '<style>') + htmlText;
      }
      htmlParser(htmlText);
      return documentLoaded.promise;
    };
    domicile.writeHook = cajaVM.def(tameDocWrite);
    domicile.evaluateUntrustedExternalScript =
      cajaVM.def(evaluateUntrustedExternalScript);
  })(opt_domicile);
}

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['HtmlEmitter'] = HtmlEmitter;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * A lexical scannar for CSS3 as defined at http://www.w3.org/TR/css3-syntax .
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 * \@provides lexCss, decodeCss
 * \@overrides window
 */

var lexCss;
var decodeCss;

(function () {

  /**
   * Decodes an escape sequence as specified in CSS3 section 4.1.
   * http://www.w3.org/TR/css3-syntax/#characters
   * @private
   */
  function decodeCssEscape(s) {
    var i = parseInt(s.substring(1), 16);
    // If parseInt didn't find a hex diigt, it returns NaN so return the
    // escaped character.
    // Otherwise, parseInt will stop at the first non-hex digit so there's no
    // need to worry about trailing whitespace.
    if (i > 0xffff) {
      // A supplemental codepoint.
      return i -= 0x10000,
        String.fromCharCode(
            0xd800 + (i >> 10),
            0xdc00 + (i & 0x3FF));
    } else if (i == i) {
      return String.fromCharCode(i);
    } else if (s[1] < ' ') {
      // "a backslash followed by a newline is ignored".
      return '';
    } else {
      return s[1];
    }
  }

  /**
   * Returns an equivalent CSS string literal given plain text: foo -> "foo".
   * @private
   */
  function escapeCssString(s, replacer) {
    return '"' + s.replace(/[\u0000-\u001f\\\"<>]/g, replacer) + '"';
  }

  /**
   * Maps chars to CSS escaped equivalents: "\n" -> "\\a ".
   * @private
   */
  function escapeCssStrChar(ch) {
    return cssStrChars[ch]
        || (cssStrChars[ch] = '\\' + ch.charCodeAt(0).toString(16) + ' ');
  }

  /**
   * Maps chars to URI escaped equivalents: "\n" -> "%0a".
   * @private
   */
  function escapeCssUrlChar(ch) {
    return cssUrlChars[ch]
        || (cssUrlChars[ch] = (ch < '\x10' ? '%0' : '%')
            + ch.charCodeAt(0).toString(16));
  }

  /**
   * Mapping of CSS special characters to escaped equivalents.
   * @private
   */
  var cssStrChars = {
    '\\': '\\\\'
  };

  /**
   * Mapping of CSS special characters to URL-escaped equivalents.
   * @private
   */
  var cssUrlChars = {
    '\\': '%5c'
  };

  // The comments below are copied from the CSS3 module syntax at
  // http://www.w3.org/TR/css3-syntax .
  // These string constants minify out when this is run-through closure
  // compiler.
  // Rules that have been adapted have comments prefixed with "Diff:", and
  // where rules have been combined to avoid back-tracking in the regex engine
  // or to work around limitations, there is a comment prefixed with
  // "NewRule:".

  // In the below, we assume CRLF and CR have been normalize to CR.

  // wc  ::=  #x9 | #xA | #xC | #xD | #x20
  var WC = '[\\t\\n\\f ]';
  // w  ::=  wc*
  var W = WC + '*';
  // nl  ::=  #xA | #xD #xA | #xD | #xC
  var NL = '[\\n\\f]';
  // nonascii  ::=  [#x80-#xD7FF#xE000-#xFFFD#x10000-#x10FFFF]
  // NewRule: Supplemental codepoints are represented as surrogate pairs in JS.
  var SURROGATE_PAIR = '[\\ud800-\\udbff][\\udc00-\\udfff]';
  var NONASCII = '[\\u0080-\\ud7ff\\ue000-\\ufffd]|' + SURROGATE_PAIR;
  // unicode  ::=  '\' [0-9a-fA-F]{1,6} wc?
  // NewRule: No point in having ESCAPE do (\\x|\\y)
  var UNICODE_TAIL = '[0-9a-fA-F]{1,6}' + WC + '?';
  var UNICODE = '\\\\' + UNICODE_TAIL;
  // escape  ::=  unicode
  //           | '\' [#x20-#x7E#x80-#xD7FF#xE000-#xFFFD#x10000-#x10FFFF]
  // NewRule: Below we use escape tail to efficiently match an escape or a
  // line continuation so we can decode string content.
  var ESCAPE_TAIL = '(?:' + UNICODE_TAIL
      + '|[\\u0020-\\u007e\\u0080-\\ud7ff\\ue000\\ufffd]|'
      + SURROGATE_PAIR + ')';
  var ESCAPE = '\\\\' + ESCAPE_TAIL;
  // urlchar  ::=  [#x9#x21#x23-#x26#x28-#x7E] | nonascii | escape
  var URLCHAR = '(?:[\\t\\x21\\x23-\\x26\\x28-\\x5b\\x5d-\\x7e]|'
      + NONASCII + '|' + ESCAPE + ')';
  // stringchar  ::= urlchar | #x20 | '\' nl
  // We ignore mismatched surrogate pairs inside strings, so stringchar
  // simplifies to a non-(quote|newline|backslash) or backslash any.
  // Since we normalize CRLF to a single code-unit, there is no special
  // handling needed for '\\' + CRLF.
  var STRINGCHAR = '[^\'"\\n\\f\\\\]|\\\\[\\s\\S]';
  // string  ::=  '"' (stringchar | "'")* '"' | "'" (stringchar | '"')* "'"
  var STRING = '"(?:\'|' + STRINGCHAR + ')*"'
      + '|\'(?:\"|' + STRINGCHAR + ')*\'';
  // num  ::=  [0-9]+ | [0-9]* '.' [0-9]+
  // Diff: We attach signs to num tokens.
  var NUM = '[-+]?(?:[0-9]+(?:[.][0-9]+)?|[.][0-9]+)';
  // nmstart  ::=  [a-zA-Z] | '_' | nonascii | escape
  var NMSTART = '(?:[a-zA-Z_]|' + NONASCII + '|' + ESCAPE + ')';
  // nmchar  ::=  [a-zA-Z0-9] | '-' | '_' | nonascii | escape
  var NMCHAR = '(?:[a-zA-Z0-9_-]|' + NONASCII + '|' + ESCAPE + ')';
  // name  ::=  nmchar+
  var NAME = NMCHAR + '+';
  // ident  ::=  '-'? nmstart nmchar*
  var IDENT = '-?' + NMSTART + NMCHAR + '*';

  // ATKEYWORD  ::=  '@' ident
  var ATKEYWORD = '@' + IDENT;
  // HASH  ::=  '#' name
  var HASH = '#' + NAME;
  // NUMBER  ::=  num
  var NUMBER = NUM;

  // NewRule: union of IDENT, ATKEYWORD, HASH, but excluding #[0-9].
  var WORD_TERM = '(?:@?-?' + NMSTART + '|#)' + NMCHAR + '*';

  // PERCENTAGE  ::=  num '%'
  var PERCENTAGE = NUM + '%';
  // DIMENSION  ::=  num ident
  var DIMENSION = NUM + IDENT;
  var NUMERIC_VALUE = NUM + '(?:%|' + IDENT + ')?';
  // URI  ::=  "url(" w (string | urlchar* ) w ")"
  var URI = 'url[(]' + W + '(?:' + STRING + '|' + URLCHAR + '*)' + W + '[)]';
  // UNICODE-RANGE  ::=  "U+" [0-9A-F?]{1,6} ('-' [0-9A-F]{1,6})?
  var UNICODE_RANGE = 'U[+][0-9A-F?]{1,6}(?:-[0-9A-F]{1,6})?';
  // CDO  ::=  "<\!--"
  var CDO = '<\!--';
  // CDC  ::=  "-->"
  var CDC = '-->';
  // S  ::=  wc+
  var S = WC + '+';
  // COMMENT  ::=  "/*" [^*]* '*'+ ([^/] [^*]* '*'+)* "/"
  // Diff: recognizes // comments.
  var COMMENT = '/(?:[*][^*]*[*]+(?:[^/][^*]*[*]+)*/|/[^\\n\\f]*)';
  // FUNCTION  ::=  ident '('
  // Diff: We exclude url explicitly.
  // TODO: should we be tolerant of "fn ("?
  var FUNCTION = '(?!url[(])' + IDENT + '[(]';
  // INCLUDES  ::=  "~="
  var INCLUDES = '~=';
  // DASHMATCH  ::=  "|="
  var DASHMATCH = '[|]=';
  // PREFIXMATCH  ::=  "^="
  var PREFIXMATCH = '[^]=';
  // SUFFIXMATCH  ::=  "$="
  var SUFFIXMATCH = '[$]=';
  // SUBSTRINGMATCH  ::=  "*="
  var SUBSTRINGMATCH = '[*]=';
  // NewRule: one rule for all the comparison operators.
  var CMP_OPS = '[~|^$*]=';
  // CHAR  ::=  any character not matched by the above rules, except for " or '
  // Diff: We exclude / and \ since they are handled above to prevent
  // /* without a following */ from combining when comments are concatenated.
  var CHAR = '[^"\'\\\\/]|/(?![/*])';
  // BOM  ::=  #xFEFF
  var BOM = '\\uFEFF';

  var CSS_TOKEN = new RegExp([
      BOM, UNICODE_RANGE, URI, FUNCTION, WORD_TERM, STRING, NUMERIC_VALUE,
      CDO, CDC, S, COMMENT, CMP_OPS, CHAR].join("|"), 'gi');

  /**
   * Decodes CSS escape sequences in a CSS string body.
   */
   decodeCss = function (css) {
     return css.replace(
         new RegExp('\\\\(?:' + ESCAPE_TAIL + '|' + NL + ')', 'g'),
         decodeCssEscape);
   };

  /**
   * Given CSS Text, returns an array of normalized tokens.
   * @param {string} cssText
   * @return {Array.<string>} tokens where all ignorable token sequences have
   *    been reduced to a single {@code " "} and all strings and
   *    {@code url(...)} tokens have been normalized to use double quotes as
   *    delimiters and to not otherwise contain double quotes.
   */
  lexCss = function (cssText) {
    cssText = '' + cssText;
    var tokens = cssText.replace(/\r\n?/g, '\n')  // Normalize CRLF & CR to LF.
        .match(CSS_TOKEN) || [];
    var j = 0;
    var last = ' ';
    for (var i = 0, n = tokens.length; i < n; ++i) {
      // Normalize all escape sequences.  We will have to re-escape some
      // codepoints in string and url(...) bodies but we already know the
      // boundaries.
      // We might mistakenly treat a malformed identifier like \22\20\22 as a
      // string, but that will not break any valid stylesheets since we requote
      // and re-escape in string below.
      var tok = decodeCss(tokens[i]);
      var len = tok.length;
      var cc = tok.charCodeAt(0);
      tok =
          // All strings should be double quoted, and the body should never
          // contain a double quote.
          (cc == '"'.charCodeAt(0) || cc == '\''.charCodeAt(0))
          ? escapeCssString(tok.substring(1, len - 1), escapeCssStrChar)
          // A breaking ignorable token should is replaced with a single space.
          : (cc == '/'.charCodeAt(0) && len > 1  // Comment.
             || tok == '\\' || tok == CDC || tok == CDO || tok == '\ufeff'
             // Characters in W.
             || cc <= ' '.charCodeAt(0))
          ? ' '
          // Make sure that all url(...)s are double quoted.
          : /url\(/i.test(tok)
          ? 'url(' + escapeCssString(
            tok.replace(
                new RegExp('^url\\(' + W + '["\']?|["\']?' + W + '\\)$', 'gi'),
                ''),
            escapeCssUrlChar)
            + ')'
          // Escapes in identifier like tokens will have been normalized above.
          : tok;
      // Merge adjacent space tokens.
      if (last != tok || tok != ' ') {
        tokens[j++] = last = tok;
      }
    }
    tokens.length = j;
    return tokens;
  };
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['lexCss'] = lexCss;
  window['decodeCss'] = decodeCss;
}
;
// Copyright (C) 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Implements RFC 3986 for parsing/formatting URIs.
 *
 * @author mikesamuel@gmail.com
 * \@provides URI
 * \@overrides window
 */

var URI = (function () {

/**
 * creates a uri from the string form.  The parser is relaxed, so special
 * characters that aren't escaped but don't cause ambiguities will not cause
 * parse failures.
 *
 * @return {URI|null}
 */
function parse(uriStr) {
  var m = ('' + uriStr).match(URI_RE_);
  if (!m) { return null; }
  return new URI(
      nullIfAbsent(m[1]),
      nullIfAbsent(m[2]),
      nullIfAbsent(m[3]),
      nullIfAbsent(m[4]),
      nullIfAbsent(m[5]),
      nullIfAbsent(m[6]),
      nullIfAbsent(m[7]));
}


/**
 * creates a uri from the given parts.
 *
 * @param scheme {string} an unencoded scheme such as "http" or null
 * @param credentials {string} unencoded user credentials or null
 * @param domain {string} an unencoded domain name or null
 * @param port {number} a port number in [1, 32768].
 *    -1 indicates no port, as does null.
 * @param path {string} an unencoded path
 * @param query {Array.<string>|string|null} a list of unencoded cgi
 *   parameters where even values are keys and odds the corresponding values
 *   or an unencoded query.
 * @param fragment {string} an unencoded fragment without the "#" or null.
 * @return {URI}
 */
function create(scheme, credentials, domain, port, path, query, fragment) {
  var uri = new URI(
      encodeIfExists2(scheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),
      encodeIfExists2(
          credentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),
      encodeIfExists(domain),
      port > 0 ? port.toString() : null,
      encodeIfExists2(path, URI_DISALLOWED_IN_PATH_),
      null,
      encodeIfExists(fragment));
  if (query) {
    if ('string' === typeof query) {
      uri.setRawQuery(query.replace(/[^?&=0-9A-Za-z_\-~.%]/g, encodeOne));
    } else {
      uri.setAllParameters(query);
    }
  }
  return uri;
}
function encodeIfExists(unescapedPart) {
  if ('string' == typeof unescapedPart) {
    return encodeURIComponent(unescapedPart);
  }
  return null;
};
/**
 * if unescapedPart is non null, then escapes any characters in it that aren't
 * valid characters in a url and also escapes any special characters that
 * appear in extra.
 *
 * @param unescapedPart {string}
 * @param extra {RegExp} a character set of characters in [\01-\177].
 * @return {string|null} null iff unescapedPart == null.
 */
function encodeIfExists2(unescapedPart, extra) {
  if ('string' == typeof unescapedPart) {
    return encodeURI(unescapedPart).replace(extra, encodeOne);
  }
  return null;
};
/** converts a character in [\01-\177] to its url encoded equivalent. */
function encodeOne(ch) {
  var n = ch.charCodeAt(0);
  return '%' + '0123456789ABCDEF'.charAt((n >> 4) & 0xf) +
      '0123456789ABCDEF'.charAt(n & 0xf);
}

/**
 * {@updoc
 *  $ normPath('foo/./bar')
 *  # 'foo/bar'
 *  $ normPath('./foo')
 *  # 'foo'
 *  $ normPath('foo/.')
 *  # 'foo'
 *  $ normPath('foo//bar')
 *  # 'foo/bar'
 * }
 */
function normPath(path) {
  return path.replace(/(^|\/)\.(?:\/|$)/g, '$1').replace(/\/{2,}/g, '/');
}

var PARENT_DIRECTORY_HANDLER = new RegExp(
    ''
    // A path break
    + '(/|^)'
    // followed by a non .. path element
    // (cannot be . because normPath is used prior to this RegExp)
    + '(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)'
    // followed by .. followed by a path break.
    + '/\\.\\.(?:/|$)');

var PARENT_DIRECTORY_HANDLER_RE = new RegExp(PARENT_DIRECTORY_HANDLER);

var EXTRA_PARENT_PATHS_RE = /^(?:\.\.\/)*(?:\.\.$)?/;

/**
 * Normalizes its input path and collapses all . and .. sequences except for
 * .. sequences that would take it above the root of the current parent
 * directory.
 * {@updoc
 *  $ collapse_dots('foo/../bar')
 *  # 'bar'
 *  $ collapse_dots('foo/./bar')
 *  # 'foo/bar'
 *  $ collapse_dots('foo/../bar/./../../baz')
 *  # 'baz'
 *  $ collapse_dots('../foo')
 *  # '../foo'
 *  $ collapse_dots('../foo').replace(EXTRA_PARENT_PATHS_RE, '')
 *  # 'foo'
 * }
 */
function collapse_dots(path) {
  if (path === null) { return null; }
  var p = normPath(path);
  // Only /../ left to flatten
  var r = PARENT_DIRECTORY_HANDLER_RE;
  // We replace with $1 which matches a / before the .. because this
  // guarantees that:
  // (1) we have at most 1 / between the adjacent place,
  // (2) always have a slash if there is a preceding path section, and
  // (3) we never turn a relative path into an absolute path.
  for (var q; (q = p.replace(r, '$1')) != p; p = q) {};
  return p;
}

/**
 * resolves a relative url string to a base uri.
 * @return {URI}
 */
function resolve(baseUri, relativeUri) {
  // there are several kinds of relative urls:
  // 1. //foo - replaces everything from the domain on.  foo is a domain name
  // 2. foo - replaces the last part of the path, the whole query and fragment
  // 3. /foo - replaces the the path, the query and fragment
  // 4. ?foo - replace the query and fragment
  // 5. #foo - replace the fragment only

  var absoluteUri = baseUri.clone();
  // we satisfy these conditions by looking for the first part of relativeUri
  // that is not blank and applying defaults to the rest

  var overridden = relativeUri.hasScheme();

  if (overridden) {
    absoluteUri.setRawScheme(relativeUri.getRawScheme());
  } else {
    overridden = relativeUri.hasCredentials();
  }

  if (overridden) {
    absoluteUri.setRawCredentials(relativeUri.getRawCredentials());
  } else {
    overridden = relativeUri.hasDomain();
  }

  if (overridden) {
    absoluteUri.setRawDomain(relativeUri.getRawDomain());
  } else {
    overridden = relativeUri.hasPort();
  }

  var rawPath = relativeUri.getRawPath();
  var simplifiedPath = collapse_dots(rawPath);
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
    simplifiedPath = simplifiedPath
        && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
  } else {
    overridden = !!rawPath;
    if (overridden) {
      // resolve path properly
      if (simplifiedPath.charCodeAt(0) !== 0x2f /* / */) {  // path is relative
        var absRawPath = collapse_dots(absoluteUri.getRawPath() || '')
            .replace(EXTRA_PARENT_PATHS_RE, '');
        var slash = absRawPath.lastIndexOf('/') + 1;
        simplifiedPath = collapse_dots(
            (slash ? absRawPath.substring(0, slash) : '')
            + collapse_dots(rawPath))
            .replace(EXTRA_PARENT_PATHS_RE, '');
      }
    } else {
      simplifiedPath = simplifiedPath
          && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
      if (simplifiedPath !== rawPath) {
        absoluteUri.setRawPath(simplifiedPath);
      }
    }
  }

  if (overridden) {
    absoluteUri.setRawPath(simplifiedPath);
  } else {
    overridden = relativeUri.hasQuery();
  }

  if (overridden) {
    absoluteUri.setRawQuery(relativeUri.getRawQuery());
  } else {
    overridden = relativeUri.hasFragment();
  }

  if (overridden) {
    absoluteUri.setRawFragment(relativeUri.getRawFragment());
  }

  return absoluteUri;
}

/**
 * a mutable URI.
 *
 * This class contains setters and getters for the parts of the URI.
 * The <tt>getXYZ</tt>/<tt>setXYZ</tt> methods return the decoded part -- so
 * <code>uri.parse('/foo%20bar').getPath()</code> will return the decoded path,
 * <tt>/foo bar</tt>.
 *
 * <p>The raw versions of fields are available too.
 * <code>uri.parse('/foo%20bar').getRawPath()</code> will return the raw path,
 * <tt>/foo%20bar</tt>.  Use the raw setters with care, since
 * <code>URI::toString</code> is not guaranteed to return a valid url if a
 * raw setter was used.
 *
 * <p>All setters return <tt>this</tt> and so may be chained, a la
 * <code>uri.parse('/foo').setFragment('part').toString()</code>.
 *
 * <p>You should not use this constructor directly -- please prefer the factory
 * functions {@link uri.parse}, {@link uri.create}, {@link uri.resolve}
 * instead.</p>
 *
 * <p>The parameters are all raw (assumed to be properly escaped) parts, and
 * any (but not all) may be null.  Undefined is not allowed.</p>
 *
 * @constructor
 */
function URI(
    rawScheme,
    rawCredentials, rawDomain, port,
    rawPath, rawQuery, rawFragment) {
  this.scheme_ = rawScheme;
  this.credentials_ = rawCredentials;
  this.domain_ = rawDomain;
  this.port_ = port;
  this.path_ = rawPath;
  this.query_ = rawQuery;
  this.fragment_ = rawFragment;
  /**
   * @type {Array|null}
   */
  this.paramCache_ = null;
}

/** returns the string form of the url. */
URI.prototype.toString = function () {
  var out = [];
  if (null !== this.scheme_) { out.push(this.scheme_, ':'); }
  if (null !== this.domain_) {
    out.push('//');
    if (null !== this.credentials_) { out.push(this.credentials_, '@'); }
    out.push(this.domain_);
    if (null !== this.port_) { out.push(':', this.port_.toString()); }
  }
  if (null !== this.path_) { out.push(this.path_); }
  if (null !== this.query_) { out.push('?', this.query_); }
  if (null !== this.fragment_) { out.push('#', this.fragment_); }
  return out.join('');
};

URI.prototype.clone = function () {
  return new URI(this.scheme_, this.credentials_, this.domain_, this.port_,
                 this.path_, this.query_, this.fragment_);
};

URI.prototype.getScheme = function () {
  return this.scheme_ && decodeURIComponent(this.scheme_);
};
URI.prototype.getRawScheme = function () {
  return this.scheme_;
};
URI.prototype.setScheme = function (newScheme) {
  this.scheme_ = encodeIfExists2(
      newScheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);
  return this;
};
URI.prototype.setRawScheme = function (newScheme) {
  this.scheme_ = newScheme ? newScheme : null;
  return this;
};
URI.prototype.hasScheme = function () {
  return null !== this.scheme_;
};


URI.prototype.getCredentials = function () {
  return this.credentials_ && decodeURIComponent(this.credentials_);
};
URI.prototype.getRawCredentials = function () {
  return this.credentials_;
};
URI.prototype.setCredentials = function (newCredentials) {
  this.credentials_ = encodeIfExists2(
      newCredentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);

  return this;
};
URI.prototype.setRawCredentials = function (newCredentials) {
  this.credentials_ = newCredentials ? newCredentials : null;
  return this;
};
URI.prototype.hasCredentials = function () {
  return null !== this.credentials_;
};


URI.prototype.getDomain = function () {
  return this.domain_ && decodeURIComponent(this.domain_);
};
URI.prototype.getRawDomain = function () {
  return this.domain_;
};
URI.prototype.setDomain = function (newDomain) {
  return this.setRawDomain(newDomain && encodeURIComponent(newDomain));
};
URI.prototype.setRawDomain = function (newDomain) {
  this.domain_ = newDomain ? newDomain : null;
  // Maintain the invariant that paths must start with a slash when the URI
  // is not path-relative.
  return this.setRawPath(this.path_);
};
URI.prototype.hasDomain = function () {
  return null !== this.domain_;
};


URI.prototype.getPort = function () {
  return this.port_ && decodeURIComponent(this.port_);
};
URI.prototype.setPort = function (newPort) {
  if (newPort) {
    newPort = Number(newPort);
    if (newPort !== (newPort & 0xffff)) {
      throw new Error('Bad port number ' + newPort);
    }
    this.port_ = '' + newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
URI.prototype.hasPort = function () {
  return null !== this.port_;
};


URI.prototype.getPath = function () {
  return this.path_ && decodeURIComponent(this.path_);
};
URI.prototype.getRawPath = function () {
  return this.path_;
};
URI.prototype.setPath = function (newPath) {
  return this.setRawPath(encodeIfExists2(newPath, URI_DISALLOWED_IN_PATH_));
};
URI.prototype.setRawPath = function (newPath) {
  if (newPath) {
    newPath = String(newPath);
    this.path_ = 
      // Paths must start with '/' unless this is a path-relative URL.
      (!this.domain_ || /^\//.test(newPath)) ? newPath : '/' + newPath;
  } else {
    this.path_ = null;
  }
  return this;
};
URI.prototype.hasPath = function () {
  return null !== this.path_;
};


URI.prototype.getQuery = function () {
  // From http://www.w3.org/Addressing/URL/4_URI_Recommentations.html
  // Within the query string, the plus sign is reserved as shorthand notation
  // for a space.
  return this.query_ && decodeURIComponent(this.query_).replace(/\+/g, ' ');
};
URI.prototype.getRawQuery = function () {
  return this.query_;
};
URI.prototype.setQuery = function (newQuery) {
  this.paramCache_ = null;
  this.query_ = encodeIfExists(newQuery);
  return this;
};
URI.prototype.setRawQuery = function (newQuery) {
  this.paramCache_ = null;
  this.query_ = newQuery ? newQuery : null;
  return this;
};
URI.prototype.hasQuery = function () {
  return null !== this.query_;
};

/**
 * sets the query given a list of strings of the form
 * [ key0, value0, key1, value1, ... ].
 *
 * <p><code>uri.setAllParameters(['a', 'b', 'c', 'd']).getQuery()</code>
 * will yield <code>'a=b&c=d'</code>.
 */
URI.prototype.setAllParameters = function (params) {
  if (typeof params === 'object') {
    if (!(params instanceof Array)
        && (params instanceof Object
            || Object.prototype.toString.call(params) !== '[object Array]')) {
      var newParams = [];
      var i = -1;
      for (var k in params) {
        var v = params[k];
        if ('string' === typeof v) {
          newParams[++i] = k;
          newParams[++i] = v;
        }
      }
      params = newParams;
    }
  }
  this.paramCache_ = null;
  var queryBuf = [];
  var separator = '';
  for (var j = 0; j < params.length;) {
    var k = params[j++];
    var v = params[j++];
    queryBuf.push(separator, encodeURIComponent(k.toString()));
    separator = '&';
    if (v) {
      queryBuf.push('=', encodeURIComponent(v.toString()));
    }
  }
  this.query_ = queryBuf.join('');
  return this;
};
URI.prototype.checkParameterCache_ = function () {
  if (!this.paramCache_) {
    var q = this.query_;
    if (!q) {
      this.paramCache_ = [];
    } else {
      var cgiParams = q.split(/[&\?]/);
      var out = [];
      var k = -1;
      for (var i = 0; i < cgiParams.length; ++i) {
        var m = cgiParams[i].match(/^([^=]*)(?:=(.*))?$/);
        // From http://www.w3.org/Addressing/URL/4_URI_Recommentations.html
        // Within the query string, the plus sign is reserved as shorthand
        // notation for a space.
        out[++k] = decodeURIComponent(m[1]).replace(/\+/g, ' ');
        out[++k] = decodeURIComponent(m[2] || '').replace(/\+/g, ' ');
      }
      this.paramCache_ = out;
    }
  }
};
/**
 * sets the values of the named cgi parameters.
 *
 * <p>So, <code>uri.parse('foo?a=b&c=d&e=f').setParameterValues('c', ['new'])
 * </code> yields <tt>foo?a=b&c=new&e=f</tt>.</p>
 *
 * @param key {string}
 * @param values {Array.<string>} the new values.  If values is a single string
 *   then it will be treated as the sole value.
 */
URI.prototype.setParameterValues = function (key, values) {
  // be nice and avoid subtle bugs where [] operator on string performs charAt
  // on some browsers and crashes on IE
  if (typeof values === 'string') {
    values = [ values ];
  }

  this.checkParameterCache_();
  var newValueIndex = 0;
  var pc = this.paramCache_;
  var params = [];
  for (var i = 0, k = 0; i < pc.length; i += 2) {
    if (key === pc[i]) {
      if (newValueIndex < values.length) {
        params.push(key, values[newValueIndex++]);
      }
    } else {
      params.push(pc[i], pc[i + 1]);
    }
  }
  while (newValueIndex < values.length) {
    params.push(key, values[newValueIndex++]);
  }
  this.setAllParameters(params);
  return this;
};
URI.prototype.removeParameter = function (key) {
  return this.setParameterValues(key, []);
};
/**
 * returns the parameters specified in the query part of the uri as a list of
 * keys and values like [ key0, value0, key1, value1, ... ].
 *
 * @return {Array.<string>}
 */
URI.prototype.getAllParameters = function () {
  this.checkParameterCache_();
  return this.paramCache_.slice(0, this.paramCache_.length);
};
/**
 * returns the value<b>s</b> for a given cgi parameter as a list of decoded
 * query parameter values.
 * @return {Array.<string>}
 */
URI.prototype.getParameterValues = function (paramNameUnescaped) {
  this.checkParameterCache_();
  var values = [];
  for (var i = 0; i < this.paramCache_.length; i += 2) {
    if (paramNameUnescaped === this.paramCache_[i]) {
      values.push(this.paramCache_[i + 1]);
    }
  }
  return values;
};
/**
 * returns a map of cgi parameter names to (non-empty) lists of values.
 * @return {Object.<string,Array.<string>>}
 */
URI.prototype.getParameterMap = function (paramNameUnescaped) {
  this.checkParameterCache_();
  var paramMap = {};
  for (var i = 0; i < this.paramCache_.length; i += 2) {
    var key = this.paramCache_[i++],
      value = this.paramCache_[i++];
    if (!(key in paramMap)) {
      paramMap[key] = [value];
    } else {
      paramMap[key].push(value);
    }
  }
  return paramMap;
};
/**
 * returns the first value for a given cgi parameter or null if the given
 * parameter name does not appear in the query string.
 * If the given parameter name does appear, but has no '<tt>=</tt>' following
 * it, then the empty string will be returned.
 * @return {string|null}
 */
URI.prototype.getParameterValue = function (paramNameUnescaped) {
  this.checkParameterCache_();
  for (var i = 0; i < this.paramCache_.length; i += 2) {
    if (paramNameUnescaped === this.paramCache_[i]) {
      return this.paramCache_[i + 1];
    }
  }
  return null;
};

URI.prototype.getFragment = function () {
  return this.fragment_ && decodeURIComponent(this.fragment_);
};
URI.prototype.getRawFragment = function () {
  return this.fragment_;
};
URI.prototype.setFragment = function (newFragment) {
  this.fragment_ = newFragment ? encodeURIComponent(newFragment) : null;
  return this;
};
URI.prototype.setRawFragment = function (newFragment) {
  this.fragment_ = newFragment ? newFragment : null;
  return this;
};
URI.prototype.hasFragment = function () {
  return null !== this.fragment_;
};

function nullIfAbsent(matchPart) {
  return ('string' == typeof matchPart) && (matchPart.length > 0)
         ? matchPart
         : null;
}




/**
 * a regular expression for breaking a URI into its component parts.
 *
 * <p>http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234 says
 * As the "first-match-wins" algorithm is identical to the "greedy"
 * disambiguation method used by POSIX regular expressions, it is natural and
 * commonplace to use a regular expression for parsing the potential five
 * components of a URI reference.
 *
 * <p>The following line is the regular expression for breaking-down a
 * well-formed URI reference into its components.
 *
 * <pre>
 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
 *  12            3  4          5       6  7        8 9
 * </pre>
 *
 * <p>The numbers in the second line above are only to assist readability; they
 * indicate the reference points for each subexpression (i.e., each paired
 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
 * For example, matching the above expression to
 * <pre>
 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
 * </pre>
 * results in the following subexpression matches:
 * <pre>
 *    $1 = http:
 *    $2 = http
 *    $3 = //www.ics.uci.edu
 *    $4 = www.ics.uci.edu
 *    $5 = /pub/ietf/uri/
 *    $6 = <undefined>
 *    $7 = <undefined>
 *    $8 = #Related
 *    $9 = Related
 * </pre>
 * where <undefined> indicates that the component is not present, as is the
 * case for the query component in the above example. Therefore, we can
 * determine the value of the five components as
 * <pre>
 *    scheme    = $2
 *    authority = $4
 *    path      = $5
 *    query     = $7
 *    fragment  = $9
 * </pre>
 *
 * <p>msamuel: I have modified the regular expression slightly to expose the
 * credentials, domain, and port separately from the authority.
 * The modified version yields
 * <pre>
 *    $1 = http              scheme
 *    $2 = <undefined>       credentials -\
 *    $3 = www.ics.uci.edu   domain       | authority
 *    $4 = <undefined>       port        -/
 *    $5 = /pub/ietf/uri/    path
 *    $6 = <undefined>       query without ?
 *    $7 = Related           fragment without #
 * </pre>
 */
var URI_RE_ = new RegExp(
      "^" +
      "(?:" +
        "([^:/?#]+)" +         // scheme
      ":)?" +
      "(?://" +
        "(?:([^/?#]*)@)?" +    // credentials
        "([^/?#:@]*)" +        // domain
        "(?::([0-9]+))?" +     // port
      ")?" +
      "([^?#]+)?" +            // path
      "(?:\\?([^#]*))?" +      // query
      "(?:#(.*))?" +           // fragment
      "$"
      );

var URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_ = /[#\/\?@]/g;
var URI_DISALLOWED_IN_PATH_ = /[\#\?]/g;

URI.parse = parse;
URI.create = create;
URI.resolve = resolve;
URI.collapse_dots = collapse_dots;  // Visible for testing.

// lightweight string-based api for loadModuleMaker
URI.utils = {
  mimeTypeOf: function (uri) {
    var uriObj = parse(uri);
    if (/\.html$/.test(uriObj.getPath())) {
      return 'text/html';
    } else {
      return 'application/javascript';
    }
  },
  resolve: function (base, uri) {
    if (base) {
      return resolve(parse(base), parse(uri)).toString();
    } else {
      return '' + uri;
    }
  }
};


return URI;
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['URI'] = URI;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * JavaScript support for client-side CSS sanitization.
 * The CSS property schema API is defined in CssPropertyPatterns.java which
 * is used to generate css-defs.js.
 *
 * @author mikesamuel@gmail.com
 * \@requires CSS_PROP_BIT_ALLOWED_IN_LINK
 * \@requires CSS_PROP_BIT_HASH_VALUE
 * \@requires CSS_PROP_BIT_NEGATIVE_QUANTITY
 * \@requires CSS_PROP_BIT_QSTRING_CONTENT
 * \@requires CSS_PROP_BIT_QSTRING_URL
 * \@requires CSS_PROP_BIT_QUANTITY
 * \@requires CSS_PROP_BIT_Z_INDEX
 * \@requires cssSchema
 * \@requires decodeCss
 * \@requires URI
 * \@overrides window
 * \@requires parseCssStylesheet
 * \@provides sanitizeCssProperty
 * \@provides sanitizeCssSelectors
 * \@provides sanitizeStylesheet
 */

/**
 * Given a series of normalized CSS tokens, applies a property schema, as
 * defined in CssPropertyPatterns.java, and sanitizes the tokens in place.
 * @param property a property name.
 * @param propertySchema a property of cssSchema as defined by
 *    CssPropertyPatterns.java
 * @param tokens as parsed by lexCss.  Modified in place.
 * @param opt_naiveUriRewriter a URI rewriter; an object with a "rewrite"
 *     function that takes a URL and returns a safe URL.
 * @param opt_baseURI baseUri; uri against which all relative urls in this
 *     style will be resolved
 */
var sanitizeCssProperty = (function () {
  var NOEFFECT_URL = 'url("about:blank")';
  /**
   * The set of characters that need to be normalized inside url("...").
   * We normalize newlines because they are not allowed inside quoted strings,
   * normalize quote characters, angle-brackets, and asterisks because they
   * could be used to break out of the URL or introduce targets for CSS
   * error recovery.  We normalize parentheses since they delimit unquoted
   * URLs and calls and could be a target for error recovery.
   */
  var NORM_URL_REGEXP = /[\n\f\r\"\'()*<>]/g;
  /** The replacements for NORM_URL_REGEXP. */
  var NORM_URL_REPLACEMENTS = {
    '\n': '%0a',
    '\f': '%0c',
    '\r': '%0d',
    '"':  '%22',
    '\'': '%27',
    '(':  '%28',
    ')':  '%29',
    '*':  '%2a',
    '<':  '%3c',
    '>':  '%3e'
  };


  function normalizeUrl(s) {
    if ('string' === typeof s) {
      return 'url("' + s.replace(NORM_URL_REGEXP, normalizeUrlChar) + '")';
    } else {
      return NOEFFECT_URL;
    }
  }
  function normalizeUrlChar(ch) {
    return NORM_URL_REPLACEMENTS[ch];
  }

  // From RFC3986
  var URI_SCHEME_RE = new RegExp(
      '^' +
      '(?:' +
        '([^:\/?# ]+)' +         // scheme
      ':)?'
  );

  var ALLOWED_URI_SCHEMES = /^(?:https?|mailto)$/i;

  function resolveUri(baseUri, uri) {
    if (baseUri) {
      return URI.utils.resolve(baseUri, uri);
    }
    return uri;
  }

  function safeUri(uri, prop, naiveUriRewriter) {
    if (!naiveUriRewriter) { return null; }
    var parsed = ('' + uri).match(URI_SCHEME_RE);
    if (parsed && (!parsed[1] || ALLOWED_URI_SCHEMES.test(parsed[1]))) {
      return naiveUriRewriter(uri, prop);
    } else {
      return null;
    }
  }

  function unionArrays(arrs) {
    var map = {};
    for (var i = arrs.length; --i >= 0;) {
      var arr = arrs[i];
      for (var j = arr.length; --j >= 0;) {
        map[arr[j]] = ALLOWED_LITERAL;
      }
    }
    return map;
  }

  /**
   * Normalize tokens within a function call they can match against
   * cssSchema[propName].cssExtra.
   * @return the exclusive end in tokens of the function call.
   */
  function normalizeFunctionCall(tokens, start) {
    var parenDepth = 1, end = start + 1, n = tokens.length;
    while (end < n && parenDepth) {
      // TODO: Can URLs appear in functions?
      var token = tokens[end++];
      parenDepth += (token === '(' ? 1 : token === ')' ? -1 : 0);
    }
    return end;
  }

  // Used as map value to avoid hasOwnProperty checks.
  var ALLOWED_LITERAL = {};

  return function (property, propertySchema, tokens,
    opt_naiveUriRewriter, opt_baseUri) {
    var propBits = propertySchema.cssPropBits;
    // Used to determine whether to treat quoted strings as URLs or
    // plain text content, and whether unrecognized keywords can be quoted
    // to treate ['Arial', 'Black'] equivalently to ['"Arial Black"'].
    var qstringBits = propBits & (
        CSS_PROP_BIT_QSTRING_CONTENT | CSS_PROP_BIT_QSTRING_URL);
    // TODO(mikesamuel): Figure out what to do with props like
    // content that admit both URLs and strings.

    // Used to join unquoted keywords into a single quoted string.
    var lastQuoted = NaN;
    var i = 0, k = 0;
    for (;i < tokens.length; ++i) {
      // Has the effect of normalizing hex digits, keywords,
      // and function names.
      var token = tokens[i].toLowerCase();
      var cc = token.charCodeAt(0), cc1, cc2, isnum1, isnum2, end;
      var litGroup, litMap;
      token = (
        // Strip out spaces.  Normally cssparser.js dumps these, but we
        // strip them out in case the content doesn't come via cssparser.js.
        (cc === ' '.charCodeAt(0)) ? ''
        : (cc === '"'.charCodeAt(0)) ? (  // Quoted string.
          (qstringBits === CSS_PROP_BIT_QSTRING_URL && opt_naiveUriRewriter)
          // Sanitize and convert to url("...") syntax.
          // Treat url content as case-sensitive.
          ? (normalizeUrl(safeUri(resolveUri(opt_baseUri,
                decodeCss(tokens[i].substring(1, token.length - 1))),
                property,
                opt_naiveUriRewriter)))
          // Drop if plain text content strings not allowed.
          : (qstringBits === CSS_PROP_BIT_QSTRING_CONTENT) ? token : '')
        // Preserve hash color literals if allowed.
        : (cc === '#'.charCodeAt(0) && /^#(?:[0-9a-f]{3}){1,2}$/.test(token))
        ? (propBits & CSS_PROP_BIT_HASH_VALUE ? token : '')
        : ('0'.charCodeAt(0) <= cc && cc <= '9'.charCodeAt(0))
        // A number starting with a digit.
        ? ((propBits & CSS_PROP_BIT_QUANTITY)
          ? ((propBits & CSS_PROP_BIT_Z_INDEX)
            ? (token.match(/^\d{1,7}$/) ? token : '')
            : token)
          : '')
        // Normalize quantities so they don't start with a '.' or '+' sign and
        // make sure they all have an integer component so can't be confused
        // with a dotted identifier.
        // This can't be done in the lexer since ".4" is a valid rule part.
        : (cc1 = token.charCodeAt(1),
           cc2 = token.charCodeAt(2),
           isnum1 = '0'.charCodeAt(0) <= cc1 && cc1 <= '9'.charCodeAt(0),
           isnum2 = '0'.charCodeAt(0) <= cc2 && cc2 <= '9'.charCodeAt(0),
           // +.5 -> 0.5 if allowed.
           (cc === '+'.charCodeAt(0)
            && (isnum1 || (cc1 === '.'.charCodeAt(0) && isnum2))))
          ? ((propBits & CSS_PROP_BIT_QUANTITY)
            ? ((propBits & CSS_PROP_BIT_Z_INDEX)
              ? (token.match(/^\+\d{1,7}$/) ? token : '')
              : ((isnum1 ? '' : '0') + token.substring(1)))
            : '')
        // -.5 -> -0.5 if allowed otherwise -> 0 if quantities allowed.
        : (cc === '-'.charCodeAt(0)
           && (isnum1 || (cc1 === '.'.charCodeAt(0) && isnum2)))
          ? ((propBits & CSS_PROP_BIT_NEGATIVE_QUANTITY)
             ? ((propBits & CSS_PROP_BIT_Z_INDEX)
               ? (token.match(/^\-\d{1,7}$/) ? token : '')
               : ((isnum1 ? '-' : '-0') + token.substring(1)))
             : ((propBits & CSS_PROP_BIT_QUANTITY) ? '0' : ''))
        // .5 -> 0.5 if allowed.
        : (cc === '.'.charCodeAt(0) && isnum1)
        ? ((propBits & CSS_PROP_BIT_QUANTITY) ? '0' + token : '')
        // Handle url("...") by rewriting the body.
        : ('url(' === token.substring(0, 4))
        ? ((opt_naiveUriRewriter && (qstringBits & CSS_PROP_BIT_QSTRING_URL))
           ? normalizeUrl(safeUri(resolveUri(opt_baseUri,
                tokens[i].substring(5, token.length - 2)),
                property,
                opt_naiveUriRewriter))
           : '')
        // Handle func(...) and literal tokens
        // such as keywords and punctuation.
        : (
          // Step 1. Combine func(...) into something that can be compared
          // against propertySchema.cssExtra.
          (token.charAt(token.length-1) === '(')
          && (end = normalizeFunctionCall(tokens, i),
              // When tokens is
              //   ['x', ' ', 'rgb(', '255', ',', '0', ',', '0', ')', ' ', 'y']
              // and i is the index of 'rgb(' and end is the index of ')'
              // splices tokens to where i now is the index of the whole call:
              //   ['x', ' ', 'rgb( 255 , 0 , 0 )', ' ', 'y']
              tokens.splice(i, end - i,
                            token = tokens.slice(i, end).join(' '))),
          litGroup = propertySchema.cssLitGroup,
          litMap = (litGroup
                    ? (propertySchema.cssLitMap
                       // Lazily compute the union from litGroup.
                       || (propertySchema.cssLitMap = unionArrays(litGroup)))
                    : ALLOWED_LITERAL),  // A convenient empty object.
          (litMap[token] === ALLOWED_LITERAL
           || propertySchema.cssExtra && propertySchema.cssExtra.test(token)))
          // Token is in the literal map or matches extra.
          ? token
          : (/^\w+$/.test(token)
             && (qstringBits === CSS_PROP_BIT_QSTRING_CONTENT))
          // Quote unrecognized keywords so font names like
          //    Arial Bold
          // ->
          //    "Arial Bold"
          ? (lastQuoted+1 === k
             // If the last token was also a keyword that was quoted, then
             // combine this token into that.
             ? (tokens[lastQuoted] = tokens[lastQuoted]
                .substring(0, tokens[lastQuoted].length-1) + ' ' + token + '"',
                token = '')
             : (lastQuoted = k, '"' + token + '"'))
          // Disallowed.
          : '');
      if (token) {
        tokens[k++] = token;
      }
    }
    // For single URL properties, if the URL failed to pass the sanitizer,
    // then just drop it.
    if (k === 1 && tokens[0] === NOEFFECT_URL) { k = 0; }
    tokens.length = k;
  };
})();

/**
 * Given a series of tokens, returns two lists of sanitized selectors.
 * @param {Array.<string>} selectors In the form produces by csslexer.js.
 * @param {string} suffix a suffix that is added to all IDs and which is
 *    used as a CLASS names so that the returned selectors will only match
 *    nodes under one with suffix as a class name.
 *    If suffix is {@code "sfx"}, the selector
 *    {@code ["a", "#foo", " ", "b", ".bar"]} will be namespaced to
 *    {@code [".sfx", " ", "a", "#foo-sfx", " ", "b", ".bar"]}.
 * @param {function(string, Array.<string>): ?Array.<string>} tagPolicy
 *     As in html-sanitizer, used for rewriting element names.
 * @return {Array.<Array.<string>>} an array of length 2 where the zeroeth
 *    element contains history-insensitive selectors and the first element
 *    contains history-sensitive selectors.
 */
function sanitizeCssSelectors(selectors, suffix, tagPolicy) {
  // Produce two distinct lists of selectors to sequester selectors that are
  // history sensitive (:visited), so that we can disallow properties in the
  // property groups for the history sensitive ones.
  var historySensitiveSelectors = [];
  var historyInsensitiveSelectors = [];

  // Remove any spaces that are not operators.
  var k = 0, i;
  for (i = 0; i < selectors.length; ++i) {
    if (!(selectors[i] == ' '
          && (selectors[i-1] == '>' || selectors[i+1] == '>'))) {
      selectors[k++] = selectors[i];
    }
  }
  selectors.length = k;

  // Split around commas.  If there is an error in one of the comma separated
  // bits, we throw the whole away, but the failure of one selector does not
  // affect others.
  var n = selectors.length, start = 0;
  for (i = 0; i < n; ++i) {
    if (selectors[i] == ',') {
      processSelector(start, i);
      start = i+1;
    }
  }
  processSelector(start, n);


  function processSelector(start, end) {
    var historySensitive = false;

    // Space around commas is not an operator.
    if (selectors[start] === ' ') { ++start; }
    if (end-1 !== start && selectors[end] === ' ') { --end; }

    // Split the selector into element selectors, content around
    // space (ancestor operator) and '>' (descendant operator).
    var out = [];
    var lastOperator = start;
    var elSelector = '';
    for (var i = start; i < end; ++i) {
      var tok = selectors[i];
      var isChild = (tok === '>');
      if (isChild || tok === ' ') {
        // We've found the end of a single link in the selector chain.
        // We disallow absolute positions relative to html.
        elSelector = processElementSelector(lastOperator, i, false);
        if (!elSelector || (isChild && /^html/i.test(elSelector))) {
          return;
        }
        lastOperator = i+1;
        out.push(elSelector, isChild ? ' > ' : ' ');
      }
    }
    elSelector = processElementSelector(lastOperator, end, true);
    if (!elSelector) { return; }
    out.push(elSelector);

    function processElementSelector(start, end, last) {
      var debugStart = start, debugEnd = end;
      // Split the element selector into three parts.
      // DIV.foo#bar:hover
      //    ^       ^
      // el classes pseudo
      var element, classId, pseudoSelector, tok;
      element = '';
      if (start < end) {
        tok = selectors[start];
        if (tok === '*') {
          ++start;
          element = tok;
        } else if (/^[a-zA-Z]/.test(tok)) {  // is an element selector
          var decision = tagPolicy(tok.toLowerCase(), []);
          if (decision) {
            if ('tagName' in decision) {
              tok = decision['tagName'];
            }
            ++start;
            element = tok;
          }
        }
      }
      classId = '';
      while (start < end) {
        tok = selectors[start];
        if (tok.charAt(0) === '#') {
          if (/^#_|__$|[^#0-9A-Za-z:_\-]/.test(tok)) { return null; }
          // Rewrite ID elements to include the suffix.
          classId += tok + '-' + suffix;
        } else if (tok === '.') {
          if (++start < end
              && /^[0-9A-Za-z:_\-]+$/.test(tok = selectors[start])
              && !/^_|__$/.test(tok)) {
            classId += '.' + tok;
          } else {
            return null;
          }
        } else {
          break;
        }
        ++start;
      }
      pseudoSelector = '';
      if (start < end && selectors[start] === ':') {
        tok = selectors[++start];
        if (tok === 'visited' || tok === 'link') {
          if (!/^[a*]?$/.test(element)) {
            return null;
          }
          historySensitive = true;
          pseudoSelector = ':' + tok;
          element = 'a';
          ++start;
        }
      }
      if (start === end) {
        return element + classId + pseudoSelector;
      }
      return null;
    }


    var safeSelector = out.join('');
    // Namespace the selector so that it only matches under
    // a node with suffix in its CLASS attribute.
    safeSelector = '.' + suffix + ' ' + safeSelector;

    (historySensitive
     ? historySensitiveSelectors
     : historyInsensitiveSelectors).push(safeSelector);
  }

  return [historyInsensitiveSelectors, historySensitiveSelectors];
}

var sanitizeStylesheet = (function () {
  var allowed = {};
  var cssMediaTypeWhitelist = {
    'braille': allowed,
    'embossed': allowed,
    'handheld': allowed,
    'print': allowed,
    'projection': allowed,
    'screen': allowed,
    'speech': allowed,
    'tty': allowed,
    'tv': allowed
  };

  /**
   * Given a series of sanitized tokens, removes any properties that would
   * leak user history if allowed to style links differently depending on
   * whether the linked URL is in the user's browser history.
   * @param {Array.<string>} blockOfProperties
   */
  function sanitizeHistorySensitive(blockOfProperties) {
    var elide = false;
    for (var i = 0, n = blockOfProperties.length; i < n-1; ++i) {
      var token = blockOfProperties[i];
      if (':' === blockOfProperties[i+1]) {
        elide = !(cssSchema[token].cssPropBits & CSS_PROP_BIT_ALLOWED_IN_LINK);
      }
      if (elide) { blockOfProperties[i] = ''; }
      if (';' === token) { elide = false; }
    }
    return blockOfProperties.join('');
  }

  /**
   * @param {string} baseUri a string against which relative urls are resolved.
   * @param {string} cssText a string containing a CSS stylesheet.
   * @param {string} suffix a suffix that is added to all IDs and which is
   *    used as a CLASS names so that the returned selectors will only match
   *    nodes under one with suffix as a class name.
   *    If suffix is {@code "sfx"}, the selector
   *    {@code ["a", "#foo", " ", "b", ".bar"]} will be namespaced to
   *    {@code [".sfx", " ", "a", "#foo-sfx", " ", "b", ".bar"]}.
   * @param {function(string, Array.<string>): ?Array.<string>} tagPolicy
   *     As in html-sanitizer, used for rewriting element names.
   * @param {function(string, string)} opt_naiveUriRewriter maps URLs of media
   *    (images, sounds) that appear as CSS property values to sanitized
   *    URLs or null if the URL should not be allowed as an external media
   *    file in sanitized CSS.
   */
  return function /*sanitizeStylesheet*/(
    baseUri, cssText, suffix, opt_naiveUriRewriter, tagPolicy) {
    var safeCss = void 0;
    // A stack describing the { ... } regions.
    // Null elements indicate blocks that should not be emitted.
    var blockStack = [];
    // True when the content of the current block should be left off safeCss.
    var elide = false;
    parseCssStylesheet(
        cssText,
        {
          startStylesheet: function () {
            safeCss = [];
          },
          endStylesheet: function () {
          },
          startAtrule: function (atIdent, headerArray) {
            if (elide) {
              atIdent = null;
            } else if (atIdent === '@media') {
              headerArray = headerArray.filter(
                function (mediaType) {
                  return cssMediaTypeWhitelist[mediaType] == allowed;
                });
              if (headerArray.length) {
                safeCss.push(atIdent, headerArray.join(','), '{');
              } else {
                atIdent = null;
              }
            } else {
              if (atIdent === '@import') {
                // TODO: Use a logger instead.
                if (window.console) {
                  window.console.log(
                      '@import ' + headerArray.join(' ') + ' elided');
                }
              }
              atIdent = null;  // Elide the block.
            }
            elide = !atIdent;
            blockStack.push(atIdent);
          },
          endAtrule: function () {
            var atIdent = blockStack.pop();
            if (!elide) {
              safeCss.push(';');
            }
            checkElide();
          },
          startBlock: function () {
            // There are no bare blocks in CSS, so we do not change the
            // block stack here, but instead in the events that bracket
            // blocks.
            if (!elide) {
              safeCss.push('{');
            }
          },
          endBlock: function () {
            if (!elide) {
              safeCss.push('}');
              elide = true;  // skip any semicolon from endAtRule.
            }
          },
          startRuleset: function (selectorArray) {
            var historySensitiveSelectors = void 0;
            var removeHistoryInsensitiveSelectors = false;
            if (!elide) {
              var selectors = sanitizeCssSelectors(selectorArray, suffix,
                  tagPolicy);
              var historyInsensitiveSelectors = selectors[0];
              historySensitiveSelectors = selectors[1];
              if (!historyInsensitiveSelectors.length
                  && !historySensitiveSelectors.length) {
                elide = true;
              } else {
                var selector = historyInsensitiveSelectors.join(', ');
                if (!selector) {
                  // If we have only history sensitive selectors,
                  // use an impossible rule so that we can capture the content
                  // for later processing by
                  // history insenstive content for use below.
                  selector = 'head > html';
                  removeHistoryInsensitiveSelectors = true;
                }
                safeCss.push(selector, '{');
              }
            }
            blockStack.push(
                elide
                ? null
                // Sometimes a single list of selectors is split in two,
                //   div, a:visited
                // because we want to allow some properties for DIV that
                // we don't want to allow for A:VISITED to avoid leaking
                // user history.
                // Store the history sensitive selectors and the position
                // where the block starts so we can later create a copy
                // of the permissive tokens, and filter it to handle the
                // history sensitive case.
                : {
                    historySensitiveSelectors: historySensitiveSelectors,
                    endOfSelectors: safeCss.length - 1,  // 1 is open curly
                    removeHistoryInsensitiveSelectors:
                       removeHistoryInsensitiveSelectors
                  });
          },
          endRuleset: function () {
            var rules = blockStack.pop();
            var propertiesEnd = safeCss.length;
            if (!elide) {
              safeCss.push('}');
              if (rules) {
                var extraSelectors = rules.historySensitiveSelectors;
                if (extraSelectors.length) {
                  var propertyGroupTokens = safeCss.slice(rules.endOfSelectors);
                  safeCss.push(extraSelectors.join(', '),
                               sanitizeHistorySensitive(propertyGroupTokens));
                }
              }
            }
            if (rules && rules.removeHistoryInsensitiveSelectors) {
              safeCss.splice(
                // -1 and +1 account for curly braces.
                rules.endOfSelectors - 1, propertiesEnd + 1);
            }
            checkElide();
          },
          declaration: function (property, valueArray) {
            if (!elide) {
              var schema = cssSchema[property];
              if (schema) {
                sanitizeCssProperty(property, schema, valueArray,
                  opt_naiveUriRewriter, baseUri);
                if (valueArray.length) {
                  safeCss.push(property, ':', valueArray.join(' '), ';');
                }
              }
            }
          }
        });
    function checkElide() {
      elide = blockStack.length !== 0
          && blockStack[blockStack.length-1] !== null;
    }
    return safeCss.join('');
  };
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['sanitizeCssProperty'] = sanitizeCssProperty;
  window['sanitizeCssSelectors'] = sanitizeCssSelectors;
  window['sanitizeStylesheet'] = sanitizeStylesheet;
}
;
// Copyright (C) 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Utilities for dealing with CSS source code.
 *
 * @author mikesamuel@gmail.com
 * \@requires lexCss
 * \@overrides window
 * \@provides parseCssStylesheet, parseCssDeclarations
 */

// The Turkish i seems to be a non-issue, but abort in case it is.
if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

/**
 * parseCssStylesheet takes a chunk of CSS text and a handler object with
 * methods that it calls as below:
 * <pre>
 * // At the beginning of a stylesheet.
 * handler.startStylesheet();
 *
 * // For an @foo rule ended by a semicolon: @import "foo.css";
 * handler.startAtrule('@import', ['"foo.css"']);
 * handler.endAtrule();
 *
 * // For an @foo rule ended with a block. @media print { ... }
 * handler.startAtrule('@media', ['print']);
 * handler.startBlock();
 * // Calls to contents elided.  Probably selectors and declarations as below.
 * handler.endBlock();
 * handler.endAtrule();
 *
 * // For a ruleset: p.clazz q, s { color: blue; }
 * handler.startRuleset(['p', '.', 'clazz', ' ', 'q', ',', ' ', 's']);
 * handler.declaration('color', ['blue']);
 * handler.endRuleset();
 *
 * // At the end of a stylesheet.
 * handler.endStylesheet();
 * </pre>
 * When errors are encountered, the parser drops the useless tokens and
 * attempts to resume parsing.
 *
 * @param {string} cssText CSS3 content to parse as a stylesheet.
 * @param {Object} handler An object like <pre>{
 *   startStylesheet: function () { ... },
 *   endStylesheet: function () { ... },
 *   startAtrule: function (atIdent, headerArray) { ... },
 *   endAtrule: function () { ... },
 *   startBlock: function () { ... },
 *   endBlock: function () { ... },
 *   startRuleset: function (selectorArray) { ... },
 *   endRuleset: function () { ... },
 *   declaration: function (property, valueArray) { ... },
 * }</pre>
 */
var parseCssStylesheet;

/**
 * parseCssDeclarations parses a run of declaration productions as seen in the
 * body of the HTML5 {@code style} attribute.
 *
 * @param {string} cssText CSS3 content to parse as a run of declarations.
 * @param {Object} handler An object like <pre>{
 *   declaration: function (property, valueArray) { ... },
 * }</pre>
 */
var parseCssDeclarations;

(function () {
  // stylesheet  : [ CDO | CDC | S | statement ]*;
  parseCssStylesheet = function(cssText, handler) {
    var toks = lexCss(cssText);
    if (handler.startStylesheet) { handler.startStylesheet(); }
    for (var i = 0, n = toks.length; i < n;) {
      // CDO and CDC ("<!--" and "-->") are converted to space by the lexer.
      i = toks[i] === ' ' ? i+1 : statement(toks, i, n, handler);
    }
    if (handler.endStylesheet) { handler.endStylesheet(); }
  };

  // statement   : ruleset | at-rule;
  function statement(toks, i, n, handler) {
    if (i < n) {
      var tok = toks[i];
      if (tok.charAt(0) === '@') {
        return atrule(toks, i, n, handler, true);
      } else {
        return ruleset(toks, i, n, handler);
      }
    } else {
      return i;
    }
  }

  // at-rule     : ATKEYWORD S* any* [ block | ';' S* ];
  function atrule(toks, i, n, handler, blockok) {
    var start = i++;
    while (i < n && toks[i] !== '{' && toks[i] !== ';') {
      ++i;
    }
    if (i < n && (blockok || toks[i] === ';')) {
      var s = start+1, e = i;
      if (s < n && toks[s] === ' ') { ++s; }
      if (e > s && toks[e-1] === ' ') { --e; }
      if (handler.startAtrule) {
        handler.startAtrule(toks[start].toLowerCase(), toks.slice(s, e));
      }
      i = (toks[i] === '{')
          ? block(toks, i, n, handler)
          : i+1;  // Skip over ';'
      if (handler.endAtrule) {
        handler.endAtrule();
      }
    }
    // Else we reached end of input or are missing a semicolon.
    // Drop the rule on the floor.
    return i;
  }

  // block       : '{' S* [ any | block | ATKEYWORD S* | ';' S* ]* '}' S*;
   // Assumes the leading '{' has been verified by callers.
  function block(toks, i, n, handler) {
    ++i; //  skip over '{'
    if (handler.startBlock) { handler.startBlock(); }
    while (i < n) {
      var ch = toks[i].charAt(0);
      if (ch == '}') {
        ++i;
        break;
      }
      if (ch === ' ' || ch === ';') {
        i = i+1;
      } else if (ch === '@') {
        i = atrule(toks, i, n, handler, false);
      } else if (ch === '{') {
        i = block(toks, i, n, handler);
      } else {
        // Instead of using (any* block) to subsume ruleset we allow either
        // blocks or rulesets with a non-blank selector.
        // This is more restrictive but does not require atrule specific
        // parse tree fixup to realize that the contents of the block in
        //    @media print { ... }
        // is a ruleset.  We just don't care about any block carrying at-rules
        // whose body content is not ruleset content.
        i = ruleset(toks, i, n, handler);
      }
    }
    if (handler.endBlock) { handler.endBlock(); }
    return i;
  }

  // ruleset    : selector? '{' S* declaration? [ ';' S* declaration? ]* '}' S*;
  function ruleset(toks, i, n, handler) {
    // toks[s:e] are the selector tokens including internal whitespace.
    var s = i, e = selector(toks, i, n, true);
    if (e < 0) {
      // Skip malformed content per selector calling convention.
      e = ~e;
      // Make sure we skip at least one token.
      return i === e ? e+1 : e;
    }
    i = e;
    // Don't include any trailing space in the selector slice.
    if (e > s && toks[e-1] === ' ') { --e; }
    var tok = toks[i];
    ++i;  // Skip over '{'
    if (tok !== '{') {
      // Skips past the '{' when there is a malformed input.
      return i;
    }
    if (handler.startRuleset) {
      handler.startRuleset(toks.slice(s, e));
    }
    while (i < n) {
      tok = toks[i];
      if (tok === '}') {
        ++i;
        break;
      }
      if (tok === ' ') {
        i = i+1;
      } else {
        i = declaration(toks, i, n, handler);
      }
    }
    if (handler.endRuleset) {
      handler.endRuleset();
    }
    return i < n ? i+1 : i;
  }

  // selector    : any+;
  // any         : [ IDENT | NUMBER | PERCENTAGE | DIMENSION | STRING
  //               | DELIM | URI | HASH | UNICODE-RANGE | INCLUDES
  //               | FUNCTION S* any* ')' | DASHMATCH | '(' S* any* ')'
  //               | '[' S* any* ']' ] S*;
  // A negative return value, rv, indicates the selector was malformed and
  // the index at which we stopped is ~rv.
  function selector(toks, i, n, allowSemi) {
    var s = i;
    // The definition of any above can be summed up as
    //   "any run of token except ('[', ']', '(', ')', ':', ';', '{', '}')
    //    or nested runs of parenthesized tokens or square bracketed tokens".
    // Spaces are significant in the selector.
    // Selector is used as (selector?) so the below looks for (any*) for
    // simplicity.
    var tok;
    // Keeping a stack pointer actually causes this to minify better since
    // ".length" and ".push" are a lo of chars.
    var brackets = [], stackLast = -1;
    for (;i < n; ++i) {
      tok = toks[i].charAt(0);
      if (tok === '[' || tok === '(') {
        brackets[++stackLast] = tok;
      } else if ((tok === ']' && brackets[stackLast] === '[') ||
                 (tok === ')' && brackets[stackLast] === '(')) {
        --stackLast;
      } else if (tok === '{' || tok === '}' || tok === ';' || tok === '@'
                 || (tok === ':' && !allowSemi)) {
        break;
      }
    }
    if (stackLast >= 0) {
      // Returns the bitwise inverse of i+1 to indicate an error in the
      // token stream so that clients can ignore it.
      i = ~(i+1);
    }
    return i;
  }

  var ident = /^-?[a-z]/i;

  // declaration : property ':' S* value;
  // property    : IDENT S*;
  // value       : [ any | block | ATKEYWORD S* ]+;
  function declaration(toks, i, n, handler) {
    var property = toks[i++];
    if (!ident.test(property)) {
      return i+1;  // skip one token.
    }
    var tok;
    if (i < n && toks[i] === ' ') { ++i; }
    if (i == n || toks[i] !== ':') {
      // skip tokens to next semi or close bracket.
      while (i < n && (tok = toks[i]) !== ';' && tok !== '}') { ++i; }
      return i;
    }
    ++i;
    if (i < n && toks[i] === ' ') { ++i; }

    // None of the rules we care about want atrules or blocks in value, so
    // we look for any+ but that is the same as selector but not zero-length.
    // This gets us the benefit of not emitting any value with mismatched
    // brackets.
    var s = i, e = selector(toks, i, n, false);
    if (e < 0) {
      // Skip malformed content per selector calling convention.
      e = ~e;
    } else {
      var value = [], valuelen = 0;
      for (var j = s; j < e; ++j) {
        tok = toks[j];
        if (tok !== ' ') {
          value[valuelen++] = tok;
        }
      }
      // One of the following is now true:
      // (1) e is flush with the end of the tokens as in <... style="x:y">.
      // (2) tok[e] points to a ';' in which case we need to consume the semi.
      // (3) tok[e] points to a '}' in which case we don't consume it.
      // (4) else there is bogus unparsed value content at toks[e:].
      // Allow declaration flush with end for style attr body.
      if (e < n) {  // 2, 3, or 4
        do {
          tok = toks[e];
          if (tok === ';' || tok === '}') { break; }
          // Don't emit the property if there is questionable trailing content.
          valuelen = 0;
        } while (++e < n);
        if (tok === ';') {
          ++e;
        }
      }
      if (valuelen && handler.declaration) {
        // TODO: coerce non-keyword ident tokens to quoted strings.
        handler.declaration(property.toLowerCase(), value);
      }
    }
    return e;
  }

  parseCssDeclarations = function(cssText, handler) {
    var toks = lexCss(cssText);
    for (var i = 0, n = toks.length; i < n;) {
      i = toks[i] !== ' ' ? declaration(toks, i, n, handler) : i+1;
    }
  };
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['parseCssStylesheet'] = parseCssStylesheet;
  window['parseCssDeclarations'] = parseCssDeclarations;
}
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * A set of utility functions that implement browser feature testing to unify
 * certain DOM behaviors, and a set of recommendations about when to use these
 * functions as opposed to the native DOM functions.
 *
 * @author ihab.awad@gmail.com
 * @author jasvir@gmail.com
 * @provides bridalMaker
 * @requires WeakMap, html, html4
 * @overrides window
 */

// The Turkish i seems to be a non-issue, but abort in case it is.
if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

/**
 * Construct the bridal object for a specific document.
 *
 * @param {function} makeDOMAccessible A function which will be called on the
 *     document and every object retrieved from it, recursively, and its results
 *     used instead of those objects. This hook is available in case bridal is
 *     running in an environment such that unmodified DOM objects cannot be
 *     touched. makeDOMAccessible may either modify its argument (should be
 *     idempotent) or return a different object.
 * @param {HTMLDocument} document
 */
var bridalMaker = function (makeDOMAccessible, document) {
  document = makeDOMAccessible(document);
  var docEl = makeDOMAccessible(document.documentElement);
  var window = makeDOMAccessible(
      bridalMaker.getWindow(docEl, makeDOMAccessible));
  var navigator      = makeDOMAccessible(window.navigator);
  var XMLHttpRequest = makeDOMAccessible(window.XMLHttpRequest);
  var ActiveXObject  = makeDOMAccessible(window.ActiveXObject);

  ////////////////////////////////////////////////////////////////////////////
  // Private section
  ////////////////////////////////////////////////////////////////////////////

  var isOpera = navigator.userAgent.indexOf('Opera') === 0;
  var isIE = !isOpera && navigator.userAgent.indexOf('MSIE') !== -1;
  var isWebkit = !isOpera && navigator.userAgent.indexOf('WebKit') !== -1;

  var featureAttachEvent = !!(window.attachEvent && !window.addEventListener);
  /**
   * Does the extended form of extendedCreateElement work?
   * From http://msdn.microsoft.com/en-us/library/ms536389.aspx :<blockquote>
   *     You can also specify all the attributes inside the createElement
   *     method by using an HTML string for the method argument.
   *     The following example demonstrates how to dynamically create two
   *     radio buttons utilizing this technique.
   *     <pre>
   *     ...
   *     var newRadioButton = document.createElement(
   *         "&lt;INPUT TYPE='RADIO' NAME='RADIOTEST' VALUE='First Choice'>")
   *     </pre>
   * </blockquote>
   */
  var featureExtendedCreateElement =
      (function () {
        try {
          return (
              document.createElement('<input type="radio">').type === 'radio');
        } catch (e) {
          return false;
        }
      })();

  // HTML5 compatibility on IE
  // Standard html5 but non-html4 tags cause IE to throw
  // Workaround from http://remysharp.com/html5-enabling-script
  function html5shim() {
    var html5_elements =["abbr", "article", "aside", "audio", "canvas",
        "details", "figcaption", "figure", "footer", "header", "hgroup", "mark",
        "meter", "nav", "output", "progress", "section", "summary", "time",
        "video"];
    var documentFragment = makeDOMAccessible(document.createDocumentFragment());
    for (var i = 0; i < html5_elements.length; i++) {
      try {
        document.createElement(html5_elements[i]);
        documentFragment.createElement(html5_elements[i]);
      } catch (e) {
        // failure in the shim is not a real failure
      }
    }
  }
  if (isIE) {
    html5shim();
  }

  // lazily initialized to allow working in cases where WeakMap is not available
  // and this code is never used.
  var hiddenEventTypes;

  var CUSTOM_EVENT_TYPE_SUFFIX = '_custom___';
  function tameEventType(type, opt_isCustom, opt_tagName) {
    type = String(type);
    if (endsWithUnderbars.test(type)) {
      throw new Error('Invalid event type ' + type);
    }
    var tagAttr = false;
    if (opt_tagName) {
      tagAttr = String(opt_tagName).toLowerCase() + '::on' + type;
    }
    if (!opt_isCustom
        && ((tagAttr && html4.atype.SCRIPT === html4.ATTRIBS[tagAttr])
            || html4.atype.SCRIPT === html4.ATTRIBS['*::on' + type])) {
      return type;
    }
    return type + CUSTOM_EVENT_TYPE_SUFFIX;
  }

  function eventHandlerTypeFilter(handler, tameType) {
    // This does not need to check that handler is callable by untrusted code
    // since the handler will invoke plugin_dispatchEvent which will do that
    // check on the untrusted function reference.
    return function (event) {
      if (hiddenEventTypes && tameType === hiddenEventTypes.get(event)) {
        return handler.call(this, event);
      }
    };
  }

  var endsWithUnderbars = /__$/;
  var escapeAttrib = html.escapeAttrib;
  function constructClone(node, deep) {
    node = makeDOMAccessible(node);
    var clone;
    if (node.nodeType === 1 && featureExtendedCreateElement) {
      // From http://blog.pengoworks.com/index.cfm/2007/7/16/IE6--IE7-quirks-with-cloneNode-and-form-elements
      //     It turns out IE 6/7 doesn't properly clone some form elements
      //     when you use the cloneNode(true) and the form element is a
      //     checkbox, radio or select element.
      // JQuery provides a clone method which attempts to fix this and an issue
      // with event listeners.  According to the source code for JQuery's clone
      // method ( http://docs.jquery.com/Manipulation/clone#true ):
      //     IE copies events bound via attachEvent when
      //     using cloneNode. Calling detachEvent on the
      //     clone will also remove the events from the orignal
      // We do not need to deal with XHTML DOMs and so can skip the clean step
      // that jQuery does.
      var tagDesc = node.tagName;
      // Copying form state is not strictly mentioned in DOM2's spec of
      // cloneNode, but all implementations do it.  The value copying
      // can be interpreted as fixing implementations' failure to have
      // the value attribute "reflect" the input's value as determined by the
      // value property.
      switch (node.tagName) {
        case 'INPUT':
          tagDesc = '<input name="' + escapeAttrib(node.name)
              + '" type="' + escapeAttrib(node.type)
              + '" value="' + escapeAttrib(node.defaultValue) + '"'
              + (node.defaultChecked ? ' checked="checked">' : '>');
          break;
        case 'BUTTON':
          tagDesc = '<button name="' + escapeAttrib(node.name)
              + '" type="' + escapeAttrib(node.type)
              + '" value="' + escapeAttrib(node.value) + '">';
          break;
        case 'OPTION':
          tagDesc = '<option '
              + (node.defaultSelected ? ' selected="selected">' : '>');
          break;
        case 'TEXTAREA':
          tagDesc = '<textarea value="'
              + escapeAttrib(node.defaultValue) + '">';
          break;
      }

      clone = makeDOMAccessible(document.createElement(tagDesc));

      var attrs = makeDOMAccessible(node.attributes);
      for (var i = 0, attr; (attr = attrs[i]); ++i) {
        attr = makeDOMAccessible(attr);
        if (attr.specified && !endsWithUnderbars.test(attr.name)) {
          setAttribute(clone, attr.nodeName, attr.nodeValue);
        }
      }
    } else {
      clone = makeDOMAccessible(node.cloneNode(false));
    }
    if (deep) {
      // TODO(mikesamuel): should we whitelist nodes here, to e.g. prevent
      // untrusted code from reloading an already loaded script by cloning
      // a script node that somehow exists in a tree accessible to it?
      for (var child = node.firstChild; child; child = child.nextSibling) {
        var cloneChild = constructClone(child, deep);
        clone.appendChild(cloneChild);
      }
    }
    return clone;
  }

  function fixupClone(node, clone) {
    node = makeDOMAccessible(node);
    clone = makeDOMAccessible(clone);
    for (var child = node.firstChild, cloneChild = clone.firstChild; cloneChild;
         child = child.nextSibling, cloneChild = cloneChild.nextSibling) {
      fixupClone(child, cloneChild);
    }
    if (node.nodeType === 1) {
      switch (node.tagName) {
        case 'INPUT':
          clone.value = node.value;
          clone.checked = node.checked;
          break;
        case 'OPTION':
          clone.selected = node.selected;
          clone.value = node.value;
          break;
        case 'TEXTAREA':
          clone.value = node.value;
          break;
      }
    }

    // Do not copy listeners since DOM2 specifies that only attributes and
    // children are copied, and that children should only be copied if the
    // deep flag is set.
    // The children are handled in constructClone.
    // TODO(kpreid): This is interpreting Domado's expando-attributes map;
    // modularity problem?
    var originalAttribs = node._d_attributes;
    if (originalAttribs) {
      var attribs = {};
      clone._d_attributes = attribs;
      var k, v;
      for (k in originalAttribs) {
        if (/__$/.test(k)) { continue; }
        v = originalAttribs[k];
        switch (typeof v) {
          case 'string': case 'number': case 'boolean':
            attribs[k] = v;
            break;
        }
      };
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Public section
  ////////////////////////////////////////////////////////////////////////////

  function untameEventType(type) {
    var suffix = CUSTOM_EVENT_TYPE_SUFFIX;
    var tlen = type.length, slen = suffix.length;
    var end = tlen - slen;
    if (end >= 0 && suffix === type.substring(end)) {
      type = type.substring(0, end);
    }
    return type;
  }

  function initEvent(event, type, bubbles, cancelable) {
    event = makeDOMAccessible(event);
    type = tameEventType(type, true);
    bubbles = Boolean(bubbles);
    cancelable = Boolean(cancelable);

    if (event.initEvent) {  // Non-IE
      event.initEvent(type, bubbles, cancelable);
    } else if (bubbles && cancelable) {  // IE
      if (!hiddenEventTypes) {
        hiddenEventTypes = new WeakMap();
      }
      hiddenEventTypes.set(event, type);
    } else {
      // TODO(mikesamuel): can bubbling and cancelable on events be simulated
      // via http://msdn.microsoft.com/en-us/library/ms533545(VS.85).aspx
      throw new Error(
          'Browser does not support non-bubbling/uncanceleable events');
    }
  }

  function dispatchEvent(element, event) {
    element = makeDOMAccessible(element);
    event = makeDOMAccessible(event);
    // TODO(mikesamuel): when we change event dispatching to happen
    // asynchronously, we should exempt custom events since those
    // need to return a useful value, and there may be code bracketing
    // them which could observe asynchronous dispatch.

    // "The return value of dispatchEvent indicates whether any of
    //  the listeners which handled the event called
    //  preventDefault. If preventDefault was called the value is
    //  false, else the value is true."
    if (element.dispatchEvent) {
      return Boolean(element.dispatchEvent(event));
    } else {
      // Only dispatches custom events as when tameEventType(t) !== t.
      element.fireEvent('ondataavailable', event);
      return Boolean(event.returnValue);
    }
  }

  /**
   * Add an event listener function to an element.
   *
   * <p>Replaces
   * W3C <code>Element::addEventListener</code> and
   * IE <code>Element::attachEvent</code>.
   *
   * @param {HTMLElement} element a native DOM element.
   * @param {string} type a string identifying the event type.
   * @param {boolean Element::function (event)} handler an event handler.
   * @param {boolean} useCapture whether the user wishes to initiate capture.
   * @return {boolean Element::function (event)} the handler added.  May be
   *     a wrapper around the input.
   */
  function addEventListener(element, type, handler, useCapture) {
    element = makeDOMAccessible(element);
    type = String(type);
    var tameType = tameEventType(type, false, element.tagName);
    if (featureAttachEvent) {
      // TODO(ihab.awad): How do we emulate 'useCapture' here?
      if (type !== tameType) {
        var wrapper = eventHandlerTypeFilter(handler, tameType);
        element.attachEvent('ondataavailable', wrapper);
        return wrapper;
      } else {
        element.attachEvent('on' + type, handler);
        return handler;
      }
    } else {
      // FF2 fails if useCapture not passed or is not a boolean.
      element.addEventListener(tameType, handler, useCapture);
      return handler;
    }
  }

  /**
   * Remove an event listener function from an element.
   *
   * <p>Replaces
   * W3C <code>Element::removeEventListener</code> and
   * IE <code>Element::detachEvent</code>.
   *
   * @param element a native DOM element.
   * @param type a string identifying the event type.
   * @param handler a function acting as an event handler.
   * @param useCapture whether the user wishes to initiate capture.
   */
  function removeEventListener(element, type, handler, useCapture) {
    element = makeDOMAccessible(element);
    type = String(type);
    var tameType = tameEventType(type, false, element.tagName);
    if (featureAttachEvent) {
      // TODO(ihab.awad): How do we emulate 'useCapture' here?
      if (tameType !== type) {
        element.detachEvent('ondataavailable', handler);
      } else {
        element.detachEvent('on' + type, handler);
      }
    } else {
      element.removeEventListener(tameType, handler, useCapture);
    }
  }

  /**
   * Clones a node per {@code Node.clone()}.
   * <p>
   * Returns a duplicate of this node, i.e., serves as a generic copy
   * constructor for nodes. The duplicate node has no parent;
   * (parentNode is null.).
   * <p>
   * Cloning an Element copies all attributes and their values,
   * including those generated by the XML processor to represent
   * defaulted attributes, but this method does not copy any text it
   * contains unless it is a deep clone, since the text is contained
   * in a child Text node. Cloning an Attribute directly, as opposed
   * to be cloned as part of an Element cloning operation, returns a
   * specified attribute (specified is true). Cloning any other type
   * of node simply returns a copy of this node.
   * <p>
   * Note that cloning an immutable subtree results in a mutable copy,
   * but the children of an EntityReference clone are readonly. In
   * addition, clones of unspecified Attr nodes are specified. And,
   * cloning Document, DocumentType, Entity, and Notation nodes is
   * implementation dependent.
   *
   * @param {boolean} deep If true, recursively clone the subtree
   * under the specified node; if false, clone only the node itself
   * (and its attributes, if it is an Element).
   *
   * @return {Node} The duplicate node.
   */
  function cloneNode(node, deep) {
    node = makeDOMAccessible(node);
    var clone;
    if (!document.all) {  // Not IE 6 or IE 7
      clone = node.cloneNode(deep);
    } else {
      clone = constructClone(node, deep);
    }
    fixupClone(node, clone);
    return clone;
  }

  function initCanvasElements(doc) {
    var els = makeDOMAccessible(doc).getElementsByTagName('canvas');
    for (var i = 0; i < els.length; i++) {
      initCanvasElement(makeDOMAccessible(els[i]));
    }
  }

  function initCanvasElement(el) {
    // TODO(felix8a): need to whitelist G_vmlCanvasManager
    if (window.G_vmlCanvasManager) {
      window.G_vmlCanvasManager.initElement(el);
    }
  }

  function createElement(tagName, attribs) {
    if (featureExtendedCreateElement) {
      var tag = ['<', tagName];
      for (var i = 0, n = attribs.length; i < n; i += 2) {
        tag.push(' ', attribs[i], '="', escapeAttrib(attribs[i + 1]), '"');
      }
      tag.push('>');
      return makeDOMAccessible(document.createElement(tag.join('')));
    } else {
      var el = makeDOMAccessible(document.createElement(tagName));
      for (var i = 0, n = attribs.length; i < n; i += 2) {
        setAttribute(el, attribs[i], attribs[i + 1]);
      }
      return el;
    }
  }

  /**
   * Create a <code>style</code> element for a document containing some
   * specified CSS text. Does not add the element to the document: the client
   * may do this separately if desired.
   *
   * <p>Replaces directly creating the <code>style</code> element and
   * populating its contents.
   *
   * @param document a DOM document.
   * @param cssText a string containing a well-formed stylesheet production.
   * @return a <code>style</code> element for the specified document.
   */
  function createStylesheet(document, cssText) {
    // Courtesy Stoyan Stefanov who documents the derivation of this at
    // http://www.phpied.com/dynamic-script-and-style-elements-in-ie/ and
    // http://yuiblog.com/blog/2007/06/07/style/
    var styleSheet = makeDOMAccessible(document.createElement('style'));
    styleSheet.setAttribute('type', 'text/css');
    var ssss = makeDOMAccessible(styleSheet.styleSheet);
    if (ssss) {   // IE
      ssss.cssText = cssText;
    } else {                // the world
      styleSheet.appendChild(document.createTextNode(cssText));
    }
    return styleSheet;
  }

  var hiddenStoredTarget;

  /**
   * Set an attribute on a DOM node.
   *
   * <p>Replaces DOM <code>Node::setAttribute</code>.
   *
   * @param {HTMLElement} element a DOM element.
   * @param {string} name the name of an attribute.
   * @param {string} value the value of an attribute.
   */
  function setAttribute(element, name, value) {
    element = makeDOMAccessible(element);
    /*
      Hazards:

        - In IE[67], el.setAttribute doesn't work for attributes like
          'class' or 'for'.  IE[67] expects you to set 'className' or
          'htmlFor'.  Using setAttributeNode solves this problem.

        - In IE[67], <input> elements can shadow attributes.  If el is a
          form that contains an <input> named x, then el.setAttribute(x, y)
          will set x's value rather than setting el's attribute.  Using
          setAttributeNode solves this problem.

        - In IE[67], the style attribute can only be modified by setting
          el.style.cssText.  Neither setAttribute nor setAttributeNode will
          work.  el.style.cssText isn't bullet-proof, since it can be
          shadowed by <input> elements.

        - In IE[67], you can never change the type of an <button> element.
          setAttribute('type') silently fails, but setAttributeNode
          throws an exception.  We want the silent failure.

        - In IE[67], you can never change the type of an <input> element.
          setAttribute('type') throws an exception.  We want the exception.

        - In IE[67], setAttribute is case-sensitive, unless you pass 0 as a
          3rd argument.  setAttributeNode is case-insensitive.

        - Trying to set an invalid name like ":" is supposed to throw an
          error.  In IE[678] and Opera 10, it fails without an error.
    */
    switch (name) {
      case 'style':
        makeDOMAccessible(element.style).cssText = value;
        return value;
      // Firefox will run javascript: URLs in the frame specified by target.
      // This can cause things to run in an unintended frame, so we make sure
      // that the target is effectively _self whenever a javascript: URL appears
      // on a node.
      case 'href':
        if (/^javascript:/i.test(value)) {
          if (!hiddenStoredTarget) {
            hiddenStoredTarget = new WeakMap();
          }
          hiddenStoredTarget.set(element, element.target);
          element.target = '';
        } else if (hiddenStoredTarget && hiddenStoredTarget.has(element)) {
          element.target = hiddenStoredTarget.get(element);
          hiddenStoredTarget["delete"](element); //delete kw rej. by Safari5.0.5
        }
        break;
      case 'target':
        if (element.href && /^javascript:/i.test(element.href)) {
          if (!hiddenStoredTarget) {
            hiddenStoredTarget = new WeakMap();
          }
          hiddenStoredTarget.set(element, value);
          return value;
        }
        break;
    }
    try {
      var attr = makeDOMAccessible(
          makeDOMAccessible(element.ownerDocument).createAttribute(name));
      attr.value = value;
      element.setAttributeNode(attr);
    } catch (e) {
      // It's a real failure only if setAttribute also fails.
      return element.setAttribute(name, value, 0);
    }
    return value;
  }

  /**
   * See <a href="http://www.w3.org/TR/cssom-view/#the-getclientrects"
   *      >ElementView.getBoundingClientRect()</a>.
   * @return {Object} duck types as a TextRectangle with numeric fields
   *    {@code left}, {@code right}, {@code top}, and {@code bottom}.
   */
  function getBoundingClientRect(el) {
    makeDOMAccessible(el);
    var doc = el.ownerDocument;
    // Use the native method if present.
    if (el.getBoundingClientRect) {
      var cRect = el.getBoundingClientRect();
      makeDOMAccessible(cRect);
      if (isIE) {
        // IE has an unnecessary border, which can be mucked with by styles, so
        // the amount of border is not predictable.
        // Depending on whether the document is in quirks or standards mode,
        // the border will be present on either the HTML or BODY elements.
        var fixupLeft = doc.documentElement.clientLeft + doc.body.clientLeft;
        cRect.left -= fixupLeft;
        cRect.right -= fixupLeft;
        var fixupTop = doc.documentElement.clientTop + doc.body.clientTop;
        cRect.top -= fixupTop;
        cRect.bottom -= fixupTop;
      }
      return ({
                top: +cRect.top,
                left: +cRect.left,
                right: +cRect.right,
                bottom: +cRect.bottom
              });
    }

    // Otherwise, try using the deprecated gecko method, or emulate it in
    // horribly inefficient ways.

    // http://code.google.com/p/doctype/wiki/ArticleClientViewportElement
    var viewport = (isIE && doc.compatMode === 'CSS1Compat')
        ? doc.body : doc.documentElement;

    // Figure out the position relative to the viewport.
    // From http://code.google.com/p/doctype/wiki/ArticlePageOffset
    var pageX = 0, pageY = 0;
    if (el === viewport) {
      // The viewport is the origin.
    } else if (doc.getBoxObjectFor) {  // Handles Firefox < 3
      var elBoxObject = doc.getBoxObjectFor(el);
      var viewPortBoxObject = doc.getBoxObjectFor(viewport);
      pageX = elBoxObject.screenX - viewPortBoxObject.screenX;
      pageY = elBoxObject.screenY - viewPortBoxObject.screenY;
    } else {
      // Walk the offsetParent chain adding up offsets.
      for (var op = el; (op && op !== el); op = op.offsetParent) {
        pageX += op.offsetLeft;
        pageY += op.offsetTop;
        if (op !== el) {
          pageX += op.clientLeft || 0;
          pageY += op.clientTop || 0;
        }
        if (isWebkit) {
          // On webkit the offsets for position:fixed elements are off by the
          // scroll offset.
          var opPosition = doc.defaultView.getComputedStyle(op, 'position');
          if (opPosition === 'fixed') {
            pageX += doc.body.scrollLeft;
            pageY += doc.body.scrollTop;
          }
          break;
        }
      }

      // Opera & (safari absolute) incorrectly account for body offsetTop
      if ((isWebkit
           && doc.defaultView.getComputedStyle(el, 'position') === 'absolute')
          || isOpera) {
        pageY -= doc.body.offsetTop;
      }

      // Accumulate the scroll positions for everything but the body element
      for (var op = el; (op = op.offsetParent) && op !== doc.body;) {
        pageX -= op.scrollLeft;
        // see https://bugs.opera.com/show_bug.cgi?id=249965
        if (!isOpera || op.tagName !== 'TR') {
          pageY -= op.scrollTop;
        }
      }
    }

    // Figure out the viewport container so we can subtract the window's
    // scroll offsets.
    var scrollEl = !isWebkit && doc.compatMode === 'CSS1Compat'
        ? doc.documentElement
        : doc.body;

    var left = pageX - scrollEl.scrollLeft, top = pageY - scrollEl.scrollTop;
    return ({
              top: top,
              left: left,
              right: left + el.clientWidth,
              bottom: top + el.clientHeight
            });
  }

  /**
   * Returns the value of the named attribute on element.
   *
   * <p> In IE[67], if you have
   * <pre>
   *    <form id="f" foo="x"><input name="foo"></form>
   * </pre>
   * then f.foo is the input node,
   * and f.getAttribute('foo') is also the input node,
   * which is contrary to the DOM spec and the behavior of other browsers.
   *
   * <p> This function tries to get a reliable value.
   *
   * <p> In IE[67], getting 'style' may be unreliable for form elements.
   *
   * @param {HTMLElement} element a DOM element.
   * @param {string} name the name of an attribute.
   */
  function getAttribute(element, name) {
    // In IE[67], element.style.cssText seems to be the only way to get the
    // value string.  This unfortunately fails when element.style is an
    // input element instead of a style object.
    if (name === 'style') {
      var style = makeDOMAccessible(element.style);
      if (typeof style.cssText === 'string') {
        return style.cssText;
      }
    }
    var attr = makeDOMAccessible(element.getAttributeNode(name));
    if (attr && attr.specified) {
      return attr.value;
    } else {
      return null;
    }
  }

  function hasAttribute(element, name) {
    if (element.hasAttribute) {  // Non IE
      return element.hasAttribute(name);
    } else {
      var attr = makeDOMAccessible(element.getAttributeNode(name));
      return attr !== null && attr.specified;
    }
  }

  /**
   * Returns a "computed style" object for a DOM node.
   *
   * @param {HTMLElement element a DOM element.
   * @param {string} pseudoElement an optional pseudo-element selector,
   * such as ":first-child".
   */
  function getComputedStyle(element, pseudoElement) {
    if (makeDOMAccessible(element).currentStyle && pseudoElement === void 0) {
      return makeDOMAccessible(element.currentStyle);
    } else if (window.getComputedStyle) {
      return makeDOMAccessible(
          window.getComputedStyle(element, pseudoElement));
    } else {
      throw new Error(
          'Computed style not available for pseudo element '
          + pseudoElement);
    }
  }

  /**
   * Returns a new XMLHttpRequest object, hiding browser differences in the
   * method of construction.
   */
  function makeXhr() {
    if (typeof XMLHttpRequest === 'undefined') {
      var activeXClassIds = [
          'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0',
          'MSXML2.XMLHTTP', 'MICROSOFT.XMLHTTP.1.0', 'MICROSOFT.XMLHTTP.1',
          'MICROSOFT.XMLHTTP'];
      for (var i = 0, n = activeXClassIds.length; i < n; i++) {
        var candidate = activeXClassIds[i];
        try {
          return makeDOMAccessible(new ActiveXObject(candidate));
        } catch (e) {}
      }
    }
    return makeDOMAccessible(new XMLHttpRequest);
  }

  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    initEvent: initEvent,
    dispatchEvent: dispatchEvent,
    cloneNode: cloneNode,
    createElement: createElement,
    createStylesheet: createStylesheet,
    setAttribute: setAttribute,
    getAttribute: getAttribute,
    hasAttribute: hasAttribute,
    getBoundingClientRect: getBoundingClientRect,
    untameEventType: untameEventType,
    extendedCreateElementFeature: featureExtendedCreateElement,
    getComputedStyle: getComputedStyle,
    makeXhr: makeXhr,
    initCanvasElement: initCanvasElement,
    initCanvasElements: initCanvasElements
  };
};

// TODO(kpreid): Kludge. Old Domita used global bridal.getWindow, but global
// bridal no longer exists since it used ambient authority. We should have a
// proper object to stick this on.
/**
 * Returns the window containing this element.
 */
// mda = makeDOMAccessible
bridalMaker.getWindow = function(element, mda) {
  var doc = mda(mda(element).ownerDocument);
  // IE
  if (doc.parentWindow) { return doc.parentWindow; }
  // Everything else
  // TODO: Safari 2's defaultView wasn't a window object :(
  // Safari 2 is not A-grade, though.
  if (doc.defaultView) { return doc.defaultView; }
  // Just in case
  var s = doc.createElement('script');
  s.innerHTML = "document.parentWindow = window;";
  var body = mda(doc.body);
  body.appendChild(s);
  body.removeChild(s);
  return doc.parentWindow;
};

// Exports for closure compiler.
// TODO(felix8a): reduce internal linkage exposed as globals
if (typeof window !== 'undefined') {
  window['bridalMaker'] = bridalMaker;
}
;
// Copyright (C) 2008-2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * A partially tamed browser object model based on
 * <a href="http://www.w3.org/TR/DOM-Level-2-HTML/Overview.html"
 * >DOM-Level-2-HTML</a> and specifically, the
 * <a href="http://www.w3.org/TR/DOM-Level-2-HTML/ecma-script-binding.html"
 * >ECMAScript Language Bindings</a>.
 *
 * Caveats:<ul>
 * <li>This is not a full implementation.
 * <li>Security Review is pending.
 * <li><code>===</code> and <code>!==</code> on node lists will not
 *   behave the same as with untamed node lists.  Specifically, it is
 *   not always true that {@code nodeA.childNodes === nodeA.childNodes}.
 * <li>Node lists are not "live" -- do not reflect changes in the DOM.
 * </ul>
 *
 * <p>
 * TODO(ihab.awad): Our implementation of getAttribute (and friends)
 * is such that standard DOM attributes which we disallow for security
 * reasons (like 'form:enctype') are placed in the "virtual" attributes
 * map (the data-caja-* namespace). They appear to be settable and gettable,
 * but their values are ignored and do not have the expected semantics
 * per the DOM API. This is because we do not have a column in
 * html4-defs.js stating that an attribute is valid but explicitly
 * blacklisted. Alternatives would be to always throw upon access to
 * these attributes; to make them always appear to be null; etc. Revisit
 * this decision if needed.
 *
 * @author mikesamuel@gmail.com (original Domita)
 * @author kpreid@switchb.org (port to ES5)
 * @requires console
 * @requires bridalMaker, cajaVM, cssSchema, lexCss, URI
 * @requires parseCssDeclarations, sanitizeCssProperty, unicode
 * @requires html, html4, htmlSchema
 * @requires WeakMap, Proxy
 * @requires CSS_PROP_BIT_HISTORY_INSENSITIVE
 * @provides Domado
 * @overrides domitaModules, window
 */

// The Turkish i seems to be a non-issue, but abort in case it is.
if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

// TODO(kpreid): Review whether multiple uses of np() should be coalesced for
// efficiency.

// TODO(kpreid): Move this from the global scope into the function(){}();
// eliminate the domitaModules object (or possibly move more stuff into it).
var domitaModules;
var Domado = (function() {
  'use strict';

  var isVirtualizedElementName = htmlSchema.isVirtualizedElementName;
  var realToVirtualElementName = htmlSchema.realToVirtualElementName;
  var virtualToRealElementName = htmlSchema.virtualToRealElementName;

  var cajaPrefix = 'data-caja-';
  var cajaPrefRe = new RegExp('^' + cajaPrefix);

  // From RFC3986
  var URI_SCHEME_RE = new RegExp(
      '^' +
      '(?:' +
        '([^:\/?# ]+)' +         // scheme
      ':)?'
  );

  var ALLOWED_URI_SCHEMES = /^(?:https?|mailto)$/i;

  /**
   * Tests if the given uri has an allowed scheme.
   * This matches the logic in UriPolicyNanny#apply
   */
  function allowedUriScheme(uri) {
    var parsed = ('' + uri).match(URI_SCHEME_RE);
    return (parsed && (!parsed[1] || ALLOWED_URI_SCHEMES.test(parsed[1])));
  }

  function uriFetch(naiveUriPolicy, uri, mime, callback) {
    if (!naiveUriPolicy || !callback
      || 'function' !== typeof naiveUriPolicy.fetch) {
      return;
    }
    if (allowedUriScheme(uri)) {
      naiveUriPolicy.fetch(uri, mime, callback);
    } else {
      naiveUriPolicy.fetch(undefined, mime, callback);
    }
  }

  function uriRewrite(naiveUriPolicy, uri, effects, ltype, hints) {
    if (!naiveUriPolicy) { return null; }
    return allowedUriScheme(uri) ?
        'function' === typeof naiveUriPolicy.rewrite ?
          naiveUriPolicy.rewrite(uri, effects, ltype, hints)
        : null
      : null;
  }

  if (!domitaModules) { domitaModules = {}; }

  domitaModules.proxiesAvailable = typeof Proxy !== 'undefined';

  // The proxy facilities provided by Firefox and ES5/3 differ in whether the
  // proxy itself (or rather 'receiver') is the first argument to the 'get'
  // traps. This autoswitches as needed, removing the first argument.
  domitaModules.permuteProxyGetSet = (function () {
    var needToSwap = false;

    if (domitaModules.proxiesAvailable) {
      var testHandler = {
        set: function (a, b, c) {
          if (a === proxy && b === "foo" && c === 1) {
            needToSwap = true;
          } else if (a === "foo" && b === 1 && c === proxy) {
            // needToSwap already false
          } else if (a === "foo" && b === 1 && c === undefined) {
            throw new Error('Proxy implementation does not provide proxy '
                + 'parameter: ' + Array.prototype.slice.call(arguments, 0));
          } else {
            throw new Error('internal: Failed to understand proxy arguments: '
                + Array.prototype.slice.call(arguments, 0));
          }
          return true;
        }
      };
      var proxy = Proxy.create(testHandler);
      proxy.foo = 1;
    }

    if (needToSwap) {
      return {
        getter: function (getFunc) {
          function permutedGetter(proxy, name) {
            return getFunc.call(this, name, proxy);
          };
          permutedGetter.unpermuted = getFunc;
          return permutedGetter;
        },
        setter: function (setFunc) {
          function permutedSetter(proxy, name, value) {
            return setFunc.call(this, name, value, proxy);
          };
          permutedSetter.unpermuted = setFunc;
          return permutedSetter;
        }
      };
    } else {
      return {
        getter: function (getFunc) {
          getFunc.unpermuted = getFunc;
          return getFunc;
        },
        setter: function (setFunc) {
          setFunc.unpermuted = setFunc;
          return setFunc;
        }
      };
    }
  })();

  domitaModules.canHaveEnumerableAccessors = (function () {
    // Firefox bug causes enumerable accessor properties to appear as own
    // properties of children. SES patches this by prohibiting enumerable
    // accessor properties. We work despite the bug by making all such
    // properties non-enumerable using this flag.
    try {
      Object.defineProperty({}, "foo", {
        enumerable: true,
        configurable: false,
        get: function () {}
      });
      return true;
    } catch (e) {
      return false;
    }
  })();

  domitaModules.getPropertyDescriptor = function (o, n) {
    if (o === null || o === undefined) {
      return undefined;
    } else {
      return Object.getOwnPropertyDescriptor(o, n)
          || domitaModules.getPropertyDescriptor(Object.getPrototypeOf(o), n);
    }
  };

  // This is a simple forwarding proxy handler. Code copied 2011-05-24 from
  // <http://wiki.ecmascript.org/doku.php?id=harmony:proxy_defaulthandler>
  // with modifications to make it work on ES5-not-Harmony-but-with-proxies as
  // provided by Firefox 4.0.1.
  domitaModules.ProxyHandler = function (target) {
    this.target = target;
  };
  domitaModules.ProxyHandler.prototype = {
    // == fundamental traps ==

    // Object.getOwnPropertyDescriptor(proxy, name) -> pd | undefined
    getOwnPropertyDescriptor: function(name) {
      var desc = Object.getOwnPropertyDescriptor(this.target, name);
      if (desc !== undefined) { desc.configurable = true; }
      return desc;
    },

    // Object.getPropertyDescriptor(proxy, name) -> pd | undefined
    getPropertyDescriptor: function(name) {
      var desc = Object.getPropertyDescriptor(this.target, name);
      if (desc !== undefined) { desc.configurable = true; }
      return desc;
    },

    // Object.getOwnPropertyNames(proxy) -> [ string ]
    getOwnPropertyNames: function() {
      return Object.getOwnPropertyNames(this.target);
    },

    // Object.getPropertyNames(proxy) -> [ string ]
    getPropertyNames: function() {
      return Object.getPropertyNames(this.target);
    },

    // Object.defineProperty(proxy, name, pd) -> undefined
    defineProperty: function(name, desc) {
      return Object.defineProperty(this.target, name, desc);
    },

    // delete proxy[name] -> boolean
    'delete': function(name) { return delete this.target[name]; },

    // Object.{freeze|seal|preventExtensions}(proxy) -> proxy
    fix: function() {
      // As long as target is not frozen,
      // the proxy won't allow itself to be fixed
      if (!Object.isFrozen(this.target)) {
        return undefined;
      }
      var props = {};
      for (var name in this.target) {
        props[name] = Object.getOwnPropertyDescriptor(this.target, name);
      }
      return props;
    },

    // == derived traps ==

    // name in proxy -> boolean
    has: function(name) { return name in this.target; },

    // ({}).hasOwnProperty.call(proxy, name) -> boolean
    hasOwn: function(name) {
      return ({}).hasOwnProperty.call(this.target, name);
    },

    // proxy[name] -> any
    get: domitaModules.permuteProxyGetSet.getter(
        function(name, proxy) { return this.target[name]; }),

    // proxy[name] = value
    set: domitaModules.permuteProxyGetSet.setter(
        function(name, value, proxy) { this.target[name] = value; }),

    // for (var name in proxy) { ... }
    enumerate: function() {
      var result = [];
      for (var name in this.target) { result.push(name); };
      return result;
    },

    /*
    // if iterators would be supported:
    // for (var name in proxy) { ... }
    iterate: function() {
      var props = this.enumerate();
      var i = 0;
      return {
        next: function() {
          if (i === props.length) throw StopIteration;
          return props[i++];
        }
      };
    },*/

    // Object.keys(proxy) -> [ string ]
    keys: function() { return Object.keys(this.target); }
  };
  cajaVM.def(domitaModules.ProxyHandler);


  /**
   * Like object[propName] = value, but DWIMs enumerability.
   *
   * This is also used as a workaround for possible bugs/unfortunate-choices in
   * SES, where a non-writable property cannot be overridden by an own property
   * by simple assignment. Or maybe I (kpreid) am misunderstanding what the
   * right thing is.
   *
   * The property's enumerability is inherited from the ancestor's property's
   * descriptor. The property is not writable or configurable.
   *
   * TODO(kpreid): Attempt to eliminate the need for uses of this. Some may be
   * due to a fixed bug in ES5/3.
   */
  domitaModules.setOwn = function (object, propName, value) {
    propName += '';
    // IE<=8, DOM objects are missing 'valueOf' property'
    var desc = domitaModules.getPropertyDescriptor(object, propName);
    Object.defineProperty(object, propName, {
      enumerable: desc ? desc.enumerable : false,
      value: value
    });
  };

  /**
   * Checks that a user-supplied callback is a function. Return silently if the
   * callback is valid; throw an exception if it is not valid.
   *
   * TODO(kpreid): Is this conversion to ES5-world OK?
   *
   * @param aCallback some user-supplied "function-like" callback.
   */
  domitaModules.ensureValidCallback =
      function (aCallback) {

    if ('function' !== typeof aCallback) {
      throw new Error('Expected function not ' + typeof aCallback);
    }
  };

  /**
   * This combines trademarks with amplification, and is really a thin wrapper
   * on WeakMap. It allows objects to have an arbitrary collection of private
   * properties, which can only be accessed by those holding the amplifier 'p'
   * (which, in most cases, should be only a particular prototype's methods.)
   *
   * Unlike trademarks, this does not freeze the object. It is assumed that the
   * caller makes the object sufficiently frozen for its purposes and/or that
   * the private properties are all that needs protection.
   *
   * This is designed to be more efficient and straightforward than using both
   * trademarks and per-private-property sealed boxes or weak maps.
   *
   * Capability design note: This facility provides sibling amplification (the
   * ability for one object to access the private state of other similar
   * objects).
   */
  domitaModules.Confidence = (function () {
    var setOwn = domitaModules.setOwn;

    function Confidence(typename) {
      var table = new WeakMap();

      this.confide = cajaVM.def(function (object, opt_sameAs) {
        //console.debug("Confiding:", object);
        if (table.get(object) !== undefined) {
          if (table.get(object)._obj !== object) {
            throw new Error("WeakMap broke! " + object + " vs. " +
                table.get(object)._obj);
          }
          throw new Error(typename + " has already confided in " + object);
        }

        var privates;
        var proto = Object.getPrototypeOf(object);
        if (opt_sameAs !== undefined) {
          privates = this.p(opt_sameAs);
        } else {
          privates = {_obj: object};
        }

        table.set(object, privates);
      });

      var guard = this.guard = cajaVM.makeTableGuard(table, typename,
          'This operation requires a ' + typename);

      /**
       * Wrap a method to enforce that 'this' is a confidant, and also
       * freeze it.
       *
       * This plays the role ___.grantTypedMethod did in Domita.
       */
      this.protectMethod = function (method) {
        //cajaVM.def(method);  // unnecessary in theory.  TODO(felix8a): verify
        function protectedMethod(var_args) {
          return method.apply(guard.coerce(this), arguments);
        }
        setOwn(protectedMethod, "toString", cajaVM.def(function () {
          // TODO(kpreid): this causes function body spamminess in firebug
          return "[" + typename + "]" + method.toString();
        }));
        return cajaVM.def(protectedMethod);
      };


      /**
       * Get the private properties of the object, or throw.
       */
      this.p = cajaVM.def(function (object) {
        var p = table.get(object);
        if (p === undefined) {
          guard.coerce(object);  // borrow failure
          throw new Error("can't happen");
        } else {
          return p;
        }
      });

      this.typename = typename;
    }
    setOwn(Confidence.prototype, "toString", Object.freeze(function () {
      return this.typename + 'Confidence';
    }));

    return cajaVM.def(Confidence);
  })();

  domitaModules.ExpandoProxyHandler = (function () {
    var getPropertyDescriptor = domitaModules.getPropertyDescriptor;
    var ProxyHandler = domitaModules.ProxyHandler;

    /**
     * A handler for a proxy which implements expando properties by forwarding
     * them to a separate object associated (by weak map) with the real node.
     *
     * The {@code target} is treated as if it were the prototype of this proxy,
     * and the expando properties as own properties of this proxy, except that
     * expando properties cannot hide target properties.
     *
     * The client SHOULD call ExpandoProxyHandler.register(proxy, target) to
     * enable use of ExpandoProxyHandler.unwrap.
     * TODO(kpreid): Wouldn't this mapping better be handled just by the client
     * since this is not defensively consistent and we don't need it here?
     *
     * Note the following exophoric hazard: if there are multiple expando
     * proxies with the same {@code storage}, and an accessor property is set on
     * one, and then that property is read on the other, the {@code this} seen
     * by the accessor get/set functions will be the latter proxy rather than
     * the former. Therefore, it should never be the case that two expando
     * proxies have the same storage and provide different authority, unless
     * every proxy which is editable provides a superset of the authority
     * provided by all others (which is the case for the use with TameNodes in
     * Domado).
     *
     * @param {Object} target The tame node to forward methods to.
     * @param {boolean} editable Whether modifying the properties is allowed.
     * @param {Object} storage The object to store the expando properties on.
     */
    function ExpandoProxyHandler(target, editable, storage) {
      this.editable = editable;
      this.storage = storage;
      this.target = target;
    }
    var expandoProxyTargets = new WeakMap();
    // Not doing this because it implements all the derived traps, requiring
    // us to do the same. Instead, we use its prototype selectively, whee.
    //inherit(ExpandoProxyHandler, ProxyHandler);

    ExpandoProxyHandler.register = function (proxy, handler) {
      expandoProxyTargets.set(proxy, handler);
    };

    /**
     * If obj is an expando proxy, return the underlying object. This is used
     * to apply non-expando properties to the object outside of its constructor.
     *
     * This is not robust against spoofing because it is only used during
     * initialization.
     */
    ExpandoProxyHandler.unwrap = function (obj) {
      return expandoProxyTargets.has(obj) ? expandoProxyTargets.get(obj) : obj;
    };

    ExpandoProxyHandler.prototype.getOwnPropertyDescriptor = function (name) {
      if (name === "ident___") {
        // Caja WeakMap emulation internal property
        return Object.getOwnPropertyDescriptor(this, "ident");
      } else {
        return Object.getOwnPropertyDescriptor(this.storage, name);
      }
    };
    ExpandoProxyHandler.prototype.getPropertyDescriptor = function (name) {
      var desc = this.getOwnPropertyDescriptor(name)
          || getPropertyDescriptor(this.target, name);
      return desc;
    };
    ExpandoProxyHandler.prototype.getOwnPropertyNames = function () {
      return Object.getOwnPropertyNames(
          this.storage || {});
    };
    ExpandoProxyHandler.prototype.defineProperty = function (name, descriptor) {
      if (name === "ident___") {
        if (descriptor.set === null) descriptor.set = undefined;
        Object.defineProperty(this, "ident", descriptor);
      } else if (name in this.target) {
        // Forwards everything already defined (not expando).
        return ProxyHandler.prototype.defineProperty.call(this, name,
            descriptor);
      } else {
        if (!this.editable) { throw new Error("Not editable"); }
        Object.defineProperty(this.storage, name, descriptor);
        return true;
      }
      return false;
    };
    ExpandoProxyHandler.prototype['delete'] = function (name) {
      if (name === "ident___") {
        return false;
      } else if (name in this.target) {
        // Forwards everything already defined (not expando).
        return ProxyHandler.prototype['delete'].call(this, name);
      } else {
        if (!this.editable) { throw new Error("Not editable"); }
        return delete this.storage[name];
      }
      return false;
    };
    ExpandoProxyHandler.prototype.fix = function () {
      // TODO(kpreid): Implement fixing, because it is possible to freeze a
      // host DOM node and so ours should support it too.
      return undefined;
    };

    // Derived traps
    ExpandoProxyHandler.prototype.get = domitaModules.permuteProxyGetSet.getter(
        function (name) {
      // Written for an ES5/3 bug, but probably useful for efficiency too.
      if (name === "ident___") {
        // Caja WeakMap emulation internal property
        return this.ident;
      } else if (Object.prototype.hasOwnProperty.call(this.storage, name)) {
        return this.storage[name];
      } else {
        return this.target[name];
      }
    });
    ExpandoProxyHandler.prototype.enumerate = function () {
      // This derived trap shouldn't be necessary, but Firebug won't complete
      // properties without it (FF 4.0.1, Firebug 1.7.1, 2011-06-02).
      var names = [];
      for (var k in this.target) names.push(k);
      for (var k in this.storage) names.push(k);
      return names;
    };
    ExpandoProxyHandler.prototype.set = domitaModules.permuteProxyGetSet.setter(
        function (name, val, receiver) {
      // NOTE: this was defined to work around what might be a FF4 or
      // FF4+initSES bug or a bug in our get[Own]PropertyDescriptor that made
      // the innerHTML setter not be invoked.
      // It is, in fact, an exact copy of the default derived trap code from
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Proxy
      // as of 2011-05-25.
      var desc = this.getOwnPropertyDescriptor(name);
      if (desc) {
        if ('writable' in desc) {
          if (desc.writable) {
            desc.value = val;
            this.defineProperty(name, desc);
            return true;
          } else {
            return false;
          }
        } else { // accessor
          if (desc.set) {
            desc.set.call(receiver, val);
            return true;
          } else {
            return false;
          }
        }
      }
      desc = this.getPropertyDescriptor(name);
      if (desc) {
        if ('writable' in desc) {
          if (desc.writable) {
            // fall through
          } else {
            return false;
          }
        } else { // accessor
          if (desc.set) {
            desc.set.call(receiver, val);
            return true;
          } else {
            return false;
          }
        }
      }
      this.defineProperty(name, {
        value: val,
        writable: true,
        enumerable: true,
        configurable: true});
      return true;
    });

    return cajaVM.def(ExpandoProxyHandler);
  })();

  /** XMLHttpRequest or an equivalent on IE 6. */
  domitaModules.XMLHttpRequestCtor = function (makeDOMAccessible,
      XMLHttpRequest, ActiveXObject, XDomainRequest) {
    if (XMLHttpRequest &&
      makeDOMAccessible(new XMLHttpRequest()).withCredentials !== undefined) {
      return XMLHttpRequest;
    } else if (XDomainRequest) { 
      return function XDomainRequestObjectForIE() {
        var xdr = makeDOMAccessible(new XDomainRequest());
        xdr.onload = function () {
          if ('function' === typeof xdr.onreadystatechange) {
            xdr.status = 200;
            xdr.readyState = 4;
            xdr.onreadystatechange.call(xdr, null, false);
          }
        };
        var errorHandler = function () {
          if ('function' === typeof xdr.onreadystatechange) {
            xdr.status = 500;
            xdr.readyState = 4;
            xdr.onreadystatechange.call(xdr, null, false);
          }
        };
        xdr.onerror = errorHandler;
        xdr.ontimeout = errorHandler;
        return xdr;
      };
    } else if (ActiveXObject) {
     // The first time the ctor is called, find an ActiveX class supported by
     // this version of IE.
      var activeXClassId;
      return function ActiveXObjectForIE() {
        if (activeXClassId === void 0) {
          activeXClassId = null;
          /** Candidate Active X types. */
          var activeXClassIds = [
              'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
              'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP',
              'MICROSOFT.XMLHTTP.1.0', 'MICROSOFT.XMLHTTP.1',
              'MICROSOFT.XMLHTTP'];
          for (var i = 0, n = activeXClassIds.length; i < n; i++) {
            var candidate = activeXClassIds[+i];
            try {
              void new ActiveXObject(candidate);
              activeXClassId = candidate;
              break;
            } catch (e) {
              // do nothing; try next choice
            }
          }
          activeXClassIds = null;
        }
        return new ActiveXObject(activeXClassId);
      };
    } else {
      throw new Error('ActiveXObject not available');
    }
  };

  domitaModules.TameXMLHttpRequest = function(
      taming,
      rulebreaker,
      xmlHttpRequestMaker,
      naiveUriPolicy) {
    var Confidence = domitaModules.Confidence;
    var setOwn = domitaModules.setOwn;
    var canHaveEnumerableAccessors = domitaModules.canHaveEnumerableAccessors;
    // See http://www.w3.org/TR/XMLHttpRequest/

    // TODO(ihab.awad): Improve implementation (interleaving, memory leaks)
    // per http://www.ilinsky.com/articles/XMLHttpRequest/

    var TameXHRConf = new Confidence('TameXMLHttpRequest');
    var p = TameXHRConf.p.bind(TameXHRConf);
    var method = TameXHRConf.protectMethod;

    // Note: Since there is exactly one TameXMLHttpRequest per feral XHR, we do
    // not use an expando proxy and always let clients set expando properties
    // directly on this. This simplifies implementing onreadystatechange.
    function TameXMLHttpRequest() {
      TameXHRConf.confide(this);
      var xhr = p(this).feral =
          rulebreaker.makeDOMAccessible(new xmlHttpRequestMaker());
      taming.tamesTo(xhr, this);
    }
    Object.defineProperties(TameXMLHttpRequest.prototype, {
      onreadystatechange: {
        enumerable: canHaveEnumerableAccessors,
        set: method(function (handler) {
          // TODO(ihab.awad): Do we need more attributes of the event than
          // 'target'? May need to implement full "tame event" wrapper similar
          // to DOM events.
          var self = this;
          p(this).feral.onreadystatechange = function (event) {
            var evt = { target: self };
            return handler.call(void 0, evt);
          };
          // Store for later direct invocation if need be
          p(this).handler = handler;
        })
      },
      readyState: {
        enumerable: canHaveEnumerableAccessors,
        get: method(function () {
          // The ready state should be a number
          return Number(p(this).feral.readyState);
        })
      },
      responseText: {
        enumerable: canHaveEnumerableAccessors,
        get: method(function () {
          var result = p(this).feral.responseText;
          return (result === undefined || result === null) ?
            result : String(result);
        })
      },
      responseXML: {
        enumerable: canHaveEnumerableAccessors,
        get: method(function () {
          var feralXml = p(this).feral.responseXML;
          if (feralXml === null || feralXml === undefined) {
            // null = 'The response did not parse as XML.'
            return null;
          } else {
            // TODO(ihab.awad): Implement a taming layer for XML. Requires
            // generalizing the HTML node hierarchy as well so we have a unified
            // implementation.

            // This kludge is just enough to keep the jQuery tests from freezing.
            var node = {nodeName: '#document'};
            node.cloneNode = function () { return node; };
            node.toString = function () {
              return 'Caja does not support XML.';
            };
            return {documentElement: node};
          }
        })
      },
      status: {
        enumerable: canHaveEnumerableAccessors,
        get: method(function () {
          var result = p(this).feral.status;
          return (result === undefined || result === null) ?
            result : Number(result);
        })
      },
      statusText: {
        enumerable: canHaveEnumerableAccessors,
        get: method(function () {
          var result = p(this).feral.statusText;
          return (result === undefined || result === null) ?
            result : String(result);
        })
      }
    });
    TameXMLHttpRequest.prototype.open = method(function (
        method, URL, opt_async, opt_userName, opt_password) {
      method = String(method);
      // The XHR interface does not tell us the MIME type in advance, so we
      // must assume the broadest possible.
      var safeUri = uriRewrite(
          naiveUriPolicy,
          String(URL), html4.ueffects.SAME_DOCUMENT, html4.ltypes.DATA,
          {
            "TYPE": "XHR",
            "XHR_METHOD": method,
            "XHR": true  // Note: this hint is deprecated
          });
      // If the uriPolicy rejects the URL, we throw an exception, but we do
      // not put the URI in the exception so as not to put the caller at risk
      // of some code in its stack sniffing the URI.
      if ("string" !== typeof safeUri) { throw 'URI violates security policy'; }
      switch (arguments.length) {
      case 2:
        p(this).async = true;
        p(this).feral.open(method, safeUri);
        break;
      case 3:
        p(this).async = opt_async;
        p(this).feral.open(method, safeUri, Boolean(opt_async));
        break;
      case 4:
        p(this).async = opt_async;
        p(this).feral.open(
            method, safeUri, Boolean(opt_async), String(opt_userName));
        break;
      case 5:
        p(this).async = opt_async;
        p(this).feral.open(
            method, safeUri, Boolean(opt_async), String(opt_userName),
            String(opt_password));
        break;
      default:
        throw 'XMLHttpRequest cannot accept ' + arguments.length + ' arguments';
        break;
      }
    });
    TameXMLHttpRequest.prototype.setRequestHeader = method(
        function (label, value) {
      p(this).feral.setRequestHeader(String(label), String(value));
    });
    TameXMLHttpRequest.prototype.send = method(function(opt_data) {
      if (arguments.length === 0) {
        // TODO(ihab.awad): send()-ing an empty string because send() with no
        // args does not work on FF3, others?
        p(this).feral.send('');
      } else if (typeof opt_data === 'string') {
        p(this).feral.send(opt_data);
      } else /* if XML document */ {
        // TODO(ihab.awad): Expect tamed XML document; unwrap and send
        p(this).feral.send('');
      }

      // Firefox does not call the 'onreadystatechange' handler in
      // the case of a synchronous XHR. We simulate this behavior by
      // calling the handler explicitly.
      if (p(this).feral.overrideMimeType) {
        // This is Firefox
        if (!p(this).async && p(this).handler) {
          var evt = { target: this };
          p(this).handler.call(void 0, evt);
        }
      }
    });
    TameXMLHttpRequest.prototype.abort = method(function () {
      p(this).feral.abort();
    });
    TameXMLHttpRequest.prototype.getAllResponseHeaders = method(function () {
      var result = p(this).feral.getAllResponseHeaders();
      return (result === undefined || result === null) ?
        result : String(result);
    });
    TameXMLHttpRequest.prototype.getResponseHeader = method(
        function (headerName) {
      var result = p(this).feral.getResponseHeader(String(headerName));
      return (result === undefined || result === null) ?
        result : String(result);
    });
    /*SES*/setOwn(TameXMLHttpRequest.prototype, "toString", method(function () {
      return 'Not a real XMLHttpRequest';
    }));

    return cajaVM.def(TameXMLHttpRequest);
  };

  // TODO(kpreid): Review whether this has unnecessary features (as we're
  // statically generating Style accessors rather than proxy/handler-ing
  // Domita did).
  domitaModules.CssPropertiesCollection = function(aStyleObject) {
    var canonicalStylePropertyNames = {};
    // Maps style property names, e.g. cssFloat, to property names, e.g. float.
    var cssPropertyNames = {};

    for (var cssPropertyName in cssSchema) {
      var baseStylePropertyName = cssPropertyName.replace(
          /-([a-z])/g, function (_, letter) { return letter.toUpperCase(); });
      var canonStylePropertyName = baseStylePropertyName;
      cssPropertyNames[baseStylePropertyName]
          = cssPropertyNames[canonStylePropertyName]
          = cssPropertyName;
      var alts = cssSchema[cssPropertyName].cssAlternates;
      if (alts) {
        for (var i = alts.length; --i >= 0;) {
          cssPropertyNames[alts[+i]] = cssPropertyName;
          // Handle oddities like cssFloat/styleFloat.
          if (alts[+i] in aStyleObject
              && !(canonStylePropertyName in aStyleObject)) {
            canonStylePropertyName = alts[+i];
          }
        }
      }
      canonicalStylePropertyNames[cssPropertyName] = canonStylePropertyName;
    }

    return {
      isCanonicalProp: function (p) {
        return cssPropertyNames.hasOwnProperty(p);
      },
      isCssProp: function (p) {
        return canonicalStylePropertyNames.hasOwnProperty(p);
      },
      getCanonicalPropFromCss: function (p) {
        return canonicalStylePropertyNames[p];
      },
      getCssPropFromCanonical: function(p) {
        return cssPropertyNames[p];
      },
      forEachCanonical: function (f) {
        for (var p in cssPropertyNames) {
          if (cssPropertyNames.hasOwnProperty(p)) {
            f(p);
          }
        }
      }
    };
  };

  cajaVM.def(domitaModules);

  /**
   * Authorize the Domado library.
   *
   * The result of this constructor is almost stateless. The exceptions are
   * that each instance has unique trademarks for certain types of tamed
   * objects, and a shared map allowing separate virtual documents to dispatch
   * events across them. (TODO(kpreid): Confirm this explanation is good.)
   *
   * @param {Object} taming. An interface to a taming membrane.
   * @param {Object} opt_rulebreaker. If necessary, authorities to break the
   *     ES5/3 taming membrane and work with the taming-frame system. If
   *     running under SES, pass null instead.
   * @return A record of functions attachDocument, dispatchEvent, and
   *     dispatchToHandler.
   */
  return function Domado(opt_rulebreaker) {
    // Everything in this scope but not in function attachDocument() below
    // does not contain lexical references to a particular DOM instance, but
    // may have some kind of privileged access to Domado internals.

    // This is only used if opt_rulebreaker is absent (because the plugin ids
    // are normally managed by es53 when it is not). TODO(kpreid): Is there a
    // more sensible place to put this management, which would be used in both
    // modes?
    var importsToId = new WeakMap(true);
    var idToImports = [];
    var nextPluginId = 0;

    // This parameter is supplied in the ES5/3 case and not in the ES5+SES case.
    var rulebreaker = opt_rulebreaker ? opt_rulebreaker : cajaVM.def({
      // These are the stub versions used when in ES5+SES.
      makeDOMAccessible: function (o) {return o;},
      makeFunctionAccessible: function (o) {return o;},
      writeToPixelArray: function (source, target, length) {
        // See the use below for why this exists.
        for (var i = length-1; i >= 0; i--) {
          target[+i] = source[+i];
        }
      },

      getId: function (imports) {
        if (importsToId.has(imports)) {
          return importsToId.get(imports);
        } else {
          var id = nextPluginId++;
          importsToId.set(imports, id);
          idToImports[id] = imports;
          return id;
        }
      },
      getImports: function (id) {
        var imports = idToImports[id];
        if (imports === undefined) {
          throw new Error('Internal: imports#', id, ' unregistered');
        }
        return imports;
      }
    });

    var makeDOMAccessible = rulebreaker.makeDOMAccessible;
    var makeFunctionAccessible = rulebreaker.makeFunctionAccessible;

    var Confidence = domitaModules.Confidence;
    var ProxyHandler = domitaModules.ProxyHandler;
    var ExpandoProxyHandler = domitaModules.ExpandoProxyHandler;
    var setOwn = domitaModules.setOwn;
    var canHaveEnumerableAccessors = domitaModules.canHaveEnumerableAccessors;

    function traceStartup(var_args) {
      //// In some versions, Firebug console's methods have no .apply. In other
      //// versions, Function.prototype.apply cannot be used on them!
      //if (typeof console !== 'undefined') {
      //  if (console.debug.apply) {
      //    console.debug.apply(console, arguments);
      //  } else {
      //    Function.prototype.apply.call(console.debug, console, arguments);
      //  }
      //}
    }

    function inherit(sub, souper) {
      sub.prototype = Object.create(souper.prototype);
      Object.defineProperty(sub.prototype, "constructor", {
        value: sub,
        writable: true,
        configurable: true
      });
    }

    /**
     * For each enumerable p: d in propDescs, do the equivalent of
     *
     *   Object.defineProperty(object, p, d)
     *
     * except that the property descriptor d can have additional keys:
     *
     *    extendedAccessors:
     *      If present and true, property accessor functions receive the
     *      property name as an additional argument.
     */
    function definePropertiesAwesomely(object, propDescs) {
      for (var prop in propDescs) {
        var desc = {};
        for (var k in propDescs[prop]) {
          desc[k] = propDescs[prop][k];
        }
        if ('get' in desc || 'set' in desc) {
          // Firefox bug workaround; see comments on canHaveEnumerableAccessors.
          desc.enumerable = desc.enumerable && canHaveEnumerableAccessors;
        }
        if (desc.extendedAccessors) {
          delete desc.extendedAccessors;
          (function (prop, extGet, extSet) {  // @*$#*;%#<$ non-lexical scoping
            if (extGet) {
              desc.get = cajaVM.def(function () {
                return extGet.call(this, prop);
              });
            }
            if (desc.set) {
              desc.set = cajaVM.def(function (value) {
                return extSet.call(this, value, prop);
              });
            }
          })(prop, desc.get, desc.set);
        }
        if (desc.get && !Object.isFrozen(desc.get)) {
          if (typeof console !== 'undefined') {
            console.warn("Getter for ", prop, " of ", object,
                " is not frozen; fixing.");
          }
          cajaVM.def(desc.get);
        }
        if (desc.set && !Object.isFrozen(desc.set)) {
          if (typeof console !== 'undefined') {
            console.warn("Setter for ", prop, " of ", object,
                " is not frozen; fixing.");
          }
          cajaVM.def(desc.set);
        }
        Object.defineProperty(object, prop, desc);
      }
    }

    function forOwnKeys(obj, fn) {
      for (var i in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, i)) { continue; }
        fn(i, obj[i]);
      }
    }

    // value transforming functions
    function identity(x) { return x; }
    function defaultToEmptyStr(x) { return x || ''; }

    // Array Remove - By John Resig (MIT Licensed)
    function arrayRemove(array, from, to) {
      var rest = array.slice((to || from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, rest);
    }

    // It is tempting to name this table "burglar".
    var windowToDomicile = new WeakMap();

    var TameEventConf = new Confidence('TameEvent');
    var TameEventT = TameEventConf.guard;
    var TameImageDataConf = new Confidence('TameImageData');
    var TameImageDataT = TameImageDataConf.guard;
    var TameGradientConf = new Confidence('TameGradient');
    var TameGradientT = TameGradientConf.guard;

    var eventMethod = TameEventConf.protectMethod;

    // Define a wrapper type for known safe HTML, and a trademarker.
    // This does not actually use the trademarking functions since trademarks
    // cannot be applied to strings.
    var safeHTMLTable = new WeakMap(true);
    function Html(htmlFragment) {
      // Intentionally using == rather than ===.
      var h = String(htmlFragment == null ? '' : htmlFragment);
      safeHTMLTable.put(this, htmlFragment);
      return cajaVM.def(this);
    }
    function htmlToString() {
      return safeHTMLTable.get(this);
    }
    setOwn(Html.prototype, 'valueOf', htmlToString);
    setOwn(Html.prototype, 'toString', htmlToString);
    function safeHtml(htmlFragment) {
      // Intentionally using == rather than ===.
      return (htmlFragment instanceof Html)
          ? safeHTMLTable.get(htmlFragment)
          : html.escapeAttrib(String(htmlFragment == null ? '' : htmlFragment));
    }
    function blessHtml(htmlFragment) {
      return (htmlFragment instanceof Html)
          ? htmlFragment
          : new Html(htmlFragment);
    }
    cajaVM.def([Html, safeHtml, blessHtml]);

    var XML_SPACE = '\t\n\r ';

    var JS_SPACE = '\t\n\r ';
    // An identifier that does not end with __.
    var JS_IDENT = '(?:[a-zA-Z_][a-zA-Z0-9$_]*[a-zA-Z0-9$]|[a-zA-Z])_?';
    var SIMPLE_HANDLER_PATTERN = new RegExp(
        '^[' + JS_SPACE + ']*'
        + '(return[' + JS_SPACE + ']+)?'  // Group 1 is present if it returns.
        + '(' + JS_IDENT + ')[' + JS_SPACE + ']*'  // Group 2 is a func name.
        // Which can be passed optionally the event, and optionally this node.
        + '\\((?:event'
          + '(?:[' + JS_SPACE + ']*,[' + JS_SPACE + ']*this)?'
          + '[' + JS_SPACE + ']*)?\\)'
        // And it can end with a semicolon.
        + '[' + JS_SPACE + ']*(?:;?[' + JS_SPACE + ']*)$');

    // These id patterns match the ones in HtmlAttributeRewriter.

    var VALID_ID_CHAR =
        unicode.LETTER + unicode.DIGIT + '_'
        + '$\\-.:;=()\\[\\]'
        + unicode.COMBINING_CHAR + unicode.EXTENDER;

    var VALID_ID_PATTERN = new RegExp(
        '^[' + VALID_ID_CHAR + ']+$');

    var VALID_ID_LIST_PATTERN = new RegExp(
        '^[' + XML_SPACE + VALID_ID_CHAR + ']*$');

    var FORBIDDEN_ID_PATTERN = new RegExp('__\\s*$');

    var FORBIDDEN_ID_LIST_PATTERN = new RegExp('__(?:\\s|$)');

    function isValidId(s) {
      return !FORBIDDEN_ID_PATTERN.test(s)
          && VALID_ID_PATTERN.test(s);
    }

    function isValidIdList(s) {
      return !FORBIDDEN_ID_LIST_PATTERN.test(s)
          && VALID_ID_LIST_PATTERN.test(s);
    }

    // Trim whitespace from the beginning and end of a string, using this
    // definition of whitespace:
    // per http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#space-character
    function trimHTML5Spaces(input) {
      return input.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
    }

    function mimeTypeForAttr(tagName, attribName) {
      if (attribName === 'src') {
        if (tagName === 'img') { return 'image/*'; }
        if (tagName === 'script') { return 'text/javascript'; }
      }
      return '*/*';
    }

    // TODO(ihab.awad): Does this work on IE, where console output
    // goes to a DOM node?
    function assert(cond) {
      if (!cond) {
        if (typeof console !== 'undefined') {
          console.error('domita assertion failed');
          console.trace();
        }
        throw new Error("Domita assertion failed");
      }
    }

    var cssSealerUnsealerPair = cajaVM.makeSealerUnsealerPair();

    /*
     * Implementations of setTimeout, setInterval, clearTimeout, and
     * clearInterval that only allow simple functions as timeouts and
     * that treat timeout ids as capabilities.
     * This is safe even if accessed across frame since the same
     * map is never used with more than one version of setTimeout.
     */
    function tameSetAndClear(target, set, clear, setName, clearName) {
      var ids = new WeakMap();
      makeFunctionAccessible(set);
      makeFunctionAccessible(clear);
      function tameSet(action, delayMillis) {
        // Existing browsers treat a timeout/interval of null or undefined as a
        // noop.
        var id;
        if (action) {
          if (typeof action !== 'function') {
            // Early error for usability -- we also defend below.
            // This check is not *necessary* for security.
            throw new Error(
                setName + ' called with a ' + typeof action + '.'
                + '  Please pass a function instead of a string of JavaScript');
          }
          // actionWrapper defends against:
          //   * Passing a string-like object which gets taken as code.
          //   * Non-standard arguments to the callback.
          //   * Non-standard effects of callback's return value.
          var actionWrapper = function() {
            action();
          };
          id = set(actionWrapper, delayMillis | 0);
        } else {
          id = undefined;
        }
        var tamed = {};
        ids.set(tamed, id);
        return tamed;
      }
      function tameClear(id) {
        // From https://developer.mozilla.org/en/DOM/window.clearTimeout says:
        //   Notes:
        //   Passing an invalid ID to clearTimeout does not have any effect
        //   (and doesn't throw an exception).

        // WeakMap will throw on these, so early exit.
        if (typeof id !== 'object' || id == null) { return; }

        var feral = ids.get(id);
        if (feral !== undefined) clear(feral);  // noop if not found
      }
      target[setName] = cajaVM.def(tameSet);
      target[clearName] = cajaVM.def(tameClear);
      return target;
    }

    function makeScrollable(bridal, element) {
      var overflow = bridal.getComputedStyle(element, void 0).overflow;
      switch (overflow && overflow.toLowerCase()) {
        case 'visible':
        case 'hidden':
          makeDOMAccessible(element.style);
          element.style.overflow = 'auto';
          break;
      }
    }

    /**
     * Moves the given pixel within the element's frame of reference as close to
     * the top-left-most pixel of the element's viewport as possible without
     * moving the viewport beyond the bounds of the content.
     * @param {number} x x-coord of a pixel in the element's frame of reference.
     * @param {number} y y-coord of a pixel in the element's frame of reference.
     */
    function tameScrollTo(element, x, y) {
      if (x !== +x || y !== +y || x < 0 || y < 0) {
        throw new Error('Cannot scroll to ' + x + ':' + typeof x + ','
                        + y + ' : ' + typeof y);
      }
      element.scrollLeft = x;
      element.scrollTop = y;
    }

    /**
     * Moves the origin of the given element's view-port by the given offset.
     * @param {number} dx a delta in pixels.
     * @param {number} dy a delta in pixels.
     */
    function tameScrollBy(element, dx, dy) {
      if (dx !== +dx || dy !== +dy) {
        throw new Error('Cannot scroll by ' + dx + ':' + typeof dx + ', '
                        + dy + ':' + typeof dy);
      }
      element.scrollLeft += dx;
      element.scrollTop += dy;
    }

    function guessPixelsFromCss(cssStr) {
      if (!cssStr) { return 0; }
      var m = cssStr.match(/^([0-9]+)/);
      return m ? +m[1] : 0;
    }

    function tameResizeTo(element, w, h) {
      if (w !== +w || h !== +h) {
        throw new Error('Cannot resize to ' + w + ':' + typeof w + ', '
                        + h + ':' + typeof h);
      }
      makeDOMAccessible(element.style);
      element.style.width = w + 'px';
      element.style.height = h + 'px';
    }

    function tameResizeBy(element, dw, dh) {
      if (dw !== +dw || dh !== +dh) {
        throw new Error('Cannot resize by ' + dw + ':' + typeof dw + ', '
                        + dh + ':' + typeof dh);
      }
      if (!dw && !dh) { return; }

      // scrollWidth is width + padding + border.
      // offsetWidth is width + padding + border, but excluding the non-visible
      // area.
      // clientWidth iw width + padding, and like offsetWidth, clips to the
      // viewport.
      // margin does not count in any of these calculations.
      //
      // scrollWidth/offsetWidth
      //   +------------+
      //   |            |
      //
      // +----------------+
      // |                | Margin-top
      // | +------------+ |
      // | |############| | Border-top
      // | |#+--------+#| |
      // | |#|        |#| | Padding-top
      // | |#| +----+ |#| |
      // | |#| |    | |#| | Height
      // | |#| |    | |#| |
      // | |#| +----+ |#| |
      // | |#|        |#| |
      // | |#+--------+#| |
      // | |############| |
      // | +------------+ |
      // |                |
      // +----------------+
      //
      //     |        |
      //     +--------+
      //     clientWidth (but excludes content outside viewport)

      var style = makeDOMAccessible(element.currentStyle);
      if (!style) {
        style = makeDOMAccessible(
            bridalMaker.getWindow(element, makeDOMAccessible)
            .getComputedStyle(element, void 0));
      }

      makeDOMAccessible(element.style);

      // We guess the padding since it's not always expressed in px on IE
      var extraHeight = guessPixelsFromCss(style.paddingBottom)
          + guessPixelsFromCss(style.paddingTop);
      var extraWidth = guessPixelsFromCss(style.paddingLeft)
          + guessPixelsFromCss(style.paddingRight);

      var goalHeight = element.clientHeight + dh;
      var goalWidth = element.clientWidth + dw;

      var h = goalHeight - extraHeight;
      var w = goalWidth - extraWidth;

      if (dh) { element.style.height = Math.max(0, h) + 'px'; }
      if (dw) { element.style.width = Math.max(0, w) + 'px'; }

      // Correct if our guesses re padding and borders were wrong.
      // We may still not be able to resize if e.g. the deltas would take
      // a dimension negative.
      if (dh && element.clientHeight !== goalHeight) {
        var hError = element.clientHeight - goalHeight;
        element.style.height = Math.max(0, h - hError) + 'px';
      }
      if (dw && element.clientWidth !== goalWidth) {
        var wError = element.clientWidth - goalWidth;
        element.style.width = Math.max(0, w - wError) + 'px';
      }
    }

    /**
     * Add a tamed document implementation to a Gadget's global scope.
     *
     * Has the side effect of adding the classes "vdoc-container___" and
     * idSuffix.substring(1) to the containerNode.
     *
     * @param {string} idSuffix a string suffix appended to all node IDs.
     *     It should begin with "-" and end with "___".
     * @param {Object} uriPolicy an object like <pre>{
     *   rewrite: function (uri, uriEffect, loaderType, hints) {
     *      return safeUri
     *   }
     * }</pre>.
     *       * uri: the uri to be rewritten
     *       * uriEffect: the effect that allowing a URI to load has (@see
     *         UriEffect.java).
     *       * loaderType: type of loader that would load the URI or the
     *         rewritten
     *         version.
     *       * hints: record that describes the context in which the URI
     *         appears.
     *         If a hint is not present it should not be relied upon.
     *     The rewrite function should be idempotent to allow rewritten HTML
     *     to be reinjected.
     * @param {Node} containerNode an HTML node to contain the children of the
     *     virtual Document node provided to Cajoled code.
     * @param {Object} optTargetAttributePresets a record containing the presets
     *     (default and whitelist) for the HTML "target" attribute.
     * @return {Object} A collection of privileged access tools, plus the tamed
     *     {@code document} and {@code window} objects under those names. This
     *     object is known as a "domicile".
     */
    function attachDocument(
      idSuffix, naiveUriPolicy, containerNode, optTargetAttributePresets,
        taming) {

      if (arguments.length < 3) {
        throw new Error(
            'attachDocument arity mismatch: ' + arguments.length);
      }
      if (!optTargetAttributePresets) {
        optTargetAttributePresets = {
          'default': '_blank',
          whitelist: [ '_blank', '_self' ]
        };
      }

      var domicile = {
        isProcessingEvent: false
      };
      var pluginId;

      containerNode = makeDOMAccessible(containerNode);
      var document = containerNode.ownerDocument;
      document = makeDOMAccessible(document);
      var docEl = makeDOMAccessible(document.documentElement);
      var bridal = bridalMaker(makeDOMAccessible, document);

      var window = bridalMaker.getWindow(containerNode, makeDOMAccessible);
      window = makeDOMAccessible(window);

      var elementPolicies = {};
      elementPolicies.form = function (attribs) {
        // Forms must have a gated onsubmit handler or they must have an
        // external target.
        var sawHandler = false;
        for (var i = 0, n = attribs.length; i < n; i += 2) {
          if (attribs[+i] === 'onsubmit') {
            sawHandler = true;
          }
        }
        if (!sawHandler) {
          attribs.push('onsubmit', 'return false');
        }
        return forceAutocompleteOff(attribs);
      };
      elementPolicies.input = function (attribs) {
        return forceAutocompleteOff(attribs);
      };

      function forceAutocompleteOff(attribs) {
        var a = [];
        for (var i = 0, n = attribs.length; i < n; i += 2) {
          if (attribs[+i] !== 'autocomplete') {
            a.push(attribs[+i], attribs[+i+1]);
          }
        }
        a.push('autocomplete', 'off');
        return a;
      }

      // TODO(kpreid): should elementPolicies be exported in domicile?

      // On IE, turn <canvas> tags into canvas elements that explorercanvas
      // will recognize
      bridal.initCanvasElements(containerNode);

      // The private properties used in TameNodeConf are:
      //    feral (feral node)
      //    editable (this node editable)
      //    childrenEditable (this node editable)
      //    Several specifically for TameHTMLDocument.
      // Furthermore, by virtual of being scoped inside attachDocument,
      // TameNodeT also indicates that the object is a node from the *same*
      // virtual document.
      // TODO(kpreid): Review how necessary it is to scope this inside
      // attachDocument. The issues are:
      //   * Using authority or types from a different virtual document (check
      //     the things that used to be TameHTMLDocument.doc___ in particular)
      //   * Using nodes from a different real document (Domita would seem to
      //     be vulnerable to this?)
      var TameNodeConf = new Confidence('TameNode');
      var TameNodeT = TameNodeConf.guard;
      var np = TameNodeConf.p.bind(TameNodeConf);

      // A map from tame nodes to their expando proxies, used when only the tame
      // node is available and the proxy is needed to return to the client.
      var tamingProxies = new WeakMap();

      /**
       * Call this on every TameNode after it is constructed, and use its return
       * value instead of the node.
       *
       * TODO(kpreid): Is this the best way to handle things which need to be
       * done after the outermost constructor?
       */
      function finishNode(node) {
        var feral = np(node).feral;

        if (domitaModules.proxiesAvailable) {
          // If running with proxies, it is indicative of something going wrong
          // if our objects are mutated (the expando proxy handler should
          // intercept writes). If running without proxies, then we need to be
          // unfrozen so that assignments to expando fields work.
          Object.freeze(node);

          // The proxy construction is deferred until now because the ES5/3
          // implementation of proxies requires that the proxy's prototype is
          // frozen.
          var proxiedNode = Proxy.create(np(node).proxyHandler, node);
          delete np(node).proxyHandler;  // no longer needed

          ExpandoProxyHandler.register(proxiedNode, node);
          TameNodeConf.confide(proxiedNode, node);
          tamingProxies.set(node, proxiedNode);

          node = proxiedNode;
        }

        if (feral) {
          if (node.nodeType === 1) {
            // Elements must only be tamed once; to do otherwise would be
            // a bug in Domado.
            taming.tamesTo(feral, node);
          } else {
            // Other node types are tamed every time they are encountered;
            // we simply remember the latest taming here.
            taming.reTamesTo(feral, node);
          }
        } else {
          // If guest code passes a node of its own with no feral counterpart to
          // host code, we pass the empty object "{}". This is a safe behavior
          // until experience determines we need something more complex.
          taming.tamesTo({}, node);
        }

        return node;
      }

      var nodeMethod = TameNodeConf.protectMethod;

      /**
       * Sanitizes the value of a CSS property, the {@code red} in
       * {@code color:red}.
       * @param cssPropertyName a canonical CSS property name
       *    {@code "font-family"} not {@code "fontFamily"}.
       */
      function sanitizeStyleProperty(cssPropertyName, tokens) {
        var schema = cssSchema[cssPropertyName];
        if (!schema) {
          tokens.length = 0;
          return false;
        }
        sanitizeCssProperty(
            cssPropertyName,
            schema, tokens,
            naiveUriPolicy
            ? function (url) {
                return uriRewrite(
                    naiveUriPolicy,
                    url, html4.ueffects.SAME_DOCUMENT,
                    html4.ltypes.SANDBOXED,
                    {
                      "TYPE": "CSS",
                      "CSS_PROP": cssPropertyName
                    });
              }
            : null,
            domicile.pseudoLocation.href);
        return tokens.length !== 0;
      }

      /**
       * Sanitize the 'style' attribute value of an HTML element.
       *
       * @param styleAttrValue the value of a 'style' attribute, which we
       * assume has already been checked by the caller to be a plain String.
       *
       * @return a sanitized version of the attribute value.
       */
      function sanitizeStyleAttrValue(styleAttrValue) {
        var sanitizedDeclarations = [];
        parseCssDeclarations(
            String(styleAttrValue),
            {
              declaration: function (property, value) {
                property = property.toLowerCase();
                sanitizeStyleProperty(property, value);
                sanitizedDeclarations.push(property + ': ' + value.join(' '));
              }
            });
        return sanitizedDeclarations.join(' ; ');
      }

      /** Sanitize HTML applying the appropriate transformations. */
      function sanitizeHtml(htmlText) {
        var out = [];
        htmlSanitizer(htmlText, out);
        return out.join('');
      }
      function sanitizeAttrs(tagName, attribs) {
        var n = attribs.length;
        var needsTargetAttrib =
            html4.ATTRIBS.hasOwnProperty(tagName + '::target');
        for (var i = 0; i < n; i += 2) {
          var attribName = attribs[+i];
          if ('target' === attribName) { needsTargetAttrib = false; }
          var value = attribs[+i + 1];
          var atype = null, attribKey;
          if ((attribKey = tagName + '::' + attribName,
               html4.ATTRIBS.hasOwnProperty(attribKey)) ||
              (attribKey = '*::' + attribName,
               html4.ATTRIBS.hasOwnProperty(attribKey))) {
            atype = html4.ATTRIBS[attribKey];
            value = rewriteAttribute(tagName, attribName, atype, value);
            if (atype === html4.atype.URI &&
              !!value && value.charAt(0) === '#') {
              needsTargetAttrib = false;
            }
          } else if (!/__$/.test(attribKey)) {
            attribName = attribs[+i] = cajaPrefix + attribs[+i];
          } else {
            value = null;
          }
          if (value !== null && value !== void 0) {
            attribs[+i + 1] = value;
          } else {
            // Swap last attribute name/value pair in place, and reprocess here.
            // This could affect how user-agents deal with duplicate attributes.
            attribs[+i + 1] = attribs[--n];
            attribs[+i] = attribs[--n];
            i -= 2;
          }
        }
        attribs.length = n;
        if (needsTargetAttrib) {
          attribs.push('target', optTargetAttributePresets['default']);
        }
        var policy = elementPolicies[tagName];
        if (policy && elementPolicies.hasOwnProperty(tagName)) {
          return policy(attribs);
        }
        return attribs;
      }
      function tagPolicy(tagName, attrs) {
        var schemaElem = htmlSchema.element(tagName);
        if (!schemaElem.allowed) {
          if (schemaElem.shouldVirtualize) {
            return {
              tagName: htmlSchema.virtualToRealElementName(tagName),
              attribs: sanitizeAttrs(tagName, attrs)
            };
          } else {
            return null;
          }
        } else {
          return {
            attribs: sanitizeAttrs(tagName, attrs)
          };
        }
      }
      var htmlSanitizer = html.makeHtmlSanitizer(tagPolicy);

      /**
       * If str ends with suffix,
       * and str is not identical to suffix,
       * then return the part of str before suffix.
       * Otherwise return fail.
       */
      function unsuffix(str, suffix, fail) {
        if (typeof str !== 'string') return fail;
        var n = str.length - suffix.length;
        if (0 < n && str.substring(n) === suffix) {
          return str.substring(0, n);
        } else {
          return fail;
        }
      }

      var ID_LIST_PARTS_PATTERN = new RegExp(
        '([^' + XML_SPACE + ']+)([' + XML_SPACE + ']+|$)', 'g');

      /** Convert a real attribute value to the value seen in a sandbox. */
      function virtualizeAttributeValue(attrType, realValue) {
        realValue = String(realValue);
        switch (attrType) {
          case html4.atype.GLOBAL_NAME:
          case html4.atype.ID:
          case html4.atype.IDREF:
            return unsuffix(realValue, idSuffix, null);
          case html4.atype.IDREFS:
            return realValue.replace(ID_LIST_PARTS_PATTERN,
                function(_, id, spaces) {
                  return unsuffix(id, idSuffix, '') + (spaces ? ' ' : '');
                });
          case html4.atype.URI:
            if (realValue && '#' === realValue.charAt(0)) {
              return unsuffix(realValue, idSuffix, realValue);
            } else {
              return realValue;
            }
          case html4.atype.URI_FRAGMENT:
            if (realValue && '#' === realValue.charAt(0)) {
              return unsuffix(realValue, idSuffix, null);
            } else {
              return null;
            }
          default:
            return realValue;
        }
      }

      /**
       * Undoes some of the changes made by sanitizeHtml, e.g. stripping ID
       * prefixes.
       */
      function tameInnerHtml(htmlText) {
        var out = [];
        innerHtmlTamer(htmlText, out);
        return out.join('');
      }
      var innerHtmlTamer = html.makeSaxParser({
          startTag: function (tagName, attribs, out) {
            tagName = realToVirtualElementName(tagName);
            out.push('<', tagName);
            for (var i = 0; i < attribs.length; i += 2) {
              var aname = '' + attribs[+i];
              var atype = htmlSchema.attribute(tagName, aname).type;
              var value = attribs[i + 1];
              if (aname !== 'target' && atype !== void 0) {
                value = virtualizeAttributeValue(atype, value);
                if (typeof value === 'string') {
                  out.push(' ', aname, '="', html.escapeAttrib(value), '"');
                }
              } else if (cajaPrefRe.test(aname)) {
                out.push(' ', aname.substring(cajaPrefix.length), '="',
                    html.escapeAttrib(value), '"');
              }
            }
            out.push('>');
          },
          endTag: function (tagName, out) {
            var rempty = htmlSchema.element(tagName).empty;
            tagName = realToVirtualElementName(tagName);
            var vempty = htmlSchema.element(tagName).empty;
            if (vempty && !rempty) {
              // omit end tag because the browser doesn't see the virtualized
              // element as empty
              return;
            }
            out.push('</', tagName, '>');
          },
          pcdata: function (text, out) { out.push(text); },
          rcdata: function (text, out) { out.push(text); },
          cdata: function (text, out) { out.push(text); }
        });

      function getSafeTargetAttribute(tagName, attribName, value) {
        if (value !== null) {
          value = String(value);
          for (var i = 0; i < optTargetAttributePresets.whitelist.length; ++i) {
            if (optTargetAttributePresets.whitelist[i] === value) {
              return value;
            }
          }
        }
        return optTargetAttributePresets['default'];
      }

      /**
       * Returns a normalized attribute value, or null if the attribute should
       * be omitted.
       * <p>This function satisfies the attribute rewriter interface defined in
       * {@link html-sanitizer.js}.  As such, the parameters are keys into
       * data structures defined in {@link html4-defs.js}.
       *
       * @param {string} tagName a canonical tag name.
       * @param {string} attribName a canonical tag name.
       * @param type as defined in html4-defs.js.
       *
       * @return {string|null} null to indicate that the attribute should not
       *   be set.
       */
      function rewriteAttribute(tagName, attribName, type, value) {
        switch (type) {
          case html4.atype.NONE:
            // TODO(felix8a): annoying that this has to be in two places
            if (attribName === 'autocomplete'
                && (tagName === 'input' || tagName === 'form')) {
              return 'off';
            }
            return String(value);
          case html4.atype.CLASSES:
            // note, className is arbitrary CDATA.
            value = String(value);
            if (!FORBIDDEN_ID_LIST_PATTERN.test(value)) {
              return value;
            }
            return null;
          case html4.atype.GLOBAL_NAME:
          case html4.atype.ID:
          case html4.atype.IDREF:
            value = String(value);
            if (value && isValidId(value)) {
              return value + idSuffix;
            }
            return null;
          case html4.atype.IDREFS:
            value = String(value);
            if (value && isValidIdList(value)) {
              return value.replace(ID_LIST_PARTS_PATTERN,
                  function(_, id, spaces) {
                    return id + idSuffix + (spaces ? ' ' : '');
                  });
            }
            return null;
          case html4.atype.LOCAL_NAME:
            value = String(value);
            if (value && isValidId(value)) {
              return value;
            }
            return null;
          case html4.atype.SCRIPT:
            value = String(value);
            var fnNameExpr, doesReturn;
            var match = value.match(SIMPLE_HANDLER_PATTERN);
            if (match) {
              // Translate a handler that calls a simple function like
              //   return foo(this, event)
              doesReturn = !!match[1];
              fnNameExpr = '"' + match[2] + '"';
                  // safe because match[2] must be an identifier
            } else if (cajaVM.compileExpr) {
              // Compile arbitrary handler code (only in SES mode)
              doesReturn = true;
              var handlerFn = cajaVM.compileExpr(
                '(function(event) { ' + value + ' })'
              )(tameWindow);
              fnNameExpr = domicile.handlers.push(handlerFn) - 1;
            } else {
              if (typeof console !== 'undefined') {
                console.log('Rejecting complex event handler ' + tagName + ' ' +
                    attribName + '="' + value + '"');
              }
              return null;
            }
            var trustedHandler = (doesReturn ? 'return ' : '')
                + '___.plugin_dispatchEvent___('
                + 'this, event, ' + pluginId + ', '
                + fnNameExpr + ');';
            if (attribName === 'onsubmit') {
              trustedHandler =
                'try { ' + trustedHandler + ' } finally { return false; }';
            }
            return trustedHandler;
          case html4.atype.URI:
            value = String(value);
            // URI fragments reference contents within the document and
            // aren't subject to the URI policy
            if (value.charAt(0) === '#' && isValidId(value.substring(1))) {
              return value + idSuffix;
            }
            value = URI.utils.resolve(domicile.pseudoLocation.href, value);
            if (!naiveUriPolicy) { return null; }
            var schemaAttr = htmlSchema.attribute(tagName, attribName);
            return uriRewrite(
                naiveUriPolicy,
                value,
                schemaAttr.uriEffect,
                schemaAttr.loaderType,
                {
                  "TYPE": "MARKUP",
                  "XML_ATTR": attribName,
                  "XML_TAG": tagName
                }) || null;
          case html4.atype.URI_FRAGMENT:
            value = String(value);
            if (value.charAt(0) === '#' && isValidId(value.substring(1))) {
              return value + idSuffix;
            }
            return null;
          case html4.atype.STYLE:
            if ('function' !== typeof value) {
              return sanitizeStyleAttrValue(String(value));
            }
            var cssPropertiesAndValues = cssSealerUnsealerPair.unseal(value);
            if (!cssPropertiesAndValues) { return null; }

            var css = [];
            for (var i = 0; i < cssPropertiesAndValues.length; i += 2) {
              var propName = cssPropertiesAndValues[+i];
              var propValue = cssPropertiesAndValues[i + 1];
              // If the propertyName differs between DOM and CSS, there will
              // be a semicolon between the two.
              // E.g., 'background-color;backgroundColor'
              // See CssTemplate.toPropertyValueList.
              var semi = propName.indexOf(';');
              if (semi >= 0) { propName = propName.substring(0, semi); }
              css.push(propName + ' : ' + propValue);
            }
            return css.join(' ; ');
          // Frames are ambient, so disallow reference.
          case html4.atype.FRAME_TARGET:
            return getSafeTargetAttribute(tagName, attribName, value);
          default:
            return null;
        }
      }

      // Property descriptors which are independent of any feral object.
      /**
       * Property descriptor which throws on access.
       */
      var P_UNIMPLEMENTED = {
        enumerable: true,
        get: cajaVM.def(function () {
          throw new Error('Not implemented');
        })
      };
      /**
       * Property descriptor for an unsettable constant attribute (like DOM
       * attributes such as nodeType).
       */
      function P_constant(value) {
        return { enumerable: true, value: value };
      }

      /**
       * Construct property descriptors suitable for taming objects which use
       * the specified confidence, such that confidence.p(obj).feral is the
       * feral object to forward to and confidence.p(obj).editable is an
       * editable/readonly flag.
       *
       * Lowercase properties are property descriptors; uppercase ones are
       * constructors for parameterized property descriptors.
       */
      function PropertyTaming(confidence) {
        var p = confidence.p;
        var method = confidence.protectMethod;

        return cajaVM.def({
          /**
           * Property descriptor for properties which have the value the feral
           * object does and are not assignable.
           */
          ro: {
            enumerable: true,
            extendedAccessors: true,
            get: method(function (prop) {
              return p(this).feral[prop];
            })
          },

          /**
           * Property descriptor for properties which have the value the feral
           * object does, and are assignable if the wrapper is editable.
           */
          rw: {
            enumerable: true,
            extendedAccessors: true,
            get: method(function (prop) {
              return p(this).feral[prop];
            }),
            set: method(function (value, prop) {
              if (!p(this).editable) { throw new Error(NOT_EDITABLE); }
              p(this).feral[prop] = value;
            })
          },

          /**
           * Property descriptor for properties which have the value the feral
           * object does, and are assignable (with a predicate restricting the
           * values which may be assigned) if the wrapper is editable.
           * TODO(kpreid): Use guards instead of predicates.
           */
          RWCond: function (predicate) {
            return {
              enumerable: true,
              extendedAccessors: true,
              get: method(function (prop) {
                return p(this).feral[prop];
              }),
              set: method(function (value, prop) {
                var privates = p(this);
                if (!privates.editable) { throw new Error(NOT_EDITABLE); }
                if (predicate(value)) {
                  privates.feral[prop] = value;
                }
              })
            };
          },

          /**
           * Property descriptor for properties which have a different name
           * than what they map to (e.g. labelElement.htmlFor vs.
           * <label for=...>).
           * This function changes the name the extended accessor property
           * descriptor 'desc' sees.
           */
          Rename: function (mapName, desc) {
            return {
              enumerable: true,
              extendedAccessors: true,
              get: method(function (prop) {
                return desc.get.call(this, mapName);
              }),
              set: method(function (value, prop) {
                return desc.set.call(this, value, mapName);
              })
            };
          },

          /**
           * Property descriptor for forwarded properties which have node values
           * which may be nodes that might be outside of the virtual document.
           */
          related: {
            enumerable: true,
            extendedAccessors: true,
            get: method(function (prop) {
              if (!('editable' in p(this))) {
                throw new Error(
                    "Internal error: related property tamer can only"
                    + " be applied to objects with an editable flag");
              }
              return tameRelatedNode(p(this).feral[prop],
                                     p(this).editable,
                                     defaultTameNode);
            })
          },

          /**
           * Property descriptor which maps to an attribute or property, is
           * assignable, and has the value transformed in some way.
           * @param {boolean} useAttrGetter true if the getter should delegate
           *     to {@code this.getAttribute}.  That method is assumed to
           *     already be trusted though {@code toValue} is still called on
           *     the result.
           *     If false, then {@code toValue} is called on the result of
           *     accessing the name property on the underlying element, a
           *     possibly untrusted value.
           * @param {Function} toValue transforms the attribute or underlying
           *     property value retrieved according to the useAttrGetter flag
           *     above to the value of the defined property.
           * @param {boolean} useAttrSetter like useAttrGetter but for a setter.
           *     Switches between the name property on the underlying node
           *     (the false case) or using this's {@code setAttribute} method
           *     (the true case).
           * @param {Function} fromValue called on the input before it is passed
           *     through according to the flag above.  This receives untrusted
           *     values, and can do any vetting or transformation.  If
           *     {@code useAttrSetter} is true then it need not do much value
           *     vetting since the {@code setAttribute} method must do its own
           *     vetting.
           */
          filter: function (useAttrGetter, toValue, useAttrSetter, fromValue) {
            var desc = {
              enumerable: true,
              extendedAccessors: true,
              get: useAttrGetter
                  ? method(function (name) {
                      return toValue.call(this, this.getAttribute(name));
                    })
                  : method(function (name) {
                      return toValue.call(this, p(this).feral[name]);
                    })
            };
            if (fromValue) {
              desc.set = useAttrSetter
                  ? method(function (value, name) {
                      this.setAttribute(name, fromValue.call(this, value));
                    })
                  : method(function (value, name) {
                      if (!p(this).editable) { throw new Error(NOT_EDITABLE); }
                      p(this).feral[name] = fromValue.call(this, value);
                    });
            }
            return desc;
          },
          filterAttr: function(toValue, fromValue) {
            return NP.filter(true, toValue, true, fromValue);
          },
          filterProp: function(toValue, fromValue) {
            return NP.filter(false, toValue, false, fromValue);
          }
        });
      }
      cajaVM.def(PropertyTaming);  // and its prototype

      // TODO(kpreid): We have completely unrelated things called 'np' and 'NP'.
      var NP = new PropertyTaming(TameNodeConf);

      // Node-specific property accessors:
      /**
       * Property descriptor for forwarded properties which have node values
       * and are descendants of this node.
       */
      var NP_tameDescendant = {
        enumerable: true,
        extendedAccessors: true,
        get: nodeMethod(function (prop) {
          return defaultTameNode(np(this).feral[prop],
                                 np(this).childrenEditable);
        })
      };

      var nodeExpandos = new WeakMap(true);
      /**
       * Return the object which stores expando properties for a given
       * host DOM node.
       */
      function getNodeExpandoStorage(node) {
        var s = nodeExpandos.get(node);
        if (s === undefined) {
          nodeExpandos.set(node, s = {});
        }
        return s;
      }

      function makeTameNodeByType(node, editable) {
        switch (node.nodeType) {
          case 1:  // Element
            var tagName = node.tagName.toLowerCase();
            if (tamingClassesByElement.hasOwnProperty(tagName + '$')) {
              // Known element with specialized taming class (e.g. <a> has an
              // href property). This is deliberately before the unsafe test;
              // for example, <script> has its own class even though it is
              // unsafe.
              return new (tamingClassesByElement[tagName + '$'])(
                  node, editable);
            } 
            var schemaElem = htmlSchema.element(tagName);
            if (schemaElem.isVirtualizedElementName) {
              // Virtualized unrecognized elements are generic
              return new TameElement(node, editable, editable);
            } else if (schemaElem.allowed) {
              return new TameElement(node, editable, editable);
            } else {
              // If an unrecognized or unsafe node, return a
              // placeholder that doesn't prevent tree navigation,
              // but that doesn't allow mutation or leak attribute
              // information.
              return new TameOpaqueNode(node, editable);
            }
          case 2:  // Attr
            // Cannot generically wrap since we must have access to the
            // owner element
            throw 'Internal: Attr nodes cannot be generically wrapped';
          case 3:  // Text
          case 4:  // CDATA Section Node
            return new TameTextNode(node, editable);
          case 8:  // Comment
            return new TameCommentNode(node, editable);
          case 11: // Document Fragment
            return new TameBackedNode(node, editable, editable);
          default:
            return new TameOpaqueNode(node, editable);
        }
      }

      /**
       * returns a tame DOM node.
       * @param {Node} node
       * @param {boolean} editable
       * @see <a href="http://www.w3.org/TR/DOM-Level-2-HTML/html.html"
       *       >DOM Level 2</a>
       */
      function defaultTameNode(node, editable, foreign) {
        if (node === null || node === void 0) { return null; }
        node = makeDOMAccessible(node);
        // TODO(mikesamuel): make sure it really is a DOM node

        if (taming.hasTameTwin(node)) {
          return taming.tame(node);
        }

        var tamed = foreign
            ? new TameForeignNode(node, editable)
            : makeTameNodeByType(node, editable);
        tamed = finishNode(tamed);

        return tamed;
      }

      function tameRelatedNode(node, editable, tameNodeCtor) {
        if (node === null || node === void 0) { return null; }
        if (node === np(tameDocument).feralContainerNode) {
          if (np(tameDocument).editable && !editable) {
            // FIXME: return a non-editable version instead
            throw new Error(NOT_EDITABLE);
          }
          return tameDocument;
        }

        node = makeDOMAccessible(node);

        // Catch errors because node might be from a different domain.
        try {
          var docElem = node.ownerDocument.documentElement;
          for (var ancestor = node;
              ancestor;
              ancestor = makeDOMAccessible(ancestor.parentNode)) {
            if (idClassPattern.test(ancestor.className)) {
              return tameNodeCtor(node, editable);
            } else if (ancestor === docElem) {
              return null;
            }
          }
          return tameNodeCtor(node, editable);
        } catch (e) {}
        return null;
      }

      domicile.tameNodeAsForeign = function(node) {
        return defaultTameNode(node, true, true);
      };

      /**
       * Returns the length of a raw DOM Nodelist object, working around
       * NamedNodeMap bugs in IE, Opera, and Safari as discussed at
       * http://code.google.com/p/google-caja/issues/detail?id=935
       *
       * @param nodeList a DOM NodeList.
       *
       * @return the number of nodes in the NodeList.
       */
      function getNodeListLength(nodeList) {
        var limit = nodeList.length;
        if (limit !== +limit) { limit = 1/0; }
        return limit;
      }

      /**
       * Constructs a NodeList-like object.
       *
       * @param tamed a JavaScript array that will be populated and decorated
       *     with the DOM NodeList API. If it has existing elements they will
       *     precede the actual NodeList elements.
       * @param nodeList an array-like object supporting a "length" property
       *     and "[]" numeric indexing, or a raw DOM NodeList;
       * @param editable whether the tame nodes wrapped by this object
       *     should permit editing.
       * @param opt_tameNodeCtor a function for constructing tame nodes
       *     out of raw DOM nodes.
       */
      function mixinNodeList(tamed, nodeList, editable, opt_tameNodeCtor) {
        // TODO(kpreid): Under a true ES5 environment, node lists should be
        // proxies so that they preserve liveness of the original lists.
        // This should be controlled by an option.

        var limit = getNodeListLength(nodeList);
        if (limit > 0 && !opt_tameNodeCtor) {
          throw 'Internal: Nonempty mixinNodeList() without a tameNodeCtor';
        }

        for (var i = tamed.length, j = 0; j < limit && nodeList[+j]; ++i, ++j) {
          tamed[+i] = opt_tameNodeCtor(nodeList[+j], editable);
        }

        // Guard against accidental leakage of untamed nodes
        nodeList = null;

        tamed.item = cajaVM.def(function (k) {
          k &= 0x7fffffff;
          if (k !== k) { throw new Error(); }
          return tamed[+k] || null;
        });

        return tamed;
      }

      function rebuildTameListConstructors(ArrayLike) {
        TameNodeList = makeTameNodeList();
        TameNodeList.prototype = Object.create(ArrayLike.prototype);
        Object.defineProperty(TameNodeList.prototype, 'constructor',
            { value: TameNodeList });
        Object.freeze(TameNodeList.prototype);
        Object.freeze(TameNodeList);
        TameOptionsList = makeTameOptionsList();
        TameOptionsList.prototype = Object.create(ArrayLike.prototype);
        Object.defineProperty(TameOptionsList.prototype, 'constructor',
            { value: TameOptionsList });
        Object.freeze(TameOptionsList.prototype);
        Object.freeze(TameOptionsList);
      }

      function makeTameNodeList() {
        return function TNL(nodeList, editable, tameNodeCtor) {
            nodeList = makeDOMAccessible(nodeList);
            function getItem(i) {
              i = +i;
              if (i >= nodeList.length) { return void 0; }
              return tameNodeCtor(nodeList[i], editable);
            }
            function getLength() {
              return nodeList.length;
            }
            var len = +getLength();
            var ArrayLike = cajaVM.makeArrayLike(len);
            if (!(TameNodeList.prototype instanceof ArrayLike)) {
              rebuildTameListConstructors(ArrayLike);
            }
            var result = ArrayLike(TameNodeList.prototype, getItem, getLength);
            Object.defineProperty(result, 'item',
                { value: Object.freeze(getItem) });
            return result;
          };
      }

      var TameNodeList = Object.freeze(makeTameNodeList());

      function makeTameOptionsList() {
        return function TOL(nodeList, editable, opt_tameNodeCtor) {
            nodeList = makeDOMAccessible(nodeList);
            function getItem(i) {
              i = +i;
              return opt_tameNodeCtor(nodeList[i], editable);
            }
            function getLength() { return nodeList.length; }
            var len = +getLength();
            var ArrayLike = cajaVM.makeArrayLike(len);
            if (!(TameOptionsList.prototype instanceof ArrayLike)) {
              rebuildTameListConstructors(ArrayLike);
            }
            var result = ArrayLike(
                TameOptionsList.prototype, getItem, getLength);
            Object.defineProperty(result, 'selectedIndex', {
                get: function () { return +nodeList.selectedIndex; }
              });
            return result;
          };
      }

      var TameOptionsList = Object.freeze(makeTameOptionsList());

      /**
       * Return a fake node list containing tamed nodes.
       * @param {Array.<TameNode>} array of tamed nodes.
       * @return an array that duck types to a node list.
       */
      function fakeNodeList(array) {
        array.item = cajaVM.def(function(i) { return array[+i]; });
        return Object.freeze(array);
      }

      /**
       * Constructs an HTMLCollection-like object which indexes its elements
       * based on their NAME attribute.
       *
       * @param tamed a JavaScript array that will be populated and decorated
       *     with the DOM HTMLCollection API.
       * @param nodeList an array-like object supporting a "length" property
       *     and "[]" numeric indexing.
       * @param editable whether the tame nodes wrapped by this object
       *     should permit editing.
       * @param opt_tameNodeCtor a function for constructing tame nodes
       *     out of raw DOM nodes.
       *
       * TODO(kpreid): Per
       * <http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-75708506>
       * this should be looking up ids as well as names. (And not returning
       * nodelists, but is that for compatibility?)
       */
      function mixinHTMLCollection(tamed, nodeList, editable,
          opt_tameNodeCtor) {
        mixinNodeList(tamed, nodeList, editable, opt_tameNodeCtor);

        var tameNodesByName = {};
        var tameNode;

        for (var i = 0; i < tamed.length && (tameNode = tamed[+i]); ++i) {
          var name = void 0;
          if (tameNode.getAttribute) { name = tameNode.getAttribute('name'); }
          if (name && !(name.charAt(name.length - 1) === '_' || (name in tamed)
                       || name === String(name & 0x7fffffff))) {
            if (!tameNodesByName[name]) { tameNodesByName[name] = []; }
            tameNodesByName[name].push(tameNode);
          }
        }

        for (var name in tameNodesByName) {
          var tameNodes = tameNodesByName[name];
          if (tameNodes.length > 1) {
            tamed[name] = fakeNodeList(tameNodes);
          } else {
            tamed[name] = tameNodes[0];
          }
        }

        tamed.namedItem = cajaVM.def(function(name) {
          name = String(name);
          if (name.charAt(name.length - 1) === '_') {
            return null;
          }
          if (Object.prototype.hasOwnProperty.call(tamed, name)) {
            return cajaVM.passesGuard(TameNodeT, tamed[name])
                ? tamed[name] : tamed[name][0];
          }
          return null;
        });

        return tamed;
      }

      function tameHTMLCollection(nodeList, editable, opt_tameNodeCtor) {
        return Object.freeze(
            mixinHTMLCollection([], nodeList, editable, opt_tameNodeCtor));
      }

      function tameGetElementsByTagName(rootNode, tagName, editable) {
        tagName = String(tagName);
        var eflags = 0;
        if (tagName !== '*') {
          tagName = tagName.toLowerCase();
          tagName = virtualToRealElementName(tagName);
        }
        return new TameNodeList(rootNode.getElementsByTagName(tagName),
            editable, defaultTameNode);
      }

      /**
       * Implements http://www.whatwg.org/specs/web-apps/current-work/#dom-document-getelementsbyclassname
       * using an existing implementation on browsers that have one.
       */
      function tameGetElementsByClassName(rootNode, className, editable) {
        className = String(className);

        // The quotes below are taken from the HTML5 draft referenced above.

        // "having obtained the classes by splitting a string on spaces"
        // Instead of using split, we use match with the global modifier so that
        // we don't have to remove leading and trailing spaces.
        var classes = className.match(/[^\t\n\f\r ]+/g);

        // Filter out classnames in the restricted namespace.
        for (var i = classes ? classes.length : 0; --i >= 0;) {
          var classi = classes[+i];
          if (FORBIDDEN_ID_PATTERN.test(classi)) {
            classes[+i] = classes[classes.length - 1];
            --classes.length;
          }
        }

        if (!classes || classes.length === 0) {
          // "If there are no tokens specified in the argument, then the method
          //  must return an empty NodeList" [instead of all elements]
          // This means that
          //     htmlEl.ownerDocument.getElementsByClassName(htmlEl.className)
          // will return an HtmlCollection containing htmlElement iff
          // htmlEl.className contains a non-space character.
          return fakeNodeList([]);
        }

        // "unordered set of unique space-separated tokens representing classes"
        if (typeof rootNode.getElementsByClassName === 'function') {
          return new TameNodeList(
              rootNode.getElementsByClassName(
                  classes.join(' ')), editable, defaultTameNode);
        } else {
          // Add spaces around each class so that we can use indexOf later to
          // find a match.
          // This use of indexOf is strictly incorrect since
          // http://www.whatwg.org/specs/web-apps/current-work/#reflecting-content-attributes-in-dom-attributes
          // does not normalize spaces in unordered sets of unique
          // space-separated tokens.  This is not a problem since HTML5
          // compliant implementations already have a getElementsByClassName
          // implementation, and legacy
          // implementations do normalize according to comments on issue 935.

          // We assume standards mode, so the HTML5 requirement that
          //   "If the document is in quirks mode, then the comparisons for the
          //    classes must be done in an ASCII case-insensitive  manner,"
          // is not operative.
          var nClasses = classes.length;
          for (var i = nClasses; --i >= 0;) {
            classes[+i] = ' ' + classes[+i] + ' ';
          }

          // We comply with the requirement that the result is a list
          //   "containing all the elements in the document, in tree order,"
          // since the spec for getElementsByTagName has the same language.
          var candidates = rootNode.getElementsByTagName('*');
          var matches = [];
          var limit = candidates.length;
          if (limit !== +limit) { limit = 1/0; }  // See issue 935
          candidate_loop:
          for (var j = 0, candidate, k = -1;
               j < limit && (candidate = candidates[+j]);
               ++j) {
            var candidateClass = ' ' + candidate.className + ' ';
            for (var i = nClasses; --i >= 0;) {
              if (-1 === candidateClass.indexOf(classes[+i])) {
                continue candidate_loop;
              }
            }
            var tamed = defaultTameNode(candidate, editable);
            if (tamed) {
              matches[++k] = tamed;
            }
          }
          // "the method must return a live NodeList object"
          return fakeNodeList(matches);
        }
      }

      function makeEventHandlerWrapper(thisNode, listener) {
        domitaModules.ensureValidCallback(listener);
        function wrapper(event) {
          return plugin_dispatchEvent(
              thisNode, event, rulebreaker.getId(tameWindow), listener);
        }
        return wrapper;
      }

      var NOT_EDITABLE = "Node not editable.";
      var INDEX_SIZE_ERROR = "Index size error.";

      // Implementation of EventTarget::addEventListener
      function tameAddEventListener(name, listener, useCapture) {
        var feral = np(this).feral;
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        if (!np(this).wrappedListeners) { np(this).wrappedListeners = []; }
        useCapture = Boolean(useCapture);
        var wrappedListener = makeEventHandlerWrapper(np(this).feral, listener);
        wrappedListener = bridal.addEventListener(
            np(this).feral, name, wrappedListener, useCapture);
        wrappedListener._d_originalListener = listener;
        np(this).wrappedListeners.push(wrappedListener);
      }

      // Implementation of EventTarget::removeEventListener
      function tameRemoveEventListener(name, listener, useCapture) {
        var self = TameNodeT.coerce(this);
        var feral = np(self).feral;
        if (!np(self).editable) { throw new Error(NOT_EDITABLE); }
        if (!np(this).wrappedListeners) { return; }
        var wrappedListener = null;
        for (var i = np(this).wrappedListeners.length; --i >= 0;) {
          if (np(this).wrappedListeners[+i]._d_originalListener === listener) {
            wrappedListener = np(this).wrappedListeners[+i];
            arrayRemove(np(this).wrappedListeners, i, i);
            break;
          }
        }
        if (!wrappedListener) { return; }
        bridal.removeEventListener(
            np(this).feral, name, wrappedListener, useCapture);
      }

      // A map of tamed node classes, keyed by DOM Level 2 standard name, which
      // will be exposed to the client.
      var nodeClasses = {};

      // A map of tamed node constructors, keyed by HTML element name, which
      // will be used by defaultTameNode.
      var tamingClassesByElement = {};

      /**
       * This does three things:
       *
       * Replace tamedCtor's prototype with one whose prototype is someSuper.
       *
       * Hide the constructor of the products of tamedCtor, replacing it with a
       * function which just throws (but can still be used for instanceof
       * checks).
       *
       * Register the inert ctor under the given name if specified.
       */
      function inertCtor(tamedCtor, someSuper, opt_name) {
        inherit(tamedCtor, someSuper);

        var inert = function() {
          throw new TypeError('This constructor cannot be called directly.');
        };
        inert.prototype = tamedCtor.prototype;
        Object.freeze(inert);  // not def, because inert.prototype must remain
        setOwn(tamedCtor.prototype, "constructor", inert);

        if (opt_name !== undefined)
          nodeClasses[opt_name] = inert;

        return inert;
      }

      traceStartup("DT: about to make TameNode");

      /**
       * Base class for a Node wrapper.  Do not create directly -- use the
       * tameNode factory instead.
       *
       * NOTE that all TameNodes should have the TameNodeT trademark, but it is
       * not applied here since that freezes the object, and also because of the
       * forwarding proxies used for catching expando properties.
       *
       * @param {boolean} editable true if the node's value, attributes,
       *     children,
       *     or custom properties are mutable.
       * @constructor
       */
      function TameNode(editable) {
        TameNodeConf.confide(this);
        np(this).editable = editable;
        return this;
      }
      inertCtor(TameNode, Object, 'Node');
      traceStartup("DT: about to DPA TameNode");
      definePropertiesAwesomely(TameNode.prototype, {
        // tameDocument is not yet defined at this point so can't be a constant
        ownerDocument: {
          enumerable: canHaveEnumerableAccessors,
          get: cajaVM.def(function () {
          return tameDocument;
        }) }
      });
      traceStartup("DT: about to set toString for TameNode");
      /**
       * Print this object according to its tamed class name; also note for
       * debugging purposes if it is actually the prototype instance.
       */
      setOwn(TameNode.prototype, "toString", cajaVM.def(function (opt_self) {
        // recursion exit case
        if (this === Object.prototype || this == null || this == undefined) {
          return Object.prototype.toString.call(opt_self || this);
        }

        var ctor = this.constructor;
        for (var name in nodeClasses) { // TODO(kpreid): less O(n)
          if (nodeClasses[name] === ctor) {
            if (ctor.prototype === (opt_self || this)) {
              return "[domado PROTOTYPE OF " + name + "]";
            } else {
              return "[domado object " + name + "]";
            }
          }
        }

        // try again with our prototype, passing the real this in
        return TameNode.prototype.toString.call(
            Object.getPrototypeOf(this), this);
      }));
      // abstract TameNode.prototype.nodeType
      // abstract TameNode.prototype.nodeName
      // abstract TameNode.prototype.nodeValue
      // abstract TameNode.prototype.cloneNode
      // abstract TameNode.prototype.appendChild
      // abstract TameNode.prototype.insertBefore
      // abstract TameNode.prototype.removeChild
      // abstract TameNode.prototype.replaceChild
      // abstract TameNode.prototype.firstChild
      // abstract TameNode.prototype.lastChild
      // abstract TameNode.prototype.nextSibling
      // abstract TameNode.prototype.previousSibling
      // abstract TameNode.prototype.parentNode
      // abstract TameNode.prototype.getElementsByTagName
      // abstract TameNode.prototype.getElementsByClassName
      // abstract TameNode.prototype.childNodes
      // abstract TameNode.prototype.attributes
      var tameNodePublicMembers = [
          'cloneNode',
          'appendChild', 'insertBefore', 'removeChild', 'replaceChild',
          'dispatchEvent', 'hasChildNodes'
          ];
      traceStartup("DT: about to defend TameNode");
      cajaVM.def(TameNode);  // and its prototype

      traceStartup("DT: about to make TameBackedNode");

      /**
       * A tame node that is backed by a real node.
       *
       * Note that the constructor returns a proxy which delegates to 'this';
       * subclasses should apply properties to 'this' but return the proxy.
       *
       * @param {boolean} childrenEditable true iff the child list is mutable.
       * @param {Function} opt_proxyType The constructor of the proxy handler
       *     to use, defaulting to ExpandoProxyHandler.
       * @constructor
       */
      function TameBackedNode(node, editable, childrenEditable, opt_proxyType) {
        node = makeDOMAccessible(node);

        if (!node) {
          throw new Error('Creating tame node with undefined native delegate');
        }

        TameNode.call(this, editable);

        np(this).feral = node;
        np(this).childrenEditable = editable && childrenEditable;

        if (domitaModules.proxiesAvailable) {
          np(this).proxyHandler = new (opt_proxyType || ExpandoProxyHandler)(
              this, editable, getNodeExpandoStorage(node));
        }
      }
      inertCtor(TameBackedNode, TameNode);
      definePropertiesAwesomely(TameBackedNode.prototype, {
        nodeType: NP.ro,
        nodeName: NP.ro,
        nodeValue: NP.ro,
        firstChild: NP_tameDescendant,
        lastChild: NP_tameDescendant,
        nextSibling: NP.related,
        previousSibling: NP.related,
        parentNode: NP.related,
        childNodes: {
          enumerable: true,
          get: cajaVM.def(function () {
            return new TameNodeList(np(this).feral.childNodes,
                                np(this).childrenEditable, defaultTameNode);
          })
        },
        attributes: {
          enumerable: true,
          get: cajaVM.def(function () {
            var thisNode = np(this).feral;
            var tameNodeCtor = function(node, editable) {
              return new TameBackedAttributeNode(node, editable, thisNode);
            };
            return new TameNodeList(
                thisNode.attributes, thisNode, tameNodeCtor);
          })
        }
      });
      TameBackedNode.prototype.cloneNode = nodeMethod(function (deep) {
        var clone = bridal.cloneNode(np(this).feral, Boolean(deep));
        // From http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-3A0ED0A4
        //   "Note that cloning an immutable subtree results in a mutable copy"
        return defaultTameNode(clone, true);
      });
      TameBackedNode.prototype.appendChild = nodeMethod(function (child) {
        child = child || {};
        // Child must be editable since appendChild can remove it from its
        // parent.
        child = TameNodeT.coerce(child);
        if (!np(this).childrenEditable || !np(child).editable) {
          throw new Error(NOT_EDITABLE);
        }
        np(this).feral.appendChild(np(child).feral);
        return child;
      });
      TameBackedNode.prototype.insertBefore = nodeMethod(
          function(toInsert, child) {
        toInsert = TameNodeT.coerce(toInsert);
        if (child === void 0) { child = null; }
        if (child !== null) {
          child = TameNodeT.coerce(child);
          if (!np(child).editable) {
            throw new Error(NOT_EDITABLE);
          }
        }
        if (!np(this).childrenEditable || !np(toInsert).editable) {
          throw new Error(NOT_EDITABLE);
        }
        np(this).feral.insertBefore(
            np(toInsert).feral, child !== null ? np(child).feral : null);
        return toInsert;
      });
      TameBackedNode.prototype.removeChild = nodeMethod(function(child) {
        child = TameNodeT.coerce(child);
        if (!np(this).childrenEditable || !np(child).editable) {
          throw new Error(NOT_EDITABLE);
        }
        np(this).feral.removeChild(np(child).feral);
        return child;
      });
      TameBackedNode.prototype.replaceChild = nodeMethod(
          function(newChild, oldChild) {
        newChild = TameNodeT.coerce(newChild);
        oldChild = TameNodeT.coerce(oldChild);
        if (!np(this).childrenEditable || !np(newChild).editable
            || !np(oldChild).editable) {
          throw new Error(NOT_EDITABLE);
        }
        np(this).feral.replaceChild(np(newChild).feral, np(oldChild).feral);
        return oldChild;
      });
      TameBackedNode.prototype.hasChildNodes = nodeMethod(function() {
        return !!np(this).feral.hasChildNodes();
      });
      // http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
      // "The EventTarget interface is implemented by all Nodes"
      TameBackedNode.prototype.dispatchEvent = nodeMethod(function(evt) {
        evt = TameEventT.coerce(evt);
        bridal.dispatchEvent(np(this).feral, TameEventConf.p(evt).feral);
      });

      if (docEl.contains) {  // typeof is 'object' on IE
        TameBackedNode.prototype.contains = nodeMethod(function (other) {
          if (other === null || other === void 0) { return false; }
          other = TameNodeT.coerce(other);
          var otherNode = np(other).feral;
          return np(this).feral.contains(otherNode);
        });
      }
      if ('function' ===
          typeof docEl.compareDocumentPosition) {
        /**
         * Speced in <a href="http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition">DOM-Level-3</a>.
         */
        TameBackedNode.prototype.compareDocumentPosition = nodeMethod(
            function (other) {
          other = TameNodeT.coerce(other);
          var otherNode = np(other).feral;
          if (!otherNode) { return 0; }
          var bitmask = +np(this).feral.compareDocumentPosition(otherNode);
          // To avoid leaking information about the relative positioning of
          // different roots, if neither contains the other, then we mask out
          // the preceding/following bits.
          // 0x18 is (CONTAINS | CONTAINED)
          // 0x1f is all the bits documented at
          //   http://www.w3.org/TR/DOM-Level-3-Core/core.html#DocumentPosition
          //   except IMPLEMENTATION_SPECIFIC
          // 0x01 is DISCONNECTED
          /*
          if (!(bitmask & 0x18)) {
            // TODO: If they are not under the same virtual doc root, return
            // DOCUMENT_POSITION_DISCONNECTED instead of leaking information
            // about PRECEDING | FOLLOWING.
          }
          */
          // Firefox3 returns spurious PRECEDING and FOLLOWING bits for
          // disconnected trees.
          // https://bugzilla.mozilla.org/show_bug.cgi?id=486002
          if (bitmask & 1) {
            bitmask &= ~6;
          }
          return bitmask & 0x1f;
        });
        if (!Object.prototype.hasOwnProperty.call(TameBackedNode.prototype,
            'contains')) {
          // http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
          TameBackedNode.prototype.contains = nodeMethod(function (other) {
            if (other === null || other === void 0) { return false; }
            var docPos = this.compareDocumentPosition(other);
            return !(!(docPos & 0x10) && docPos);
          });
        }
      }
      cajaVM.def(TameBackedNode);  // and its prototype

      traceStartup("DT: about to make TamePseudoNode");

      /**
       * A fake node that is not backed by a real DOM node.
       * @constructor
       */
      function TamePseudoNode(editable) {
        TameNode.call(this, editable);

        if (domitaModules.proxiesAvailable) {
          // finishNode will wrap 'this' with an actual proxy later.
          np(this).proxyHandler = new ExpandoProxyHandler(this, editable, {});
        }
      }
      inertCtor(TamePseudoNode, TameNode);
      TamePseudoNode.prototype.appendChild =
      TamePseudoNode.prototype.insertBefore =
      TamePseudoNode.prototype.removeChild =
      TamePseudoNode.prototype.replaceChild = nodeMethod(function () {
        if (typeof console !== 'undefined') {
          console.log("Node not editable; no action performed.");
        }
        return void 0;
      });
      TamePseudoNode.prototype.hasChildNodes = nodeMethod(function () {
        return this.firstChild != null;
      });
      definePropertiesAwesomely(TamePseudoNode.prototype, {
        firstChild: { enumerable: true, get: nodeMethod(function () {
          var children = this.childNodes;
          return children.length ? children[0] : null;
        })},
        lastChild: { enumerable: true, get: nodeMethod(function () {
          var children = this.childNodes;
          return children.length ? children[children.length - 1] : null;
        })},
        nextSibling: { enumerable: true, get: nodeMethod(function () {
          var self = tamingProxies.get(this) || this;
          var parentNode = this.parentNode;
          if (!parentNode) { return null; }
          var siblings = parentNode.childNodes;
          for (var i = siblings.length - 1; --i >= 0;) {
            if (siblings[+i] === self) { return siblings[i + 1]; }
          }
          return null;
        })},
        previousSibling: { enumerable: true, get: nodeMethod(function () {
          var self = tamingProxies.get(this) || this;
          var parentNode = this.parentNode;
          if (!parentNode) { return null; }
          var siblings = parentNode.childNodes;
          for (var i = siblings.length; --i >= 1;) {
            if (siblings[+i] === self) { return siblings[i - 1]; }
          }
          return null;
        })}
      });
      cajaVM.def(TamePseudoNode);  // and its prototype

      traceStartup("DT: done fundamental nodes");
      traceStartup("DT: about to define makeRestrictedNodeType");

      function makeRestrictedNodeType(whitelist) {
        function ForeignOrOpaqueNode(node, editable) {
          TameBackedNode.call(this, node, editable, editable);
        }
        var nodeType = ForeignOrOpaqueNode;  // other name is for debug hint
        inherit(nodeType, TameBackedNode);
        for (var safe in whitelist) {
          // Any non-own property is overridden to be opaque below.
          var descriptor = (whitelist[safe] === 0)
              ? domitaModules.getPropertyDescriptor(
                    TameBackedNode.prototype, safe)
              : {
                  value: whitelist[safe],
                  writable: false,
                  configurable: false,
                  enumerable: true
              };
          Object.defineProperty(nodeType.prototype, safe, descriptor);
        }
        definePropertiesAwesomely(nodeType.prototype, {
          attributes: {
            enumerable: canHaveEnumerableAccessors,
            get: nodeMethod(function () {
              return new TameNodeList([], false, undefined);
            })
          }
        });
        function throwRestricted() {
          throw new Error('Node is restricted');
        }
        cajaVM.def(throwRestricted);
        for (var i = tameNodePublicMembers.length; --i >= 0;) {
          var k = tameNodePublicMembers[+i];
          if (!nodeType.prototype.hasOwnProperty(k)) {
            if (typeof TameBackedNode.prototype[k] === 'Function') {
              nodeType.prototype[k] = throwRestricted;
            } else {
              Object.defineProperty(nodeType.prototype, k, {
                enumerable: canHaveEnumerableAccessors,
                get: throwRestricted
              });
            }
          }
        }
        return cajaVM.def(nodeType);  // and its prototype
      }

      traceStartup("DT: about to make TameOpaqueNode");

      // An opaque node is traversible but not manipulable by guest code. This
      // is the default taming for unrecognized nodes or nodes not explicitly
      // whitelisted.
      var TameOpaqueNode = makeRestrictedNodeType({
        nodeValue: 0,
        nodeType: 0,
        nodeName: 0,
        nextSibling: 0,
        previousSibling: 0,
        firstChild: 0,
        lastChild: 0,
        parentNode: 0,
        childNodes: 0,
        ownerDocument: 0,
        hasChildNodes: 0
      });

      traceStartup("DT: about to make TameForeignNode");

      // A foreign node is one supplied by some external system to the guest
      // code, which the guest code may lay out within its own DOM tree but may
      // not traverse into in any way.
      //
      // TODO(ihab.awad): The taming chosen for foreign nodes is very
      // restrictive and could be relaxed, but only after careful consideration.
      // The below choices are for simple safety, e.g., exposing a foreign
      // node's
      // siblings when the foreign node has been added to some DOM tree outside
      // this domicile might be dangerous.
      var TameForeignNode = makeRestrictedNodeType({
        nodeValue: 0,
        nodeType: 0,
        nodeName: 0,
        nextSibling: undefined,
        previousSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        parentNode: undefined,
        childNodes: Object.freeze([]),
        ownerDocument: undefined,
        getElementsByTagName: function() { return Object.freeze([]); },
        getElementsByClassName: function() { return Object.freeze([]); },
        hasChildNodes: function() { return false; }
      });

      traceStartup("DT: about to make TameTextNode");

      function TameTextNode(node, editable) {
        assert(node.nodeType === 3);

        // The below should not be strictly necessary since childrenEditable for
        // TameScriptElements is always false, but it protects against tameNode
        // being called naively on a text node from container code.
        var pn = node.parentNode;
        if (editable && pn) {
          if (1 === pn.nodeType
              && !htmlSchema.element(pn.tagName).allowed) {
            // Do not allow mutation of text inside script elements.
            // See the testScriptLoading testcase for examples of exploits.
            editable = false;
          }
        }

        TameBackedNode.call(this, node, editable, editable);
      }
      inertCtor(TameTextNode, TameBackedNode, 'Text');
      var textAccessor = {
        enumerable: true,
        get: nodeMethod(function () {
          return np(this).feral.nodeValue;
        }),
        set: nodeMethod(function (value) {
          if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
          np(this).feral.nodeValue = String(value || '');
        })
      };
      definePropertiesAwesomely(TameTextNode.prototype, {
        nodeValue: textAccessor,
        textContent: textAccessor,
        innerText: textAccessor,
        data: textAccessor
      });
      setOwn(TameTextNode.prototype, "toString", nodeMethod(function () {
        return '#text';
      }));
      cajaVM.def(TameTextNode);  // and its prototype

      function TameCommentNode(node, editable) {
        assert(node.nodeType === 8);
        TameBackedNode.call(this, node, editable, editable);
      }
      inertCtor(TameCommentNode, TameBackedNode, 'CommentNode');
      setOwn(TameCommentNode.prototype, "toString", nodeMethod(function () {
        return '#comment';
      }));
      cajaVM.def(TameCommentNode);  // and its prototype

      traceStartup("DT: about to make TameBackedAttributeNode");
      /**
       * Plays the role of an Attr node for TameElement objects.
       */
      function TameBackedAttributeNode(node, editable, ownerElement) {
        if (ownerElement === undefined) throw new Error(
            "ownerElement undefined");
        TameBackedNode.call(this, node, editable);
        np(this).ownerElement = ownerElement;
      }
      inertCtor(TameBackedAttributeNode, TameBackedNode, 'Attr');
      setOwn(TameBackedAttributeNode.prototype, 'cloneNode',
          nodeMethod(function (deep) {
        var clone = bridal.cloneNode(np(this).feral, Boolean(deep));
        // From http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-3A0ED0A4
        //   "Note that cloning an immutable subtree results in a mutable copy"
        return new TameBackedAttributeNode(clone, true, np(this).ownerElement);
      }));
      var nameAccessor = {
        enumerable: true,
        get: nodeMethod(function () {
          var name = np(this).feral.name;
          if (cajaPrefRe.test(name)) {
            name = name.substring(cajaPrefix.length);
          }
          return name;
        })
      };
      var valueAccessor = {
        enumerable: true,
        get: nodeMethod(function () {
           return this.ownerElement.getAttribute(this.name);
        }),
        set: nodeMethod(function (value) {
          return this.ownerElement.setAttribute(this.name, value);
        })
      };
      definePropertiesAwesomely(TameBackedAttributeNode.prototype, {
        nodeName: nameAccessor,
        name: nameAccessor,
        specified: {
          enumerable: true,
          get: nodeMethod(function () {
            return this.ownerElement.hasAttribute(this.name);
          })
        },
        nodeValue: valueAccessor,
        value: valueAccessor,
        ownerElement: {
          enumerable: true,
          get: nodeMethod(function () {
            return defaultTameNode(np(this).ownerElement, np(this).editable);
          })
        },
        nodeType: P_constant(2),
        firstChild:      P_UNIMPLEMENTED,
        lastChild:       P_UNIMPLEMENTED,
        nextSibling:     P_UNIMPLEMENTED,
        previousSibling: P_UNIMPLEMENTED,
        parentNode:      P_UNIMPLEMENTED,
        childNodes:      P_UNIMPLEMENTED,
        attributes:      P_UNIMPLEMENTED
      });
      var notImplementedNodeMethod = {
        enumerable: true,
        value: nodeMethod(function () {
          throw new Error('Not implemented.');
        })
      };
      ['appendChild', 'insertBefore', 'removeChild', 'replaceChild',
          ].forEach(function (m) {
        Object.defineProperty(
          TameBackedAttributeNode.prototype, m, notImplementedNodeMethod);
      });
      cajaVM.def(TameBackedAttributeNode);  // and its prototype
      traceStartup("DT: after TameBackedAttributeNode");

      // Register set handlers for onclick, onmouseover, etc.
      function registerElementScriptAttributeHandlers(tameElementPrototype) {
        var seenAlready = {};
        var attrNameRe = /::(.*)/;
        for (var html4Attrib in html4.ATTRIBS) {
          if (html4.atype.SCRIPT === html4.ATTRIBS[html4Attrib]) {
            (function (attribName) {
              // Attribute names are defined per-element, so we will see
              // duplicates here.
              if (Object.prototype.hasOwnProperty.call(
                  seenAlready, attribName)) {
                return;
              }
              seenAlready[attribName] = true;

              Object.defineProperty(tameElementPrototype, attribName, {
                enumerable: canHaveEnumerableAccessors,
                configurable: false,
                set: nodeMethod(function eventHandlerSetter(listener) {
                  if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
                  if (!listener) {  // Clear the current handler
                    np(this).feral[attribName] = null;
                  } else {
                    // This handler cannot be copied from one node to another
                    // which is why getters are not yet supported.
                    np(this).feral[attribName] = makeEventHandlerWrapper(
                        np(this).feral, listener);
                  }
                  return listener;
                })
              });
            })(html4Attrib.match(attrNameRe)[1]);
          }
        }
      }

      traceStartup("DT: about to make TameElement");
      /**
       * See comments on TameBackedNode regarding return value.
       * @constructor
       */
      function TameElement(node, editable, childrenEditable, opt_proxyType) {
        assert(node.nodeType === 1);
        var obj = TameBackedNode.call(this, node, editable, childrenEditable,
           opt_proxyType);
        np(this).geometryDelegate = node;
        return obj;
      }
      nodeClasses.Element = inertCtor(TameElement, TameBackedNode,
          'HTMLElement');
      registerElementScriptAttributeHandlers(TameElement.prototype);
      TameElement.prototype.blur = nodeMethod(function () {
        np(this).feral.blur();
      });
      TameElement.prototype.focus = nodeMethod(function () {
        if (domicile.isProcessingEvent) {
          np(this).feral.focus();
        }
      });
      // IE-specific method.  Sets the element that will have focus when the
      // window has focus, without focusing the window.
      if (docEl.setActive) {
        TameElement.prototype.setActive = nodeMethod(function () {
          if (domicile.isProcessingEvent) {
            np(this).feral.setActive();
          }
        });
      }
      // IE-specific method.
      if (docEl.hasFocus) {
        TameElement.prototype.hasFocus = nodeMethod(function () {
          return np(this).feral.hasFocus();
        });
      }
      TameElement.prototype.getAttribute = nodeMethod(function (attribName) {
        var feral = np(this).feral;
        attribName = String(attribName).toLowerCase();
        if (/__$/.test(attribName)) {
          throw new TypeError('Attributes may not end with __');
        }
        var tagName = feral.tagName.toLowerCase();
        var atype = htmlSchema.attribute(tagName, attribName).type;
        if (atype === void 0) {
          return feral.getAttribute(cajaPrefix + attribName);
        }
        var value = bridal.getAttribute(feral, attribName);
        if ('string' !== typeof value) { return value; }
        return virtualizeAttributeValue(atype, value);
      });
      TameElement.prototype.getAttributeNode = nodeMethod(function (name) {
        var feral = np(this).feral;
        var hostDomNode = feral.getAttributeNode(name);
        if (hostDomNode === null) { return null; }
        return new TameBackedAttributeNode(
            hostDomNode, np(this).editable, feral);
      });
      TameElement.prototype.hasAttribute = nodeMethod(function (attribName) {
        var feral = np(this).feral;
        attribName = String(attribName).toLowerCase();
        var tagName = feral.tagName.toLowerCase();
        var atype = htmlSchema.attribute(tagName, attribName).type;
        if (atype === void 0) {
          return bridal.hasAttribute(feral, cajaPrefix + attribName);
        } else {
          return bridal.hasAttribute(feral, attribName);
        }
      });
      TameElement.prototype.setAttribute = nodeMethod(
          function (attribName, value) {
        //console.debug("setAttribute", this, attribName, value);
        var feral = np(this).feral;
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        attribName = String(attribName).toLowerCase();
        if (/__$/.test(attribName)) {
          throw new TypeError('Attributes may not end with __');
        }
        var tagName = feral.tagName.toLowerCase();
        var atype = htmlSchema.attribute(tagName, attribName).type;
        if (atype === void 0) {
          bridal.setAttribute(feral, cajaPrefix + attribName, value);
        } else {
          var sanitizedValue = rewriteAttribute(
              tagName, attribName, atype, value);
          if (sanitizedValue !== null) {
            bridal.setAttribute(feral, attribName, sanitizedValue);
            if (html4.ATTRIBS.hasOwnProperty(tagName + '::target') &&
              atype === html4.atype.URI) {
              if (sanitizedValue.charAt(0) === '#') {
                feral.removeAttribute('target');
              } else {
                bridal.setAttribute(feral, 'target',
                  getSafeTargetAttribute(tagName, 'target',
                    bridal.getAttribute(feral, 'target')));
              }
            }
          }
        }
        return value;
      });
      TameElement.prototype.removeAttribute = nodeMethod(function (attribName) {
        var feral = np(this).feral;
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        attribName = String(attribName).toLowerCase();
        if (/__$/.test(attribName)) {
          throw new TypeError('Attributes may not end with __');
        }
        var tagName = feral.tagName.toLowerCase();
        var atype = htmlSchema.attribute(tagName, attribName).type;
        if (atype === void 0) {
          feral.removeAttribute(cajaPrefix + attribName);
        } else {
          feral.removeAttribute(attribName);
        }
      });
      TameElement.prototype.getElementsByTagName = nodeMethod(
          function(tagName) {
        return tameGetElementsByTagName(
            np(this).feral, tagName, np(this).childrenEditable);
      });
      TameElement.prototype.getElementsByClassName = nodeMethod(
          function(className) {
        return tameGetElementsByClassName(
            np(this).feral, className, np(this).childrenEditable);
      });
      TameElement.prototype.getBoundingClientRect = nodeMethod(function () {
        var feral = np(this).feral;
        var elRect = bridal.getBoundingClientRect(feral);
        var vdoc = bridal.getBoundingClientRect(
            np(this.ownerDocument).feralContainerNode);
        var vdocLeft = vdoc.left, vdocTop = vdoc.top;
        return ({
                  top: elRect.top - vdocTop,
                  left: elRect.left - vdocLeft,
                  right: elRect.right - vdocLeft,
                  bottom: elRect.bottom - vdocTop
                });
      });
      TameElement.prototype.updateStyle = nodeMethod(function (style) {
        var feral = np(this).feral;
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        var cssPropertiesAndValues = cssSealerUnsealerPair.unseal(style);
        if (!cssPropertiesAndValues) { throw new Error(); }

        var styleNode = feral.style;
        for (var i = 0; i < cssPropertiesAndValues.length; i += 2) {
          var propName = cssPropertiesAndValues[+i];
          var propValue = cssPropertiesAndValues[i + 1];
          // If the propertyName differs between DOM and CSS, there will
          // be a semicolon between the two.
          // E.g., 'background-color;backgroundColor'
          // See CssTemplate.toPropertyValueList.
          var semi = propName.indexOf(';');
          if (semi >= 0) { propName = propName.substring(semi + 1); }
          styleNode[propName] = propValue;
        }
      });
      TameElement.prototype.addEventListener =
          nodeMethod(tameAddEventListener);
      TameElement.prototype.removeEventListener =
          nodeMethod(tameRemoveEventListener);
      function innerTextOf(rawNode, out) {
        switch (rawNode.nodeType) {
          case 1:  // Element
            if (htmlSchema.element(rawNode.tagName).allowed) {
              // Not an opaque node.
              for (var c = rawNode.firstChild; c; c = c.nextSibling) {
                c = makeDOMAccessible(c);
                innerTextOf(c, out);
              }
            }
            break;
          case 3:  // Text Node
          case 4:  // CDATA Section Node
            out[out.length] = rawNode.data;
            break;
          case 11:  // Document Fragment
            for (var c = rawNode.firstChild; c; c = c.nextSibling) {
              c = makeDOMAccessible(c);
              innerTextOf(c, out);
            }
            break;
        }
      }
      (function() {
        var geometryDelegateProperty = {
          extendedAccessors: true,
          enumerable: true,
          get: nodeMethod(function (prop) {
            return np(this).geometryDelegate[prop];
          })
        };
        var geometryDelegatePropertySettable =
            Object.create(geometryDelegateProperty);
        geometryDelegatePropertySettable.set =
            nodeMethod(function (value, prop) {
          if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
          np(this).geometryDelegate[prop] = +value;
        });
        definePropertiesAwesomely(TameElement.prototype, {
          clientLeft: geometryDelegateProperty,
          clientTop: geometryDelegateProperty,
          clientWidth: geometryDelegateProperty,
          clientHeight: geometryDelegateProperty,
          offsetLeft: geometryDelegateProperty,
          offsetTop: geometryDelegateProperty,
          offsetWidth: geometryDelegateProperty,
          offsetHeight: geometryDelegateProperty,
          scrollLeft: geometryDelegatePropertySettable,
          scrollTop: geometryDelegatePropertySettable,
          scrollWidth: geometryDelegateProperty,
          scrollHeight: geometryDelegateProperty
        });
      })();
      var innerTextProp = {
        enumerable: true,
        get: nodeMethod(function () {
          var text = [];
          innerTextOf(np(this).feral, text);
          return text.join('');
        }),
        set: nodeMethod(function (newText) {
          // This operation changes the child node list (but not other
          // properties
          // of the element) so it checks childrenEditable. Note that this check
          // is critical to security, as else a client can set the innerHTML of
          // a <script> element to execute scripts.
          if (!np(this).childrenEditable) { throw new Error(NOT_EDITABLE); }
          var newTextStr = newText != null ? String(newText) : '';
          var el = np(this).feral;
          for (var c; (c = el.firstChild);) { el.removeChild(c); }
          if (newTextStr) {
            el.appendChild(el.ownerDocument.createTextNode(newTextStr));
          }
        })
      };
      var tagNameAttr = {
        enumerable: true,
        get: nodeMethod(function () {
          return realToVirtualElementName(String(np(this).feral.tagName));
        })
      };
      definePropertiesAwesomely(TameElement.prototype, {
        id: NP.filterAttr(defaultToEmptyStr, identity),
        className: {
          enumerable: true,
          get: nodeMethod(function () {
            return this.getAttribute('class') || '';
          }),
          set: nodeMethod(function (classes) {
            return this.setAttribute('class', String(classes));
          })
        },
        title: NP.filterAttr(defaultToEmptyStr, String),
        dir: NP.filterAttr(defaultToEmptyStr, String),
        innerText: innerTextProp,
        textContent: innerTextProp,
        nodeName: tagNameAttr,
        tagName: tagNameAttr,
        style: NP.filter(
            false,
            nodeMethod(function (styleNode) {
              TameStyle || buildTameStyle();
              return new TameStyle(styleNode, np(this).editable, this);
            }),
            true, identity),
        innerHTML: {
          enumerable: true,
          get: nodeMethod(function () {
            var node = np(this).feral;
            var tagName = node.tagName.toLowerCase();
            var schemaElem = htmlSchema.element(tagName);
            if (!schemaElem.allowed) {
              return '';  // unknown node
            }
            var innerHtml = node.innerHTML;
            if (schemaElem.contentIsCDATA) {
              innerHtml = html.escapeAttrib(innerHtml);
            } else if (schemaElem.contentIsRCDATA) {
              // Make sure we return PCDATA.
              // For RCDATA we only need to escape & if they're not part of an
              // entity.
              innerHtml = html.normalizeRCData(innerHtml);
            } else {
              // If we blessed the resulting HTML, then this would round trip
              // better but it would still not survive appending, and it would
              // propagate event handlers where the setter of innerHTML does not
              // expect it to.
              innerHtml = tameInnerHtml(innerHtml);
            }
            return innerHtml;
          }),
          set: nodeMethod(function (htmlFragment) {
            // This operation changes the child node list (but not other
            // properties of the element) so it checks childrenEditable. Note
            // that
            // this check is critical to security, as else a client can set the
            // innerHTML of a <script> element to execute scripts.
            if (!np(this).childrenEditable) { throw new Error(NOT_EDITABLE); }
            var node = np(this).feral;
            var schemaElem = htmlSchema.element(node.tagName);
            if (!schemaElem.allowed) { throw new Error(); }
            var isRCDATA = schemaElem.contentIsRCDATA;
            var htmlFragmentString;
            if (!isRCDATA && htmlFragment instanceof Html) {
              htmlFragmentString = '' + safeHtml(htmlFragment);
            } else if (htmlFragment === null) {
              htmlFragmentString = '';
            } else {
              htmlFragmentString = '' + htmlFragment;
            }
            var sanitizedHtml;
            if (isRCDATA) {
              sanitizedHtml = html.normalizeRCData(htmlFragmentString);
            } else {
              sanitizedHtml = sanitizeHtml(htmlFragmentString);
            }
            node.innerHTML = sanitizedHtml;
            return htmlFragment;
          })
        },
        offsetParent: {
          enumerable: true,
          get: cajaVM.def(function () {
            var feralOffsetParent = np(this).feral.offsetParent;
            if (!feralOffsetParent) {
              return feralOffsetParent;
            } else if (feralOffsetParent === containerNode) {
              // Return the body if the node is contained in the body. This is
              // emulating how browsers treat offsetParent and the real <BODY>.
              var feralBody = np(tameDocument.body).feral;
              for (var ancestor = makeDOMAccessible(np(this).feral.parentNode);
                   ancestor !== containerNode;
                   ancestor = makeDOMAccessible(ancestor.parentNode)) {
                if (ancestor === feralBody) {
                  return defaultTameNode(feralBody, np(this).editable);
                }
              }
              return null;
            } else {
              return tameRelatedNode(feralOffsetParent, np(this).editable,
                  defaultTameNode);
            }
          })
        }
      });
      cajaVM.def(TameElement);  // and its prototype

      traceStartup("DT: starting defineElement");

      /**
       * Define a taming class for a subclass of HTMLElement.
       *
       * @param {Array} record.superclass The tame superclass constructor
       *     (defaults to TameElement) with parameters (this, node, editable,
       *     childrenEditable, opt_proxyType).
       * @param {Array} record.names The element names which should be tamed
       *     using this class.
       * @param {String} record.domClass The DOM-specified class name.
       * @param {Object} record.properties The custom properties this class
       *     should have (in the format accepted by definePropertiesAwesomely).
       * @param {function} record.construct Code to invoke at the end of
       *     construction; takes and returns self.
       * @param {boolean} record.forceChildrenNotEditable Whether to force the
       *     childrenEditable flag to be false regardless of the value of
       *     editable.
       * @return {function} The constructor.
       */
      function defineElement(record) {
        var superclass = record.superclass || TameElement;
        var proxyType = record.proxyType;
        var construct = record.construct || identity;
        var virtualized = record.virtualized || false;
        var forceChildrenNotEditable = record.forceChildrenNotEditable;
        function TameSpecificElement(node, editable) {
          superclass.call(this,
                          node,
                          editable,
                          editable && !forceChildrenNotEditable,
                          proxyType);
          construct.call(this);
        }
        inertCtor(TameSpecificElement, superclass, record.domClass);
        for (var i = 0; i < record.names.length; i++) {
          var name = record.names[+i];
          if (!!virtualized !== !!htmlSchema.element(name).shouldVirtualize) {
            throw new Error("Domado internal inconsistency: " + name + 
                "has inconsistent virtualization flags");
          }
          tamingClassesByElement[virtualToRealElementName(name) + '$'] =
              TameSpecificElement;
        }
        definePropertiesAwesomely(TameSpecificElement.prototype,
            record.properties || {});
        // Note: cajaVM.def will be applied to all registered node classes
        // later, so users of defineElement don't need to.
        return TameSpecificElement;
      }
      cajaVM.def(defineElement);

      defineElement({
        names: ['a'],
        domClass: 'HTMLAnchorElement',
        properties: {
          hash: NP.filter(
            false,
            function (value) { return unsuffix(value, idSuffix, value); },
            false,
            // TODO(felix8a): add suffix if href is self
            identity),
          // TODO(felix8a): fragment rewriting?
          href: NP.filter(false, identity, true, identity)
        }
      });

      var TameBodyElement = defineElement({
        names: ['body'],
        virtualized: true,
        domClass: 'HTMLBodyElement'
      });
      setOwn(TameBodyElement.prototype, 'setAttribute', nodeMethod(
          function (attrib, value) {
        TameElement.prototype.setAttribute.call(this, attrib, value);
        var attribName = String(attrib).toLowerCase();
        // Window event handlers are exposed as content attributes on <body>
        // and <frameset>
        // <http://www.whatwg.org/specs/web-apps/current-work/multipage/webappapis.html#handler-window-onload>
        // as of 2012-09-14
        // Note: We only currently implement onload.
        if (attribName === 'onload') {
          // We do not use the main event-handler-attribute rewriter here
          // because it generates event-handler strings, not functions -- and 
          // for the TameWindow there is no real element to hang those handler
          // strings on. TODO(kpreid): refactor to fix that.
          if (cajaVM.compileExpr) { // ES5 case: eval available
            // Per http://www.whatwg.org/specs/web-apps/current-work/multipage/webappapis.html#event-handler-attributes
            tameWindow[attribName] = cajaVM.compileExpr(
                'function cajaEventHandlerAttribFn_' + attribName +
                '(event) {\n' + value + '\n}')(tameWindow);
          } else {
            var match = value.match(SIMPLE_HANDLER_PATTERN);
            if (!match) { return; }
            //var doesReturn = match[1];  // not currently used
            var fnName = match[2];
            // TODO(kpreid): Synthesize a load event object.
            tameWindow[attribName] =
                function () { tameWindow[fnName].call(this, {}, this); };
          }
        }
      }));

      // http://dev.w3.org/html5/spec/Overview.html#the-canvas-element
      (function() {
        // If the host browser does not have getContext, then it must not
        // usefully
        // support canvas, so we don't either; skip registering the canvas
        // element
        // class.
        // TODO(felix8a): need to call bridal.initCanvasElement
        var e = makeDOMAccessible(document.createElement('canvas'));
        if (typeof e.getContext !== 'function')
          return;

        // TODO(kpreid): snitched from Caja runtime; review whether we actually
        // need this (the Canvas spec says that invalid values should be ignored
        // and we don't do that in a bunch of places);
        /**
         * Enforces <tt>typeOf(specimen) === typename</tt>, in which case
         * specimen is returned.
         * <p>
         * If not, throws an informative TypeError
         * <p>
         * opt_name, if provided, should be a name or description of the
         * specimen used only to generate friendlier error messages.
         */
        function enforceType(specimen, typename, opt_name) {
          if (typeof specimen !== typename) {
            throw new Error('expected ', typename, ' instead of ',
                typeof specimen, ': ', (opt_name || specimen));
          }
          return specimen;
        }

        var TameContext2DConf = new Confidence('TameContext2D');
        var ContextP = new PropertyTaming(TameContext2DConf);

        function matchesStyleFully(cssPropertyName, value) {
          if (typeof value !== "string") { return false; }
          var tokens = lexCss(value);
          var k = 0;
          for (var i = 0, n = tokens.length; i < n; ++i) {
            var tok = tokens[i];
            if (tok !== ' ') { tokens[k++] = tok; }
          }
          tokens.length = k;
          // sanitizeCssProperty always lowercases
          var unfiltered = tokens.join(' ').toLowerCase();
          sanitizeCssProperty(cssPropertyName,
                              cssSchema[cssPropertyName], tokens);
          return unfiltered === tokens.join(' ') ? unfiltered : false;
        }

        function isFont(value) {
          return !!matchesStyleFully('font', value);
        }
        function isColor(value) {
          // Note: we're testing against the pattern for the CSS "color:"
          // property, but what is actually referenced by the draft canvas spec
          // is
          // the CSS syntactic element <color>, which is why we need to
          // specifically exclude "inherit".
          var style = matchesStyleFully('color', value);
          return style && style.toLowerCase() !== 'inherit';
        }
        var colorNameTable = {
          // http://dev.w3.org/csswg/css3-color/#html4 as cited by
          // http://dev.w3.org/html5/2dcontext/#dom-context-2d-fillstyle
          // TODO(kpreid): avoid duplication with table in CssRewriter.java
          " black":   "#000000",
          " silver":  "#c0c0c0",
          " gray":    "#808080",
          " white":   "#ffffff",
          " maroon":  "#800000",
          " red":     "#ff0000",
          " purple":  "#800080",
          " fuchsia": "#ff00ff",
          " green":   "#008000",
          " lime":    "#00ff00",
          " olive":   "#808000",
          " yellow":  "#ffff00",
          " navy":    "#000080",
          " blue":    "#0000ff",
          " teal":    "#008080",
          " aqua":    "#00ffff"
        };
        function StringTest(strings) {
          var table = {};
          // The table itself as a value is a marker to avoid running into
          // Object.prototype properties.
          for (var i = strings.length; --i >= 0;) {
            table[strings[+i]] = table;
          }
          return cajaVM.def(function (string) {
            return typeof string === 'string' && table[string] === table;
          });
        }
        function canonColor(colorString) {
          // http://dev.w3.org/html5/2dcontext/ says the color shall be returned
          // only as #hhhhhh, not as names.
          return colorNameTable[" " + colorString] || colorString;
        }
        function TameImageData(imageData) {
          imageData = makeDOMAccessible(imageData);
          var p = TameImageDataConf.p;

          // Since we can't interpose indexing, we can't wrap the
          // CanvasPixelArray
          // so we have to copy the pixel data. This is horrible, bad, and
          // awful.
          // TODO(kpreid): No longer true in ES5-land; we can interpose but not
          // under ES5/3. Use proxies conditional on the same switch that
          // controls
          // liveness of node lists.
          var tameImageData = {
            toString: cajaVM.def(function () {
                return "[Domita Canvas ImageData]"; }),
            width: Number(imageData.width),
            height: Number(imageData.height)
          };
          TameImageDataConf.confide(tameImageData);
          taming.permitUntaming(tameImageData);

          // used to unwrap for passing to putImageData
          p(tameImageData).feral = imageData;

          // lazily constructed tame copy, backs .data accessor; also used to
          // test whether we need to write-back the copy before a putImageData
          p(tameImageData).tamePixelArray = undefined;

          definePropertiesAwesomely(tameImageData, {
            data: {
              enumerable: true,
              // Accessor used so we don't need to copy if the client is just
              // blitting (getImageData -> putImageData) rather than inspecting
              // the pixels.
              get: cajaVM.def(function () {
                if (!p(tameImageData).tamePixelArray) {

                  var bareArray = imageData.data;
                  // Note: On Firefox 4.0.1, at least, pixel arrays cannot have
                  // added properties (such as our w___). Therefore, for
                  // writing,
                  // we use a special routine, and we don't do
                  // makeDOMAccessible
                  // because it would have no effect. An alternative approach
                  // would be to muck with the "Uint8ClampedArray" prototype.

                  var length = bareArray.length;
                  var tamePixelArray = { // not frozen, user-modifiable
                    // TODO: Investigate whether it would be an optimization to
                    // make this an array with properties added.
                    toString: cajaVM.def(function () {
                        return "[Domita CanvasPixelArray]"; }),
                    _d_canvas_writeback: function () {
                      // This is invoked just before each putImageData

                      // TODO(kpreid): shouldn't be a public method (but is
                      // harmless).

                      rulebreaker.writeToPixelArray(
                        tamePixelArray, bareArray, length);
                    }
                  };
                  for (var i = length-1; i >= 0; i--) {
                    tamePixelArray[+i] = bareArray[+i];
                  }
                  p(tameImageData).tamePixelArray = tamePixelArray;
                }
                return p(tameImageData).tamePixelArray;
              })
            }
          });
          return Object.freeze(tameImageData);
        }
        function TameGradient(gradient) {
          gradient = makeDOMAccessible(gradient);
          var tameGradient = {
            toString: cajaVM.def(function () {
                return "[Domita CanvasGradient]"; }),
            addColorStop: cajaVM.def(function (offset, color) {
              enforceType(offset, 'number', 'color stop offset');
              if (!(0 <= offset && offset <= 1)) {
                throw new Error(INDEX_SIZE_ERROR);
                // TODO(kpreid): should be a DOMException per spec
              }
              if (!isColor(color)) {
                throw new Error("SYNTAX_ERR");
                // TODO(kpreid): should be a DOMException per spec
              }
              gradient.addColorStop(offset, color);
            })
          };
          TameGradientConf.confide(tameGradient);
          TameGradientConf.p(tameGradient).feral = gradient;
          taming.tamesTo(gradient, tameGradient);
          return Object.freeze(tameGradient);
        }
        function enforceFinite(value, name) {
          enforceType(value, 'number', name);
          if (!isFinite(value)) {
            throw new Error("NOT_SUPPORTED_ERR");
            // TODO(kpreid): should be a DOMException per spec
          }
        }

        function TameCanvasElement(node, editable) {
          // TODO(kpreid): review whether this can use defineElement
          TameElement.call(this, node, editable, editable);

          // helpers for tame context
          var context = makeDOMAccessible(node.getContext('2d'));
          function tameFloatsOp(count, verb) {
            var m = makeFunctionAccessible(context[verb]);
            return cajaVM.def(function () {
              if (arguments.length !== count) {
                throw new Error(verb + ' takes ' + count + ' args, not ' +
                                arguments.length);
              }
              for (var i = 0; i < count; i++) {
                enforceType(arguments[+i], 'number', verb + ' argument ' + i);
              }
              // The copy-into-array is necessary in ES5/3 because host DOM
              // won't take an arguments object from inside of ES53.
              m.apply(context, Array.prototype.slice.call(arguments));
            });
          }
          function tameRectMethod(m, hasResult) {
            makeFunctionAccessible(m);
            return cajaVM.def(function (x, y, w, h) {
              if (arguments.length !== 4) {
                throw new Error(m + ' takes 4 args, not ' +
                                arguments.length);
              }
              enforceType(x, 'number', 'x');
              enforceType(y, 'number', 'y');
              enforceType(w, 'number', 'width');
              enforceType(h, 'number', 'height');
              if (hasResult) {
                return m.call(context, x, y, w, h);
              } else {
                m.call(context, x, y, w, h);
              }
            });
          }
          function tameDrawText(m) {
            makeFunctionAccessible(m);
            return cajaVM.def(function (text, x, y, maxWidth) {
              enforceType(text, 'string', 'text');
              enforceType(x, 'number', 'x');
              enforceType(y, 'number', 'y');
              switch (arguments.length) {
              case 3:
                m.apply(context, Array.prototype.slice.call(arguments));
                return;
              case 4:
                enforceType(maxWidth, 'number', 'maxWidth');
                m.apply(context, Array.prototype.slice.call(arguments));
                return;
              default:
                throw new Error(m + ' cannot accept ' + arguments.length +
                                    ' arguments');
              }
            });
          }
          function tameGetMethod(prop) {
            return cajaVM.def(function () { return context[prop]; });
          }
          function tameSetMethod(prop, validator) {
            return cajaVM.def(function (newValue) {
              if (validator(newValue)) {
                context[prop] = newValue;
              }
              return newValue;
            });
          }
          var CP_STYLE = {
            enumerable: true,
            extendedAccessors: true,
            get: TameContext2DConf.protectMethod(function (prop) {
              var value = context[prop];
              if (typeof(value) == "string") {
                return canonColor(value);
              } else if (cajaVM.passesGuard(TameGradientT,
                                            taming.tame(value))) {
                return taming.tame(value);
              } else {
                throw new Error("Internal: Can't tame value " + value + " of " +
                     prop);
              }
            }),
            set: cajaVM.def(function (newValue, prop) {
              if (isColor(newValue)) {
                context[prop] = newValue;
              } else if (typeof(newValue) === "object" &&
                         cajaVM.passesGuard(TameGradientT, newValue)) {
                context[prop] = TameGradientConf.p(newValue).feral;
              } // else do nothing
              return newValue;
            })
          };
          function tameSimpleOp(m) {  // no return value
            makeFunctionAccessible(m);
            return cajaVM.def(function () {
              if (arguments.length !== 0) {
                throw new Error(m + ' takes no args, not ' + arguments.length);
              }
              m.call(context);
            });
          }

          // Design note: We generally reject the wrong number of arguments,
          // unlike default JS behavior. This is because we are just passing
          // data
          // through to the underlying implementation, but we don't want to pass
          // on anything which might be an extension we don't know about, and it
          // is better to fail explicitly than to leave the client wondering
          // about
          // why their extension usage isn't working.

          // http://dev.w3.org/html5/2dcontext/
          // TODO(kpreid): Review this for converting to prototypical objects
          var tameContext2d = np(this).tameContext2d = {
            toString: cajaVM.def(function () {
                return "[Domita CanvasRenderingContext2D]"; }),

            save: tameSimpleOp(context.save),
            restore: tameSimpleOp(context.restore),

            scale: tameFloatsOp(2, 'scale'),
            rotate: tameFloatsOp(1, 'rotate'),
            translate: tameFloatsOp(2, 'translate'),
            transform: tameFloatsOp(6, 'transform'),
            setTransform: tameFloatsOp(6, 'setTransform'),

            createLinearGradient: function (x0, y0, x1, y1) {
              if (arguments.length !== 4) {
                throw new Error('createLinearGradient takes 4 args, not ' +
                                arguments.length);
              }
              enforceType(x0, 'number', 'x0');
              enforceType(y0, 'number', 'y0');
              enforceType(x1, 'number', 'x1');
              enforceType(y1, 'number', 'y1');
              return new TameGradient(
                context.createLinearGradient(x0, y0, x1, y1));
            },
            createRadialGradient: function (x0, y0, r0, x1, y1, r1) {
              if (arguments.length !== 6) {
                throw new Error('createRadialGradient takes 6 args, not ' +
                                arguments.length);
              }
              enforceType(x0, 'number', 'x0');
              enforceType(y0, 'number', 'y0');
              enforceType(r0, 'number', 'r0');
              enforceType(x1, 'number', 'x1');
              enforceType(y1, 'number', 'y1');
              enforceType(r1, 'number', 'r1');
              return new TameGradient(context.createRadialGradient(
                x0, y0, r0, x1, y1, r1));
            },

            createPattern: function (imageElement, repetition) {
              // Consider what policy to have wrt reading the pixels from image
              // elements before implementing this.
              throw new Error(
                  'Domita: canvas createPattern not yet implemented');
            },

            clearRect:  tameRectMethod(context.clearRect,  false),
            fillRect:   tameRectMethod(context.fillRect,   false),
            strokeRect: tameRectMethod(context.strokeRect, false),

            beginPath: tameSimpleOp(context.beginPath),
            closePath: tameSimpleOp(context.closePath),
            moveTo: tameFloatsOp(2, 'moveTo'),
            lineTo: tameFloatsOp(2, 'lineTo'),
            quadraticCurveTo: tameFloatsOp(4, 'quadraticCurveTo'),
            bezierCurveTo: tameFloatsOp(6, 'bezierCurveTo'),
            arcTo: tameFloatsOp(5, 'arcTo'),
            rect: tameFloatsOp(4, 'rect'),
            arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
              if (arguments.length !== 6) {
                throw new Error('arc takes 6 args, not ' + arguments.length);
              }
              enforceType(x, 'number', 'x');
              enforceType(y, 'number', 'y');
              enforceType(radius, 'number', 'radius');
              enforceType(startAngle, 'number', 'startAngle');
              enforceType(endAngle, 'number', 'endAngle');
              enforceType(anticlockwise, 'boolean', 'anticlockwise');
              if (radius < 0) {
                throw new Error(INDEX_SIZE_ERROR);
                // TODO(kpreid): should be a DOMException per spec
              }
              context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            },
            fill: tameSimpleOp(context.fill),
            stroke: tameSimpleOp(context.stroke),
            clip: tameSimpleOp(context.clip),

            isPointInPath: function (x, y) {
              enforceType(x, 'number', 'x');
              enforceType(y, 'number', 'y');
              return enforceType(context.isPointInPath(x, y), 'boolean');
            },

            fillText: tameDrawText(context.fillText),
            strokeText: tameDrawText(context.strokeText),
            measureText: function (string) {
              if (arguments.length !== 1) {
                throw new Error('measureText takes 1 arg, not ' +
                    arguments.length);
              }
              enforceType(string, 'string', 'measureText argument');
              return context.measureText(string);
            },

            drawImage: function (imageElement) {
              // Consider what policy to have wrt reading the pixels from image
              // elements before implementing this.
              throw new Error('Domita: canvas drawImage not yet implemented');
            },

            createImageData: function (sw, sh) {
              if (arguments.length !== 2) {
                throw new Error('createImageData takes 2 args, not ' +
                                arguments.length);
              }
              enforceType(sw, 'number', 'sw');
              enforceType(sh, 'number', 'sh');
              return new TameImageData(context.createImageData(sw, sh));
            },
            getImageData: tameRectMethod(function (sx, sy, sw, sh) {
              return TameImageData(context.getImageData(sx, sy, sw, sh));
            }, true),
            putImageData: function
                (tameImageData, dx, dy, dirtyX, dirtyY,
                    dirtyWidth, dirtyHeight) {
              tameImageData = TameImageDataT.coerce(tameImageData);
              enforceFinite(dx, 'dx');
              enforceFinite(dy, 'dy');
              switch (arguments.length) {
              case 3:
                dirtyX = 0;
                dirtyY = 0;
                dirtyWidth = tameImageData.width;
                dirtyHeight = tameImageData.height;
                break;
              case 7:
                enforceFinite(dirtyX, 'dirtyX');
                enforceFinite(dirtyY, 'dirtyY');
                enforceFinite(dirtyWidth, 'dirtyWidth');
                enforceFinite(dirtyHeight, 'dirtyHeight');
                break;
              default:
                throw 'putImageData cannot accept ' + arguments.length +
                    ' arguments';
              }
              var tamePixelArray =
                TameImageDataConf.p(tameImageData).tamePixelArray;
              if (tamePixelArray) {
                tamePixelArray._d_canvas_writeback();
              }
              context.putImageData(TameImageDataConf.p(tameImageData).feral,
                                   dx, dy, dirtyX, dirtyY,
                                   dirtyWidth, dirtyHeight);
            }
          };

          if ("drawFocusRing" in context) {
            tameContext2d.drawFocusRing = function
                (tameElement, x, y, canDrawCustom) {
              switch (arguments.length) {
              case 3:
                canDrawCustom = false;
                break;
              case 4:
                break;
              default:
                throw 'drawFocusRing cannot accept ' + arguments.length +
                    ' arguments';
              }
              tameElement = TameNodeT.coerce(tameElement);
              enforceType(x, 'number', 'x');
              enforceType(y, 'number', 'y');
              enforceType(canDrawCustom, 'boolean', 'canDrawCustom');

              // On safety of using the untamed node here: The only information
              // drawFocusRing takes from the node is whether it is focused.
              return enforceType(
                  context.drawFocusRing(np(tameElement).feral, x, y,
                                        canDrawCustom),
                  'boolean');
            };
          }

          definePropertiesAwesomely(tameContext2d, {
            // We filter the values supplied to setters in case some browser
            // extension makes them more powerful, e.g. containing scripting or
            // a URL.
            // TODO(kpreid): Do we want to filter the *getters* as well?
            // Scenarios: (a) canvas shared with innocent code, (b) browser
            // quirks?? If we do, then what should be done with a bad value?
            globalAlpha: ContextP.RWCond(
                function (v) { return typeof v === "number" &&
                                      0.0 <= v && v <= 1.0;     }),
            globalCompositeOperation: ContextP.RWCond(
                StringTest([
                  "source-atop",
                  "source-in",
                  "source-out",
                  "source-over",
                  "destination-atop",
                  "destination-in",
                  "destination-out",
                  "destination-over",
                  "lighter",
                  "copy",
                  "xor"
                ])),
            strokeStyle: CP_STYLE,
            fillStyle: CP_STYLE,
            lineWidth: ContextP.RWCond(
                function (v) { return typeof v === "number" &&
                                      0.0 < v && v !== Infinity; }),
            lineCap: ContextP.RWCond(
                StringTest([
                  "butt",
                  "round",
                  "square"
                ])),
            lineJoin: ContextP.RWCond(
                StringTest([
                  "bevel",
                  "round",
                  "miter"
                ])),
            miterLimit: ContextP.RWCond(
                  function (v) { return typeof v === "number" &&
                                        0 < v && v !== Infinity; }),
            shadowOffsetX: ContextP.RWCond(
                  function (v) {
                    return typeof v === "number" && isFinite(v); }),
            shadowOffsetY: ContextP.RWCond(
                  function (v) {
                    return typeof v === "number" && isFinite(v); }),
            shadowBlur: ContextP.RWCond(
                  function (v) { return typeof v === "number" &&
                                        0.0 <= v && v !== Infinity; }),
            shadowColor: {
              enumerable: true,
              extendedAccessors: true,
              get: CP_STYLE.get,
              set: ContextP.RWCond(isColor).set
            },

            font: ContextP.RWCond(isFont),
            textAlign: ContextP.RWCond(
                StringTest([
                  "start",
                  "end",
                  "left",
                  "right",
                  "center"
                ])),
            textBaseline: ContextP.RWCond(
                StringTest([
                  "top",
                  "hanging",
                  "middle",
                  "alphabetic",
                  "ideographic",
                  "bottom"
                ]))
          });
          TameContext2DConf.confide(tameContext2d);
          TameContext2DConf.p(tameContext2d).editable = np(this).editable;
          TameContext2DConf.p(tameContext2d).feral = context;
          cajaVM.def(tameContext2d);
          taming.permitUntaming(tameContext2d);
        }  // end of TameCanvasElement
        inertCtor(TameCanvasElement, TameElement, 'HTMLCanvasElement');
        TameCanvasElement.prototype.getContext = function (contextId) {

          // TODO(kpreid): We can refine this by inventing a
          // ReadOnlyCanvas object
          // to return in this situation, which allows getImageData and
          // so on but
          // not any drawing. Not bothering to do that for now; if
          // you have a use
          // for it let us know.
          if (!np(this).editable) { throw new Error(NOT_EDITABLE); }

          enforceType(contextId, 'string', 'contextId');
          switch (contextId) {
            case '2d':
              return np(this).tameContext2d;
            default:
              // http://dev.w3.org/html5/spec/the-canvas-element.html#the-canvas-element
              // says: The getContext(contextId, args...) method of the canvas
              // element, when invoked, must run the following steps:
              // [...]
              //     If contextId is not the name of a context supported by the
              //     user agent, return null and abort these steps.
              //
              // However, Mozilla throws and WebKit returns undefined instead.
              // Returning undefined rather than null is closer to the spec
              // than throwing.
              return undefined;
              throw new Error('Unapproved canvas contextId');
          }
        };
        definePropertiesAwesomely(TameCanvasElement.prototype, {
          height: NP.filter(false, identity, false, Number),
          width: NP.filter(false, identity, false, Number)
        });

        tamingClassesByElement['canvas$'] = TameCanvasElement;
      })();

      traceStartup("DT: done with canvas");

      function FormElementAndExpandoProxyHandler(target, editable, storage) {
        ExpandoProxyHandler.call(this, target, editable, storage);
      }
      inherit(FormElementAndExpandoProxyHandler, ExpandoProxyHandler);
      setOwn(FormElementAndExpandoProxyHandler.prototype,
          'getOwnPropertyDescriptor', function (name) {
        if (name !== 'ident___' &&
            Object.prototype.hasOwnProperty.call(this.target.elements, name)) {
          return Object.getOwnPropertyDescriptor(this.target.elements, name);
        } else {
          return ExpandoProxyHandler.prototype.getOwnPropertyDescriptor
              .call(this, name);
        }
      });
      setOwn(FormElementAndExpandoProxyHandler.prototype,
          'get', domitaModules.permuteProxyGetSet.getter(function (name) {
        if (name !== 'ident___' &&
            Object.prototype.hasOwnProperty.call(this.target.elements, name)) {
          return this.target.elements[name];
        } else {
          return ExpandoProxyHandler.prototype.get.unpermuted.call(this, name);
        }
      }));
      setOwn(FormElementAndExpandoProxyHandler.prototype, 'getOwnPropertyNames',
          function () {
        // TODO(kpreid): not quite right result set
        return Object.getOwnPropertyNames(this.target.elements);
      });
      setOwn(FormElementAndExpandoProxyHandler.prototype, 'delete',
          function (name) {
        if (name === "ident___") {
          return false;
        } else if (Object.prototype.hasOwnProperty.call(
                       this.target.elements, name)) {
          return false;
        } else {
          return ExpandoProxyHandler.prototype['delete'].call(this, name);
        }
      });
      cajaVM.def(FormElementAndExpandoProxyHandler);

      var TameFormElement = defineElement({
        names: ['form'],
        domClass: 'HTMLFormElement',
        proxyType: FormElementAndExpandoProxyHandler,
        properties: {
          action: NP.filterAttr(defaultToEmptyStr, String),
          elements: {
            enumerable: true,
            get: nodeMethod(function () {
              return tameHTMLCollection(
                  np(this).feral.elements, np(this).editable, defaultTameNode);
            })
          },
          enctype: NP.filterAttr(defaultToEmptyStr, String),
          method: NP.filterAttr(defaultToEmptyStr, String),
          target: NP.filterAttr(defaultToEmptyStr, String)
        },
        construct: function () {
          // Freeze length at creation time since we aren't live.
          // TODO(kpreid): Revise this when we have live node lists.
          Object.defineProperty(this, "length", {
            value: np(this).feral.length
          });
        }
      });
      TameFormElement.prototype.submit = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return np(this).feral.submit();
      });
      TameFormElement.prototype.reset = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return np(this).feral.reset();
      });

      defineElement({
        names: ['head'],
        virtualized: true,
        domClass: 'HTMLHeadElement'
      });

      defineElement({
        names: ['html'],
        virtualized: true,
        domClass: 'HTMLHtmlElement'
      });

      var P_blacklist = {
        enumerable: true,
        extendedAccessors: true,
        get: nodeMethod(function () { return undefined; }),
        set: nodeMethod(function (value, prop) {
          if (typeof console !== 'undefined')
            console.error('Cannot set the [', prop, '] property of an iframe.');
        })
      };
      var TameIFrameElement = defineElement({
        names: ['iframe'],
        domClass: 'HTMLIFrameElement',
        construct: function () {
          np(this).childrenEditable = false;
        },
        properties: {
          align: {
            enumerable: true,
            get: nodeMethod(function () {
              return np(this).feral.align;
            }),
            set: nodeMethod(function (alignment) {
              if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
              alignment = String(alignment);
              if (alignment === 'left' ||
                  alignment === 'right' ||
                  alignment === 'center') {
                np(this).feral.align = alignment;
              }
            })
          },
          frameBorder: {
            enumerable: true,
            get: nodeMethod(function () {
              return np(this).feral.frameBorder;
            }),
            set: nodeMethod(function (border) {
              if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
              border = String(border).toLowerCase();
              if (border === '0' || border === '1' ||
                  border === 'no' || border === 'yes') {
                np(this).feral.frameBorder = border;
              }
            })
          },
          height: NP.filterProp(identity, Number),
          width:  NP.filterProp(identity, Number),
          src: P_blacklist,
          name: P_blacklist
        }
      });
      // TODO(kpreid): Check these two (straight from Domita) for correctness
      // vs. TameElement's version
      setOwn(TameIFrameElement.prototype, 'getAttribute',
          nodeMethod(function (attr) {
        var attrLc = String(attr).toLowerCase();
        if (attrLc !== 'name' && attrLc !== 'src') {
          return TameElement.prototype.getAttribute.call(this, attr);
        }
        return null;
      }));
      setOwn(TameIFrameElement.prototype, 'setAttribute',
          nodeMethod(function (attr, value) {
        var attrLc = String(attr).toLowerCase();
        // The 'name' and 'src' attributes are whitelisted for all tags in
        // html4-attributes-whitelist.json, since they're needed on tags
        // like <img>.  Because there's currently no way to filter attributes
        // based on the tag, we have to blacklist these two here.
        if (attrLc !== 'name' && attrLc !== 'src') {
          return TameElement.prototype.setAttribute.call(this, attr, value);
        }
        if (typeof console !== 'undefined')
          console.error('Cannot set the [' + attrLc +
              '] attribute of an iframe.');
        return value;
      }));

      var TameImageElement = defineElement({
        names: ['img'],
        domClass: 'HTMLImageElement',
        properties: {
          alt: NP.filterProp(String, String),
          height: NP.filterProp(Number, Number),
          src: NP.filter(false, String, true, identity),
          width: NP.filterProp(Number, Number)
        }
      });
      var featureTestImage = makeDOMAccessible(document.createElement('img'));
      if ("naturalWidth" in featureTestImage) {
        definePropertiesAwesomely(TameImageElement, {
          naturalHeight: NP.filterProp(Number, Number),
          naturalWidth: NP.filterProp(Number, Number)
        });
      }
      if ("complete" in featureTestImage) {
        definePropertiesAwesomely(TameImageElement, {
          complete: NP.filterProp(Boolean, Boolean)
        });
      }

      function toInt(x) { return x | 0; }
      // TODO(kpreid): The conflation of these elements is partly nonsense.
      // Split it into the appropriate narrow interfaces for each element.
      var TameInputElement = defineElement({
        names: ['select', 'button', 'textarea', 'input'],
        domClass: 'HTMLInputElement',
        properties: {
          checked: NP.filterProp(identity, Boolean),
          defaultChecked: NP.rw,
          value: NP.filter(
            false, function (x) { return x == null ? null : String(x); },
            false, function (x) { return x == null ? '' : '' + x; }),
          defaultValue: NP.filter(
            false, function (x) { return x == null ? null : String(x); },
            false, function (x) { return x == null ? '' : '' + x; }),
          form: NP.related,
          disabled: NP.rw,
          readOnly: NP.rw,
          options: {
            enumerable: true,
            get: nodeMethod(function () {
              return new TameOptionsList(
                  np(this).feral.options,
                  np(this).editable,
                  defaultTameNode, 'name');
            })
          },
          selectedIndex: NP.filterProp(identity, toInt),
          name: NP.rw,
          accessKey: NP.rw,
          tabIndex: NP.rw,
          maxLength: NP.rw,
          size: NP.rw,
          type: NP.rw,
          multiple: NP.rw,
          cols: NP.rw,
          rows: NP.rw
        }
      });
      TameInputElement.prototype.select = nodeMethod(function () {
        np(this).feral.select();
      });

      defineElement({
        names: ['label'],
        domClass: 'HTMLLabelElement',
        properties: {
          htmlFor: NP.Rename("for", NP.filterAttr(identity, identity))
        }
      });

      defineElement({
        names: ['option'],
        domClass: 'HTMLOptionElement',
        properties: {
          defaultSelected: NP.filterProp(Boolean, Boolean),
          disabled: NP.filterProp(Boolean, Boolean),
          form: NP.related,
          index: NP.filterProp(Number),
          label: NP.filterProp(String, String),
          selected: NP.filterProp(Boolean, Boolean),
          text: NP.filterProp(String, String),
          // TODO(kpreid): Justify these specialized filters.
          value: NP.filterProp(
            function (x) { return x == null ? null : String(x); },
            function (x) { return x == null ? '' : '' + x; })
        }
      });

      function dynamicCodeDispatchMaker(that) {
        window.cajaDynamicScriptCounter =
          window.cajaDynamicScriptCounter ?
            window.cajaDynamicScriptCounter + 1 : 0;
        var name = "caja_dynamic_script" +
          window.cajaDynamicScriptCounter + '___';
        window[name] = function() {
          try {
            if (that.src &&
              'function' === typeof domicile.evaluateUntrustedExternalScript) {
              domicile.evaluateUntrustedExternalScript(that.src);
            }
          } finally {
            window[name] = undefined;
          }
        };
        return name + "();";
      }

      var TameScriptElement = defineElement({
        names: ['script'],
        domClass: 'HTMLScriptElement',
        forceChildrenNotEditable: true,
        properties: {
          src: NP.filter(false, identity, true, identity)
        },
        construct: function () {
          var script = np(this);
          script.feral.appendChild(
            document.createTextNode(
              dynamicCodeDispatchMaker(script)));
        }
      });

      setOwn(TameScriptElement.prototype, 'setAttribute', nodeMethod(
          function (attrib, value) {
        var feral = np(this).feral;
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        TameElement.prototype.setAttribute.call(this, attrib, value);
        var attribName = String(attrib).toLowerCase();
        if ("src" === attribName) {
          np(this).src = String(value);
        }
      }));

      var TameTableCompElement = defineElement({
        names: ['td', 'thead', 'tfoot', 'tbody', 'th'],
        properties: {
          colSpan: NP.filterProp(identity, identity),
          cells: {
            // TODO(kpreid): It would be most pleasing to find a way to generalize
            // all the accessors which are of the form
            //     return new TameNodeList(np(this).feral...., ..., ...)
            enumerable: true,
            get: nodeMethod(function () {
              return new TameNodeList(
                  np(this).feral.cells, np(this).editable, defaultTameNode);
            })
          },
          cellIndex: NP.ro,
          rowSpan: NP.filterProp(identity, identity),
          rows: {
            enumerable: true,
            get: nodeMethod(function () {
              return new TameNodeList(
                  np(this).feral.rows, np(this).editable, defaultTameNode);
            })
          },
          rowIndex: NP.ro,
          sectionRowIndex: NP.ro,
          align: NP.filterProp(identity, identity),
          vAlign: NP.filterProp(identity, identity),
          nowrap: NP.filterProp(identity, identity)
        }
      });
      TameTableCompElement.prototype.insertRow = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.rows.length);
        return defaultTameNode(np(this).feral.insertRow(index),
            np(this).editable);
      });
      TameTableCompElement.prototype.deleteRow = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.rows.length);
        np(this).feral.deleteRow(index);
      });

      function requireIntIn(idx, min, max) {
        if (idx !== (idx | 0) || idx < min || idx > max) {
          throw new Error(INDEX_SIZE_ERROR);
        }
      }

      var TameTableRowElement = defineElement({
        superclass: TameTableCompElement,
        names: ['tr'],
        domClass: 'HTMLTableRowElement'
      });
      TameTableRowElement.prototype.insertCell = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.cells.length);
        return defaultTameNode(
            np(this).feral.insertCell(index),
            np(this).editable);
      });
      TameTableRowElement.prototype.deleteCell = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.cells.length);
        np(this).feral.deleteCell(index);
      });

      var TameTableElement = defineElement({
        superclass: TameTableCompElement,
        names: ['table'],
        domClass: 'HTMLTableElement',
        properties: {
          tBodies: {
            enumerable: true,
            get: nodeMethod(function () {
              return new TameNodeList(
                  np(this).feral.tBodies, np(this).editable, defaultTameNode);
            })
          },
          tHead: NP_tameDescendant,
          tFoot: NP_tameDescendant,
          cellPadding: NP.filterAttr(Number, fromInt),
          cellSpacing: NP.filterAttr(Number, fromInt),
          border:      NP.filterAttr(Number, fromInt)
        }
      });
      TameTableElement.prototype.createTHead = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return defaultTameNode(np(this).feral.createTHead(), np(this).editable);
      });
      TameTableElement.prototype.deleteTHead = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        np(this).feral.deleteTHead();
      });
      TameTableElement.prototype.createTFoot = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return defaultTameNode(np(this).feral.createTFoot(), np(this).editable);
      });
      TameTableElement.prototype.deleteTFoot = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        np(this).feral.deleteTFoot();
      });
      TameTableElement.prototype.createCaption = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return defaultTameNode(np(this).feral.createCaption(), np(this).editable);
      });
      TameTableElement.prototype.deleteCaption = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        np(this).feral.deleteCaption();
      });
      TameTableElement.prototype.insertRow = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.rows.length);
        return defaultTameNode(np(this).feral.insertRow(index),
            np(this).editable);
      });
      TameTableElement.prototype.deleteRow = nodeMethod(function (index) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        requireIntIn(index, -1, np(this).feral.rows.length);
        np(this).feral.deleteRow(index);
      });

      defineElement({
        names: ['title'],
        virtualized: true,
        domClass: 'HTMLTitleElement'
      });

      traceStartup('DT: done with specific elements');

      // Oddball constructors. There are only two of these and we implement
      // both. (Caveat: In actual browsers, new Image().constructor == Image
      // != HTMLImageElement. We don't implement that.)
      
      // Per https://developer.mozilla.org/en-US/docs/DOM/Image as of 2012-09-24
      function TameImageFun(width, height) {
        var element = tameDocument.createElement('img');
        if (width !== undefined) { element.width  = width; }
        if (height !== undefined) { element.height = height; }
        return element;
      }
      cajaVM.def(TameImageFun);
      
      // Per https://developer.mozilla.org/en-US/docs/DOM/Option
      // as of 2012-09-24
      function TameOptionFun(text, value, defaultSelected, selected) {
        var element = tameDocument.createElement('option');
        if (text !== undefined) { element.text = text; }
        if (value !== undefined) { element.value = value; }
        if (defaultSelected !== undefined) {
          element.defaultSelected = defaultSelected;
        }
        if (selected !== undefined) { element.selected = selected; }
        return element;
      }
      cajaVM.def(TameOptionFun);

      traceStartup('DT: starting event taming');

      // coerce null and false to 0
      function fromInt(x) { return '' + (x | 0); }

      function tameEvent(event) {
        event = makeDOMAccessible(event);
        if (!taming.hasTameTwin(event)) {
          var tamed = new TameEvent(event);
          taming.tamesTo(event, tamed);
        }
        return taming.tame(event);
      }

      var ep = TameEventConf.p.bind(TameEventConf);

      var EP_RELATED = {
        enumerable: true,
        extendedAccessors: true,
        get: eventMethod(function (prop) {
          // TODO(kpreid): Isn't it unsafe to be always editable=true here?
          return tameRelatedNode(ep(this).feral[prop], true,
              defaultTameNode);
        })
      };

      function P_e_view(transform) {
        return {
          enumerable: true,
          extendedAccessors: true,
          get: eventMethod(function (prop) {
            return transform(ep(this).feral[prop]);
          })
        };
      }

      function TameEvent(event) {
        assert(!!event);
        TameEventConf.confide(this);
        ep(this).feral = event;
        return this;
      }
      inertCtor(TameEvent, Object, 'Event');
      definePropertiesAwesomely(TameEvent.prototype, {
        type: {
          enumerable: true,
          get: eventMethod(function () {
            return bridal.untameEventType(String(ep(this).feral.type));
          })
        },
        target: {
          enumerable: true,
          get: eventMethod(function () {
            var event = ep(this).feral;
            return tameRelatedNode(
                event.target || event.srcElement, true, defaultTameNode);
          })
        },
        srcElement: {
          enumerable: true,
          get: eventMethod(function () {
            return tameRelatedNode(ep(this).feral.srcElement, true,
                defaultTameNode);
          })
        },
        currentTarget: {
          enumerable: true,
          get: eventMethod(function () {
            var e = ep(this).feral;
            return tameRelatedNode(e.currentTarget, true, defaultTameNode);
          })
        },
        relatedTarget: {
          enumerable: true,
          get: eventMethod(function () {
            var e = ep(this).feral;
            var t = e.relatedTarget;
            if (!t) {
              if (e.type === 'mouseout') {
                t = e.toElement;
              } else if (e.type === 'mouseover') {
                t = e.fromElement;
              }
            }
            return tameRelatedNode(t, true, defaultTameNode);
          }),
          // relatedTarget is read-only.  this dummy setter is because some code
          // tries to workaround IE by setting a relatedTarget when it's not
          // set.
          // code in a sandbox can't tell the difference between "falsey because
          // relatedTarget is not supported" and "falsey because relatedTarget
          // is outside sandbox".
          set: eventMethod(function () {})
        },
        fromElement: EP_RELATED,
        toElement: EP_RELATED,
        pageX: P_e_view(Number),
        pageY: P_e_view(Number),
        altKey: P_e_view(Boolean),
        ctrlKey: P_e_view(Boolean),
        metaKey: P_e_view(Boolean),
        shiftKey: P_e_view(Boolean),
        button: P_e_view(function (v) { return v && Number(v); }),
        clientX: P_e_view(Number),
        clientY: P_e_view(Number),
        screenX: P_e_view(Number),
        screenY: P_e_view(Number),
        which: P_e_view(function (v) { return v && Number(v); }),
        keyCode: P_e_view(function (v) { return v && Number(v); })
      });
      TameEvent.prototype.stopPropagation = eventMethod(function () {
        // TODO(mikesamuel): make sure event doesn't propagate to dispatched
        // events for this gadget only.
        // But don't allow it to stop propagation to the container.
        if (ep(this).feral.stopPropagation) {
          ep(this).feral.stopPropagation();
        } else {
          ep(this).feral.cancelBubble = true;
        }
      });
      TameEvent.prototype.preventDefault = eventMethod(function () {
        // TODO(mikesamuel): make sure event doesn't propagate to dispatched
        // events for this gadget only.
        // But don't allow it to stop propagation to the container.
        if (ep(this).feral.preventDefault) {
          ep(this).feral.preventDefault();
        } else {
          ep(this).feral.returnValue = false;
        }
      });
      setOwn(TameEvent.prototype, "toString", eventMethod(function () {
        return '[domado object Event]';
      }));
      cajaVM.def(TameEvent);  // and its prototype

      function TameCustomHTMLEvent(event) {
        var self;
        if (domitaModules.proxiesAvailable) {
          Object.preventExtensions(this);  // required by ES5/3 proxy emulation
          self = Proxy.create(
              new ExpandoProxyHandler(this, true, {}),
              TameEvent.call(this, event));
          ExpandoProxyHandler.register(self, this);
          TameEventConf.confide(self, this);
        } else {
          self = this;
        }

        return self;
      }
      inherit(TameCustomHTMLEvent, TameEvent);
      TameCustomHTMLEvent.prototype.initEvent
          = eventMethod(function (type, bubbles, cancelable) {
        bridal.initEvent(ep(this).feral, type, bubbles, cancelable);
      });
      setOwn(TameCustomHTMLEvent.prototype, "toString", eventMethod(function () {
        return '[Fake CustomEvent]';
      }));
      cajaVM.def(TameCustomHTMLEvent);  // and its prototype

      function TameHTMLDocument(doc, container, domain, editable) {
        traceStartup("DT: TameHTMLDocument begin");
        TamePseudoNode.call(this, editable);

        np(this).feralDoc = doc;
        np(this).feralContainerNode = container;
        np(this).onLoadListeners = [];
        np(this).onDCLListeners = [];

        traceStartup("DT: TameHTMLDocument done private");

        var tameContainer = defaultTameNode(container, editable);
        np(this).tameContainerNode = tameContainer;

        definePropertiesAwesomely(this, {
          domain: P_constant(domain)
        });

        installLocation(this);
      }
      inertCtor(TameHTMLDocument, TamePseudoNode, 'HTMLDocument');
      definePropertiesAwesomely(TameHTMLDocument.prototype, {
        nodeType: P_constant(9),
        nodeName: P_constant('#document'),
        nodeValue: P_constant(null),
        childNodes: { enumerable: true, get: nodeMethod(function () {
          return np(this).tameContainerNode.childNodes;
        })},
        attributes: { enumerable: true, get: nodeMethod(function () {
          return fakeNodeList([]);
        })},
        parentNode: P_constant(null),
        body: { enumerable: true, get: nodeMethod(function () {
          for (var n = this.documentElement.firstChild; n; n = n.nextSibling) {
            // Note: Standard def. also includes FRAMESET elements but we don't
            // currently support them.
            if (n.nodeName === "BODY") { return n; }
          }
          return null;
        })},
        documentElement: {
          enumerable: true,
          get: cajaVM.def(function () {
            var n;
            // In principle, documentElement should be our sole child, but
            // sometimes that gets screwed up, and we end up with more than
            // one child.  Returning something other than the pseudo <html>
            // element will mess up many things, so we first try finding
            // the <html> element
            for (n = this.firstChild; n; n = n.nextSibling) {
              if (n.nodeName === "HTML") { return n; }
            }
            // No <html>, so return the first child that's an element
            for (n = this.firstChild; n; n = n.nextSibling) {
              if (n.nodeType === 1) { return n; }
            }
            // None of our children are elements, fail
            return null;
          })},
        forms: { enumerable: true, get: nodeMethod(function () {
          var tameForms = [];
          for (var i = 0; i < document.forms.length; i++) {
            var tameForm = tameRelatedNode(
              makeDOMAccessible(document.forms).item(i),
              np(this).editable, defaultTameNode);
            // tameRelatedNode returns null if the node is not part of
            // this node's virtual document.
            if (tameForm !== null) { tameForms.push(tameForm); }
          }
          return fakeNodeList(tameForms);
        })},
        title: {
          // TODO(kpreid): get the title element pointer in conformant way

          // http://www.whatwg.org/specs/web-apps/current-work/multipage/dom.html#document.title
          // as of 2012-08-14
          enumerable: true,
          get: nodeMethod(function() {
            var titleEl = this.getElementsByTagName('title')[0];
            return trimHTML5Spaces(titleEl.textContent);
          }),
          set: nodeMethod(function(value) {
            var titleEl = this.getElementsByTagName('title')[0];
            titleEl.textContent = value;
          })
        },
        compatMode: P_constant('CSS1Compat'),
        ownerDocument: P_constant(null)
      });
      TameHTMLDocument.prototype.getElementsByTagName = nodeMethod(
          function (tagName) {
        tagName = String(tagName).toLowerCase();
        return tameGetElementsByTagName(
            np(this).feralContainerNode, tagName, np(this).editable);
      });
      TameHTMLDocument.prototype.getElementsByClassName = nodeMethod(
          function (className) {
        return tameGetElementsByClassName(
            np(this).feralContainerNode, className, np(this).editable);
      });
      TameHTMLDocument.prototype.addEventListener =
          nodeMethod(function (name, listener, useCapture) {
            if (name === 'DOMContentLoaded') {
              domitaModules.ensureValidCallback(listener);
              np(tameDocument).onDCLListeners.push(listener);
            } else {
              return np(this).tameContainerNode.addEventListener(
                  name, listener, useCapture);
            }
          });
      TameHTMLDocument.prototype.removeEventListener =
          nodeMethod(function (name, listener, useCapture) {
            return np(this).tameContainerNode.removeEventListener(
                name, listener, useCapture);
          });
      TameHTMLDocument.prototype.createComment = nodeMethod(function (text) {
        return defaultTameNode(np(this).feralDoc.createComment(" "), true);
      });
      TameHTMLDocument.prototype.createDocumentFragment = nodeMethod(function () {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return defaultTameNode(np(this).feralDoc.createDocumentFragment(), true);
      });
      TameHTMLDocument.prototype.createElement = nodeMethod(function (tagName) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        tagName = String(tagName).toLowerCase();
        tagName = htmlSchema.virtualToRealElementName(tagName);
        var newEl = np(this).feralDoc.createElement(tagName);
        if ("canvas" == tagName) {
          bridal.initCanvasElement(newEl);
        }
        if (elementPolicies.hasOwnProperty(tagName)) {
          var attribs = elementPolicies[tagName]([]);
          if (attribs) {
            for (var i = 0; i < attribs.length; i += 2) {
              bridal.setAttribute(newEl, attribs[+i], attribs[i + 1]);
            }
          }
        }
        return defaultTameNode(newEl, true);
      });
      TameHTMLDocument.prototype.createTextNode = nodeMethod(function (text) {
        if (!np(this).editable) { throw new Error(NOT_EDITABLE); }
        return defaultTameNode(np(this).feralDoc.createTextNode(
            text !== null && text !== void 0 ? '' + text : ''), true);
      });
      TameHTMLDocument.prototype.getElementById = nodeMethod(function (id) {
        id += idSuffix;
        var node = np(this).feralDoc.getElementById(id);
        return defaultTameNode(node, np(this).editable);
      });
      // http://www.w3.org/TR/DOM-Level-2-Events/events.html
      // #Events-DocumentEvent-createEvent
      TameHTMLDocument.prototype.createEvent = nodeMethod(function (type) {
        type = String(type);
        if (type !== 'HTMLEvents') {
          // See https://developer.mozilla.org/en/DOM/document.createEvent#Notes
          // for a long list of event ypes.
          // See http://www.w3.org/TR/DOM-Level-2-Events/events.html
          // #Events-eventgroupings
          // for the DOM2 list.
          throw new Error('Unrecognized event type ' + type);
        }
        var document = np(this).feralDoc;
        var rawEvent;
        if (document.createEvent) {
          rawEvent = document.createEvent(type);
        } else {
          rawEvent = document.createEventObject();
          rawEvent.eventType = 'ondataavailable';
        }
        var tamedEvent = new TameCustomHTMLEvent(rawEvent);
        taming.tamesTo(rawEvent, tamedEvent);
        return tamedEvent;
      });
      TameHTMLDocument.prototype.write = nodeMethod(function () {
        if (typeof domicile.writeHook !== 'function') {
          throw new Error('document.write not provided for this document');
        }
        return domicile.writeHook.apply(undefined, arguments);
      });
      TameHTMLDocument.prototype.writeln = nodeMethod(function () {
        if (typeof domicile.writeHook !== 'function') {
          throw new Error('document.writeln not provided for this document');
        }
        // We don't write the \n separately rather than copying args, because
        // the HTML parser would rather get fewer larger chunks.
        var args = Array.prototype.slice.call(arguments);
        args.push("\n");
        domicile.writeHook.apply(undefined, args);
      });
      cajaVM.def(TameHTMLDocument);  // and its prototype
      domicile.setBaseUri = cajaVM.def(function(base) {
        var parsed = URI.parse(base);
        var host = null;
        if (parsed.hasDomain()) {
          host = parsed.hasPort() ? parsed.getDomain() + ':' + parsed.getPort() : null;
        }
        domicile.pseudoLocation = {
          href: parsed.toString(),
          hash: parsed.getFragment(),
          host: host,
          hostname: parsed.getDomain(),
          port: parsed.getPort(),
          protocol: parsed.hasScheme() ? parsed.getScheme() + ':' : null,
          pathname: parsed.getPath(),
          search: parsed.getQuery()
        };
      });

      // Called by the html-emitter when the virtual document has been loaded.
      domicile.signalLoaded = cajaVM.def(function () {
        // TODO(kpreid): Review if this rewrite of the condition here is correct
        var self = tameDocument;
        var listeners = np(self).onDCLListeners;
        np(self).onDCLListeners = [];
        for (var i = 0, n = listeners.length; i < n; ++i) {
          window.setTimeout(listeners[+i], 0);
        }
        var onload = tameWindow.onload;
        if (onload) {
          window.setTimeout(onload, 0);
        }
        listeners = np(self).onLoadListeners;
        np(self).onLoadListeners = [];
        for (var i = 0, n = listeners.length; i < n; ++i) {
          window.setTimeout(listeners[+i], 0);
        }
      });

      // For JavaScript handlers.  See function dispatchEvent below
      domicile.handlers = [];
      domicile.TameHTMLDocument = TameHTMLDocument;  // Exposed for testing
      domicile.tameNode = cajaVM.def(defaultTameNode);
      domicile.feralNode = cajaVM.def(function (tame) {
        return np(tame).feral;  // NOTE: will be undefined for pseudo nodes
      });
      domicile.tameEvent = cajaVM.def(tameEvent);
      domicile.blessHtml = cajaVM.def(blessHtml);
      domicile.blessCss = cajaVM.def(function (var_args) {
        var arr = [];
        for (var i = 0, n = arguments.length; i < n; ++i) {
          arr[+i] = arguments[+i];
        }
        return cssSealerUnsealerPair.seal(arr);
      });
      domicile.htmlAttr = cajaVM.def(function (s) {
        return html.escapeAttrib(String(s || ''));
      });
      domicile.html = cajaVM.def(safeHtml);
      domicile.fetchUri = cajaVM.def(function (uri, mime, callback) {
        uriFetch(naiveUriPolicy, uri, mime, callback);
      });
      domicile.rewriteUri = cajaVM.def(function (uri, mimeType) {
        var s = rewriteAttribute(null, null, html4.atype.URI, uri);
        if (!s) { throw new Error(); }
        return s;
      });
      domicile.suffix = cajaVM.def(function (nmtokens) {
        var p = String(nmtokens).replace(/^\s+|\s+$/g, '').split(/\s+/g);
        var out = [];
        for (var i = 0; i < p.length; ++i) {
          var nmtoken = rewriteAttribute(null, null, html4.atype.ID, p[+i]);
          if (!nmtoken) { throw new Error(nmtokens); }
          out.push(nmtoken);
        }
        return out.join(' ');
      });
      domicile.suffixStr = idSuffix;
      domicile.ident = cajaVM.def(function (nmtokens) {
        var p = String(nmtokens).replace(/^\s+|\s+$/g, '').split(/\s+/g);
        var out = [];
        for (var i = 0; i < p.length; ++i) {
          var nmtoken = rewriteAttribute(null, null, html4.atype.CLASSES, p[+i]);
          if (!nmtoken) { throw new Error(nmtokens); }
          out.push(nmtoken);
        }
        return out.join(' ');
      });
      domicile.rewriteUriInCss = cajaVM.def(function (value, propName) {
        return value
          ? uriRewrite(naiveUriPolicy, value, html4.ueffects.SAME_DOCUMENT,
                html4.ltypes.SANDBOXED,
                {
                  "TYPE": "CSS",
                  "CSS_PROP": propName
                })
          : void 0;
      });
      domicile.rewriteUriInAttribute = cajaVM.def(
          function (value, tagName, attribName) {
        if (value.charAt(0) === '#' && isValidId(value.substring(1))) {
          return value + idSuffix;
        }
        var schemaAttr = htmlSchema.attribute(tagName, attribName);
        return value
          ? uriRewrite(naiveUriPolicy, value, schemaAttr.uriEffect,
                schemaAttr.loaderType, {
                  "TYPE": "MARKUP",
                  "XML_ATTR": attribName,
                  "XML_TAG": tagName
                })
          : void 0;
      });
      domicile.rewriteTargetAttribute = cajaVM.def(
          function (value, tagName, attribName) {
        // TODO(ihab.awad): Parrots much of the code in sanitizeAttrs; refactor
        var atype = null, attribKey;
        if ((attribKey = tagName + '::' + attribName,
             html4.ATTRIBS.hasOwnProperty(attribKey))
            || (attribKey = '*::' + attribName,
                html4.ATTRIBS.hasOwnProperty(attribKey))) {
          atype = html4.ATTRIBS[attribKey];
          return rewriteAttribute(tagName, attribName, atype, value);
        }
        return null;
      });

      traceStartup("DT: preparing Style");

      // defer construction
      var TameStyle = null;
      var TameComputedStyle = null;

      function buildTameStyle() {

        var aStyleForCPC = docEl.style;
        aStyleForCPC = makeDOMAccessible(aStyleForCPC);
        var allCssProperties = domitaModules.CssPropertiesCollection(
            aStyleForCPC);

        // Sealed internals for TameStyle objects, not to be exposed.
        var TameStyleConf = new Confidence('Style');

        function allowProperty(cssPropertyName) {
          return allCssProperties.isCssProp(cssPropertyName);
        };

        /**
         * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
         */
        TameStyle = function (style, editable, tameEl) {
          style = makeDOMAccessible(style);

          TameStyleConf.confide(this);
          TameStyleConf.p(this).feral = style;
          TameStyleConf.p(this).editable = editable;
          TameStyleConf.p(this).tameElement = tameEl;

          TameStyleConf.p(this).readByCanonicalName = function(canonName) {
            return String(style[canonName] || '');
          };
          TameStyleConf.p(this).writeByCanonicalName = function(canonName, val) {
            style[canonName] = val;
          };
        };
        inertCtor(TameStyle, Object, 'Style');
        TameStyle.prototype.getPropertyValue =
            cajaVM.def(function (cssPropertyName) {
          cssPropertyName = String(cssPropertyName || '').toLowerCase();
          if (!allowProperty(cssPropertyName)) { return ''; }
          var canonName = allCssProperties.getCanonicalPropFromCss(
              cssPropertyName);
          return TameStyleConf.p(this).readByCanonicalName(canonName);
        });
        setOwn(TameStyle.prototype, "toString", cajaVM.def(function () {
          return '[domado object Style]';
        }));
        definePropertiesAwesomely(TameStyle.prototype, {
          cssText: {
            enumerable: canHaveEnumerableAccessors,
            set: cajaVM.def(function (value) {
              var p = TameStyleConf.p(this);
              if (typeof p.feral.cssText === 'string') {
                p.feral.cssText = sanitizeStyleAttrValue(value);
              } else {
                // If the browser doesn't support setting cssText, then fall
                // back to setting the style attribute of the containing
                // element.  This won't work for style declarations that are
                // part of stylesheets and not attached to elements.
                p.tameElement.setAttribute('style', value);
              }
              return true;
            })
          }
        });
        allCssProperties.forEachCanonical(function (stylePropertyName) {
          // TODO(kpreid): make each of these generated accessors more
          // specialized for this name to reduce runtime cost.
          Object.defineProperty(TameStyle.prototype, stylePropertyName, {
            enumerable: canHaveEnumerableAccessors,
            get: cajaVM.def(function () {
              if (!TameStyleConf.p(this).feral
                  || !allCssProperties.isCanonicalProp(stylePropertyName)) {
                return void 0;
              }
              var cssPropertyName =
                  allCssProperties.getCssPropFromCanonical(stylePropertyName);
              if (!allowProperty(cssPropertyName)) { return void 0; }
              var canonName =
                  allCssProperties.getCanonicalPropFromCss(cssPropertyName);
              return TameStyleConf.p(this).readByCanonicalName(canonName);
            }),
            set: cajaVM.def(function (value) {
              var p = TameStyleConf.p(this);
              if (!p.editable) { throw new Error('style not editable'); }
              stylePropertyName = String(stylePropertyName);
              if (!allCssProperties.isCanonicalProp(stylePropertyName)) {
                throw new Error('Unknown CSS property name ' + stylePropertyName);
              }
              var cssPropertyName =
                  allCssProperties.getCssPropFromCanonical(stylePropertyName);
              if (!allowProperty(cssPropertyName)) { return void 0; }
              var tokens = lexCss(value);
              if (tokens.length === 0
                 || (tokens.length === 1 && tokens[0] === ' ')) {
                value = '';
              } else {
                if (!sanitizeStyleProperty(cssPropertyName, tokens)) {
                  console.log('bad value `' + value + '` for CSS property '
                                  + stylePropertyName);
                }
                value = tokens.join(' ');
              }
              var canonName =
                  allCssProperties.getCanonicalPropFromCss(cssPropertyName);
              p.writeByCanonicalName(canonName, value);
              return true;
            })
          });
        });
        cajaVM.def(TameStyle);  // and its prototype

        function isNestedInAnchor(el) {
          for (;
              el && el != containerNode;
              el = makeDOMAccessible(el.parentNode)) {
            if (el.tagName && el.tagName.toLowerCase() === 'a') {
              return true;
            }
          }
          return false;
        }

        traceStartup("DT: about to TameComputedStyle");

        TameComputedStyle = function (rawElement, pseudoElement) {
          rawElement = rawElement || document.createElement('div');
          TameStyle.call(
              this,
              bridal.getComputedStyle(rawElement, pseudoElement),
              false);
          TameStyleConf.p(this).rawElement = rawElement;
          TameStyleConf.p(this).pseudoElement = pseudoElement;

          var superReadByCanonicalName =
              TameStyleConf.p(this).readByCanonicalName;
          TameStyleConf.p(this).readByCanonicalName = function(canonName) {
            var propName = allCssProperties.getCssPropFromCanonical(canonName);
            var schemaElement = cssSchema[propName];
            var canReturnDirectValue =
                (schemaElement
                 && (schemaElement.cssPropBits
                     & CSS_PROP_BIT_HISTORY_INSENSITIVE))
                || !isNestedInAnchor(this.rawElement);
            if (canReturnDirectValue) {
              return superReadByCanonicalName.call(this, canonName);
            } else {
              return TameStyleConf.p(
                      new TameComputedStyle(containerNode, this.pseudoElement))
                  .readByCanonicalName(canonName);
            }
          };
          TameStyleConf.p(this).writeByCanonicalName = function(canonName) {
            throw 'Computed styles not editable: This code should be unreachable';
          };
        };
        inertCtor(TameComputedStyle, TameStyle);
        setOwn(TameComputedStyle.prototype, "toString", cajaVM.def(function () {
          return '[Fake Computed Style]';
        }));
        cajaVM.def(TameComputedStyle);  // and its prototype
      }

      traceStartup("DT: about to make XMLHttpRequest");
      // Note: nodeClasses.XMLHttpRequest is a ctor that *can* be directly
      // called by cajoled code, so we do not use inertCtor().
      nodeClasses.XMLHttpRequest = domitaModules.TameXMLHttpRequest(
          taming,
          rulebreaker,
          domitaModules.XMLHttpRequestCtor(
              makeDOMAccessible,
              makeFunctionAccessible(window.XMLHttpRequest),
              makeFunctionAccessible(window.ActiveXObject),
              makeFunctionAccessible(window.XDomainRequest)),
          naiveUriPolicy);
      cajaVM.def(nodeClasses.XMLHttpRequest);
      traceStartup("DT: done for XMLHttpRequest");

      /**
       * given a number, outputs the equivalent css text.
       * @param {number} num
       * @return {string} an CSS representation of a number suitable for both html
       *    attribs and plain text.
       */
      domicile.cssNumber = cajaVM.def(function (num) {
        if ('number' === typeof num && isFinite(num) && !isNaN(num)) {
          return '' + num;
        }
        throw new Error(num);
      });
      /**
       * given a number as 24 bits of RRGGBB, outputs a properly formatted CSS
       * color.
       * @param {number} num
       * @return {string} a CSS representation of num suitable for both html
       *    attribs and plain text.
       */
      domicile.cssColor = cajaVM.def(function (color) {
        // TODO: maybe whitelist the color names defined for CSS if the arg is a
        // string.
        if ('number' !== typeof color || (color != (color | 0))) {
          throw new Error(color);
        }
        var hex = '0123456789abcdef';
        return '#' + hex.charAt((color >> 20) & 0xf)
            + hex.charAt((color >> 16) & 0xf)
            + hex.charAt((color >> 12) & 0xf)
            + hex.charAt((color >> 8) & 0xf)
            + hex.charAt((color >> 4) & 0xf)
            + hex.charAt(color & 0xf);
      });
      domicile.cssUri = cajaVM.def(function (uri, mimeType, prop) {
        uri = String(uri);
        if (!naiveUriPolicy) { return null; }
        return uriRewrite(
            naiveUriPolicy,
            uri,
            html4.ueffects.SAME_DOCUMENT,
            html4.ltypes.SANDBOXED,
            {
              "TYPE": "CSS",
              "CSS_PROP": prop
            });
      });

      /**
       * Create a CSS stylesheet with the given text and append it to the DOM.
       * @param {string} cssText a well-formed stylesheet production.
       */
      domicile.emitCss = cajaVM.def(function (cssText) {
        this.getCssContainer().appendChild(
            bridal.createStylesheet(document, cssText));
      });
      /** The node to which gadget stylesheets should be added. */
      domicile.getCssContainer = cajaVM.def(function () {
        var e = document.getElementsByTagName('head')[0];
        e = makeDOMAccessible(e);
        return e;
      });
      domicile.tagPolicy = tagPolicy;  // used by CSS rewriter

      if (!/^-/.test(idSuffix)) {
        throw new Error('id suffix "' + idSuffix + '" must start with "-"');
      }
      if (!/___$/.test(idSuffix)) {
        throw new Error('id suffix "' + idSuffix + '" must end with "___"');
      }
      var idClass = idSuffix.substring(1);
      var idClassPattern = new RegExp(
          '(?:^|\\s)' + idClass.replace(/[\.$]/g, '\\$&') + '(?:\\s|$)');
      /** A per-gadget class used to separate style rules. */
      domicile.getIdClass = cajaVM.def(function () {
        return idClass;
      });
      // enforce id class on element
      bridal.setAttribute(containerNode, "class",
          bridal.getAttribute(containerNode, "class")
          + " " + idClass + " vdoc-container___");

      // bitmask of trace points
      //    0x0001 plugin_dispatchEvent
      domicile.domitaTrace = 0;
      domicile.getDomitaTrace = cajaVM.def(
          function () { return domicile.domitaTrace; }
      );
      domicile.setDomitaTrace = cajaVM.def(
          function (x) { domicile.domitaTrace = x; }
      );

      // Location object -- used by Document and Window and so must be created
      // before each.
      function TameLocation() {
        // TODO(mikesamuel): figure out a mechanism by which the container can
        // specify the gadget's apparent URL.
        // See http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html#location0
        var tameLocation = this;
        function defineLocationField(f, dflt) {
          Object.defineProperty(tameLocation, f, {
            configurable: false,
            enumerable: true,
            get: function() { 
              return String(domicile.pseudoLocation[f] || dflt); 
            }
          });
        }
        defineLocationField('href', 'http://nosuchhost.invalid:80/');
        defineLocationField('hash', '');
        defineLocationField('host', 'nosuchhost.invalid:80');
        defineLocationField('hostname', 'nosuchhost.invalid');
        defineLocationField('pathname', '/');
        defineLocationField('port', '80');
        defineLocationField('protocol', 'http:');
        defineLocationField('search', '');
        setOwn(tameLocation, 'toString',
          cajaVM.def(function() { return tameLocation.href; }));
      }
      inertCtor(TameLocation, Object);
      var tameLocation = new TameLocation();
      function installLocation(obj) {
        Object.defineProperty(obj, "location", {
          value: tameLocation,
          configurable: false,
          enumerable: true,
          writable: false  // Writable in browsers, but has a side-effect
                           // which we don't implement.
        });
      }

      traceStartup("DT: about to do TameHTMLDocument");
      var tameDocument = new TameHTMLDocument(
          document,
          containerNode,
          // TODO(jasvir): Properly wire up document.domain
          // by untangling the cyclic dependence between
          // TameWindow and TameDocument
          String(undefined || 'nosuchhost.invalid'),
          true);
      traceStartup("DT: finished TameHTMLDocument");
      domicile.htmlEmitterTarget = containerNode;

      // See spec at http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#navigator
      // We don't attempt to hide or abstract userAgent details since
      // they are discoverable via side-channels we don't control.
      var navigator = makeDOMAccessible(window.navigator);
      var tameNavigator = cajaVM.def({
        appName: String(navigator.appName),
        appVersion: String(navigator.appVersion),
        platform: String(navigator.platform),
        // userAgent should equal the string sent in the User-Agent HTTP header.
        userAgent: String(navigator.userAgent),
        // Custom attribute indicating Caja is active.
        cajaVersion: '1.0'
        });

      traceStartup("DT: done tameNavigator");

      /**
       * Set of allowed pseudo elements as described at
       * http://www.w3.org/TR/CSS2/selector.html#q20
       */
      var PSEUDO_ELEMENT_WHITELIST = {
        // after and before disallowed since they can leak information about
        // arbitrary ancestor nodes.
        'first-letter': true,
        'first-line': true
      };

      /**
       * See http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#window for the full API.
       */
      function TameWindow() {

        // These descriptors were chosen to resemble actual ES5-supporting browser
        // behavior.
        // The document property is defined below.
        installLocation(this);
        Object.defineProperty(this, "navigator", {
          value: tameNavigator,
          configurable: false,
          enumerable: true,
          writable: false
        });
        taming.permitUntaming(this);
      }
      // Methods of TameWindow are established later.
      setOwn(TameWindow.prototype, "toString", cajaVM.def(function () {
        return "[domado object Window]";
      }));

      /**
       * An <a href=
       * href=http://www.w3.org/TR/DOM-Level-2-Views/views.html#Views-AbstractView
       * >AbstractView</a> implementation that exposes styling, positioning, and
       * sizing information about the current document's pseudo-body.
       * <p>
       * The AbstractView spec specifies very little in its IDL description, but
       * mozilla defines it thusly:<blockquote>
       *   document.defaultView is generally a reference to the window object
       *   for the document, however that is not defined in the specification
       *   and can't be relied upon for all host environments, particularly as
       *   not all browsers implement it.
       * </blockquote>
       * <p>
       * We can't provide access to the tamed window directly from document
       * since it is the global scope of valija code, and so access to another
       * module's tamed window provides an unbounded amount of authority.
       * <p>
       * Instead, we expose styling, positioning, and sizing properties
       * via this class.  All of this authority is already available from the
       * document.
       */
      function TameDefaultView() {
        // TODO(kpreid): The caller passes document's editable flag; this does not
        // take such a parameter. Which is right?
        // TODO(mikesamuel): Implement in terms of
        //     http://www.w3.org/TR/cssom-view/#the-windowview-interface
        // TODO: expose a read-only version of the document
        this.document = tameDocument;
        // Exposing an editable default view that pointed to a read-only
        // tameDocument via document.defaultView would allow escalation of
        // authority.
        assert(np(tameDocument).editable);
        taming.permitUntaming(this);
      }

      // Under ES53, the set/clear pairs get invoked with 'this' bound
      // to USELESS, which causes problems on Chrome unless they're wrpaped
      // this way.
      tameSetAndClear(
          TameWindow.prototype,
          function (code, millis) { return window.setTimeout(code, millis); },
          function (id) { return window.clearTimeout(id); },
          'setTimeout', 'clearTimeout');
      tameSetAndClear(
          TameWindow.prototype,
          function (code, millis) { return window.setInterval(code, millis); },
          function (id) { return window.clearInterval(id); },
          'setInterval', 'clearInterval');
      TameWindow.prototype.addEventListener = cajaVM.def(
          function (name, listener, useCapture) {
        if (name === 'load') {
          domitaModules.ensureValidCallback(listener);
          np(tameDocument).onLoadListeners.push(listener);
        } else if (name === 'DOMContentLoaded') {
          domitaModules.ensureValidCallback(listener);
          np(tameDocument).onDCLListeners.push(listener);
        } else {
          // TODO: need a testcase for this
          tameDocument.addEventListener(name, listener, useCapture);
        }
      });
      TameWindow.prototype.removeEventListener = cajaVM.def(
          function (name, listener, useCapture) {
        if (name === 'load' || name === 'DOMContentLoaded') {
          var listeners = np(tameDocument)[name === 'load' ?
              'onLoadListeners' : 'onDCLListeners'];
          var k = 0;
          for (var i = 0, n = listeners.length; i < n; ++i) {
            listeners[i - k] = listeners[+i];
            if (listeners[+i] === listener) {
              ++k;
            }
          }
          listeners.length -= k;
        } else {
          tameDocument.removeEventListener(name, listener, useCapture);
        }
      });
      TameWindow.prototype.dispatchEvent = cajaVM.def(function (evt) {
        // TODO(ihab.awad): Implement
      });

      // Methods which are installed on window AND defaultView.
      // See doc comment of TameDefaultView regarding authority to expose here.
      forOwnKeys({
        scrollBy: cajaVM.def(
            function (dx, dy) {
              // The window is always auto scrollable, so make the apparent window
              // body scrollable if the gadget tries to scroll it.
              if (dx || dy) {
                makeScrollable(bridal, np(tameDocument).feralContainerNode);
              }
              tameScrollBy(np(tameDocument).feralContainerNode, dx, dy);
            }),
        scrollTo: cajaVM.def(
            function (x, y) {
              // The window is always auto scrollable, so make the apparent window
              // body scrollable if the gadget tries to scroll it.
              makeScrollable(bridal, np(tameDocument).feralContainerNode);
              tameScrollTo(np(tameDocument).feralContainerNode, x, y);
            }),
        resizeTo: cajaVM.def(
            function (w, h) {
              tameResizeTo(np(tameDocument).feralContainerNode, w, h);
            }),
        resizeBy: cajaVM.def(
            function (dw, dh) {
              tameResizeBy(np(tameDocument).feralContainerNode, dw, dh);
            }),
        /** A partial implementation of getComputedStyle. */
        getComputedStyle: cajaVM.def(
            // Pseudo elements are suffixes like :first-line which constrain to
            // a portion of the element's content as defined at
            // http://www.w3.org/TR/CSS2/selector.html#q20
            function (tameElement, pseudoElement) {
              tameElement = TameNodeT.coerce(tameElement);
              // Coerce all nullish values to undefined, since that is the value
              // for unspecified parameters.
              // Per bug 973: pseudoElement should be null according to the
              // spec, but mozilla docs contradict this.
              // From https://developer.mozilla.org/En/DOM:window.getComputedStyle
              //     pseudoElt is a string specifying the pseudo-element to match.
              //     Should be an empty string for regular elements.
              pseudoElement = (pseudoElement === null || pseudoElement === void 0
                               || '' === pseudoElement)
                  ? void 0 : String(pseudoElement).toLowerCase();
              if (pseudoElement !== void 0
                  && !PSEUDO_ELEMENT_WHITELIST.hasOwnProperty(pseudoElement)) {
                throw new Error('Bad pseudo element ' + pseudoElement);
              }
              // No need to check editable since computed styles are readonly.
              TameComputedStyle || buildTameStyle();
              return new TameComputedStyle(
                  np(tameElement).feral,
                  pseudoElement);
            })

        // NOT PROVIDED
        // event: a global on IE.  We always define it in scopes that can handle
        //        events.
        // opera: defined only on Opera.
      }, (function (propertyName, value) {
        TameWindow.prototype[propertyName] = value;
        TameDefaultView.prototype[propertyName] = value;
      }));
      
      cajaVM.def(TameWindow);  // and its prototype

      var tameWindow = new TameWindow();
      var tameDefaultView = new TameDefaultView(np(tameDocument).editable);

      // Getters for properties which are installed on window AND defaultView.
      // See doc comment of TameDefaultView regarding authority to expose here.
      forOwnKeys({
        pageXOffset: function () { return this.scrollX; },
        pageYOffset: function () { return this.scrollY; },
        scrollX: function () {
            return np(tameDocument).feralContainerNode.scrollLeft; },
        scrollY: function () {
            return np(tameDocument).feralContainerNode.scrollTop; },
        
        innerHeight: function () {
            return np(tameDocument).feralContainerNode.offsetHeight; },
        innerWidth:  function () {
            return np(tameDocument).feralContainerNode.offsetWidth; },
        outerHeight: function () {
            return np(tameDocument).feralContainerNode.offsetHeight; },
        outerWidth:  function () {
            return np(tameDocument).feralContainerNode.offsetWidth; }
      }, function (propertyName, handler) {
        // TODO(mikesamuel): define on prototype.
        var desc = {enumerable: canHaveEnumerableAccessors, get: handler};
        Object.defineProperty(tameWindow, propertyName, desc);
        Object.defineProperty(tameDefaultView, propertyName, desc);
      });

      // Attach reflexive properties to 'window' object
      var windowProps = ['top', 'self', 'opener', 'parent', 'window'];
      var wpLen = windowProps.length;
      for (var i = 0; i < wpLen; ++i) {
        var prop = windowProps[+i];
        tameWindow[prop] = tameWindow;
      }

      Object.freeze(tameDefaultView);

      if (np(tameDocument).editable) {
        tameDocument.defaultView = tameDefaultView;

        // Hook for document.write support.
        domicile.sanitizeAttrs = sanitizeAttrs;
      }

      // Iterate over all node classes, assigning them to the Window object
      // under their DOM Level 2 standard name. Also freeze.
      for (var name in nodeClasses) {
        var ctor = nodeClasses[name];
        cajaVM.def(ctor);  // and its prototype
        cajaVM.def(ctor.prototype);
        Object.defineProperty(tameWindow, name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ctor
        });
      }

      // TODO(ihab.awad): Build a more sophisticated virtual class hierarchy by
      // creating a table of actual subclasses and instantiating tame nodes by
      // table lookups. This will allow the client code to see a truly consistent
      // DOM class hierarchy.

      // This is a list of all HTML-specific element node classes defined by
      // DOM Level 2 HTML, <http://www.w3.org/TR/DOM-Level-2-HTML/html.html>.
      // If a node class name in this list is not defined using defineElement or
      // inertCtor above, then it will now be bound to the HTMLElement class.
      var allDomNodeClasses = [
        'HTMLAnchorElement',
        'HTMLAppletElement',
        'HTMLAreaElement',
        'HTMLBaseElement',
        'HTMLBaseFontElement',
        'HTMLBodyElement',
        'HTMLBRElement',
        'HTMLButtonElement',
        'HTMLDirectoryElement',
        'HTMLDivElement',
        'HTMLDListElement',
        'HTMLFieldSetElement',
        'HTMLFontElement',
        'HTMLFormElement',
        'HTMLFrameElement',
        'HTMLFrameSetElement',
        'HTMLHeadElement',
        'HTMLHeadingElement',
        'HTMLHRElement',
        'HTMLHtmlElement',
        'HTMLIFrameElement',
        'HTMLImageElement',
        'HTMLInputElement',
        'HTMLIsIndexElement',
        'HTMLLabelElement',
        'HTMLLegendElement',
        'HTMLLIElement',
        'HTMLLinkElement',
        'HTMLMapElement',
        'HTMLMenuElement',
        'HTMLMetaElement',
        'HTMLModElement',
        'HTMLNavElement',
        'HTMLObjectElement',
        'HTMLOListElement',
        'HTMLOptGroupElement',
        'HTMLOptionElement',
        'HTMLParagraphElement',
        'HTMLParamElement',
        'HTMLPreElement',
        'HTMLQuoteElement',
        'HTMLScriptElement',
        'HTMLSelectElement',
        'HTMLStyleElement',
        'HTMLTableCaptionElement',
        'HTMLTableCellElement',
        'HTMLTableColElement',
        'HTMLTableElement',
        'HTMLTableRowElement',
        'HTMLTableSectionElement',
        'HTMLTextAreaElement',
        'HTMLTitleElement',
        'HTMLUListElement'
      ];

      var defaultNodeClassCtor = nodeClasses.HTMLElement;
      for (var i = 0; i < allDomNodeClasses.length; i++) {
        var className = allDomNodeClasses[+i];
        if (!(className in tameWindow)) {
          Object.defineProperty(tameWindow, className, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: defaultNodeClassCtor
          });
        }
      }

      tameWindow.Image = TameImageFun;
      tameWindow.Option = TameOptionFun;

      tameDocument = finishNode(tameDocument);

      domicile.window = tameWindow;
      domicile.document = tameDocument;
      Object.defineProperty(tameWindow, 'document', {
        value: tameDocument,
        configurable: false,
        enumerable: true,
        writable: false
      });

      pluginId = rulebreaker.getId(tameWindow);
      windowToDomicile.set(tameWindow, domicile);

      // Install virtual UA stylesheet.
      if (!document.caja_gadgetStylesheetInstalled) (function () {
        document.caja_gadgetStylesheetInstalled = true;
        
        var element = makeDOMAccessible(document.createElement("style"));
        element.setAttribute("type", "text/css");
        element.textContent = (
          // Visually contains the virtual document
          ".vdoc-container___ {" +
            "position:relative!important;" +
            "overflow:auto!important;" +
            "clip:rect(auto,auto,auto,auto)!important;" + // paranoia
          "}" +

          // Styles for HTML elements that we virtualize, and so do not get the
          // normal UA stylesheet rules applied:

          // Should be the intersection of HTML5 spec's list and our virtualized
          // (i.e. non-whitelisted) elements. Source:
          // <http://www.whatwg.org/specs/web-apps/current-work/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints>
          "caja-v-base,caja-v-basefont,caja-v-head,caja-v-link,caja-v-meta," +
          "caja-v-noembed,caja-v-noframes,caja-v-param,caja-v-source," +
          "caja-v-track,caja-v-title{" +
            "display:none;" + 
          "}" +

          "caja-v-html, caja-v-body {" +
            "display:block;" +
          "}"
        );
        domicile.getCssContainer().appendChild(element);
      })();

      traceStartup("DT: all done");

      return domicile;
    }

    /**
     * Function called from rewritten event handlers to dispatch an event safely.
     */
    function plugin_dispatchEvent(thisNode, event, pluginId, handler) {
      event = makeDOMAccessible(
          event || bridalMaker.getWindow(thisNode, makeDOMAccessible).event);
      // support currentTarget on IE[678]
      if (!event.currentTarget) {
        event.currentTarget = thisNode;
      }
      var imports = rulebreaker.getImports(pluginId);
      var domicile = windowToDomicile.get(imports);
      var node = domicile.tameNode(thisNode, true);
      try {
        return plugin_dispatchToHandler(
          pluginId, handler, [ node, domicile.tameEvent(event), node ]);
      } catch (ex) {
        imports.onerror(ex.message, 'unknown', 0);
      }
    }

    function plugin_dispatchToHandler(pluginId, handler, args) {
      var sig = ('' + handler).match(/^function\b[^\)]*\)/);
      var domicile = windowToDomicile.get(rulebreaker.getImports(pluginId));
      if (domicile.domitaTrace & 0x1 && typeof console != 'undefined') {
        console.log(
            'Dispatch pluginId=' + pluginId +
            ', handler=' + (sig ? sig[0] : handler) +
            ', args=' + args);
      }
      switch (typeof handler) {
        case 'number':
          handler = domicile.handlers[+handler];
          break;
        case 'string':
          var fn = void 0;
          fn = domicile.window[handler];
          handler = fn && typeof fn.call === 'function' ? fn : void 0;
          break;
        case 'function': case 'object': break;
        default:
          throw new Error(
              'Expected function as event handler, not ' + typeof handler);
      }
      domicile.isProcessingEvent = true;
      try {
        return handler.call.apply(handler, args);
      } catch (ex) {
        // guard against IE discarding finally blocks
        throw ex;
      } finally {
        domicile.isProcessingEvent = false;
      }
    }

    return cajaVM.def({
      attachDocument: attachDocument,
      plugin_dispatchEvent: plugin_dispatchEvent,
      plugin_dispatchToHandler: plugin_dispatchToHandler,
      getDomicileForWindow: windowToDomicile.get.bind(windowToDomicile)
    });
  };
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['Domado'] = Domado;
}
;
// Copyright (C) 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Schema for taming membrane.
 *
 * @requires WeakMap
 * @overrides window
 * @provides TamingSchema
 */
function TamingSchema(privilegedAccess) {

  'use strict';

  function PropertyFlags() {
    var map = WeakMap();
    return Object.freeze({
      has: function(obj, prop, flag) {
        prop = '$' + prop;
        return map.has(obj) &&
            map.get(obj).hasOwnProperty(prop) &&
            map.get(obj)[prop].indexOf(flag) !== -1;
      },
      set: function(obj, prop, flag) {
        prop = '$' + prop;
        if (!map.has(obj)) {
          // Note: Object.create(null) not supported in ES5/3
          map.set(obj, {});
        }
        var o = map.get(obj);
        if (!o.hasOwnProperty(prop)) {
          o[prop] = [];
        }
        if (o[prop].indexOf(flag) === -1) {
          o[prop].push(flag);
        }
      },
      getProps: function(obj) {
        if (!map.has(obj)) { return []; }
        return Object.getOwnPropertyNames(map.get(obj))
            .map(function(s) { return s.substring(1); });
      }
    });
  }

  var grantTypes = Object.freeze({
    METHOD: 'method',
    READ: 'read',
    WRITE: 'write',
    OVERRIDE: 'override'
  });

  var grantAs = PropertyFlags();

  var tameTypes = Object.freeze({
    CONSTRUCTOR: 'constructor',
    FUNCTION: 'function',
    XO4A: 'xo4a',
    READ_ONLY_RECORD: 'read_only_record'
  });

  var tameAs = new WeakMap();

  var tameFunctionName = new WeakMap();
  var tameCtorSuper = new WeakMap();

  var functionAdvice = new WeakMap();

  function applyFeralFunction(f, self, args) {
    return initAdvice(f)(self, args);
  }

  function isNumericName(n) {
    return typeof n === 'number' || ('' + (+n)) === n;
  }

  function checkNonNumeric(prop) {
    if (isNumericName(prop)) {
      throw new TypeError('Cannot control numeric property names: ' + prop);
    }
  }

  var fixed = new WeakMap();

  function checkCanControlTaming(f) {
    var to = typeof f;
    if (!f || (to !== 'function' && to !== 'object')) {
      throw new TypeError('Taming controls not for non-objects: ' + f);
    }
    if (fixed.has(f)) {
      throw new TypeError('Taming controls not for already tamed: ' + f);
    }
    if (privilegedAccess.isDefinedInCajaFrame(f)) {
      throw new TypeError('Taming controls not for Caja objects: ' + f);
    }
  }

  function fix(f) {
    fixed.set(f, true);
  }

  function markTameAsReadOnlyRecord(f) {
    checkCanControlTaming(f);
    tameAs.set(f, tameTypes.READ_ONLY_RECORD);
    return f;
  }

  function markTameAsFunction(f, name) {
    checkCanControlTaming(f);
    tameAs.set(f, tameTypes.FUNCTION);
    tameFunctionName.set(f, name);
    return f;
  }

  function markTameAsCtor(ctor, opt_super, name) {
    checkCanControlTaming(ctor);
    var ctype = typeof ctor;
    var stype = typeof opt_super;
    if (ctype !== 'function') {
      throw new TypeError('Cannot tame ' + ctype + ' as ctor');
    }
    if (opt_super && stype !== 'function') {
      throw new TypeError('Cannot tame ' + stype + ' as superclass ctor');
    }
    tameAs.set(ctor, tameTypes.CONSTRUCTOR);
    tameFunctionName.set(ctor, name);
    tameCtorSuper.set(ctor, opt_super);
    return ctor;
  }

  function markTameAsXo4a(f, name) {
    checkCanControlTaming(f);
    var ftype = typeof f;
    if (ftype !== 'function') {
      throw new TypeError('Cannot tame ' + ftype + ' as function');
    }
    tameAs.set(f, tameTypes.XO4A);
    tameFunctionName.set(f, name);
    return f;
  }

  function grantTameAsMethod(f, prop) {
    checkCanControlTaming(f);
    checkNonNumeric(prop);
    grantAs.set(f, prop, grantTypes.METHOD);
    grantAs.set(f, prop, grantTypes.READ);
  }

  function grantTameAsRead(f, prop) {
    checkCanControlTaming(f);
    checkNonNumeric(prop);
    grantAs.set(f, prop, grantTypes.READ);
  }

  function grantTameAsReadWrite(f, prop) {
    checkCanControlTaming(f);
    checkNonNumeric(prop);
    grantAs.set(f, prop, grantTypes.READ);
    grantAs.set(f, prop, grantTypes.WRITE);
  }

  function grantTameAsReadOverride(f, prop) {
    checkCanControlTaming(f);
    checkNonNumeric(prop);
    grantAs.set(f, prop, grantTypes.READ);
    grantAs.set(f, prop, grantTypes.OVERRIDE);
  }

  // Met the ghost of Greg Kiczales at the Hotel Advice.
  // This is what I told him as I gazed into his eyes:
  // Objects were for contracts,
  // Functions made for methods,
  // Membranes made for interposing semantics around them!

  function initAdvice(f) {
    if (!functionAdvice.has(f)) {
      functionAdvice.set(f, function(self, args) {
        return privilegedAccess.applyFunction(f, self, args);
      });
    }
    return functionAdvice.get(f);
  }

  function adviseFunctionBefore(f, advice) {
    var p = initAdvice(f);
    functionAdvice.set(f, function(self, args) {
      return p(
          self,
          privilegedAccess.applyFunction(
              advice,
              privilegedAccess.USELESS,
              [f, self, args]));
    });
  }
  
  function adviseFunctionAfter(f, advice) {
    var p = initAdvice(f);
    functionAdvice.set(f, function(self, args) {
      return privilegedAccess.applyFunction(
          advice,
          privilegedAccess.USELESS,
          [f, self, p(self, args)]);
    });
  }

  function adviseFunctionAround(f, advice) {
    var p = initAdvice(f);
    functionAdvice.set(f, function(self, args) {
      return privilegedAccess.applyFunction(
          advice,
          privilegedAccess.USELESS,
          [p, self, args]);
    });
  }

  ///////////////////////////////////////////////////////////////////////////

  return Object.freeze({
    // Public facet, providing taming controls to clients
    published: Object.freeze({
      markTameAsReadOnlyRecord: markTameAsReadOnlyRecord,
      markTameAsFunction: markTameAsFunction,
      markTameAsCtor: markTameAsCtor,
      markTameAsXo4a: markTameAsXo4a,
      grantTameAsMethod: grantTameAsMethod,
      grantTameAsRead: grantTameAsRead,
      grantTameAsReadWrite: grantTameAsReadWrite,
      grantTameAsReadOverride: grantTameAsReadOverride,
      adviseFunctionBefore: adviseFunctionBefore,
      adviseFunctionAfter: adviseFunctionAfter,
      adviseFunctionAround: adviseFunctionAround
    }),
    // Control facet, exposed to taming membrane instances
    control: Object.freeze({
      grantTypes: grantTypes,
      grantAs: grantAs,
      tameTypes: tameTypes,
      tameAs: tameAs,
      tameFunctionName: tameFunctionName,
      tameCtorSuper: tameCtorSuper,
      applyFeralFunction: applyFeralFunction,
      fix: fix
    })});
}

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['TamingSchema'] = TamingSchema;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Generic taming membrane implementation.
 *
 * @requires WeakMap
 * @overrides window
 * @provides TamingMembrane
 */
function TamingMembrane(privilegedAccess, schema) {

  'use strict';

  var feralByTame = new WeakMap();
  var tameByFeral = new WeakMap();

  // Useless value provided as a safe 'this' value to functions.
  feralByTame.set(privilegedAccess.USELESS, privilegedAccess.USELESS);
  tameByFeral.set(privilegedAccess.USELESS, privilegedAccess.USELESS);

  function isNumericName(n) {
    return typeof n === 'number' || ('' + (+n)) === n;
  }

  function preventExtensions(o) {
    return ((void 0) === o) ? (void 0) : Object.preventExtensions(o);
  }

  // Applies a function 'feralFunction' ensuring that either the return
  // value is tamed or the thrown exception is tamed and rethrown.
  function applyFeralFunction(feralFunction, feralThis, feralArguments) {
    try {
      return tame(
          schema.applyFeralFunction(
              feralFunction,
              feralThis,
              feralArguments));
    } catch (e) {
      throw tameException(e);
    }
  }

  // Applies a guest-side function 'tameFunction' ensuring that either the
  // return value is untamed or the thrown exception is untamed and rethrown.
  function applyTameFunction(tameFunction, tameThis, tameArguments) {
    try {
      return untame(tameFunction.apply(tameThis, tameArguments));
    } catch (e) {
      throw untameException(e);
    }
  }

  function getFeralProperty(feralObject, feralProp) {
    try {
      return tame(
          privilegedAccess.getProperty(feralObject, feralProp));
    } catch (e) {
      throw tameException(e);
    }
  }

  function setFeralProperty(feralObject, feralProp, feralValue) {
    try {
      privilegedAccess.setProperty(feralObject, feralProp, feralValue);
    } catch (e) {
      throw tameException(e);
    }
  }

  function getTameProperty(tameObject, tameProp) {
    try {
      return untame(tameObject[tameProp]);
    } catch (e) {
      throw untameException(e);
    }
  }

  function setTameProperty(tameObject, tameProp, tameValue) {
    try {
      tameObject[tameProp] = tameValue;
    } catch (e) {
      throw untameException(e);
    }
  }

  // Given a builtin object "o" provided by either a guest or host frame,
  // return a copy constructed in the taming frame. Return undefined if
  // "o" is not a builtin object. Note that we only call this function if we
  // know that "o" is *not* a primitive.
  function copyBuiltin(o) {
    var t = void 0;
    switch (Object.prototype.toString.call(o)) {
      case '[object Boolean]':
        t = new Boolean(privilegedAccess.getValueOf(o));
        break;
      case '[object Date]':
        t = new Date(privilegedAccess.getValueOf(o));
        break;
      case '[object Number]':
        t = new Number(privilegedAccess.getValueOf(o));
        break;
      case '[object RegExp]':
        t = new RegExp(
            privilegedAccess.getProperty(o, 'source'),
            (privilegedAccess.getProperty(o, 'global') ? 'g' : '') +
            (privilegedAccess.getProperty(o, 'ignoreCase') ? 'i' : '') +
            (privilegedAccess.getProperty(o, 'multiline') ? 'm' : ''));
        break;
      case '[object String]':
        t = new String(privilegedAccess.getValueOf(o));
        break;
      case '[object Error]':
        var msg = privilegedAccess.getProperty(o, 'message');
        switch (privilegedAccess.getProperty(o, 'name')) {
          case 'Error':
            t = new Error(msg);
            break;
          case 'EvalError':
            t = new EvalError(msg);
            break;
          case 'RangeError':
            t = new RangeError(msg);
            break;
          case 'ReferenceError':
            t = new ReferenceError(msg);
            break;
          case 'SyntaxError':
            t = new SyntaxError(msg);
            break;
          case 'TypeError':
            t = new TypeError(msg);
            break;
          case 'URIError':
            t = new URIError(msg);
            break;
        }
    }
    return t;
  }

  // This is a last resort for passing a safe "demilitarized zone" exception
  // across the taming membrane in cases where passing the actual thrown
  // exception is either problematic or not known to be safe.
  function makeNeutralException(e) {
    var str = 'Error';
    try {
      str = e.toString();
    } catch (ex) {}
    return new Error(str);
  }

  function tameException(f) {
    var t = void 0;
    try { t = tame(f); } catch (e) {}
    if (t !== void 0) { return t; }
    return makeNeutralException(f);
  }

  function untameException(t) {
    var f = void 0;
    try { f = untame(t); } catch (e) {}
    if (f !== void 0) { return f; }
    return makeNeutralException(t);
  }

  /**
   * Records that f is t's feral twin and t is f's tame twin.
   * <p>
   * A <i>feral</i> object is one safe to make accessible to trusted
   * but possibly innocent host code. A <i>tame</i> object is one
   * safe to make accessible to untrusted guest
   * code. tamesTo(f, t) records that f is feral, that t is tamed,
   * and that they are in one-to-one correspondence so that
   * tame(f) === t and untame(t) === f.
   */
  function tamesTo(f, t) {
    if ((f && tameByFeral.has(f)) || (t && feralByTame.has(t))) {
      throw new TypeError('Attempt to multiply tame: ' + f + ', ' + t);
    }
    reTamesTo(f, t);
  }

  function reTamesTo(f, t) {
    var ftype = typeof f;
    if (!f || (ftype !== 'function' && ftype !== 'object')) {
      throw new TypeError('Unexpected feral primitive: ', f);
    }
    var ttype = typeof t;
    if (!t || (ttype !== 'function' && ttype !== 'object')) {
      throw new TypeError('Unexpected tame primitive: ', t);
    }

    tameByFeral.set(f, t);
    feralByTame.set(t, f);
    schema.fix(f);
  }

  /**
   * Private utility functions to tame and untame arrays.
   */
  function tameArray(fa) {
    var ta = [];
    for (var i = 0; i < fa.length; i++) {
      ta[i] = tame(privilegedAccess.getProperty(fa, i));
    }
    return Object.freeze(ta);
  }

  function untameArray(ta) {
    var fa = [];
    for (var i = 0; i < ta.length; i++) {
      privilegedAccess.setProperty(fa, i, untame(ta[i]));
    }
    return Object.freeze(fa);
  }

  function errGet(p) {
    return Object.freeze(function() {
      throw new TypeError('Unreadable property: ' + p);
    });
  }

  function errSet(p) {
    return Object.freeze(function() {
      throw new TypeError('Unwriteable property: ' + p);
    });
  }

  /**
   * Returns a tame object representing f, or undefined on failure.
   */
  function tame(f) {
    if (!f) { return f; }
    var ftype = typeof f;
    if (ftype !== 'function' && ftype !== 'object') {
      // Primitive value; tames to self
      return f;
    } else if (Array.isArray(f)) {
      // No tamesTo(...) for arrays; we copy across the membrane
      return tameArray(f);
    }
    if (tameByFeral.has(f)) { return tameByFeral.get(f); }
    if (privilegedAccess.isDefinedInCajaFrame(f)) { return f; }
    var t = void 0;
    if (ftype === 'object') {
      var ctor = privilegedAccess.directConstructor(f);
      if (ctor === void 0) {
        throw new TypeError('Cannot determine ctor of: ' + f);
      } else if (ctor === privilegedAccess.BASE_OBJECT_CONSTRUCTOR) {
        t = preventExtensions(tameRecord(f));
      } else {
        t = copyBuiltin(f);
        if (t === void 0) {
          t = tamePreviouslyConstructedObject(f, ctor);
        }
      }
    } else if (ftype === 'function') {
      switch (schema.tameAs.get(f)) {
        case schema.tameTypes.CONSTRUCTOR:
          t = tameCtor(f, schema.tameCtorSuper.get(f), schema.tameFunctionName.get(f));
          break;
        case schema.tameTypes.FUNCTION:
          t = tamePureFunction(f, schema.tameFunctionName.get(f));
          break;
        case schema.tameTypes.XO4A:
          t = tameXo4a(f, schema.tameFunctionName.get(f));
          break;
        default:
          t = void 0;
          break;
      }
    }
    if (t) {
      privilegedAccess.banNumerics(t);
      tamesTo(f, t);
    }

    return t;
  }

  function isValidPropertyName(p) {
    return !/.*__$/.test(p);
  }

  // Tame a feral record by iterating over all own properties of the feral
  // record and installing a property handler for each one. Tame object is not
  // frozen; that is up to the caller to do when appropriate.
  function tameRecord(f, t) {
    if (!t) { t = {}; }
    var readOnly = schema.tameAs.get(f) === schema.tameTypes.READ_ONLY_RECORD;
    privilegedAccess.getOwnPropertyNames(f).forEach(function(p) {
      if (isNumericName(p)) { return; }
      if (!isValidPropertyName(p)) { return; }
      var get = function() {
        return getFeralProperty(f, p);
      };
      var set = readOnly ? undefined :
          function(v) {
            setFeralProperty(f, p, untame(v));
            return v;
          };
      Object.defineProperty(t, p, {
        enumerable: true,
        configurable: false,
        get: get,
        set: set ? set : errSet(p)
      });
    });
    return t;
  }

  function tamePreviouslyConstructedObject(f, fc) {
    if (schema.tameAs.get(fc) !== schema.tameTypes.CONSTRUCTOR) { return void 0; }
    var tc = tame(fc);
    var t = Object.create(tc.prototype);
    tameObjectWithMethods(f, t);
    return t;
  }

  function addFunctionPropertyHandlers(f, t) {
    schema.grantAs.getProps(f).forEach(function(p) {
      if (!isValidPropertyName(p)) { return; }
      var get = !schema.grantAs.has(f, p, schema.grantTypes.READ) ? undefined :
          function() {
            return getFeralProperty(f, p);
          };
      var set = !schema.grantAs.has(f, p, schema.grantTypes.WRITE) ? undefined :
          function(v) {
            setFeralProperty(f, p, untame(v));
            return v;
          };
      if (get || set) {
        Object.defineProperty(t, p, {
          enumerable: true,
          configurable: false,
          get: get ? get : errGet(p),
          set: set ? set : errSet(p)
        });
      }
    });
  }

  function tamePureFunction(f) {
    var t = function(_) {
      // Since it's by definition useless, there's no reason to bother
      // passing untame(USELESS); we just pass USELESS itself.
      return applyFeralFunction(
          f,
          privilegedAccess.USELESS,
          untameArray(arguments));
    };
    addFunctionPropertyHandlers(f, t);
    preventExtensions(t);
    return t;
  }

  function tameCtor(f, fSuper, name) {
    var fPrototype = privilegedAccess.getProperty(f, 'prototype');

    var t = function (_) {
      if (!(this instanceof t)) {
        // Call as a function
        return applyFeralFunction(
            f,
            privilegedAccess.USELESS,
            untameArray(arguments));
      } else {
        // Call as a constructor
        var o = Object.create(fPrototype);
        applyFeralFunction(f, o, untameArray(arguments));
        tameObjectWithMethods(o, this);
        tamesTo(o, this);
        privilegedAccess.banNumerics(this);
      }
    };

    if (tameByFeral.get(fPrototype)) {
      throw new TypeError(
          'Prototype of constructor ' + f + ' has already been tamed');
    }

    tameRecord(f, t);

    var tPrototype = (function() {
      if (!fSuper || (fSuper === privilegedAccess.getObjectCtorFor(fSuper))) {
        return {};
      }
      if (!schema.tameAs.get(fSuper) === schema.tameTypes.CONSTRUCTOR) {
        throw new TypeError('Super ctor ' + fSuper + ' not granted as such');
      }
      var tSuper = tame(fSuper);
      return Object.create(tSuper.prototype);
    })();

    tameObjectWithMethods(fPrototype, tPrototype);

    Object.defineProperty(tPrototype, 'constructor', {
      writable: false,
      configurable: false,
      enumerable: true,
      value: t
    });

    privilegedAccess.banNumerics(tPrototype);
    Object.freeze(tPrototype);

    tamesTo(fPrototype, tPrototype);

    // FIXME(ihab.awad): Investigate why this fails *only* in ES53 mode
    // t.name = name;

    t.prototype = tPrototype;
    Object.freeze(t);

    return t;
  }

  function tameXo4a(f) {
    var t = function(_) {
      return applyFeralFunction(
          f,
          untame(this),
          untameArray(arguments));
    };
    addFunctionPropertyHandlers(f, t);
    preventExtensions(t);
    return t;
  }

  function makePrototypeMethod(proto, func) {
    return function(_) {
      if (!inheritsFrom(this, proto)) {
        throw new TypeError('Target object not permitted: ' + this);
      }
      return func.apply(this, arguments);
    };
  }

  function makeStrictPrototypeMethod(proto, func) {
    return function(_) {
      if ((this === proto) || !inheritsFrom(this, proto)) {
        throw new TypeError('Target object not permitted: ' + this);
      }
      return func.apply(this, arguments);
    };
  }

  function inheritsFrom(o, proto) {
    while (o) {
      if (o === proto) { return true; }
      o = Object.getPrototypeOf(o);
    }
    return false;
  }

  function makePropertyGetter(f, t, p) {
    if (schema.grantAs.has(f, p, schema.grantTypes.METHOD)) {
      // METHOD access implies READ, and requires careful wrapping of the
      // feral method being exposed
      return makePrototypeMethod(t, function() {
        var self = this;
        return function(_) {
          return applyFeralFunction(
              privilegedAccess.getProperty(untame(self), p),
              untame(self),
              untameArray(arguments));
        };
      });
    } else if (schema.grantAs.has(f, p, schema.grantTypes.READ)) {
      // Default READ access implies normal taming of the property value
      return makePrototypeMethod(t, function() {
        return getFeralProperty(untame(this), p);
      });
    } else {
      return undefined;
    }
  }

  function makePropertySetter(f, t, p) {
    var override =
      schema.grantAs.has(f, p, schema.grantTypes.OVERRIDE) ||
      (schema.grantAs.has(f, p, schema.grantTypes.METHOD) &&
       schema.grantAs.has(f, p, schema.grantTypes.WRITE));

    if (override) {
      return makeStrictPrototypeMethod(t, function(v) {
        setFeralProperty(untame(this), p, untame(v));
        return v;
      });
    } else if (schema.grantAs.has(f, p, schema.grantTypes.WRITE)) {
      return makePrototypeMethod(t, function(v) {
        setFeralProperty(untame(this), p, untame(v));
        return v;
      });
    } else {
      return undefined;
    }
  }

  function defineObjectProperty(f, t, p) {
    var get = makePropertyGetter(f, t, p);
    var set = makePropertySetter(f, t, p);
    if (get || set) {
      Object.defineProperty(t, p, {
        enumerable: true,
        configurable: false,
        get: get ? get : errGet(p),
        set: set ? set : errSet(p)
      });
    }
  }

  function tameObjectWithMethods(f, t) {
    if (!t) { t = {}; }
    schema.grantAs.getProps(f).forEach(function(p) {
      if (isValidPropertyName(p)) {
        defineObjectProperty(f, t, p);
      }
    });
    return t;
  }

  /**
   * Returns a feral object representing t, or undefined on failure.
   */
  function untame(t) {
    if (!t) { return t; }
    var ttype = typeof t;
    if (ttype !== 'function' && ttype !== 'object') {
      // Primitive value; untames to self
      return t;
    } else if (Array.isArray(t)) {
      // No tamesTo(...) for arrays; we copy across the membrane
      return untameArray(t);
    }
    if (feralByTame.has(t)) { return feralByTame.get(t); }
    if (!privilegedAccess.isDefinedInCajaFrame(t)) {
      throw new TypeError('Host object leaked without being tamed');
    }
    var f = void 0;
    if (ttype === 'object') {
      var ctor = privilegedAccess.directConstructor(t);
      if (ctor === privilegedAccess.BASE_OBJECT_CONSTRUCTOR) {
        f = untameCajaRecord(t);
      } else {
        f = copyBuiltin(t);
        if (f === void 0) {
          throw new TypeError(
              'Untaming of guest constructed objects unsupported: ' + t);
        }
      }
    } else if (ttype === 'function') {
      f = Object.freeze(untameCajaFunction(t));
    }
    if (f) { tamesTo(f, t); }
    return f;
  }

  function untameCajaFunction(t) {
    // Untaming of *constructors* which are defined in Caja is unsupported.
    // We untame all functions defined in Caja as xo4a.
    return function(_) {
      return applyTameFunction(t, tame(this), tameArray(arguments));
    };
  }

  function untameCajaRecord(t) {
    return privilegedAccess.isES5Browser
        ? untameCajaRecordByPropertyHandlers(t)
        : untameCajaRecordByEvisceration(t);
  }

  function untameCajaRecordByEvisceration(t) {
    var f = {};
    privilegedAccess.eviscerate(t, f, untame);
    tameRecord(f, t);
    return f;
  }

  function untameCajaRecordByPropertyHandlers(t) {
    var f = {};
    Object.getOwnPropertyNames(t).forEach(function(p) {
      if (isNumericName(p)) { return; }
      var d = Object.getOwnPropertyDescriptor(t, p);
      var read = d.get || d.hasOwnProperty('value');
      var write = d.set || (d.hasOwnProperty('value') && d.writable);
      var get = !read ? undefined :
          function() {
             return getTameProperty(t, p);
          };
      var set = !write ? undefined :
          function(v) {
            setTameProperty(t, p, tame(v));
            return v;
          };
      if (get || set) {
        Object.defineProperty(f, p, {
          enumerable: true,
          configurable: false,
          get: get ? get : errGet(p),
          set: set ? set : errSet(p)
        });
      }
    });
    return preventExtensions(f);
  }

  function hasTameTwin(f) {
    return tameByFeral.has(f);
  }

  function hasFeralTwin(t) {
    return feralByTame.has(t);
  }

  return Object.freeze({
    tame: tame,
    untame: untame,
    tamesTo: tamesTo,
    reTamesTo: reTamesTo,
    hasTameTwin: hasTameTwin,
    hasFeralTwin: hasFeralTwin
  });
}

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['TamingMembrane'] = TamingMembrane;
}
;
// Copyright 2007-2009 Tyler Close
// under the terms of the MIT X license found at
// http://www.opensource.org/licenses/mit-license.html


/**
 * Implementation of promises for SES/ES5.
 * Exports Q to the global scope.
 *
 * Mostly taken from the ref_send implementation by Tyler Close, with the
 * addition of a trademark table to support promises for functions. Originally
 * written for Cajita, then ported to SES by Kevin Reid.
 *
 * @contributor maoziqing@gmail.com, kpreid@switchb.org
 * @requires setTimeout, WeakMap, cajaVM
 * @overrides window
 * @provides Q
 */

var Q;

(function() {
  "use strict";

  // Table of functions-which-are-promises
  var promises = new WeakMap(true);

  function reject(reason) {
    function rejected(op, arg1, arg2, arg3) {
      if (undefined === op) { return rejected; }
        if ('WHEN' === op) { return arg2 ? arg2(reason) : reject(reason); }
          return arg1 ? arg1(reject(reason)) : reject(reason);
    }
    rejected.reason = reason;
    promises.set(rejected, true);
    return rejected;
  }

  function ref(value) {
    if (null === value || undefined === value) {
      return reject({ 'class': [ 'NaO' ] });
    }
    if ('number' === typeof value && !isFinite(value)) {
      return reject({ 'class': [ 'NaN' ] });
    }
    function fulfilled(op, arg1, arg2, arg3) {
      if (undefined === op) { return value; }
      var r;
      switch (op) {
        case 'WHEN':
          r = value;
          break;
        case 'GET':
          if (undefined === arg2 || null === arg2) {
            r = value;
          } else {
            r = value[arg2];
          }
          break;
        case 'POST':
          if (undefined === arg2 || null === arg2) {
            r = reject({});
          } else {
            r = value[arg2].apply(value, arg3);
          }
          break;
        case 'PUT':
          if (undefined === arg2 || null === arg2) {
            r = reject({});
          } else {
            value[arg2] = arg3;
            r = {};
          }
          break;
        case 'DELETE':
          if (undefined === arg2 || null === arg2) {
            r = reject({});
          } else {
            delete value[arg2];
            r = {};
          }
          break;
        default:
          r = reject({});
      }
      return arg1 ? arg1.apply(null, [r]) : r;
    }
    promises.set(fulfilled, true);
    return fulfilled;
  }
 	
  var enqueue = (function () {
    var active = false;
    var pending = [];
    var run = function () {
      var task = pending.shift();
      if (0 === pending.length) {
        active = false;
      } else {
        setTimeout(run, 0);
      }
      task();
    };
    return function (task) {
      pending.push(task);
      if (!active) {
        setTimeout(run, 0);
        active = true;
      }
    };
  }());
 	
  /**
   * Enqueues a promise operation.
   *
   * The above functions, reject() and ref(), each construct a kind of
   * promise. Other libraries can provide other kinds of promises by
   * implementing the same API. A promise is a function with signature:
   * function (op, arg1, arg2, arg3). The first argument determines the
   * interpretation of the remaining arguments. The following cases exist:
   *
   * 'op' is undefined:
   *  Return the most resolved current value of the promise.
   *
   * 'op' is "WHEN":
   *  'arg1': callback to invoke with the fulfilled value of the promise
   *  'arg2': callback to invoke with the rejection reason for the promise
   *
   * 'op' is "GET":
   *  'arg1': callback to invoke with the value of the named property
   *  'arg2': name of the property to read
   *
   * 'op' is "POST":
   *  'arg1': callback to invoke with the return value from the invocation
   *  'arg2': name of the method to invoke
   *  'arg3': array of invocation arguments
   *
   * 'op' is "PUT":
   *  'arg1': callback to invoke with the return value from the operation
   *  'arg2': name of the property to set
   *  'arg3': new value of property
   *
   * 'op' is "DELETE":
   *  'arg1': callback to invoke with the return value from the operation
   *  'arg2': name of the property to delete
   *
   * 'op' is unrecognized:
   *  'arg1': callback to invoke with a rejected promise
   */
  function forward(p, op, arg1, arg2, arg3) {
    enqueue(function () { p(op, arg1, arg2, arg3); });
  }

  /**
   * Gets the corresponding promise for a given reference.
   */
  function promised(value) {
    return ('function' === typeof value && promises.get(value))
        ? value : ref(value);
  }

  function defer() {
    var value;
    var pending = [];
    function promise(op, arg1, arg2, arg3) {
      if (undefined === op) { return pending ? promise : value(); }
      if (pending) {
        pending.push({ op: op, arg1: arg1, arg2: arg2, arg3: arg3 });
      } else {
        forward(value, op, arg1, arg2, arg3);
      }
    }
    promises.set(promise, true);
    return cajaVM.def({
      promise: promise,
      resolve: function (p) {
        if (!pending) { return; }

        var todo = pending;
        pending = null;
        value = promised(p);
        for (var i = 0; i !== todo.length; i += 1) {
          var x = todo[+i];
          forward(value, x.op, x.arg1, x.arg2, x.arg3);
        }
      }
    });
  }

  Q = cajaVM.def({
    /**
     * Enqueues a task to be run in a future turn.
     * @param task  function to invoke later
     */
    run: enqueue,

    /**
     * Constructs a rejected promise.
     * @param reason    value describing the failure
     */
    reject: reject,

    /**
     * Constructs a promise for an immediate reference.
     * @param value immediate reference
     */
    ref: ref,

    /**
     * Constructs a ( promise, resolver ) pair.
     *
     * The resolver is a callback to invoke with a more resolved value for
     * the promise. To fulfill the promise, simply invoke the resolver with
     * an immediate reference. To reject the promise, invoke the resolver
     * with the return from a call to reject(). To put the promise in the
     * same state as another promise, invoke the resolver with that other
     * promise.
     */
    defer: defer,

    /**
     * Gets the current value of a promise.
     * @param value promise or immediate reference to evaluate
     */
    near: function (value) {
      return ('function' === typeof value && promises.get(value))
          ? value() : value;
    },

    /**
     * Registers an observer on a promise.
     * @param value     promise or immediate reference to observe
     * @param fulfilled function to be called with the resolved value
     * @param rejected  function to be called with the rejection reason
     * @return promise for the return value from the invoked callback
     */
    when: function (value, fulfilled, rejected) {
      var r = defer();
      var done = false;   // ensure the untrusted promise makes at most a
                          // single call to one of the callbacks
      forward(promised(value), 'WHEN', function (x) {
        if (done) { throw new Error(); }
        done = true;
        r.resolve(ref(x)('WHEN', fulfilled, rejected));
      }, function (reason) {
        if (done) { throw new Error(); }
        done = true;
        r.resolve(rejected ? rejected.apply(null, [reason]) : reject(reason));
      });
      return r.promise;
    },

    /**
     * Gets the value of a property in a future turn.
     * @param target    promise or immediate reference for target object
     * @param noun      name of property to get
     * @return promise for the property value
     */
    get: function (target, noun) {
      var r = defer();
      forward(promised(target), 'GET', r.resolve, noun);
      return r.promise;
    },

    /**
     * Invokes a method in a future turn.
     * @param target    promise or immediate reference for target object
     * @param verb      name of method to invoke
     * @param argv      array of invocation arguments
     * @return promise for the return value
     */
    post: function (target, verb, argv) {
      var r = defer();
      forward(promised(target), 'POST', r.resolve, verb, argv);
      return r.promise;
    },

    /**
     * Sets the value of a property in a future turn.
     * @param target    promise or immediate reference for target object
     * @param noun      name of property to set
     * @param value     new value of property
     * @return promise for the return value
     */
    put: function (target, noun, value) {
      var r = defer();
      forward(promised(target), 'PUT', r.resolve, noun, value);
      return r.promise;
    },

    /**
     * Deletes a property in a future turn.
     * @param target    promise or immediate reference for target object
     * @param noun      name of property to delete
     * @return promise for the return value
     */
    remove: function (target, noun) {
      var r = defer();
      forward(promised(target), 'DELETE', r.resolve, noun);
      return r.promise;
    }
  });
})();

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['Q'] = Q;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Client for the cajoling service which provides access to, and caches, the
 * JSON response from the service.
 *
 * @param serviceUrl the URL of the cajoling service.
 * @param jsonRequestChannel a JSON request channel for the communication.
 * @param emitHtmlInJs whether HTML in cajoleable input should be embedded as
 *     imperative statements in the output JS. The alternative is that the
 *     response JSON contains a field, 'html', containing the sanitized static
 *     HTML from the input content.
 * @param debug whether debuggable cajoled code is desired (larger but more
 *     readable).
 * @param console [optional] a console-like object to which errors are written.
 *
 * @requires Q, encodeURIComponent, cajaBuildVersion
 * @overrides window
 * @provides cajolingServiceClientMaker
 */
var cajolingServiceClientMaker = function(serviceUrl,
                                          jsonRequestChannel,
                                          emitHtmlInJs,
                                          debug,
                                          console) {
  // Map from full module URLs to module JSON records.
  var cache = {};

  var makeServiceReference = function(
      uncajoledSourceUrl, mimeType, domOpts)
  {
    var opt_idClass = domOpts && domOpts.idClass;
    return serviceUrl +
        '?url=' + encodeURIComponent(uncajoledSourceUrl) +
        '&build-version=' + cajaBuildVersion +
        '&directive=ES53' +
        '&emit-html-in-js=' + emitHtmlInJs +
        '&renderer=' + (debug ? 'pretty' : 'minimal') +
        '&input-mime-type=' + mimeType +
        (opt_idClass ? '&id-class=' + opt_idClass : '');
  };

  var messagesToLog = function(moduleURL, cajolerMessages) {
    if (!cajolerMessages) { return; }
    if (!console) { return; }
    var msg;
    for (var i = 0; i < cajolerMessages.length; i++) {
      msg = cajolerMessages[i];
      console.log(
          msg.name + '(' + msg.level + ') '
          + msg.type + ': ' + msg.message);
    }
  };

  var handleRequest = function (fullUrl, request, deferred) {
    Q.when(
        request,
        function(moduleJson) {
          messagesToLog(fullUrl, moduleJson.messages);
          if (moduleJson.js) {
            deferred.resolve(moduleJson);
          } else {
            deferred.resolve(Q.reject('Cajoling errors'));
          }
        },
        function(err) {
          deferred.resolve(Q.reject(err));
        });
  };

  /**
   * Cajole the content available at a specified URL.
   *
   * The cajoled result from a given URL is cached by this object beween
   * invocations.
   *
   * @param url the url of the content.
   * @param mimeType the MIME type of the content.
   *
   * @return a promise for the module JSON returned from the cajoler.
   */
  var cajoleUrl = function (url, mimeType) {
    if (!cache['$' + url]) {
      cache['$' + url] = Q.defer();
      handleRequest(
          url,
          jsonRequestChannel.request(makeServiceReference(url, mimeType)),
          cache['$' + url]);
    }
    return cache['$' + url].promise;
  };

  /**
   * Cajole a given block of content.
   *
   * The results of content cajoling are never cached between invocations.
   *
   * @param url the url of the content.
   * @param content the content to be cajoled.
   * @param mimeType the MIME type of the content.
   * @param domOpts optional DOM related config options
   *     - property opt_idClass the id/class suffix to use in static html
   *
   * @return a promise for the module JSON returned from the cajoler.
   */
  var cajoleContent = function (url, content, mimeType, domOpts) {
    var result = Q.defer();
    handleRequest(
        url,
        jsonRequestChannel.request(
            makeServiceReference(url, mimeType, domOpts),
            content,
            mimeType),
        result);
    return result.promise;
  };

  return {
    cajoleUrl: cajoleUrl,
    cajoleContent: cajoleContent
  };
};

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['cajolingServiceClientMaker'] = cajolingServiceClientMaker;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @requires setTimeout URI
 * @provides GuestManager
 * @overrides window
 */

/**
 * A GuestManager is a handle to an instance of a Caja sandbox.
 *
 * Methods on GuestManager are somewhat redundant because this consolidates
 * what used to be two different but similar objects.
 *
 * API variant 1:
 *    caja.makeFrameGroup(..., function (frameGroup) {
 *        frameGroup.makeES5Frame(..., function (frame) {
 *            frame.url(...).run(api, callback);
 *
 * API variant 2:
 *    caja.load(..., function (frame) {
 *        frame.code(...).api(api).run(callback);
 *    });
 *
 * The "frame" parameters were once different objects with subtly different
 * semantics that don't matter in practice.  GuestManager combines the two.
 */

function GuestManager(frameTamingSchema, frameTamingMembrane, divs, hostBaseUrl,
  domicile, htmlEmitter, guestWin, USELESS, uriPolicy, runImpl) {
  // TODO(felix8a): this api needs to be simplified; it's difficult to
  // explain what all the parameters mean in different situations.
  var args = {
    // url to fetch, or imputed origin of cajoled or uncajoled content
    url: undefined,

    // Content type for the url or the uncajoledContent.
    // If not specified, uncajoledContent assumes text/html,
    // and url fetch assumes type based on filename suffix.
    mimeType: undefined,

    uncajoledContent: undefined,

    cajoledJs: undefined,
    cajoledHtml: undefined,

    moreImports: undefined,

    // Enable Flash support
    flash: true
  };

  var self = {
    // Public state
    div: divs.outer && divs.outer.parentNode,
    idClass: divs.idClass,
    getUrl: function() { return args.url; },
    getUriPolicy: function() { return uriPolicy; },

    // deprecated; idSuffix in domado means '-' + idClass, but idSuffix
    // exposed here is without the leading '-'.  Future code should use the
    // idClass property instead.
    idSuffix: divs.idClass,

    iframe: guestWin.frameElement,
    imports: (domicile
              ? domicile.window
              : (guestWin.___
                 ? guestWin.___.copy(guestWin.___.sharedImports) // for es53
                 : {})),                                         // for ses
    innerContainer: divs.inner,
    outerContainer: divs.outer,

    // Internal state
    domicile: domicile,      // Currently exposed only for the test suite
    htmlEmitter: htmlEmitter,

    rewriteUri: domicile ? domicile.rewriteUri : function() { return null; },

    // Taming utilities
    tame: frameTamingMembrane.tame,
    untame: frameTamingMembrane.untame,
    tamesTo: frameTamingMembrane.tamesTo,
    reTamesTo: frameTamingMembrane.reTamesTo,
    hasTameTwin: frameTamingMembrane.hasTameTwin,

    markReadOnlyRecord: frameTamingSchema.published.markTameAsReadOnlyRecord,
    markFunction: frameTamingSchema.published.markTameAsFunction,
    markCtor: frameTamingSchema.published.markTameAsCtor,
    markXo4a: frameTamingSchema.published.markTameAsXo4a,
    grantMethod: frameTamingSchema.published.grantTameAsMethod,
    grantRead: frameTamingSchema.published.grantTameAsRead,
    grantReadWrite: frameTamingSchema.published.grantTameAsReadWrite,
    grantReadOverride: frameTamingSchema.published.grantTameAsReadOverride,
    adviseFunctionBefore: frameTamingSchema.published.adviseFunctionBefore,
    adviseFunctionAfter: frameTamingSchema.published.adviseFunctionAfter,
    adviseFunctionAround: frameTamingSchema.published.adviseFunctionAround,

    USELESS: USELESS,

    api: function (imports) {
      args.moreImports = imports;
      return self;
    },

    flash: function(flag) {
      args.flash = !!flag;
      return self;
    },

    code: function (url, opt_mimeType, opt_content) {
      args.url = url;
      args.mimeType = opt_mimeType;
      args.uncajoledContent = opt_content;
      return self;
    },

    cajoled: function (url, js, opt_html) {
      args.url = url;
      args.cajoledJs = js;
      args.cajoledHtml = opt_html;
      return self;
    },

    content: function (url, content, opt_mimeType) {
      return self.code(url, opt_mimeType, content);
    },

    contentCajoled: function (url, js, opt_html) {
      return self.cajoled(url, js, opt_html);
    },

    url: function (url, opt_mimeType) {
      return self.code(url, opt_mimeType, undefined);
    },

    urlCajoled: function (baseUrl, jsUrl, opt_htmlUrl) {
      throw new Error("Not yet implemented");  // TODO(felix8a)
    },

    run: run
  };

  return self;

  //----------------

  function run(opt_arg1, opt_arg2) {
    var moreImports, opt_runDone;
    if (opt_arg2) {
      moreImports = opt_arg1 || args.moreImports || {};
      opt_runDone = opt_arg2;
    } else {
      moreImports = args.moreImports || {};
      opt_runDone = opt_arg1;
    }
    if (domicile) {
      domicile.setBaseUri(URI.utils.resolve(hostBaseUrl, args.url));
    }
    return runImpl(self, args, moreImports, function(result) {
      setTimeout(function() { 
          if (opt_runDone) {
            opt_runDone(result);
          }
      }, 0);
    });
  }
}

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['GuestManager'] = GuestManager;
}
;
// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @provides SESFrameGroup
 * @requires Domado
 * @requires GuestManager
 * @requires Q
 * @requires TamingSchema
 * @requires TamingMembrane
 * @requires bridalMaker
 * @overrides window
 */

function SESFrameGroup(cajaInt, config, tamingWin, feralWin, guestMaker) {
  if (tamingWin !== window) {
    throw new Error('wrong frame');
  }
  if (!tamingWin.___) {
    tamingWin.___ = {};
  }

  var USELESS = Object.freeze({ USELESS: 'USELESS' });
  var BASE_OBJECT_CONSTRUCTOR = Object.freeze({});

  var tamingHelper = Object.freeze({
      applyFunction: applyFunction,
      getProperty: getProperty,
      setProperty: setProperty,
      getOwnPropertyNames: getOwnPropertyNames,
      directConstructor: directConstructor,
      getObjectCtorFor: getObjectCtorFor,
      isDefinedInCajaFrame: isDefinedInCajaFrame,
      isES5Browser: true,
      eviscerate: undefined,
      banNumerics: function() {},
      USELESS: USELESS,
      BASE_OBJECT_CONSTRUCTOR: BASE_OBJECT_CONSTRUCTOR,
      getValueOf: function(o) { return o.valueOf(); }
  });

  var frameGroupTamingSchema = TamingSchema(tamingHelper);
  var frameGroupTamingMembrane =
      TamingMembrane(tamingHelper, frameGroupTamingSchema.control);

  var domado = Domado(null);

  var bridal = bridalMaker(identity, feralWin.document);

  tamingWin.___.plugin_dispatchToHandler___ =
      domado.plugin_dispatchToHandler;

  var unsafe = false;

  var frameGroup = {

    makeDefensibleObject___: makeDefensibleObject,
    makeDefensibleFunction___: makeDefensibleFunction,

    tame: frameGroupTamingMembrane.tame,
    tamesTo: frameGroupTamingMembrane.tamesTo,
    reTamesTo: frameGroupTamingMembrane.reTamesTo,
    untame: frameGroupTamingMembrane.untame,
    unwrapDom: function(o) { return o; },
    markReadOnlyRecord:
        frameGroupTamingSchema.published.markTameAsReadOnlyRecord,
    markFunction: frameGroupTamingSchema.published.markTameAsFunction,
    markCtor: frameGroupTamingSchema.published.markTameAsCtor,
    markXo4a: frameGroupTamingSchema.published.markTameAsXo4a,
    grantMethod: frameGroupTamingSchema.published.grantTameAsMethod,
    grantRead: frameGroupTamingSchema.published.grantTameAsRead,
    grantReadWrite: frameGroupTamingSchema.published.grantTameAsReadWrite,
    grantReadOverride: frameGroupTamingSchema.published.grantTameAsReadOverride,
    adviseFunctionBefore: frameGroupTamingSchema.published.adviseFunctionBefore,
    adviseFunctionAfter: frameGroupTamingSchema.published.adviseFunctionAfter,
    adviseFunctionAround: frameGroupTamingSchema.published.adviseFunctionAround,

    USELESS: USELESS,
    iframe: window.frameElement,

    makeES5Frame: makeES5Frame,
    disableSecurityForDebugger: disableSecurityForDebugger
  };

  return frameGroup;

  //----------------

  function disableSecurityForDebugger(value) {
    unsafe = !!value;
    if (tamingWin) {
      tamingWin.ses.DISABLE_SECURITY_FOR_DEBUGGER = unsafe;
    }
  }

  function makeDefensibleObject(descriptors) {
    return Object.seal(Object.create(Object.prototype, descriptors));
  }

  function makeDefensibleFunction(f) {
    return Object.freeze(function() {
      return f.apply(USELESS, Array.prototype.slice.call(arguments, 0));
    });
  }

  function applyFunction(f, dis, args) {
    return f.apply(dis, args);
  }

  function getProperty(o, p) {
    return o[p];
  }

  function setProperty(o, p, v) {
    return o[p] = v;
  }

  function directConstructor(obj) {
    if (obj === null) { return void 0; }
    if (obj === void 0) { return void 0; }
    if ((typeof obj) !== 'object') {
      // Regarding functions, since functions return undefined,
      // directConstructor() doesn't provide access to the
      // forbidden Function constructor.
      // Otherwise, we don't support finding the direct constructor
      // of a primitive.
      return void 0;
    }
    var directProto = Object.getPrototypeOf(obj);
    if (!directProto) { return void 0; }
    var directCtor = directProto.constructor;
    if (!directCtor) { return void 0; }
    if (directCtor === feralWin.Object) { return BASE_OBJECT_CONSTRUCTOR; }
    Array.prototype.slice.call(feralWin.frames).forEach(function(w) {
      if (directCtor === w.Object) {
        directCtor = BASE_OBJECT_CONSTRUCTOR;
      }
    });
    return directCtor;
  }

  function getObjectCtorFor(o) {
    if (o === undefined || o === null) {
      return void 0;
    }
    var ot = typeof o;
    if (ot !== 'object' && ot !== 'function') {
      throw new TypeError('Cannot obtain ctor for non-object');
    }
    var proto = undefined;
    while (o) {
      proto = o;
      o = Object.getPrototypeOf(o);
    }
    return proto.constructor;
  }

  function getOwnPropertyNames(o) {
    var r = [];
    Object.getOwnPropertyNames(o).forEach(function(p) {
      if (Object.getOwnPropertyDescriptor(o, p).enumerable) {
        r.push(p);
      }
    });
    return r;
  }

  function inheritsFromPrototype(o, proto) {
    var ot = typeof o;
    if (ot !== 'object' && ot !== 'function') {
      return false;  // primitive
    }
    while (o !== null) {
      if (o === proto) { return true; }
      o = Object.getPrototypeOf(o);
    }
    return false;
  }

  function isDefinedInCajaFrame(o) {
    var result = false;
    for (var i = 0; i < feralWin.frames.length; i++) {
      var w = feralWin.frames[i];
      var isCajaFrame = false;
      try {
        isCajaFrame =
            (!!w.___ && !!w.cajaVM) ||   // ES53 frame
            (!!w.ses && !!w.cajaVM);     // SES frame
      } catch (e) {}
      if (isCajaFrame && inheritsFromPrototype(o, w.Object.prototype)) {
        return true;
      }
    }
    return false;
  }

  //----------------

  function makeES5Frame(div, uriPolicy, es5ready, domOpts) {
    var divs = cajaInt.prepareContainerDiv(div, feralWin, domOpts);
    guestMaker.make(function (guestWin) {
      var frameTamingSchema = TamingSchema(tamingHelper);
      var frameTamingMembrane =
          TamingMembrane(tamingHelper, frameTamingSchema.control);
      var domicileAndEmitter = makeDomicileAndEmitter(
          frameTamingMembrane, divs, uriPolicy, guestWin);
      var domicile = domicileAndEmitter && domicileAndEmitter[0];
      var htmlEmitter = domicileAndEmitter && domicileAndEmitter[1];
      var gman = GuestManager(frameTamingSchema, frameTamingMembrane, divs,
          cajaInt.documentBaseUrl(), domicile, htmlEmitter, guestWin, USELESS,
          uriPolicy, sesRun);
      guestWin.ses.DISABLE_SECURITY_FOR_DEBUGGER = unsafe;
      es5ready(gman);
    });
  }

  //----------------

  function makeDomicileAndEmitter(
      frameTamingMembrane, divs, uriPolicy, guestWin) {
    if (!divs.inner) { return null; }

    function FeralTwinStub() {}
    FeralTwinStub.prototype.toString = function () {
      return "[feral twin stub:" + tamingWin.taming.tame(this) + "]";
    };

    function permitUntaming(o) {
      if (typeof o === 'object' || typeof o === 'function') {
        frameTamingMembrane.tamesTo(new FeralTwinStub(), o);
      } // else let primitives go normally
    }

    var domicile = domado.attachDocument(
      '-' + divs.idClass, uriPolicy, divs.inner,
      config.targetAttributePresets,
      Object.freeze({
        permitUntaming: permitUntaming,
        tame: frameTamingMembrane.tame,
        untame: frameTamingMembrane.untame,
        tamesTo: frameTamingMembrane.tamesTo,
        reTamesTo: frameTamingMembrane.reTamesTo,
        hasTameTwin: frameTamingMembrane.hasTameTwin,
        hasFeralTwin: frameTamingMembrane.hasFeralTwin
      }));
    var imports = domicile.window;

    // The following code copied from the ES5/3 mode is mostly
    // commented out because the features it supports are not yet
    // available in the extremely incomplete ES5 mode. It is left in
    // as a reminder to implement the corresponding features.
    // In the ES5/SES/CES world, there is no ___ suffix to hide
    // properties, so all such things must be protected by other
    // means.
    //
    // TODO(kpreid): All of this code should disappear as the missing
    // features are implemented, but if it doesn't, remove it or check
    // for what we lost.

    guestWin.cajaVM.copyToImports(imports, guestWin.cajaVM.sharedImports);

    var htmlEmitter = new tamingWin.HtmlEmitter(
      identity, domicile.htmlEmitterTarget, domicile, guestWin);
    //imports.rewriteUriInCss___ = domicile.rewriteUriInCss.bind(domicile);
    //imports.rewriteUriInAttribute___ =
    //  domicile.rewriteUriInAttribute.bind(domicile);
    //imports.getIdClass___ = domicile.getIdClass.bind(domicile);
    //imports.emitCss___ = domicile.emitCss.bind(domicile);

    //___.getId = cajaInt.getId;
    //___.getImports = cajaInt.getImports;
    //___.unregister = cajaInt.unregister;
    //
    //feralWin.___.getId = cajaInt.getId;
    //feralWin.___.getImports = cajaInt.getImports;
    //feralWin.___.unregister = cajaInt.unregister;
    //
    //guestWin.___.getId = cajaInt.getId;
    //guestWin.___.getImports = cajaInt.getImports;
    //guestWin.___.unregister = cajaInt.unregister;
    //
    //cajaInt.getId(imports);

    if (!feralWin.___.tamingWindows) {
      feralWin.___.tamingWindows = {};
    }
    feralWin.___.tamingWindows[imports.id___] = tamingWin;

    feralWin.___.plugin_dispatchEvent___ = domado.plugin_dispatchEvent;
    feralWin.___.plugin_dispatchToHandler___ =
      function (pluginId, handler, args) {
        var tamingWin = feralWin.___.tamingWindows[pluginId];
        return tamingWin.___.plugin_dispatchToHandler___(
          pluginId, handler, args);
      };

    return [domicile, htmlEmitter];
  }

  function identity(x) { return x; }

  //----------------

  function sesRun(gman, args, moreImports, opt_runDone) {
    if (!moreImports.onerror) {
      moreImports.onerror = onerror;
    }

    // TODO(kpreid): right enumerable/own behavior?
    var imports = gman.imports;
    Object.getOwnPropertyNames(moreImports).forEach(
      function (i) {
        Object.defineProperty(
          imports, i,
          Object.getOwnPropertyDescriptor(moreImports, i));
      });

    // TODO(felix8a): args.flash

    var promise;
    if (args.uncajoledContent !== undefined) {
      promise = loadContent(gman, Q.ref({
        contentType: args.mimeType || 'text/html',
        responseText: args.uncajoledContent
      }));

    } else if (args.cajoledJs !== undefined) {
      throw new Error(
        'Operating in SES mode; pre-cajoled content cannot be loaded');

    } else {
      promise = loadContent(gman, fetch(args.url), args.mimeType);
    }

    Q.when(promise, function (compiledFunc) {
      var result = compiledFunc(imports);
      if (opt_runDone) {
        opt_runDone(result);
      }
    }, function (failure) {
      config.log('Failed to load guest content: ' + failure);
    });
  }

  function onerror(message, source, lineNum) {
    config.log('Uncaught script error: ' + message +
               ' in source: "' + source +
               '" at line: ' + lineNum);
  }

  /**
   * Given a promise for a fetch() response record, return a promise
   * for its Caja interpretation, a function of (extraImports).
   */
  function loadContent(gman, contentPromise, opt_expectedContentType) {
    var guestWin = gman.iframe.contentWindow;

    return Q.when(contentPromise, function (xhrRecord) {
      // TODO(kpreid): Is this safe? Does this match the cajoling
      // service's behavior? Should we reject if these two do not
      // agree?
      var contentType = opt_expectedContentType
        || xhrRecord.contentType;

      var theContent = xhrRecord.responseText;

      if (contentType === 'text/javascript'
          || contentType === 'application/javascript'
          || contentType === 'application/x-javascript'
          || contentType === 'text/ecmascript'
          || contentType === 'application/ecmascript'
          || contentType === 'text/jscript') {
        // TODO(kpreid): Make sure there's only one place (in JS)
        // where this big list of content-type synonyms is defined.

        // TODO(kpreid): needs to return completion value unless we
        // deprecate that feature.
        return Q.ref(guestWin.cajaVM.compileExpr(
          '(function () {' + theContent + '})()'));

      } else if (contentType === 'text/html') {
        // importsAgain always === imports, so ignored
        var writeComplete = gman.imports.document.write(theContent);
        return Q.when(writeComplete, function (importsAgain) {
            // TODO(kpreid): Make fetch() support streaming download,
            // then use it here via repeated document.write().
            gman.htmlEmitter.finish();
            gman.htmlEmitter.signalLoaded();
            return function() {};
        });
      } else {
        throw new TypeError("Unimplemented content-type " + contentType);
      }
    });
  }

  /**
   * Download the content of the given URL asynchronously, and return a
   * promise for a XHR-ish record containing the response.
   *
   * TODO(kpreid): modify this interface to support streaming download
   * (readyState 3), and make use of it in loadContent.
   */
  function fetch(url) {
    // TODO(kpreid): Review this for robustness/exposing all relevant info
    var pair = Q.defer();
    var resolve = pair.resolve;
    var xhr = bridal.makeXhr();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve({
            contentType: xhr.getResponseHeader('Content-Type'),
            responseText: xhr.responseText
          });
        } else {
          resolve(Q.reject(xhr.status + ' ' + xhr.statusText));
        }
      }
    };
    xhr.send(null);
    return pair.promise;
  }

}

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['SESFrameGroup'] = SESFrameGroup;
}
;
// Copyright (C) 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * This file exists to be concatenated into the single file that caja.js (the
 * iframed-Caja-runtime loader) loads as the very last thing to give an on-load
 * callback.
 *
 * @author kpreid@switchb.org
 * @requires cajaIframeDone___
 */

cajaIframeDone___();
