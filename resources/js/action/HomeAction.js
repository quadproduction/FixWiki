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
import PageAction from "../src/base/PageAction";
import Popup from "./../src/module/Popup";
import Action from "../src/module/Action";
import { annotate } from "rough-notation";
import JSConfetti from "js-confetti";
import Swal from 'sweetalert2';
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

        // Confeti ini
        this.confettiInit();

        // Annotate Init
        this.annotateInit();

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

    /**
     * confetti Init
     * 
     * @return void
     */
    confettiInit = () => {

        // Declare value
        let value = true;

        // Check localstorage in window
        if("localStorage" in window){

            // Check if localstorage exists
            value = localStorage["fixwiki_confetti"] || true;

        }

        // Check value
        if(value !== "disable"){

            // New confetti
            const jsConfetti = new JSConfetti();

            // Add Confetti
            jsConfetti.addConfetti({
                emojis: ['🌈', '⚡️', '💥', '🦄', '🎬', '🍔'],
                emojiSize: 40,
                confettiNumber: 50
            });

            // Check localstorage in window
            if("localStorage" in window){

                // Set local value
                localStorage["fixwiki_confetti"] = "disable";

            }

        }

        // Get header
        let headerEl = document.querySelector("h1.header")

            // Check header el
            if(headerEl !== null){

                headerEl.addEventListener(
                    "dblclick",
                    (e) => {

                        // New confetti
                        const jsConfettiBis = new JSConfetti();
            
                        // Add Confetti
                        jsConfettiBis.addConfetti({
                            emojis: ['🌈', '⚡️', '💥', '🦄', '🎬', '🍔'],
                            emojiSize: 40,
                            confettiNumber: 50
                        });

                    }
                )

            }

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

                    // Check collapsible
                    if(collapsibleEl !== null)

                        // Init collapsible
                        M.Collapsible.init(collapsibleEl, {
                            accordion: false
                        });

                    // Get toggle team
                    let toggleTeamEls = sgProjectsEl.querySelectorAll('.toggle-team');

                    // Check toggle team
                    if(toggleTeamEls.length)

                        // Iteration toggleTeamEls
                        for(let toggleTeamEl of toggleTeamEls)

                            // Add event on click
                            toggleTeamEl.addEventListener(
                                'click',
                                this.teamPopupInit
                            );

                });
            }
        ).catch(
            error => console.error(error)
        );

    }

    /** Team popup init
     * 
     */
    teamPopupInit = async e => {

        // Set legacy e
        let eLegacy = e;

        // Check data-sg-id
        let id = e.target.dataset.sgId ?? null;

        // Check id
        if(id)

            // Xhr
            fetch(
                "/api/shotgrid/team/"+id,
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
                    // Scan action
                    Action.scan(data);
                }
            ).catch(
                error => console.error(error)
            );

            // Popup Loader
            let popupLoader = "loaderSwalSimple";

            // Swal
            await Swal.fire({
                showCloseButton: false,
                showConfirmButton: false,
                padding: "0px",
                html: Popup[popupLoader](),
                customClass: {
                    popup: popupLoader+'Popup gradient-45deg-deep-purple-blue'
                },
                didRender: (e) => {
                    // Delete Loader
                    Popup.cleanSwalLoader(popupLoader);
                    // Set hook
                    Popup.scanHooks(e, [
                        // Close
                        {
                            query: ".popup-header-content-text-actions-close a",
                            event: "click",
                            callback: Swal.close
                        },
                        // Refresh
                        {
                            query: ".popup-header-content-text-actions-refresh a",
                            event: "click",
                            callback: () => {
                                this.teamPopupInit(eLegacy)
                            }
                        },
                        // Copy
                        {
                            query: ".copy-data",
                            event: "click",
                            callback: () => {
                                Copy.run({
                                    container: e,
                                    el: "a.copy-data",
                                    callback: (trigger) => trigger.dataset.copyContent ?? ""
                                });
                            }
                        }
                    ]);
                    // Set tippy
                    let a = e.querySelectorAll("a.copy-data");
                    if(a.length)
                        for(let b of a)
                            tippy(b, {
                                content: b.dataset.dataCopyLabel ?? "Copier l'élément ?",
                                placement: 'bottom',
                                delay: [500,0]
                            });
                } 
            });

    }

    /**
     * Init anotate
     */
    annotateInit = () => {

        // Types
        let types = {
            underline : "#f44336",
            box : "#2196f3",
            circle : "green",
            highlight : "yellow",
            bracket : "grey"
        };
        
        let options;

        // Iteration type
        for(let type in types){

            // Get marker el
            let elsCircle = document.querySelectorAll(`.marker-${type}`)

                // Check el
                if(elsCircle.length)

                    // Iteration el
                    for(let el of elsCircle){

                        // Prepare options
                        options = {
                            type: type,
                            color: types[type]
                        };

                        // Check if bracket
                        if(type == "bracket")

                            // Set brackets
                            options.brackets = ["left", "right"];

                        // New annotate
                        let annotation = annotate(el, options);

                        // Shpw
                        annotation.show();

                    }

        }

    }

}
