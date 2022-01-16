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
use LuckyPHP\Base\Controller as ControllerBase;
use LuckyPHP\Interface\Controller as ControllerInterface;

/** Class for manage the workflow of the app
 *
 */
class FileDriveAction extends ControllerBase implements ControllerInterface{

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set name
        $this->name="SidenavAction";

        # Prepare Cookie
        $this->action();

    }

    # Prepare Cookie
    private function action(){

        # Push data in model
        $this->pushData(['hello world']);


    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }
}