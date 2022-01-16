"use strict";
/*******************************************************
 * Copyright (C) 2019-2021 Kévin Zarshenas
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

}