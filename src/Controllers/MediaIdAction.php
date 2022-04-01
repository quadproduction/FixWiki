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
use Symfony\Component\HttpFoundation\Response;
use LuckyPHP\Server\Exception;
use LuckyPHP\Front\Console;
use App\GoogleDrive;

/** Class for manage logo
 *
 */
class MediaIdAction extends ControllerBase implements ControllerInterface{

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set name
        $this->name="MediaId";

        # Model action
        $this->modelAction();

    }

    /** Model action
     * 
     */
    private function modelAction(){

        # Set id
        $id = $this->parameters['id'];

        # New google drive
        $this->google_drive = new GoogleDrive();

        # Set current file
        $this->google_drive->setCurrentfileById($id);

        # Set cache
        $cache = $this->google_drive->createCacheForCurrentFile($id);

        # New model
        $this->newModel();

        # Set file
        $this->model->getFile($cache['name'], $cache['path']);

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }

}