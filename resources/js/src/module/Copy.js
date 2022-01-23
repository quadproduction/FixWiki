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
import ClipboardJS from "clipboard";

/** Page functions
 * 
 */
export default class Copy{

    /** Run copy
     * @param {object} input
     * @returns {void}
     */
    static run = (input) => {

        // Check input
        if(!input.el)
            return;

        // Let parameters
        let parameters = {};

        // Fill parameters
        // Container
        if(input.container)
            parameters.container = input.container;
        // Text
        if(input.callback)
            parameters.text = input.callback;

        // New instance
        var clipboard = new ClipboardJS(input.el, parameters);

        // Success
        clipboard.on(
            'success', 
            (e) => {
                M.toast({html: 'Copié'})
            }
        );

    }

}