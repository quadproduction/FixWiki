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
import Context from './module/Context';
import Template from './module/Template';

/** LuckyJS
 * 
 */
export default class LuckyJS {

    about = "This app is build with LuckyJs";

    /** Constructor
     * 
     * - Load all modules
     * - Set context > name
     * - Set action
     * - Set component
     * 
     */
    constructor(o = {}){

        // Set modules to LuckyJS
        this.Dom = new Dom();
        this.Http = new Http();
        this.Event = new Event();
        this.Popup = new Popup();
        this.Context = new Context();
        this.Template = new Template();

        // Ingest input object
        this.inputSet(o);

        // Set context
        this.contextSet();

        // Set action
        this.actionSet();

    }

    /** Ingest input
     * 
     */
    inputSet = (o = {}) => {

        // Set Result
        let result = {
            actionRoute: {},
            componentList: []
        };

        // Check o
        if(Object.keys(o).length)

            // Iteration of datas
            for(let input in o)

                // Set input in result
                result[input] = o[input];

        // Push result in input
        this.input = result;

    }

    /** Set Context 
     * 
     */
    contextSet = () => {

        // Set result
        let result = {
            name: this.Context.getName()
        };

        // Push result in context
        this.context = result;

    }

    /** Set Action
     * 
     */
    actionSet = () => {

        // Result
        let result = this.Context.getAction(this.context.name, this.input.actionRoute);

        // Push result in action
        this.action = result;

    }


}