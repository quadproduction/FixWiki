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
import LuckyJs from "./src/Lucky";
import {Pdf} from "./module/Pdf";
import {Google} from "./module/Google";

/** Component
 * 
 */
import Sidenav from "./component/Sidenav";

/** Actions
 * 
 */
import HomeAction from "./action/HomeAction";

/** Action route
 * 
 */
let actionRoute = {
    "Home":  HomeAction
};

/** Component list
 * 
 */
let componentList = {
    sidenav: Sidenav
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
        this.Sidenav = (o = {}) => { new Sidenav(o); };

        /** Execute current action
         */
        new this.action(this);

    }

}

/** New App
 * 
 */
window.App = new App({
    actionRoute: actionRoute,
    componentList: componentList
});