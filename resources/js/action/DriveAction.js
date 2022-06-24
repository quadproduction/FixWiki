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

        // Init Anchor
        this.anchorInit();

        // Init pre Code
        this.preCodeInit();

        // Init Media
        this.mediaInit();

        // Init Movie
        this.movieInit();

        // Init Iframe
        // Fix #24
        this.iframeInit();

        // Init Rocket Chat
        this.rocketChatInit();

        // Check box init
        this.checkBoxInit();

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
                    Url.update(
                        result,
                        this._updateScrollSpy
                    );
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

        // check if not in Iframe
        if(window.frameElement)
            return;

        // Create temp value
        let temp = null;

        // Check scrollspy already exists
        let scrollspys = container.querySelectorAll('#scrollspy');

        // Check scollspy
        if(scrollspys.length)

            // Iteration des scrollspy
            for(let scrollspy of scrollspys)

                // Remove current item
                scrollspy.remove();

        /* Generate scollspy */
        let main = document.createElement('div');
        main.setAttribute('id', 'scrollspy');
        main.classList.add("card");
            let list = document.createElement('ul');
            list.classList.add('table-of-contents');
            for(let el of titles){
                let item = document.createElement('li');
                    /* Anchor */
                    let anchor = document.createElement('a');
                    let title = el.innerText;
                    anchor.setAttribute('href', "#"+Strings.clean(title));
                    anchor.setAttribute('data-text', title);
                    anchor.classList.add('scrollspy-body');
                        /* Icon */
                        let iconA = document.createElement('a');
                        iconA.classList.add("scrollspy-icon", "btn-floating", "btn-flat", "waves-effect");
                            let icon = document.createElement('i');
                            icon.classList.add("material-icons");
                            if(el.tagName == "H1")
                                icon.innerText = "book";
                            else if(el.tagName == "H2")
                                icon.innerText = "tag";
                        iconA.appendChild(icon);
                        /* Text */
                        let text = document.createElement('span');
                        text.setAttribute('data-text', title);
                        text.innerText = title;
                    anchor.appendChild(iconA);
                    anchor.appendChild(text);
                    /* Option */
                    let option = document.createElement('a');
                    option.classList.add("scrollspy-option", "btn-floating", "btn-flat", "waves-effect");
                        /* Icon option */
                        let iconOption = document.createElement('i');
                        iconOption.classList.add("material-icons");
                        iconOption.innerText = "code";
                    option.appendChild(iconOption);
                item.appendChild(anchor);
                item.appendChild(option);
            list.appendChild(item);
            }
        main.appendChild(list);
        container.appendChild(main);

        /* Prevent default scroll to href */
        let el = container.querySelectorAll("#scrollspy li > a");
        if(el.length)
            for(let item of el)
                item.addEventListener(
                    'click',
                    e => {
                        if(item.href){
                            Url.update(
                                item.href,
                                this._updateScrollSpy
                            );
                        }
                    }
                );

        /* Offset of scrollspy */
        let elBis = container.querySelector("#scrollspy");
        if(elBis !== null){
            // Get width
            var widthLarge = elBis.offsetWidth + 20;
            var widthSmall = 47 + 13 + 22 ;
            var currentTransform = 20;
            // New Transform
            var newTransform = -1 * ( widthLarge - widthSmall );
            // Set new right
            elBis.style.right = newTransform;


        }
              
        /* Tippy */
        let scrollspyOptionEl = container.querySelectorAll(".scrollspy-option");
        if(scrollspyOptionEl.length)
        for(let el of scrollspyOptionEl){

            /* Tippy on titles */
            tippy(el, {
                content: "Intégrer l'article dans un tuto",
                placement: 'top',
            });

            // Copy action
            Copy.run({
                el: el,
                callback: () => {

                    let result = "";
                    
                    /* Get pre */
                    let href = el.parentElement.children[0].href ?? null;

                    /* Check href */
                    if(href === null){

                        // Warning
                        M.toast({html:'Problème lors de la copie... contacter @kzarshenas'})

                        // Stop function
                        return;

                    }

                    // Set href
                    let fragment = Url.extractFragment(href);

                    // Ger url
                    let url = new URL(href);

                    // Update result
                    result = url.host + url.pathname + "?extract=" + fragment.replace("#", "") + "&clean";

                    // Return result
                    return result;

                }
            });

        }

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

        // Update scroll spy
        this._updateScrollSpy();

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
        let iframes = container.querySelectorAll(".markdown iframe.extract");

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
    rocketChatInit = (callback = null) => {

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

                // Iframe Script Tigger (fix iframe autosize issue)
                let iframeScriptTigger = false;

                // Check records
                if(data.records.length)

                        // Iteration des el
                        for(let el of targetEls)

                            // Iteration des records
                            for(let record of data.records){

                                // Set username
                                let arobaseUsername = "@"+record.username;

                                // Replace
                                el.innerHTML = el.innerHTML.replaceAll(
                                    arobaseUsername, 
                                    "<a class=\"rocketchat-"+record.username+"\">"+arobaseUsername+"</a>"
                                );

                                // New tippy instance
                                tippy(
                                    ".rocketchat-"+record.username,
                                    {
                                        content: "<span><span>"+record.name+"</span> | <a href=\"https://chat.fixstudio.com/direct/"+record.username+"\" target=\"_blank\"><i class=\"fa-brands fa-rocketchat\" style=\"font-size:14;\"></i></a></span>",
                                        allowHTML: true,
                                        placement: "bottom",
                                        delay: 150,
                                        interactive: true,
                                    }
                                );

                                // Check iframe (fix)
                                if(el.getElementsByTagName('iframe') !== null)

                                    // Switch iframeScriptTigger
                                    iframeScriptTigger = true;

                            }

                // Check iframeScriptTigger
                if(iframeScriptTigger){

                    // Init component
                    this.componentInit();
            
                    // Init Anchor
                    this.anchorInit();
            
                    // Init pre Code
                    this.preCodeInit();
            
                    // Init Media
                    this.mediaInit();
            
                    // Init Movie
                    this.movieInit();
            
                    // Init Iframe
                    // Fix #24
                    this.iframeInit();

                    // Checkbox init
                    this.checkBoxInit();
            
                }

            }
        ).catch(
            error => console.error(error)
        );

    }

    /** Update scrollspy
     * 
     */
    _updateScrollSpy(url = window.location) {

        // Get scrollspy
        let scrollspyEl = document.getElementById("scrollspy");

        // Check url and scrollspy
        if(!url || scrollspyEl === null)

            // Stop function
            return;

        // Extract #content of url 
        let fragment = Url.extractFragment(url);

        // Get scrollspyBodyEl
        let scrollspyBodyEl = scrollspyEl.querySelectorAll(".scrollspy-body");

        // Check scrollspyBodyEl
        if(scrollspyBodyEl.length)

            // Iteration des scrollspyBodyEl
            for(let el of scrollspyBodyEl){

                // Get fragement of href
                let currentFragment = Url.extractFragment(el.href);

                // Get scrollspy icon
                let scrollspyIconEl = el.querySelector(".scrollspy-icon");

                // Check el
                if(scrollspyIconEl === null)
                    contine;

                // Check if equal
                if(fragment == currentFragment){

                    scrollspyIconEl.classList.add('active');

                }else{

                    scrollspyIconEl.classList.remove('active');

                }

            }


    }

    /** Check box init
     * 
     */
    checkBoxInit = () => {

        // Set container
        let container = document.querySelector('.markdown');

        // Check container
        if(container === null)

            // Stop function
            return;

        // Get all checkbox material-icons
        let checkboxes = container.querySelectorAll("i.checkbox.material-icons");

        // Delcare event
         function event(e) {

            // Check innert text
            if(e.target.innerText == "check_box_outline_blank")

                // Update innert text
                e.target.innerText = "check_box";

            else if(e.target.innerText == "check_box")

                // Update innert text
                e.target.innerText = "check_box_outline_blank";

        }

        // Check checkboxes
        if(checkboxes.length)

            // Iteration des checkboxes
            for(let checkbox of checkboxes)

                // attach event to checkbox
                checkbox.addEventListener(
                    "click",
                    event
                );

    }

}
