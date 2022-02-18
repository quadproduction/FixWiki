
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
export class Google{

    /** Constructor
     * o : {
     *  webContentLink : ""
     * }
     * 
     */
    constructor(o = {}){

        this.setContent(o);

        this.setHeight()

    }

    /** Set content
     * 
     * @returns void
     */
    setContent = o => {

        // Check if o.webContentLink
        if(o.webContentLink === undefined){
            
            // Display error
            console.error("webContentLink is missing");

            // Stop function
            return;

        }

        // Replace Edit by Preview if google link
        if(
            o.webContentLink.includes("docs.google") &&
            o.webContentLink.includes("edit")
        )
        o.webContentLink = o.webContentLink.replace("edit", "preview");

        // Create iframe
        let iframeDiv = document.createElement("iframe");

        // Set attributes
        iframeDiv.setAttribute('id', 'iframe-main');
        iframeDiv.setAttribute('src', o.webContentLink);
        iframeDiv.setAttribute('style', 'width: 100%; height: 475px;border: medium none;');

        // Get main
        let mainEl = document.getElementById("main");


        // Check el
        if(!mainEl){
        
            // Display error
            console.error("Main div is missing");

            // Stop function
            return;

        }

        // Clear main
        mainEl.innerHTML = "";

        // Append iframe
        mainEl.appendChild(iframeDiv);

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