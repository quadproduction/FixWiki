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

/** Module Template
 * 
 */
export default class Iframe {

    /*******************************************
     * Methods
     */

    static autoHeight = list => {
    
        /* Check container */
        if(!list.length)
            return;

        /* Iteration des iframe */
        for(let iframe of list)

            /* Check iframe */
            if(iframe.nodeName == "IFRAME"){

                /* Event on loaded */
                iframe.addEventListener(
                    'load',
                    () => {

                        /* Set Iframe height */
                        Iframe._setIframeHeight(iframe);
                        
                    }
                );
            
            }

    }

    /*******************************************
     * Private Methods
     */

    /**
     * @source https://www.dyn-web.com/tutorials/iframes/height/
     * @param {*} doc 
     * @returns 
     */
    static _getDocHeight = doc => {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        return height;
    }

    /**
     * @source https://www.dyn-web.com/tutorials/iframes/height/
     * @param {*} ifrm
     */
    static _setIframeHeight = ifrm => {

        var doc = ifrm.contentDocument? ifrm.contentDocument: 
            ifrm.contentWindow.document;

        ifrm.style.visibility = 'hidden';
        ifrm.style.height = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.height = Iframe._getDocHeight( doc ) + 4 + "px";
        ifrm.style.visibility = 'visible';
    }

}