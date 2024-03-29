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
import Action from "./src/module/Action";
import {Google} from "./module/Google";
import LuckyJs from "./src/Lucky";
import {Pdf} from "./module/Pdf";
import tippy from 'tippy.js';

/** Component
 * 
 */
import Sidenav from "./component/Sidenav";
import Options from "./component/Options";
import Header from "./component/Header";
import Search from "./component/Search";

/** Actions
 * 
 */
import TutorialSectionAction from "./action/TutorialSectionAction";
import TutorialAction from "./action/TutorialAction";
import TicketAction from "./action/TicketAction";
import DriveAction from "./action/DriveAction";
import HomeAction from "./action/HomeAction";

/** Action route
 * 
 */
let actionRoute = {
    "TutorialSection": TutorialSectionAction,
    "Tutorial": TutorialAction,
    "Ticket": TicketAction,
    "Drive": DriveAction,
    "Home": HomeAction,
};

/** Component list
 * 
 */
let componentList = {
    sidenav: Sidenav,
    search: Search,
    head: Header,
    options: Options,
}

/** App Class
 * 
 */
class App extends LuckyJs{

    /** Config of the app
     * 
     */
    config = {

        /* Dom */
        dom: {

            /* Scan */
            scan : {
                items: {
                    layouts: {
                        pattern: "[data-layout]"
                    }
                }
            }

        }
    };


    /** Constructor
     * @param {object} actionRoute List of action
     */
    constructor(o = {}){

        /** LuckyJs constructor
         * 
         */
        super(o);

        /** Set modules of the app
         *  
         */
        this.Pdf = (o = {}) => { new Pdf(o); };
        this.Google = (o = {}) => { new Google(o); };
        this.Header = (o = {}) => { new Header(o); };
        this.Sidenav = (o = {}) => { new Sidenav(o); };

        /** Check browser
         *  
         */
        this.checkEs6();

        /** Set ajax actions of the app
         * 
         */
        this.setAjaxActions();

        /** Execute current action
         */
        new this.action(this);

        /** Add on top button
         *
         */
        this.addOnTopBtn();

    }

    /**
     * Check Es6
     * 
     * @return boolean
     */
    checkEs6 = () => {

        // Declare result
        let result = false;

        // Try feature not available before es6
        try{
            Function("() => {};");
            result = true;
        }catch(exception){
            result = false;
        }

        // Check result
        if(!result)

            // Add dom content loaded
            document.addEventListener("DOMContentLoaded", function() {

                // Display error message
                M.toast({html: '⚠️ Votre navigateur est obsolète !<br>Demandez au système une mise à jour.', classes: 'red center-align', displayLength:Infinity});

            });

        // Return
        return result;
        
    }

    /**
     * Add On Top Button
     */
    addOnTopBtn = () => {

        // Set global variable
        window.onTopBtn = null;

        // Html Template
        let htmlContent = `
            <div id="on-top-btn" class="fixed-action-btn pt-0">
                <a class="btn-floating white">
                <i class="large material-icons black-text">keyboard_control_key</i>
                </a>
            </div>
        `;

        let addBtn  = () => {

            // Add html composant
            document.body.insertAdjacentHTML( 
                'beforeend', 
                htmlContent
            );

            // Get on top element
            let elOnTopBtn = document.getElementById("on-top-btn");

            // Check el
            if(elOnTopBtn !== null){

                // Add event
                elOnTopBtn.addEventListener(
                    "click",
                    () => {

                        // Scroll to el
                        window.scrollTo({top: 0, behavior: 'smooth'});

                    }
                );

                // Tippy message
                tippy(elOnTopBtn, {
                    content: "Remonter en haut de la page",
                    placement: 'left',
                });

            }

        }

        let btnInit = () => {

                // Get main element
                let elMain = document.getElementById("main")

                // Check elmain
                if(elMain === null)

                    // Stop function
                    return;

                // Get main height
                let elMainHeight = elMain.offsetHeight;

                // Get window height
                let elHeight = window.innerHeight;

                // Get btn on top
                let elBtnOnTop = document.getElementById("on-top-btn");

                // Check if btn already exists
                let btnOnTopExists = elBtnOnTop === null ? false : true;

                // If content bigger
                if(elMainHeight > elHeight && window.scrollY !== 0){

                    // If btn not exists
                    if(!btnOnTopExists)

                        // Create btn 
                        addBtn();


                // If content smaller
                }else{

                    // If btn not exists
                    if(btnOnTopExists)

                        // Remove btn
                        elBtnOnTop.remove();


                }

        }

        // Add dom content loaded
        document.addEventListener("DOMContentLoaded", function() {

            // addBtn
            btnInit();

            // Add resize catcher
            addEventListener("resize", () => {

                // addBtn
                btnInit();

            });

            // Add scroll catcher
            addEventListener("scroll", () => {

                // addBtn
                btnInit();

            });

        });

    }

    /** Set up Ajax Action
     * 
     */
    setAjaxActions = () => {

        // List of action
        let actions = {
            // Handlebarjs Action
            hbs: Action.hbs
        };

        // Create actions instance
        this.Action = new Action(actions);

    }

}

/** New App
 * 
 */
window.App = new App({
    actionRoute: actionRoute,
    componentList: componentList
});