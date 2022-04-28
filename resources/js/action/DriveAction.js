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
import PageAction from "../src/base/PageAction";
import Iframe from "../src/utilities/Iframe";
import Strings from "../src/module/Strings";
import Arrays from "../src/module/Arrays";
import Copy from "./../src/module/Copy";
import Dom from "./../src/module/Dom";
import Url from "../src/module/Url";
import tippy from "tippy.js";
import Plyr from 'plyr';

/** Home action
 *  
 */
export default class DriveAction extends PageAction {

    /** Constructor
     * @param {object} app Object of the app
     */
    constructor(app = {}){

        /** PageAction
         * 
         */
        super();

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

        // Init Iframe
        // Fix #24
        this.iframeInit();

        // Init Anchor
        this.anchorInit();

        // Init pre Code
        this.preCodeInit();

        // Init Media
        this.mediaInit();

        // Init Movie
        this.movieInit();

        // Init Rocket Chat
        this.rocketChatInit();

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
                    anchor.classList.add("material-icons");
                    if(el.tagName == "H1")
                        anchor.innerText = "book";
                    else if(el.tagName == "H2")
                        anchor.innerText = "tag";
                item.appendChild(anchor);
            /* Tippy */
            tippy(item, {
                content: (el) => el.querySelector("a").dataset.text ?? "",
                placement: 'left',
                followCursor: true,
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
                        if(e.target.href)
                            Url.update(e.target.href);
                    }
                );

        /* Scrollspy */
        M.ScrollSpy.init(titles, {
            scrollOffset: 75
        });

        /* Tippy on titles */
        tippy(titles, {
            content: "Cliquez pour partager le lien",
            placement: 'bottom-start',
            delay: [800,0],
            arrow: false,  
            offset: [0, -1],
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
            caption: (el) => el.getAttribute('title') ?? el.getAttribute('alt') ?? "Média"
        });

        // New tippy
        tippy(imgs, {
            content: (el) => el.getAttribute('title') ?? el.getAttribute('alt') ?? "Média",
            placement: "right",
        });


    }

    /* Movie Init */
    movieInit = () => {

        // Get movie player
        let moviePlayerEl = document.getElementById('movie-player');

        // Get main el
        let mainEl = document.getElementById("main")

        // Check movie player
        if(moviePlayerEl === null || mainEl === null)
            return;

        // Create div
        let divEl = document.createElement('div');
        divEl.classList.add("movie-player-container", "blue-grey", "darken-4");
            // Div player container
            let div2El = document.createElement('div');
                div2El.classList.add('z-depth-1');
                // Append movie player El
                div2El.append(moviePlayerEl);
            divEl.append(div2El);

        // Push in main
        mainEl.append(divEl);

        // New player
        const player = new Plyr(moviePlayerEl);

        // Largeur auto
        let autoWidth = function (divEl, div2El, player) {

            /**
             * b = a x y / x;
             */

            // Get usefull values
            let x = player.elements.container.offsetWidth;

            let y = player.elements.container.offsetHeight;
            let b = divEl.offsetHeight;

            let c = divEl.offsetWidth;

            // Calcule a
            let a = b * x / y;

            if(a > c)
                a = c;

            // Update a
            div2El.style.width = a+"px";

        }

        // Auto width

        autoWidth(divEl, div2El, player);
        window.addEventListener('resize', () => {

            autoWidth(divEl, div2El, player);

        });
        player.on('ready', () => {

            autoWidth(divEl, div2El, player);

        });
        player.on('play', () => {

            autoWidth(divEl, div2El, player);

        });
        player.on('exitfullscreen', () => {

            autoWidth(divEl, div2El, player);

        });

    }

    /** Init Iframe
     * Fix #24
     */
    iframeInit = () => {

        // Set container
        let container = document.querySelector('.markdown');

        // Check markdown enable-anchors
        if(container === null)
            return;

        // Get all iframe extract
        let iframes = container.querySelectorAll("iframe.extract");

        // Check iframes
        if(iframes.length)

            Iframe.autoHeight(iframes);

    }

