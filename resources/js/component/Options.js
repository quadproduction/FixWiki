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

/** Dependances
 * 
 */
import Dom from "./../src/module/Dom";
import tippy from "tippy.js";

/** Page functions
 * 
 */
export default class Options{

    // Dom list
    dom = {
        options : {
            id: "options",
            el: null,
        },
    };

    // Declare events
    events = [];

    /** Constructor
     * 
     */
    constructor(){

        // Scan the options
        this.scan();

        // Init options
        this.init();

    }

    /** Scan the sidenav
     * - Scan all elements in current sidenav and fill the dom list
     * @returns {void}
     */
    scan = () => {

        // Iteration of the dom list
        for(let el in this.dom)

            // Check parameters of el
            if(this.dom[el].id !== undefined && this.dom[el].id)

                // Get element
                this.dom[el].el = [document.getElementById(this.dom[el].id)];

            else
            // Check if query
            if(this.dom[el].query !== undefined && this.dom[el].query)

                // Get elements
                this.dom[el].el = document.querySelectorAll(this.dom[el].query);

    }

    /** Init
     * 
     */
    init = () => {

        // Get items
        let itemsEls = this.dom.options.el[0].querySelectorAll(".options-container-item");

        // Check items
        for(let itemEl of itemsEls)

            // Check tippy content
            if(itemEl.dataset.tippyContent){

                // New tippy
                tippy(
                    itemEl,
                    {
                        placement: "bottom"
                    }
                );

            }

    }

}