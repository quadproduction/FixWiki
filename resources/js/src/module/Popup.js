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
export default class Popup {

    /** Show popup
     * 
     */
    show = (o = {}) => {



    }

    /** Show hide
     * 
     */
    show = (o = {}) => {



    }

    /** Show hide
     * 
     */
    replace = (o = {}) => {



    }

    /*********************************************************$
     * Loader
     */

    /** clean Loader
     * 
     * 
     */
    static cleanSwalLoader = (name) => {

        // Color
        let color = "gradient-45deg-deep-purple-blue"

        // List element to clean
        let listToClean = {
            "loaderSwalSimple": {
                includeID: "loaderSwalSimpleLoader" 
            }
        };

        // Get includeID in swal
        let checkEl = document.querySelector(".swal2-container #"+listToClean[name].includeID);

        // Check name in listToClean
        if(
            name &&
            name in listToClean &&
            checkEl === null
        ){

            // Get swal2-popup
            let swalPopupEl = document.querySelector(".swal2-popup");

            // Check el
            if(swalPopupEl !== null)

                // Check Swal el
                swalPopupEl.classList.remove(name+"Popup", color);

        }

    }

    /** Simple Loader for Swal
     * 
     * @returns {string}
     */
    static loaderSwalSimple = () => {

        // Result
        let result = "";

        // Elements
        let domElements = {
            img: "aside .brand-logo .show-on-medium-and-down.hide-on-med-and-up"
        };

        // Get image
        let logo = document.querySelector(domElements.img);

        // Create dom el
        let main = document.createElement("div");
        main.setAttribute('id', "loaderSwalSimpleLoader");
            let div0 = document.createElement('div');
            div0.classList.add("preloader-logo");
                let img = document.createElement('img');
                img.setAttribute("src", logo.src);
            div0.appendChild(img);
            let div1 = document.createElement("div");
            div1.classList.add("preloader-wrapper","big","active");
                let div11 = document.createElement("div");
                div11.classList.add("spinner-layer","spinner-white-only");
                    let div111 = document.createElement("div");
                    div111.classList.add("circle-clipper","left");
                    let div112 = document.createElement("div");
                    div112.classList.add("gap-patch");
                    let div113 = document.createElement("div");
                    div113.classList.add("circle-clipper","right");
                        let div11X1 = document.createElement("div");
                        div11X1.classList.add("circle");
                    div111.appendChild(div11X1);
                    div112.appendChild(div11X1);
                    div113.appendChild(div11X1);
                div11.appendChild(div111);
                div11.appendChild(div112);
                div11.appendChild(div113);
            div1.appendChild(div11);
        main.appendChild(div0);
        main.appendChild(div1);

        // Set result
        result = main.outerHTML;

        // Return html
        return result;

    }

    /** Scan Hooks (add event to query)
     * @param {event} event
     * @param {Array} hooks
     * @returns {void}
     */
    static scanHooks = (event = null, hooks = []) => {

        // Check event and hooks
        if(event === null || !hooks.length)
            return;

        // Iteration des hooks
        for(let hook of hooks){

            // Check hook
            if(
                (
                    !hook.query &&
                    !hook.id
                ) ||
                !hook.event || 
                typeof hook.callback !== "function"
            )
                continue;

            // Set els
            let els = event.querySelectorAll(hook.query ?? hook.id);

            // Check el
            if(!els || !els.length)
                continue;

            // Iteration des el
            for(let el of els)

                // Add event on el
                el.addEventListener(
                    hook.event,
                    hook.callback
                );

        }

    }

}