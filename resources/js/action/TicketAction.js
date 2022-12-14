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
import "highlight.js/styles/github-dark.css";
import Quill from "quill";

/** Home action
 *  
 */
export default class TicketAction extends PageAction {

    /** @var editorInsance Quill editor instance */
    editorInsance = null;

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
        
        // Init main content
        this.mainInit();

    }

    /** MainInit 
     * 
     */
    mainInit = () => {

        // Set mainEl
        let mainEl = document.getElementById('main');

        // Check mainEl
        if(mainEl === null)
            return;

        // Quill init
        this.quillInit();

    }

    /** Quill Init
     * 
     */
    quillInit = () => {

        // Get editor el
        let elEditor = document.getElementById("rich-text-editor");

        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
          
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
          
            ['clean']                                         // remove formatting button
          ];

        // Check el
        if(elEditor !== null){

            // New highlight js
            hljs.configure({
                languages: ["c", "cpp", "docker", "php", "json", "mel", "yaml", "sql", "python", "markdown", "javascript", "css", "xml"]
            });

            // New quill instance
            this.editorInsance = new Quill(
                elEditor,
                {
                    modules: {
                        syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        },
                        toolbar: toolbarOptions,
                    },
                    theme: 'snow'
                }
            );

            this.editorInsance.root.innerHTML = `<blockquote>From Kevin</blockquote><p><br></p><h2>Problem</h2><p><br></p><p>Python error</p><p><br></p><h2>How get error</h2><p><br></p><ul><li>Open Maya</li><li>Take note</li></ul><p><br></p><h2>Log</h2><p><br></p><pre class="ql-syntax" spellcheck="false">console.<span class="hljs-built_in">log</span>(<span class="hljs-string">"hello"</span>);</pre><p><br></p><h2>Ressources</h2>`;


        }

    }

}