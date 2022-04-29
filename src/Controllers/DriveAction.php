<?php declare(strict_types=1);
/*******************************************************
 * Copyright (C) 2019-2022 Kévin Zarshenas
 * kevin.zarshenas@gmail.com
 *
 * This file is part of LuckyPHP.
 *
 * This code can not be copied and/or distributed without the express
 * permission of Kévin Zarshenas @kekefreedog
 *******************************************************/

/** Namespace
 *
 */
namespace App\Controllers;

/** Dependances
 *
 */
use LuckyPHP\Interface\Controller as ControllerInterface;
use LuckyPHP\Base\Controller as ControllerBase;
use LuckyPHP\Server\Exception;
use LuckyPHP\Front\Console;
use App\GoogleDrive;
use DOMDocument;
use LuckyPHP\Code\Strings;

/** Class for manage the workflow of the app
 *
 */
class DriveAction extends ControllerBase implements ControllerInterface{

    # Google Drive
    private $google_drive;

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set name
        $this->name="DriveAction";

        # Setup layouts
        $this->setupLayouts();

        # Model action
        $this->modelAction();

    }

    /** Setup layouts
     * 
     */
    private function setupLayouts(){

        # If clean in get value
        if(isset($_GET['clean'])){

            # Simple layout
            $layouts = [
                'structure/main',
            ];

            # Check if options is set
            if(isset($_GET['options'])){

                # Push options
                $layouts[] = 'structure/options';

            }

        }else{

            # Full layout
            $layouts = [
                'structure/head',
                'structure/sidenav',
                'structure/main',
            ];

        };

        # Set layouts
        $this->setLayouts($layouts);

    }

    /** Model action
     * 
     */
    private function modelAction(){

        # New model
        $this->newModel();

        # New google drive
        $this->google_drive = new GoogleDrive();

        # Get all data
        $this->google_drive->getAllFileFromSharedDrive(true);

        # Set Root
        $root = "/drive/".implode("/", $this->parameters)."/";

        try{
        
            # Get value from directory
            $result = $this->google_drive->getDirectory($root);

        }catch(Exception $e){

            $e->getHtml();

        }

        # Set current file in google drive
        $this->google_drive->setCurrentfileById($result['id'], false);

        try{

            # Get html content
            $htmlContent = $this->google_drive->getContentFile();

            # Get id
            $id = $this->google_drive->getCurrentId();

        }catch(Exception $e){

            # Message html
            $e->getHtml();

        }

        # Ig get have article
        if(isset($_GET['extract']) && $_GET['extract'])

            # Clean htmlContent
            $htmlContent = $this->extractHtmlContent($htmlContent);

        # Load app config
        $this->model
            ->loadConfig('app')
            ->setFrameworkExtra()
            ->pushDataInUserInterface(
                # Navigation
                $this->google_drive->getData() +
                # Main 
                [
                    "main"  =>  [
                        # Get content file of current
                        "<div class=\"col s12 markdown enable-anchors\">$htmlContent</div>"
                    ],
                    "header"=>  [
                        "navbar-list"   =>  [
                            "add"   =>  [
                                [
                                    "type"  =>  "nav-button-circle",
                                    "action"=>  "toggle-info",
                                    "data"  =>  [
                                        "url"   =>  "/api/file/drive/$id"
                                    ],
                                    "style" =>  [
                                        "icon"  =>  [
                                            "class" =>  "material-icons",
                                            "text"  =>  "info"
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            )
            ->pushCookies(true)
            ->pushContext()
        ;

        //\LuckyPHP\Front\Console::log($this->model->execute());

    }

    /** Get specific article of wiki
     * 
     */
    private function extractHtmlContent(string $content= ""):string{

        # Declare result
        $result = $content;

        #New DOMDocument
        $doc = new DOMDocument();

        # Get value of extract cleaned
        $extractGetValue = Strings::clean($_GET['extract']);

        # Load html
        $doc->loadHTML("<?xml encoding=\”utf-8\">$content");

        /* Prepare doc extract */

            # New doc
            $docExtract = new DOMDocument();

            # Load html
            $docExtract->loadHTML($content);

            # Get body
            $bodyExtract = $docExtract->getElementsByTagName("body")->item(0);

            # Delete all child nodes
            while($bodyExtract->childNodes->length > 0)

                # Delete child
                $bodyExtract->removeChild($bodyExtract->childNodes->item(0));

        /* End prepare doc extract */

        # ExtractStatus
        $extractStatus = false;

        # Get body
        $body = $doc->getElementsByTagName("body")->item(0);

        # check childNodes of body
        if($body->hasChildNodes())

            # Iteration dom elements
            foreach($body->childNodes as $node){

                # Set tagname
                $tagName = $node->tagName ?? null;

                # Check tag name
                if(!$tagName)
                    continue;

                # Check if h1 or h2
                if(in_array($tagName, ['h1','h2']))

                    # Check if node content is extract get value
                    if(Strings::clean($node->textContent) == $extractGetValue)

                        # Enable extra status
                        $extractStatus = $tagName;

                    # Check if it's the end of extraction
                    elseif($extractStatus == $tagName)

                        # Disable extra status 
                        $extractStatus = false;

                # Check extraction status
                if($extractStatus)

                    # Push nodes in doc result
                    $bodyExtract->appendChild($docExtract->importNode($node, true));

            }

        # Set result
        $result = $docExtract->saveHTML();

        # Return result
        return $result;

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }

}