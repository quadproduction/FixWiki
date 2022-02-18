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

/** Page functions
 * 
 */
export class Pdf{

    /** Constructor
     * 
     */
    constructor(){

        this.setHeight()

    }

    /** Set height of iframe
     * 
     */
    setHeight = () => {

        // Get header
        let headerEl = document.getElementById("header");

        // Get iframe
        let iframeEl = document.getElementById("iframe-main");

        // Check el
        if(headerEl === null || iframeEl === null)
            return;

        // Set height of iframe
        let reportWindowSize = () => { iframeEl.style.height = (window.innerHeight - headerEl.offsetHeight) + "px"; }

        // Execute function first time
        reportWindowSize();

        // Add function in event of resize
        window.addEventListener('resize', reportWindowSize);

    }

}