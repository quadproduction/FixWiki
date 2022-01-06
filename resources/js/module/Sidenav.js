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
export class Sidenav{

    /** Constructor
     * 
     */
    constructor(){

        this.sideNavTiggerAction()

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