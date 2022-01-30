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
import Strings from "../src/module/Strings";
import Arrays from "../src/module/Arrays";
import Copy from "./../src/module/Copy";
import Dom from "./../src/module/Dom";
import Url from "../src/module/Url";
import tippy from "tippy.js";

/** Home action
 *  
 */
export default class DriveAction {

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

    }

    /** Init page
     * 
     */
    pageInit = () => {

        // Set structure
        this.structure = this.app.Dom.scan(this.app.config);

        // Init component
        this.componentInit();

        // Init Anchor
        this.anchorInit();

        // Init Media
        this.mediaInit();


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

    /** Anchor Init
     * - Add anchor action
     * 
     */
    anchorList = [];
    anchorEvents = [];
    anchorInit = () => {

        // Set title in url
        let titleInUrl = false;

        // Set container
        let container = document.querySelector('.markdown.enable-anchors');

        // Check markdown enable-anchors
        if(container === null)
            return;

        // Get h1 & h2 el
        let titles = container.querySelectorAll("h1,h2");

        // Check titles
        if(!titles.length)
            return;

        // Iteration of titles
        for(let titleEl of titles){

            // Set current title
            let title = titleEl.innerText;

            // Check title
            if(!title)
                return;

            let original = title;

            // Clean title
            title = Strings.clean(title);

            // Set id in attributes of el
            titleEl.setAttribute('id', title);

            // Prepare value in anchorList
            let temp = {
                name: title,
                title: original,
                el: titleEl
            }

            // Push in anchorList
            this.anchorList.push(temp);

            // Copy action
            Copy.run({
                el: titleEl,
                callback: () => {
                    // Get current url
                    let url = window.location;
                    // Clean #
                    url = url.toString()
                    url = url.split("#")[0];
                    // Set result
                    let result = url+"#"+title;
                    // update url
                    Url.update(result);
                    // Return result
                    return result;
                }
            });

        }

        // Check if #
        let diese = window.location;
        diese = diese.toString();
        if(diese.includes("#")){

            // clean diese
            let temp = diese.split("#");
            temp = temp.pop();

            // Check if diese in anchorList
            let result = Arrays.filterArrayByKeyValue(this.anchorList, 'name', temp);

            // Check if empty result
            if(!result.length){

                // Get current url
                let url = window.location;

                // Clean #
                url = url.toString()
                url = url.split("#")[0];

                // Set result
                let urlClean = url;
                
                // update url
                Url.update(urlClean);

            }else{

                // Get first value
                result = result[0];

                // Get position to scroll to
                const yOffset = -70; 
                const y = result.el.getBoundingClientRect().top + window.pageYOffset + yOffset;

                // Scroll to el
                window.scrollTo({top: y, behavior: 'smooth'});

                // Set title in url
                titleInUrl = result.name;

            }

        }

        /* Generate scollspy */
        let main = document.createElement('div');
        main.setAttribute('id', 'scrollspy');
        main.classList.add("card");
            let list = document.createElement('ul');
            list.classList.add('table-of-contents');
            for(let el of titles){
                let item = document.createElement('li');
                    let anchor = document.createElement('a');
                    let title = el.innerText;
                    anchor.setAttribute('href', "#"+Strings.clean(title));
                    anchor.setAttribute('data-text', title);
                        let icon = document.createElement('i');
                        icon.classList.add("material-icons");
                        if(el.tagName == "H1"){
                            icon.innerText = "book";
                        }else if(el.tagName == "H2"){
                            icon.innerText = "tag";
                        }
                    anchor.appendChild(icon);
                item.appendChild(anchor);
            /* Tippy */
            tippy(item, {
                content: (el) => el.querySelector("a").dataset.text ?? "",
                placement: 'left',
            });
            list.appendChild(item);
            }
        main.appendChild(list);
        container.appendChild(main);

        /* Prevent default scroll to href */
        let el = container.querySelectorAll("#scrollspy li a");
        if(el.length)
            for(let item of el)
                item.addEventListener(
                    'click',
                    e => {
                        console.log(e);
                        if(e.target.parentNode.href)
                            Url.update(e.target.parentNode.href);
                    }
                );

        /* Scrollspy */
        M.ScrollSpy.init(titles, {
            scrollOffset: 75
        });

    }

    /** Media Init
     * 
     */
    mediaInit = () => {

        // Set container
        let container = document.querySelector('.markdown');

        // Check container
        if(container === null)
            return;

        // Get all img elements
        let imgs = container.querySelectorAll('img');

        // Check imgs length
        if(!imgs.length)
            return;

        // New Materialbox
        M.Materialbox.init(imgs, {
            caption: (el) => el.getAttribute('title') ?? ""
        });

        // New tippy
        tippy(imgs, {
            content: (el) => el.getAttribute('title') ?? "",
            placement: "right",
        });


    }

}
