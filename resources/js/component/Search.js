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
import Handlebars from "handlebars/dist/handlebars.min.js";

/** Page functions
 * 
 */
export default class Search{

    // Dom list
    dom = {
        contentOverlay: {
            query: ".content-overlay",
            el: null
        },
    };

    /** Constructor
     * 
     */
    constructor(){

        // Generate content overlay
        this.contentOverlayInit();

        // Legacy function
        this.legacy();

        // Hook for search
        //this.hookSearch();

    }

    /** Init content overlay
     * 
     */
    contentOverlayInit = () => {

        // Get content overlay
        let el = document.querySelector(this.dom.contentOverlay.query);

        // Check if el
        if(el !== null)

            // Set el
            this.dom.contentOverlay.el = el;

        // Create el
        else{

            // prepare
            let main = document.createElement("div");
            main.classList.add('content-overlay');

            // Push el in body
            document.body.appendChild(main);

            // Set main as el
            this.dom.contentOverlay.el = main;

        }

    }

    /** Hook search
     * @source https://attacomsian.com/blog/javascript-detect-user-stops-typing
     */
    hookSearch = () => {
        
        // Listen for `keyup` event
        const input = document.querySelector('header #search');

        // check input
        if(input === null)
            return;

        let timer;              // Timer identifier
        const waitTime = 500;   // Wait time in milliseconds 
        
        // Search function
        const search = (text) => {

            // check text
            text = text.trim();

            // check text
            if(!text)
                return;
            
            console.log(text);

        };

        input.addEventListener('keyup', (e) => {
            const text = e.currentTarget.value;
        
            // Clear timer
            clearTimeout(timer);
        
            // Wait for X ms and then process the request
            timer = setTimeout(() => {
                search(text);
            }, waitTime);
        });

    }

