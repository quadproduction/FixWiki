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
import Action from "./../src/module/Action";
import Popup from "./../src/module/Popup";
import Copy from "./../src/module/Copy";
import Dom from "./../src/module/Dom";
import Swal from 'sweetalert2';
import tippy from 'tippy.js';

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
        toggleThemeMode : {
            query: ".toggle-theme-mode",
            el: null,
        },
        launchRv : {
            query: ".launch-rv",
            el: null,
        },
        launchSgWizz : {
            query: ".launch-sg-wizz",
            el: null,
        },
        launchSgLocal : {
            query: ".launch-sg-local",
            el: null,
        },
        launchRocketchat : {
            query: ".launch-rocketchat",
            el: null,
        },
        launchGitlab : {
            query: ".launch-gitlab",
            el: null,
        },
        launchFixplay : {
            query: ".launch-fixplay",
            el:null,
        },
        launchMovinmotion : {
            query: ".launch-movinmotion",
            el:null,
        },
        launchHdr : {
            query: ".launch-hdr",
            el:null,
        }
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
                content: 'Info',
            }
        );
        
        // Set action
        let toggleInfoAction = async e => {

            // Set legacy e
            let eLegacy = e;

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
                data => {
                    // Scan action
                    Action.scan(data);
                }
            // Exception
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
                                toggleInfoAction(eLegacy)
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
    
    /** Toggle Theme Mode
     * @param {*} dom 
     * @returns {void}
     */
    toggleThemeModeInit = (dom) => {

        this.darkMode = false;

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
            }
        );

        // Set action
        let action = e => {

            // Set darkMode
            let htmlClass = document.documentElement.classList;
            this.darkMode = htmlClass.contains("dark-theme");

            // Switch mode
            document.documentElement.classList.toggle('dark-theme');

            // Set text content
            if(!this.darkMode){
                var contentText = "Mode jour";
                var contentIconText = "light_mode";
            }else{
                var contentText = "Mode nuit";
                var contentIconText = "dark_mode";
            }

            // Update _tippy
            if(e.target.hasOwnProperty("_tippy")){
                e.target.dataset.tippyContent = contentText;
                e.target._tippy.setContent(contentText);
            }else{
                e.target.parentElement.dataset.tippyContent = contentText;
                e.target.parentElement._tippy.setContent(contentText);
            }

            // Update icon
            if(e.target.classList.contains("material-icons")){
                e.target.innerText = contentIconText;
            }else{
                let iEl = e.querySelector('i');
                if(iEl !== null)
                    iEl.innerText = contentIconText;
            }

            // Xhr
            fetch(
                "/api/theme/"+(this.darkMode ? "light" : "dark" )+"/",
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
                data => {/* console.log(data) */}
            ).catch(
                error => console.error(error)
            );

        };

        // Push action on events
        this.events.push({
            el: dom.el,
            type: 'click',
            listener: action,
        });

    }

    /** Launch RV
     * 
     * @param {*} dom 
     */
    launchRvInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Shotgun Wizz
     * 
     * @param {*} dom 
     */
    launchSgWizzInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Shotgun Local
     * 
     * @param {*} dom 
     */
    launchSgLocalInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Rocket Chat
     * 
     * @param {*} dom 
     */
    launchRocketchatInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Git Lab
     * 
     * @param {*} dom 
     */
    launchGitlabInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Fix Play
     * 
     * @param {*} dom 
     */
    launchFixplayInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Movin Motion
     * 
     * @param {*} dom 
     */
    launchMovinmotionInit = dom => {

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

    }

    /** Launch Hdr Library
     * 
     * @param {*} dom 
     */
     launchHdrInit = dom => {

        // Declare pattern
        let pattern = "";
        let shortcut = "CTRL";

        // Get os
        let os = navigator.platform ?? null;

        // Process os
        os = os.toLowerCase();

        // Check if linux
        if(os.includes("linux"))

            // Fill pattern
            pattern = "prod/prod2/Projets";


        else 
        // Check if windows
        if(os.includes("win"))

            // Fill pattern
            pattern = "L:";

        else
        // Check if mac
        if(os.includes("mac")){
        
            // Fill pattern
            pattern = "Volumes/prod2/Projets";
            shortcut = "CMD";

        // Else remove el
        }else{

            // Remove parent El
            dom.el.parentElement.remove();

            // Stop function
            return;

        }

        // Fill href
        let a = document.querySelector(dom.query);

        // Check a
        if(a === null)
            return;
            
        // Set href
        a.href = `file:///${pattern}/RESSOURCES/_LIB/2D/_texture/EnvMap/0_hdr_previews/previews.html`;

        // Copy
        Copy.run({
            el: `a${dom.query}`,
            callback: (trigger) => {
                M.toast({html: `Coller le lien dans un nouvel onglet !<br>(${shortcut} + T puis ${shortcut} + V)`})
                return trigger.href;
            }
        });

        // Tippy
        tippy(
            dom.el,
            {
                offset: [0, 20],
                allowHTML: true,
            }
        );

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