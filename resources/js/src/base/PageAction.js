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

/** Module Context
 * 
 */
export default class PageAction {

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

        /**
         *  Component defined by data-layout
         */

        // Iteration of layouts
        for(let layoutEl of this.structure.layouts){

            // Get data layout or component
            let dataLayout = layoutEl.dataset.layout;

            // Check data layout
            if(dataLayout){

                // Get component name
                let componentName = dataLayout.split('/').pop();

                // Check if componentName is in this.app.input.componentList
                if(this.app.input.componentList[componentName] !== undefined)

                    // Execute this component with dom in parameters
                    new this.app.input.componentList[componentName](layoutEl);

            }

        }

        /**
         *  Component defined by data-component
         */

        // Search standalone component
        let components = document.querySelectorAll('[data-component]');

        // Check length
        if(components.length)

            // Iteration components
            for(let componentEl of components){

                // Get component name
                let componentName = componentEl.dataset.component;

                // Check component name
                if(componentName && this.app.input.componentList[componentName] !== undefined)

                    // Execute this component with dom in parameters
                    new this.app.input.componentList[componentName](componentEl);

            }
    }

}