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

/** Home action
 *  
 */
export default class HomeAction {

    /** Constructor
     * @param {object} app Object of the app
     */
    constructor(app = {}){

        /** Set app
         * 
         */
        this.app = app;
        
        /** Page Init
         * - Execute when page is ready
         */
        document.addEventListener(
            "DOMContentLoaded", 
            this.pageInit
        );

        console.log("hello Home");

    }

    /** Init page
     * 
     */
    pageInit = () => {

        // Set structure
        this.structure = this.app.Dom.scan(this.app.config);

        // Init component
        this.componentInit();


    }

    /** Component Init
     * Execute component action depending of structure
     * 
     */
    componentInit = () => {

        // Check componentList and structure layouts
        if(
            !Object.keys(this.app.input.componentList).length ||
            !Object.keys(this.structure.layouts).length
        )
            return;

        // Iteration of layouts
        for(let layoutEl of this.structure.layouts){

            // Get data layout
            let dataLayout = layoutEl.dataset.layout;

            // Check data layout
            if(!dataLayout)
                continue;

            // Get component name
            let componentName = dataLayout.split('/').pop();

            // Check if componentName is in this.app.input.componentList
            if(this.app.input.componentList[componentName] !== undefined)

                // Execute this component with dom in parameters
                new this.app.input.componentList[componentName](layoutEl);

        }

    }

}
