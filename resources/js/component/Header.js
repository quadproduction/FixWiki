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
import tippy from 'tippy.js';
import Swal from 'sweetalert2';

/** Page functions
 * 
 */
export default class Header{

    // Dom list
    dom = {
        toggleFullscreen: {
            query: ".toggle-fullscreen",
            el: null
        },
        toggleInfo : {
            query: ".toggle-info",
            el: null,
        },
    };

    // Declare events
    events = [];

    /** Constructor
     * 
     */
    constructor(){

        console.log("Hello moi")

        // Scan the sidenav
        this.scan();

        // Init sidenav
        this.init();

    }

    /** Scan the header
     * - Scan all elements in current header and fill the dom list
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

    /** Action on header tigger info
     * @param {object} dom
     * @returns {void}
     */
    toggleInfoInit = (dom) => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                content: 'Information',
            }
        );
        
        // Set action
        let toggleInfoAction = async e => {

            // Get url
            let url = e.target.parentNode.dataset.url;

            // Check url
            if(!url)
                return;

            // Xhr
            let content = fetch(
                url,
                {
                    method: 'GET',
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
                
                data => Swal.update({
                    html: this.templateCompile(data)
                })
                
            // Exception
            ).catch(
                error => console.error(error)
            );

            // Swal
            await Swal.fire({
                showCloseButton: false,
                showConfirmButton: false,
                padding: "0px"
            });

        }

        // Push action on events
        this.events.push({
            el: dom.el,
            type: 'click',
            listener: toggleInfoAction,
        });

    }

    /** Action on header tigger fullscreen
     * @param {object} dom
     * @returns {void}
     */
    toggleFullscreenInit = (dom) => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                content: 'Plein écran',
            }
        );

        // Push action on events
        this.events.push({
            el: dom.el,
            type: 'click',
            listener: Dom.toogleFullScreen(),
        });

    }

    /**********************************************************************************
     * Content Constructor
     */

    /** Create list for tippy
     * 
     */
    templateCompile = data => {

        let response = data._user_interface.swal2HtmlContainer.join();

        return response;
        
    }

}