    /** Legacy function
     * 
     */
    legacy = () => {

        var searchListLi = $(".search-list li"),
        searchList = $(".search-list"),
        searchSm = $(".search-sm"),
        searchBoxSm = $(".search-input-sm .search-box-sm"),
        searchListSm = $(".search-list-sm"),
        contentOverlay = $(".content-overlay");

        $(function () {
        "use strict";

        // On search input focus, Add search focus class
        $(".header-search-input")
            .focus(function () {
                $(this)
                    .parent("div")
                    .addClass("header-search-wrapper-focus");
            })
            .blur(function () {
                $(this)
                    .parent("div")
                    .removeClass("header-search-wrapper-focus");
            });

        //Search box form small screen
        $(".search-button").click(function (e) {
            if (searchSm.is(":hidden")) {
                searchSm.show();
                searchBoxSm.focus();
            } else {
                searchSm.hide();
                searchBoxSm.val("");
            }
        });
        // search input get focus
        $('.search-input-sm').on('click', function () {
            searchBoxSm.focus();
        });

        $(".search-sm-close").click(function (e) {
            searchSm.hide();
            searchBoxSm.val("");
        });

        // Search scrollbar
        if ($(".search-list").length > 0) {
            var ps_search_nav = new PerfectScrollbar(".search-list", {
                wheelSpeed: 2,
                wheelPropagation: false,
                minScrollbarLength: 20
            });
        }
        if (searchListSm.length > 0) {
            var ps_search2_nav = new PerfectScrollbar(".search-list-sm", {
                wheelSpeed: 2,
                wheelPropagation: false,
                minScrollbarLength: 20
            });
        }

        // Quick search
        //-------------
        var $filename = $(".header-search-wrapper .header-search-input,.search-input-sm .search-box-sm").data("search");

        // Navigation Search area Close
        $(".search-sm-close").on("click", function () {
            searchBoxSm.val("");
            searchBoxSm.blur();
            searchListLi.remove();
            searchList.addClass("display-none");
            if (contentOverlay.hasClass("show")) {
                contentOverlay.removeClass("show");
            }
        });

        // Navigation Search area Close on click of content overlay
        contentOverlay.on("click", function () {
            searchListLi.remove();
            contentOverlay.removeClass("show");
            searchSm.hide();
            searchBoxSm.val("");
            searchList.addClass("display-none");
            $(".search-input-sm .search-box-sm, .header-search-input").val("");

            // Get icon
            let searchEl = document.querySelector('header .navbar .header-search-wrapper i.material-icons');

            // Check search
            if(searchEl !== null){

                // Update class
                searchEl.classList.remove('rotate-infinite');

                // Change icon
                searchEl.innerText = "search";

            }

        });

        // Search filter
        var timer;
        $(".header-search-wrapper .header-search-input, .search-input-sm .search-box-sm").on("keyup", function (e) {

            timer && clearTimeout(timer);
            
            timer = setTimeout(
                () => {

                contentOverlay.addClass("show");
                searchList.removeClass("display-none");
                var $this = $(this);
                if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
                    if (e.keyCode == 27) {
                        contentOverlay.removeClass("show");
                        $this.val("");
                        $this.blur();
                    }
                    // Define variables
                    var value = $(this)
                        .val()
                        .trim()
                        .toLowerCase(), //get values of inout on keyup
                        liList = $("ul.search-list li"); // get all the list items of the search
                    liList.remove();
                    // If input value is blank
                    if (value != "") {

                        // Get icon
                        let searchEl = document.querySelector('header .navbar .header-search-wrapper i.material-icons');

                        // Check search
                        if(searchEl !== null){

                            // Change icon
                            searchEl.innerText = "autorenew";

                            // Update class
                            searchEl.classList.add('rotate-infinite');

                        }
                        // getting json data from file for search results
                        
                        $.getJSON("/api/file/drive/search/" + value, data => {

                            // Get search-list
                            let searchListEls = document.querySelectorAll('.search-list.collection');

                            // Check searchListEl
                            if(!searchListEls.length){

                                // Check search
                                if(searchEl !== null){

                                    // Change icon
                                    searchEl.innerText = "search";

                                    // Update class
                                    searchEl.classList.remove('rotate-infinite');

                                }

                                return;

                            }

                            // Clean search list
                            searchListEls[0].innerHTML = "";

                            // check data
                            if(data.records.length && data._user_interface.list.template){

                                // Compile
                                var template = Handlebars.compile(data._user_interface.list.template);

                                // Push result of compilation
                                searchListEls[0].innerHTML = template(data);

                                // Searsh all data-drive-id
                                let targetsEls = searchListEls[0].querySelectorAll("a[data-drive-id]");

                                // Check targetEls
                                if(targetsEls.length)

                                    // Iteration
                                    for(let targetEl of targetsEls){

                                        // Get drive id
                                        let idTarget = targetEl.dataset.driveId;

                                        // check 
                                        if(!idTarget)
                                            continue;

                                        // Get source
                                        let sourceEl = document.querySelector("aside a[data-drive-id=\""+idTarget+"\"]");

                                        // Check source
                                        if(sourceEl !== null && sourceEl.dataset.driveId){

                                            // Set attributes
                                            targetEl.setAttribute("href", sourceEl.href);

                                        }


                                    }
                                
                            }

                            // Check search
                            if(searchEl !== null){

                                // Change icon
                                searchEl.innerText = "search";

                                // Update class
                                searchEl.classList.remove('rotate-infinite');

                            }

                        });
                        
                    } else {
                        // if search input blank, hide overlay
                        if (contentOverlay.hasClass("show")) {
                        contentOverlay.removeClass("show");
                        searchList.addClass("display-none");
                        }
                    }
                }
                // for large screen search list
                if ($(".header-search-wrapper .current_item").length) {
                    searchList.scrollTop(0);
                    searchList.scrollTop($('.search-list .current_item:first').offset().top - searchList.height());
                }
                // for small screen search list 
                if ($(".search-input-sm .current_item").length) {
                    searchListSm.scrollTop(0);
                    searchListSm.scrollTop($('.search-list-sm .current_item:first').offset().top - searchListSm.height());
                }

            }, 300);

        });

        // small screen search box form submit prevent
        $('#navbarForm').on('submit', function (e) {
            e.preventDefault();
        })
        // If we use up key(38) Down key (40) or Enter key(13)
        $(window).on("keydown", function (e) {
            var $current = $(".search-list li.current_item"),
                $next,
                $prev;
            if (e.keyCode === 40) {
                $next = $current.next();
                $current.removeClass("current_item");
                $current = $next.addClass("current_item");
            } else if (e.keyCode === 38) {
                $prev = $current.prev();
                $current.removeClass("current_item");
                $current = $prev.addClass("current_item");
            }
            if (e.keyCode === 13 && $(".search-list li.current_item").length > 0) {
                e.preventDefault();
            }
        });

        searchList.mouseenter(function () {


            if ($(".search-list").length > 0) {
                ps_search_nav.update();
            }
            if (searchListSm.length > 0) {
                ps_search2_nav.update();
            }
        });
        // Add class on hover of the list
        $(document).on("mouseenter", ".search-list li", function (e) {
            $(this)
                .siblings()
                .removeClass("current_item");
            $(this).addClass("current_item");
        });
        $(document).on("click", ".search-list li", function (e) {
            e.stopPropagation();
        });
        });

        //Collapse menu on below 994 screen
        $(window).on("resize", function () {
        // search result remove on screen resize
        if ($(window).width() < 992) {
            $(".header-search-input").val("");
            $(".header-search-input").closest(".search-list li").remove();
        }
        if ($(window).width() > 993) {
            searchSm.hide();
            searchBoxSm.val("");
            $(".search-input-sm .search-box-sm").val("");
        }
        });

    }

}