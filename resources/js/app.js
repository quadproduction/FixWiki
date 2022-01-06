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
import {Pdf} from "./module/Pdf";
import {Google} from "./module/Google";
import {Sidenav} from "./module/Sidenav";

/** App Class
 * 
 */
class App{

    /** Constructor
     * 
     */
    constructor(){

        /** Set modules of the app
         *  
         */
        this.Pdf = (o = {}) => { new Pdf(o); };
        this.Google = (o = {}) => { new Google(o); };
        this.Sidenav = (o = {}) => { new Sidenav(o); };

        /** Hook start on document ready
         * 
         */
        document.addEventListener(
            "DOMContentLoaded", 
            () => {
                this.Sidenav();
            }
        );

    }

}

/** New App
 * 
 */
window.App = new App();