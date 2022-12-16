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
import showdown from "showdown"
import Quill from "quill";

/** Home action
 *  
 */
export default class TicketAction extends PageAction {

    /** @var editorInstance Quill editor instance */
    editorInstance = null;

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

        // From Init
        this.formInit();

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
            this.editorInstance = new Quill(
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

            /* Template */
            this.editorInstance.root.innerHTML = `<blockquote>From Kevin</blockquote><p><br></p><h2>Problem</h2><p><br></p><p>Python error</p><p><br></p><h2>How get error</h2><p><br></p><ul><li>Open Maya</li><li>Take note</li></ul><p><br></p><h2>Log</h2><p><br></p><pre class="ql-syntax" spellcheck="false">console.<span class="hljs-built_in">log</span>(<span class="hljs-string">"hello"</span>);</pre><p><br></p><h2>Ressources</h2>`;


        }

    }

    /** Forme Init
     * 
     */
    formInit = () => {

        // Get form
        let elForm = document.getElementById("ticket-form");

        // Check el
        if(elForm === null)

            // Return
            return;

        // Add event
        elForm.addEventListener(
            "submit",
            e => e.preventDefault()
        );

        // Style required for select
        $('select[required]').css({
            position: 'absolute',
            display: 'inline',
            height: 0,
            padding: 0,
            border: '1px solid rgba(255,255,255,0)',
            width: 0
        }); 	
        
        /* Set Default */
        $.validator.setDefaults({

            /* Submit handler */
            submitHandler: function(form) {

                // New Form Data
                var formData = new FormData(form);

                // Get editor el
                let elEditor = document.querySelector("#rich-text-editor .ql-editor");

                // Check editor
                if(elEditor !== null){

                    // Get Text
                    var htmlText = elEditor.innerHTML.replaceAll("<p><br></p>", "");

                    // New converter
                    var converter = new showdown.Converter();

                    // Get markdown and remove extra break lines
                    var markdownText = converter.makeMarkdown(htmlText);

                    // Push message in formdata
                    formData.append("message", markdownText);

                };
                
                // Request
                fetch('/ticket/send/', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .catch(error => {
                    console.error('Error:', error)

                    // Toast
                    M.toast({
                        html: '⚠️ Someting went wrong...',
                        classes: 'red white-text'
                    })

                })
                .then(response => {

                    console.log('Success:', JSON.stringify(response))

                    // Toast
                    M.toast({
                        html: '✅ Ticket sent !'
                    })

                    // Scroll on top
                    window.scrollTo({top: 0, behavior: 'smooth'});

                })

            }
        });

        // Validate configuration
        $(elForm).validate({
            rules: {
                email: {
                    required: true,
                    email: true
                },
                entity: {
                    required: true,
                },
                tool: {
                    required: false,
                },
            },
            //For custom messages
            messages: {
                email: {
                    required: "Enter your email adress",
                },
                entity: "Choose your entity",
            },
            errorElement: 'div',
            errorPlacement: function (error, element) {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            }
        });

    }

}