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
import Handlebars from "handlebars/dist/handlebars.min.js";
import PageAction from "../src/base/PageAction";
import Action from "../src/module/Action";
import tippy from 'tippy.js';

/** Home action
 *  
 */
export default class HomeAction extends PageAction {

    /** Constructor
     * @param {object} app Object of the app
     */
    constructor(app = {}){

        /** PageAction
         * 
         */
        super();

        /** Set app
         * 
         */
        this.app = app;
        
        /** Page Init
         * - Execute when page is ready
         */
        document.addEventListener(
            "DOMContentLoaded", 
            this.pageInit
        );

    }

    /** Init page
     * 
     */
    pageInit = () => {

        // Set structure
        this.structure = this.app.Dom.scan(this.app.config);

        // Init component
        this.componentInit();
        
        // Init main content
        this.mainInit();

    }

    /** MainInit 
     * 
     */
    mainInit = () => {

        // Set mainEl
        let mainEl = document.getElementById('main');

        // Check mainEl
        if(mainEl === null)
            return;

        // Init shortcuts
        this.shortcutsInit();

        // Init SG
        this.sgProjectsInit()

    }
    
    /** ShortcutsInit
     * 
     */
    shortcutsInit = () => {

        // Set shortcutsEl
        let shortcutsEl = document.getElementById('shortcuts');

        // Check shortcutsEl
        if(shortcutsEl === null)
            return;

        /**
         * Search all btn-large
         */
        
        // Get btn-large-m3 items
        let btnLargeEls = shortcutsEl.querySelectorAll('.btn-large-m3');

        // Check btn-large-m3 items
        if(btnLargeEls.length)

            // Iteration des btn-large-m3
            for(let btnLargeEl of btnLargeEls){

                // New tippy
                tippy(
                    btnLargeEl,
                    {
                        placement: "bottom"
                    }
                );

            }
        

    }

    /** SG Projects Init
     * 
     */
    sgProjectsInit = () => {

        // Set sgProjectsEl
        let sgProjectsEl = document.getElementById('sg-projects');

        // Check sgProjectsEl
        if(sgProjectsEl === null)
            return;

        // Xhr
        fetch(
            "/api/shotgrid/projects/",
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
            data => {

                Action.scan(data, () => {

                    // Get Collapsible
                    let collapsibleEl = sgProjectsEl.querySelector('.collapsible');

                    console.log(collapsibleEl);

                    // Check collapsible
                    if(collapsibleEl !== null)

                        // Init collapsible
                        M.Collapsible.init(collapsibleEl, {

                        });

                });
            }
        ).catch(
            error => console.error(error)
        );

    }

}