    /** Precode init
     * 
     */
    preCodeInit = () => {

        // Set container
        let container = document.querySelector('.markdown');

        // Check markdown enable-anchors
        if(container === null)
            return;

        /* Get els */
        //let preEls = container.querySelectorAll("pre:has(> code)")
        let preEls = container.querySelectorAll("pre")

        /* Check preEls */
        if(preEls.length)

            /* Iteration */
            for(let preEl of preEls){

                if(preEl.querySelector('code') === null)
                    continue;

                /* Create elements */
                let preCopyContainerEl = document.createElement('div');
                preCopyContainerEl.classList.add("pre-copy-container");

                    let preCopyItemEl = document.createElement('div');
                    preCopyItemEl.classList.add('pre-copy-item', 'waves-effect', 'waves-light');
                    preCopyItemEl.dataset.tippyContent = "Copier le contenu";

                        let preCopyItemIEl = document.createElement('i');
                        preCopyItemIEl.classList.add("material-icons");
                        preCopyItemIEl.innerText = "content_copy";

                    preCopyItemEl.append(preCopyItemIEl);

                preCopyContainerEl.append(preCopyItemEl);
                /* End Create elements */

                /* Push in preEls */
                preEl.append(preCopyContainerEl);

                /* Init tippy */
                let tippyEls = preEl.querySelectorAll('.pre-copy-item');

                /* Check tippy */
                if(tippyEls.length)

                    /* Iteration */
                    for(let tippyEl of tippyEls){

                        /* check data set content for tippy */
                        if(tippyEl.dataset.tippyContent)

                            /* Tippy init */
                            tippy(
                                tippyEl,
                                {
                                    placement: 'bottom',
                                }
                            );

                        // Copy action
                        Copy.run({
                            el: tippyEl,
                            callback: () => {
                                
                                /* Get pre */
                                let preEl = tippyEl.parentElement.parentElement;

                                /* Get code */
                                let codeEl = preEl.querySelector('code');

                                /* Return html */
                                return codeEl.innerHTML;

                            }
                        });

                    }

            }

    }

    /* RocketChatInit */
    rocketChatInit = () => {

        // Regex expression to catch word starting by at sign
        let regexExpression =  /^([\w\-]+)@|(?<=\s)\@\w+/g ;

        // chains of regex to analyse
        let regexChain = "";

        // Get markdown box
        let markdownEl = document.querySelector(".markdown");

        // Check markdown el
        if(markdownEl === null)
            return;

        //Get all p, blockquote elements
        let targetEls = markdownEl.querySelectorAll('p, blockquote, li');

        // check targetEls
        if(!targetEls.length)
            return;

        // Iteration des targetEls
        for(let el of targetEls)

            // Check text
            if(el.innerText)

                // Push text in regexChain
                regexChain += " "+el.innerText.trim();

        // Check chain
        if(!regexChain)
            return;

        // Regex execution
        let regexCollection = regexChain.match(regexExpression);

        // Check collection
        if(!regexCollection || !regexCollection.length)
            return;

        // Clean duplicate
        regexCollection = regexCollection.filter(function (value, index, array) { 
            return array.indexOf(value) === index;
        });
        
        let value = "";

        // Prepare value
        for(let item of regexCollection)

            // Add item to value
            value += (value ? "&" : "") + item;

        // Xhr
        fetch(
            "/api/rocketchat/?"+value,
            {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json',
                })
            }
        // Middleware
        ).then(
            response => response.json()
        // Controller
        ).then(
            data => {

                // Check records
                if(data.records.length)

                        // Iteration des el
                        for(let el of targetEls)

                            // Iteration des records
                            for(let record of data.records){

                                // Set username
                                let arobaseUsername = "@"+record.username;

                                // Get html
                                if(el.innerHTML.includes(arobaseUsername));

                                // Replace
                                el.innerHTML = el.innerHTML.replaceAll(
                                    arobaseUsername, 
                                    "<a class=\"rocketchat-"+record.username+"\" target=\"_blank\" href=\"https://chat.fixstudio.com/direct/"+record.username+"\">"+record.name+"</a>"
                                );

                            }
            
            }
        ).catch(
            error => console.error(error)
        );

    }

}
