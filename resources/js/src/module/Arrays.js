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

/** Module Popup
 * 
 */
export default class Arrays {

    /** Filter by key value
     * 
     */
    static filterArrayByKeyValue = (array = [], key, keyValue) => array.filter(
        (aEl) => aEl[key] == keyValue
    );

}
