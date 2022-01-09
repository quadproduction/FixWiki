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
            query: ".navbar-toggler i",
            el: null
        },
    }

    /** Constructor
     * 
     */
    constructor(){

        // Scan the sidenav
        this.sidenavScan();

        console.log(this.dom);

        this.sideNavTiggerAction();

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
                this.dom[el].el = [document.querySelectorAll(this.dom[el].query)];

    }

    /** Action on sidenav tigger
     * 
     */
    sideNavTiggerAction = () => {

        // Get tigger el
        let tiggerEl = document.querySelector("aside.sidenav-main .navbar-toggler");

        console.log(tiggerEl);

        // Check el exist
        if(tiggerEl === null)
            return;

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
                }
            ).then(
                response => response.json()
            ).then(
                data => console.log(data)
            ).catch(
                error => console.error(error)
            );

        }

        // Push action on event
        tiggerEl.addEventListener(
            'click',
            action
        );


    }

}