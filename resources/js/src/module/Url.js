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

/** Module Dom
 * 
 */
export default class Url {

    /** Update url
     * 
     */
    static update = (location) => {

        // Met à jour les paramètres dans l'URL
        if(location)
            history.pushState(null, null, location)

    }

}