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

/** Module Dom
 * 
 */
export default class Dom {

    /** Check DOM element
     * 
     * @param {object} o 
     */
    check = (o = {}) => {



    }

    /** Scan DOM elements
     * List by :
     *  - layout
     *   
     * @param {object} o 
     * @return {object}
     */
    scan = (o = {}) => {

        // Declare result
        let result = {};
        
        // Check config dom scan items
        if(o.dom.scan.items !== undefined && Object.keys(o.dom.scan.items).length)

            // Iteration of items
            for(let item in o.dom.scan.items){

                // Set pattern
                let pattern = o.dom.scan.items[item].pattern ?? `[data-${item})]`;

                // Set result
                result[item] = document.querySelectorAll(pattern);

            }
            
        // Return result
        return result;
        
    }

    /** Create DOM element
     * 
     * @param {object} o 
     */
    create = (o = {}) => {



    }

    /** Delete DOM element
     * 
     * @param {object} o 
     */
    delete = (o = {}) => {



    }

    /** Clear DOM element
     * 
     * @param {object} o 
     */
    clear = (o = {}) => {



    }

    /** Replace DOM element
     * 
     * @param {object} o 
     */
    replace = (o = {}) => {



    }

}