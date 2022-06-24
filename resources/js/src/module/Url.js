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

/** Module Dom
 * 
 */
export default class Url {

    /** Update url
     * 
     */
    static update = (location = "", callback = null) => {

        // Met à jour les paramètres dans l'URL
        if(location)
            history.pushState(null, null, location)

        // Check callback
        if(typeof callback == "function")

            // Execute callback
            callback(location);

    }

    /** Extract fragment
     * 
     */
    static extractFragment = (location = "") => {

        // Declare result
        let result = "";

        // Check location
        if(!location)
            return result;

        // Extract fragment from location
        result = new URL(location).hash.split("&").shift();

        // Return result
        return result;

    }

}