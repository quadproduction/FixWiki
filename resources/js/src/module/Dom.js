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

    /**********************************************************************************
     * Static function about events
     */

    /** Add Events
     * 
     * @param {*} o Events
     *  [
     *      el : list of el
     *      type: 'click'|...
     *      listener: action
     *  ]
     */
    static addEvents = (list = []) => {

        // Check list
        if(list.length)

            // Iteration des items
            for(let item of list){

                if(Dom.isNode(item.el))

                    item.el.addEventListener(
                        item.type,
                        item.listener
                    );

                else

                    // Iteration des el
                    for(let el of item.el)

                        el.addEventListener(
                            item.type,
                            item.listener
                        );

            }

    }

    /**********************************************************************************
     * Static function about dom element
     */

    /** Read dataset on multiple el
     * @param {object} el
     * @param {string} name
     * @param {any}
     */
    static readDataSet = (el, name) => {

        // Check el
        if(el.length && name)

            // Iteration el
            for(let e of el)

                // Check if name in dataset of current el
                if(name in e.dataset){

                    // Return data set
                    return e.dataset[name];

                }

        // Return null
        return null;

    }

    /**********************************************************************************
     * Static function about document
     */

    /** toogleFullScreen
     * 
     * 
     */
    static toogleFullScreen = () => {
        if (
           (document.fullScreenElement && document.fullScreenElement !== null) ||
           (!document.mozFullScreen && !document.webkitIsFullScreen)
        ) {
           if (document.documentElement.requestFullScreen) {
              document.documentElement.requestFullScreen();
           } else if (document.documentElement.webkitRequestFullScreen) {
              document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
           } else if (document.documentElement.msRequestFullscreen) {
              if (document.msFullscreenElement) {
                 document.msExitFullscreen();
              } else {
                 document.documentElement.msRequestFullscreen();
              }
           }
        } else {
           if (document.cancelFullScreen) {
              document.cancelFullScreen();
           } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
           }
        }
    }

    /** Static function about dom object
     * 
     */
    //Returns true if it is a DOM node
    static isNode = (o) => {
        return (
        typeof Node === "object" ? o instanceof Node : 
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }
    
    //Returns true if it is a DOM element    
    static isElement = (o) =>{
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

}