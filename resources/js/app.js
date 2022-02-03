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
import Action from "./src/module/Action";
import {Google} from "./module/Google";
import LuckyJs from "./src/Lucky";
import {Pdf} from "./module/Pdf";

/** Component
 * 
 */
import Sidenav from "./component/Sidenav";
import Header from "./component/Header";
import Search from "./component/Search";

/** Actions
 * 
 */
import HomeAction from "./action/HomeAction";
import DriveAction from "./action/DriveAction";

/** Action route
 * 
 */
let actionRoute = {
    "Home":  HomeAction,
    "Drive": DriveAction,
};

/** Component list
 * 
 */
let componentList = {
    sidenav: Sidenav,
    head: Header,
    search: Search,
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

        /** Set ajax actions of the app
         * 
         */
        this.setAjaxActions();

        /** Execute current action
         */
        new this.action(this);

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