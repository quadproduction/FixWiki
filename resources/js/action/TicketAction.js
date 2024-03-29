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
import Swal from 'sweetalert2';
import showdown from "showdown"
import tippy from "tippy.js";
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

        // Type Init
        this.typeInit();

        // Overlay Init
        this.overlayInit();

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

            // Set template
            this.setTemplate("issue");

            // Add event for text changing
            this.editorInstance.on(
                'text-change', 
                () => {

                    let current = this.editorInstance.getText().replaceAll(/[\n\r]/g,' ').replaceAll(/\s\s+/g, " ").trim();

                    // let templates
                    let templates = [];

                    // Get all template
                    let templatesEls = document.querySelectorAll("template");

                    // Check template
                    if(templatesEls.length)

                        // Iteration of templates
                        for(let template of templatesEls)

                            // Push text in templates
                            templates.push(template.content.textContent.replaceAll(/[\n\r]/g,' ').replaceAll(/\s\s+/g, " ").trim());

                    // Check if current is template
                    if(!templates.includes(current)){        
                        
                        // Get type input
                        let el = document.querySelector(`input[name="type"]`);
                
                        // Check el
                        if(el === null)
                
                            // Stop function
                            return;

                        // Check editor has changed
                        if(!("already-modified" in el.classList.keys())){

                            // Set parameter
                            el.classList.add("already-modified")


                        }

                    }

                }

            );
              
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

                // Get submit tool
                let submitEl = form.querySelector("button[type=\"submit\"]");

                // Check submit El
                if(submitEl !== null){

                    // Disable it
                    submitEl.disabled = true;

                    // Remove gradient
                    submitEl.classList.remove("gradient-45deg-red-pink");

                    // Add grey
                    submitEl.classList.add("grey");

                }

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
                    var markdownText = htmlText;//.makeMarkdown(htmlText);

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

                    // Get submit tool
                    let submitEl = form.querySelector("button[type=\"submit\"]");

                        // Check submit El
                        if(submitEl !== null){

                            // Disable it
                            submitEl.disabled = false;

                            // Remove grey
                            submitEl.classList.remove("grey");

                            // Add gradient
                            submitEl.classList.add("gradient-45deg-red-pink");

                        }

                    // Toast
                    M.toast({
                        html: '⚠️ Someting went wrong...',
                        classes: 'red white-text'
                    })

                })
                .then(response => {

                    // Get submit tool
                    let submitEl = form.querySelector("button[type=\"submit\"]");

                        // Check submit El
                        if(submitEl !== null){

                            // Disable it
                            submitEl.disabled = false;

                            // Remove grey
                            submitEl.classList.remove("grey");

                            // Add gradient
                            submitEl.classList.add("gradient-45deg-red-pink");

                        }

                    // Check error
                    if("errors" in response && response.errors.length)

                        // Iteration errors
                        for(let error of response.errors)

                            // Toast
                            M.toast({
                                html: `⚠️ ${error.detail ?? "Someting went wrong..."}`,
                                classes: 'red white-text'
                            })

                    else

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

    /** Set Template
     * 
     */
    setTemplate = (name = "") => {

        // Check name
        if(!name)

            // New error
            throw new Error(`Template name given is empty...`);

        // Get template given
        let template = document.getElementById(`template-${name}`);

        // Check template exists
        if(template === null)

            // New error
            throw new Error(`Template for "${name}" doesn't exist...`);

        // Clone template
        let cloneTemplate = template.content.cloneNode(true);

        // Search all pre tag
        let preEls = cloneTemplate.querySelectorAll("pre");

        // Check tag pre
        if(preEls.length)

            // Iteration of tags
            for(let preEl of preEls)

                // Set class
                preEl.classList.add("ql-syntax");

        console.log(cloneTemplate);

        // Set template
        this.editorInstance.root.replaceChildren(cloneTemplate);

        // Get type input
        let el = document.querySelector(`input[name="type"]`);

        // Check el
        if(el === null)

            // Stop function
            return;

        // Check editor has changed
        if(el.className.includes("already-modified"))

            // Remove class
            el.classList.remove("already-modified");

    }

    /** Type init
     * 
     */
    typeInit = () => {

        // Get type input
        let el = document.querySelector(`input[name="type"]`);

        // Check el
        if(el === null)

            // Stop function
            return;

        // Catch when update
        el.addEventListener(
            "change",
            e => {

                // Get value
                let value = e.target.checked;

                // Check editor has changed
                if(e.target.className.includes("already-modified")){

                    // Warning
                    Swal.fire({
                        title: 'Do you want replace the text you already wrote ?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes !',
                        cancelButtonText: 'No...',
                        reverseButtons: true
                    }).then((result) => {

                        // Check result
                        if(result.isConfirmed){

                            // Update content
                            this.setTemplate(value ? "new_feature" : "issue");

                        }

                    })

                }else

                    // Update content
                    this.setTemplate(value ? "new_feature" : "issue");

                // Update value of title
                let titleEl = document.querySelector("input#title");

                // Check title
                if(titleEl !== null)

                    // Replace value
                    titleEl.value = value ?
                        titleEl.value.replaceAll("Bug", "New feature") :
                            titleEl.value.replaceAll("New feature", "Bug");


            }
        );

    }

    /**
     * Overlay init
     * 
     * Exemple display github warning whenopenpype is selected
     */
    overlayInit = () => {

        // Get form
        let elForm = document.getElementById("ticket-form");

        // Test
        elForm.addEventListener('change', e => {

            // Check if select
            if(
                "target" in e &&
                "nodeName" in e.target &&
                e.target.nodeName === "SELECT"
            ){

                // Get selected options
                let selectedOptions = e.target.selectedOptions;

                // Check selectedOptions
                if(selectedOptions.length)

                    // Iteration selectedOptions
                    for(let selectedOption of selectedOptions){

                        // Check redirect
                        if(
                            "dataset" in selectedOption &&
                            "redirection" in selectedOption.dataset && 
                            !(
                                ["false", "disabled"].includes(selectedOption.dataset.redirection)
                            )
                        ){

                            // Alert
                            Swal.fire({
                                title: 'Warning',
                                icon: 'warning',
                                html:
                                    selectedOption.dataset.redirectionDescription +
                                    '<div class="mt-4 mb-6"> ' +
                                        `<a id="ticket-alert-message" class="btn-floating btn-large waves-effect waves-light pulse" style="background:${selectedOption.dataset.redirectionIconColor};" href="${selectedOption.dataset.redirectionUrl}" data-tippy-content="Click here to open the external url.">` +
                                            `<i class="${selectedOption.dataset.redirectionIconClass}">` +
                                                selectedOption.dataset.redirectionIconText +
                                            '</i>' +
                                        '</a>' +
                                    '</div>',
                                showCloseButton: true,
                                showCancelButton: false,
                                showConfirmButton: false,
                                didRender: e => {
                                    
                                    // Get element
                                    let alertEl = e.querySelector("#ticket-alert-message");

                                    // Check alert el
                                    if(alertEl !== null)

                                        // Tippy warning
                                        tippy(alertEl, {
                                            placement: "bottom"
                                        });

                                }
                            });

                        }

                    }

            }

        });

    }

}