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

/** Class for manage logo
 *
 */
class IconAction extends ControllerBase implements ControllerInterface{

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set name
        $this->name="Icon";

        # Model action
        $this->modelAction();

    }

    /** Model action
     * 
     */
    private function modelAction(){

        # New model
        $this->newModel();

        # Get logo name
        $mediaName = $this->parameters['media_name'];

        try{

            # Search file in "/resources/png/logo/"
            $this->model->getFile($mediaName, __ROOT_APP__."resources/", ["jpg", "png"], true);

        }catch(Exception $e){

            # Message html
            $e->getHtml();

        }

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }
}