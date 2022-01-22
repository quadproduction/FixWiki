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

/** Module Context
 * 
 */
export default class Action {

    // Default list
    _actionsDefault = {
        // Test
        test: (event, response) => console.log({event, response})
    };

    // Actions list
    _actionsList = {};

    // Options
    options = {};

    /** Constructor
     * @param {object} actions List of actions
     * @param {object} parameters Parameters
     */
    constructor(actions = {}, options = {}){

        // Set Parameters
        this._setParameters(options);

        // Ingest Actions
        this._ingestActions(actions);

        // Set default action
        this._setDefaultActions();

    }

    /****************************************************************
     * Methods
     */

    /** Set parameters in instance
     * @param {object} options 
     */
    _setParameters = options => {

        // Set options
        this.options = options;

    }

    /** Set parameters in instance
     * @param {object} options 
     */
     _ingestActions = actions => {

        // Iteration des actions
        for(let action of actions)

            // Push action in _actionsList
            this.push(action, actions[action], true);

    }

    /** Set default actions
     * 
     */
    _setDefaultActions = () => {

        // Check _actionsList
        for(let action in this._actionsDefault)

            // Check if action already exist
            if(this._actionsList[action] !== undefined)

                // Add action
                this._actionsList[action] = this._actionsDefault[action];

    }

    /****************************************************************
     * Access to Actions
     */

    /** Push
     * @param {string} name
     * @param {any} action
     * @param {boolean} overwrite
     */
    push = (name = "", action = null, overwrite = false) => {

        // Check name and action
        if(name && action)

            // Check if not exist or ovewrite is enable
            if(overwrite || this._actionsList[name] === undefined)

                // Set action in _actionsList
                this._actionsList[name] = action

    } 

    /** Reset
     * @param {object} actions
     */
    reset = (actions = {}) => {

        // Ingest Actions
        this._ingestActions(actions);

        // Set default action
        this._setDefaultActions();

    }

    /** Push
     * @param {string} name
     * @returns {null,function}
     */
    call = (name = "") => {
        
        // Check name and if defined
        if(name && this._actionsList[name])

            // Return callback
            return this._actionsList[name];

        // Else return null
        return null;

    } 

    /****************************************************************
     * Methods static
     */

    /** Scan response
     * 
     * @param {object} response 
     * @param {Action} action 
     * @param {callback,null} callback 
     */
    static scan = (response = {}, action, callback = null) => {

        // Set result
        let result = [];

        // Check _user_interface > actions
        if(response._user_interface.actions)

            // Iteration des actions
            for(let action in response._user_interface.actions)
                
                if(action.type){
        
                    // Call action depending of type
                    let call = action.call(action.type)
        
                    // Execute call
                    result.push({
                        callResult: call(response._user_interface.action,response),
                        callName: response._user_interface.action.type
                    });
        
                }

    }

    /****************************************************************
     * Action Predefined
     */

    /** Handlebarjs Action
     * @param {object} event 
     * @param {object} response 
     */
    static hbs = (event, response) => {
        
        console.log({message:'hbs', event, response});

    }

}