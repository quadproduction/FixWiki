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
use App\GoogleDrive;

/** Class for manage the workflow of the app
 *
 */
class TutorialAction extends ControllerBase implements ControllerInterface{

    # Google Drive
    private $google_drive;

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set name
        $this->name="TutorialAction";

        # Setup layouts
        $this->setupLayouts();

        # Model action
        $this->modelAction();

    }

    /** Setup layouts
     * 
     */
    private function setupLayouts(){

        # Set layouts
        $this->setLayouts([
            'structure/head',
            'structure/sidenav',
            'page/tutorial',
        ]);

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
        $this->google_drive->getAllFileFromSharedDrive();

        # Load app config
        $this->model
            ->loadConfig('app')
            ->setFrameworkExtra()
            ->pushDataInUserInterface($this->google_drive->getData())
            ->pushCookies(true)
            ->pushContext()
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