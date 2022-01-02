<?php declare(strict_types=1);
/*******************************************************
 * Copyright (C) 2019-2021 Kévin Zarshenas
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

        # Model action
        $this->modelAction();

    }

    /** Model action
     * 
     */
    private function modelAction(){

        # New model
        $this->newModel();

        # New google client
        ;

        # New google drive
        $this->google_drive = new GoogleDrive();

        # Get all data
        $this->google_drive->getAllFileFromSharedDrive();

        # Set Root
        $root = "/drive/".implode("/", $this->parameters)."/";

        try{
        
            # Get value from directory
            $result = $this->google_drive->getDirectory($root);

        }catch(Exception $e){

            $e->getHtml();

        }

        # Set current file in google drive
        $this->google_drive->setCurrentfile($result['file']);

        # Get content of file
        $this->google_drive->getContentFile();

        # Load app config
        $this->model
            ->loadConfig('app')
            ->setFrameworkExtra()
            ->pushDataInUserInterface($this->google_drive->getData())
        ;

        //\LuckyPHP\Front\Console::log($this->model->execute());

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }

}