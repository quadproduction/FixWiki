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
import {Pdf} from "./Pdf";

/** Page functions
 * 
 */
export class App{

    /** Constructor
     * 
     */
    constructor(){

        /** Set modules of the app
         *  
         */
        this.Pdf = (o = {}) => { new Pdf(o); };

    }

}