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
import Dom from './module/Dom';
import Http from './module/Http';
import Event from './module/Event';
import Popup from './module/Popup';
import Template from './module/Template';

/** LuckyJS
 * 
 */
export default class LuckyJS {

    /** Constructor
     * 
     * - Load all modules
     * 
     */
    constructor(){

        // Set modules to LuckyJS
        this.Dom = new Dom();
        this.Http = new Http();
        this.Event = new Event();
        this.Popup = new Popup();
        this.Template = new Template();

    }

}