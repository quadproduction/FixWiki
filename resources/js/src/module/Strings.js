"use strict";
/*******************************************************
 * Copyright (C) 2019-2022 Kévin Zarshenas
 * kevin.zarshenas@gmail.com
 * 
 * This file is part of LuckyPHP.
 * 
 * This code can not be copied and/or distributed without the express
 * permission of Kévin Zarshenas @kekefreedog
 *******************************************************/

/** Module Popup
 * 
 */
export default class Strings {

    /** Camel to Snake
     * Exemple : 
     * - helloWorldToto -> hello_world-toto
     * @param {string} str 
     * @returns {string}
     */
    static camelToSnake = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    /** Snake to Camel
     * Exemple : 
     * - hello_world-toto -> helloWorldToto 
     * @param {string} str 
     * @returns {string}
     */
    static snakeToCamel = str => {
         return str.replace(
             /([-_][a-z])/ig, 
             $1 => $1.toUpperCase()
                .replace('-', '')
                .replace('_', '')
         );
     };
 
    /** UcWords
     * @param {string} str Needle
     * @returns {string} Result
     */
    static ucWords = (str) => {
        str = str.toLowerCase();
        return str.replace(
            /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            (s) => s.toUpperCase()
        );
    };

    /** Clean str
     * @param {string} string String to process
     * @returns {string} Result clean
     */
    static clean = (string = "") => {

        // Check string
        if(!string)
            return string;

        // Rules
        let rules = [
            [ /[áàâãªä]/ug,     'a' ],
            [ /[ÁÀÂÃÄ]/ug,      'a' ],
            [ /[ÍÌÎÏ]/ug,       'i' ],
            [ /[íìîï]/ug,       'i' ],
            [ /[éèêë]/ug,       'e' ],
            [ /[ÉÈÊË]/ug,       'e' ],
            [ /[óòôõºö]/ug,     'o' ],
            [ /[ÓÒÔÕÖ]/ug,      'o' ],
            [ /[úùûü]/ug,       'u' ],
            [ /[ÚÙÛÜ]/ug,       'u' ],
            [ /ç/g,             'c' ],
            [ /Ç/g,             'c' ],
            [ /ñ/g,             'n' ],
            [ /Ñ/g,             'n' ],
            [ /\s+/g,           '_' ],
            [ /–/g,             '-' ], // UTF-8 hyphen to "normal" hyphen
            [ /[’‘‹›‚]/ug,      ' ' ], // Literally a single quote
            [ /[“”«»„]/ug,      ' ' ], // Double quote
            [ / /g,             ' ' ], // nonbreaking space (equiv. to 0x160),
            [ /[(]/g,      	    ''  ], // Round brackets
            [ /[)]/g,      	    ''  ], // Round brackets
            [ /(_-_)/g,         '_' ],
            [ /['"“”‘’„”«»]/g,  ''  ],
        ];

        // Iteration des rules
        for(let rule of rules)

            string = string.replaceAll(rule[0], rule[1]);

        // Return string
        return string.toLowerCase();

    }

    /* Fix #31 */

    /**
     * Encode Html
     * 
     * Convert utf8 string to html character encoded string
     * 
     * @source https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
     * 
     * @param {string} input Input to encode
     * @returns string
     */
    static encodeHtml = (input = "") => {
      
        /* Declare result */
        let result = "";

        /* Check input */
        if(!input)
            return result;

        /* Declare map */
        var map = {
          '&' : '&amp;',
          '<' : '&lt;',
          '>' : '&gt;',
          '"' : '&quot;',
          "'" : '&#039;'
        };
      
        /* Set result */
        result = input.replace(/[&<>"']/g, function(m) {return map[m];});

        /* Resturn result */
        return result;

      }
      
      /**
       * Decode Html
       * 
       * Convert html character encoded string to utf8 string 
       * 
       * @source https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
       * 
       * @param {string} input Input to decode
       * @returns string
       */
      static decodeHtml = (input = "") => {
      
        /* Declare result */
        let result = "";

        /* Check input */
        if(!input)
            return result;

        /* Declare map */
        var map = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#039;': "'"
        };
      
        /* Set result */
        result = input.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});

        /* Resturn result */
        return result;

      }

      /* End Fix #31 */

}