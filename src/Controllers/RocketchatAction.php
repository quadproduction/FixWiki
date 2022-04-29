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

/** Hide errors
 * 
 */
ini_set('display_errors', 1);

/** Dependances
 *
 */
use LuckyPHP\Interface\Controller as ControllerInterface;
use LuckyPHP\Base\Controller as ControllerBase;
use ATDev\RocketChat\Chat as Chat;
use ATDev\RocketChat\Users\User;
use LuckyPHP\Server\Config;
use LuckyPHP\File\Json;

/** Class for manage the workflow of the app
 *
 */
class RocketchatAction extends ControllerBase implements ControllerInterface{

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # New model
        $this->newModel();

        # Push records
        $this->pushRecords();

        # Set name
        $this->name="RocketchatAction";

    }

    /** Records
     * 
     */
    public function pushRecords(){

        # Check Get
        if(!empty($_GET));

        # Set records
        $records = [];

        # Set config
        $config = Config::read('app');

        # Connection
        Chat::setUrl($config['app']['rocketchat']['url']);
        Chat::login($config['app']['rocketchat']['login'], $config['app']['rocketchat']['password']);


        # Iteration des get
        foreach($_GET as $user => $empty){

            # Avoid root
            if(substr(trim($user), 0, 1) !== "@")
                continue;

            # Clean user
            $cleanUser = ltrim($user, "@");

            # Search user
            $result = new User($cleanUser);

            # Check user
            if(!$result || !$result->info() || !is_object($result) )

                # Contineu iteration
                continue;

            # Clean result
            $cleanResult = array_filter(json_decode(json_encode($result->info()), true));

            # Push user
            $records[] = $cleanResult;

        }

        # Push records
        $this->model->pushRecords($records);

        # Set model data in data
        $this->setData($this->model->execute());

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }
}
