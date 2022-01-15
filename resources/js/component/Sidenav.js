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

/** Dependances
 * 
 */
import Dom from "./../src/module/Dom";

/** Page functions
 * 
 */
export default class Sidenav{

    // Dom list
    dom = {
        navbar : {
            id: "sidenav",
            el: null,
        },
        navbarToggler: {
            query: ".navbar-toggler",
            el: null
        },
    };

    // Declare events
    events = [];

    /** Constructor
     * 
     */
    constructor(){

        // Scan the sidenav
        this.scan();

        // Init sidenav
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

    /**********************************************************************************
     * Init
     */

    /** Initialize
     * 
     * @returns {void}
     */
    init = () => {

        // Iteration the dom
        for(let name in this.dom)

            // Check el is set
            if(
                this.dom[name].el !== null &&
                this.dom[name].el.length &&
                this[name+'Init'] !== undefined
            )

                // Execute init
                this[name+'Init'](this.dom[name]);

        // Execute events
        Dom.addEvents(this.events);

    }

    /** Action on sidenav tigger
     * 
     * @returns {void}
     */
    navbarTogglerInit = (dom) => {

        // Prepare action
        let action = e => {

            // Get aside
            let aside = document.querySelector("aside.sidenav-main");

            // Check aside
            if(aside === null)
                return;

            // Check if nav-lock
            let request = aside.classList.contains("nav-lock") ?
                "collapse" :
                    "expanded";

            // Xhr
            fetch(
                "/api/sidenav/"+request+"/",
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Content-Type': 'application/json',
                    })
                }
            // Middleware
            ).then(
                response => response.json()
            // Controller
            ).then(
                data => console.log(data)
            ).catch(
                error => console.error(error)
            );

        }

        // Push action on events
        this.events.push({
            el: dom.el,
            type: 'click',
            listener: action,
        });

    }

}