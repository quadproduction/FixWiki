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
export default class Context {

    /** Get 
     * Get name of the action from html tag (data-context-route-name)
     */
    getName = () => {

        // Set response
        let response = null;

        // Get html el
        let htmlEl = document.getElementsByTagName("html");

        // Check htmlEl
        if(htmlEl.length)

            // Iteration of html tags
            for(let html of htmlEl)

                // Check if sataset of html contains contextRouteName
                if(
                    html.dataset.contextRouteName !== undefined &&
                    html.dataset.contextRouteName
                )

                    // Set response
                    response = html.dataset.contextRouteName;

        // Return response
        return response;
    }

    /** getAction
     * Get action from action route
     * @param {string} name Name of the current page
     * @param {object} actionRoute List of action
     * @returns {object}
     */
    getAction = (name = "", actionRoute = {}) => {

        // Set result
        let result = class{constructor(){console.info("No action associate to this route for \""+name+"\"")}};

        // Check name and action route
        if(name && Object.keys(actionRoute).length)

            // Check if name in action route
            if(actionRoute[name] !== undefined)

                // Set result
                result = actionRoute[name];

        // Return result
        return result;

    }

}