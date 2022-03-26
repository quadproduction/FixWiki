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
namespace App;

/** Dependances
 * 
 */
use GuzzleHttp\Exception\BadResponseException;
use LuckyPHP\Server\Config;
use GuzzleHttp\Client;

/** Class for manage Shotgrid
 * 
 */
class Shotgrid{

    /**********************************************************************************
     * Methods
     */

    # Instance SG
    private $instances = [];

    # Curreent SG instance
    private $currentInstance = 0;

    /**********************************************************************************
     * Constructor
     */
    public function __construct(){

        # Read config
        $this->configRead();

        # Connect to the first shotgrid instance
        $this->connectTo();

    }

    /**********************************************************************************
     * Hooks
     */

    /** Connect to instance by name
     * @param string $name Name of the instance
     */
    public function connectTo(string $name = ""){

        # Iteration of instance
        if(!empty($this->instances) && $name)

            # Iteration des instances
            foreach($this->instances as $key => $instance)

                # Check name match
                if(strtolower($instance['name']) == strtolower(trim($name))){

                    # Set current instance
                    $this->currentInstance = $key;

                }

        # Get SG instance
        $instance = $this->instances[$this->currentInstance];

        # Prepare url of shotgun
        $url = $instance['host'].'/api/v1/auth/access_token';

        # Build content of query
        $content = http_build_query($instance['auth']);

        # Prepare options
        $options = [
            'http' => [
                'header'  => 
                    "Accept: application/json\r\n".
                    "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => $content,
            ]
        ];

        # Get data of request
        $reponse = file_get_contents(
            $url, 
            false, 
            stream_context_create($options)
        );

        # Push shotgun config in auth
        $this->instances[$this->currentInstance]['tokken'] = json_decode($reponse, true);

    }

    /** Get header
     * @return array|null
     */
    public function getHeader(string $flag = ""):array|null {

        # Tokken access
        $tokkenAccess = $this->instances[$this->currentInstance]['tokken']['access_token'] ?? null;

        # Declare result
        $result = null;

        # Check access_token
        if($tokkenAccess)

            if($flag == "search"):

                # Set result
                $result = [
                    'Content-Type'  => 'application/vnd+shotgun.api3_array+json',
                    'Accept'        =>  'application/json',
                    'Authorization' =>  "Bearer $tokkenAccess",
                ];
        
            else:

                # Set result
                $result = [
                    'Accept'    =>  'application/json',
                    'Authorization' => "Bearer $tokkenAccess",
                ];

            endif;

        # Return result
        return $result;

    }

    /** Read All Records
     * 
     */
    public function readOneRecord(
        string $entity = "",
        int $id = 0,
        array $body = [],
    ){

        # Set result
        $result = [];

        # Check entity & id
        if(!$entity && !$id)

            # Return result
            return $result;

        # New client
        $client = new Client();
        
        try {
            $response = $client->request(
                'GET',
                $this->instances[$this->currentInstance]['host'] ."/api/v1/entity/$entity/$id", 
                [
                    'headers' => $this->getHeader("search"),
                    'json' => $body,
                ]
            );

                # Set result
                $result = $response->getBody()->getContents();
        }
        catch (BadResponseException $e) {

            # Set result
            $result = $e->getMessage();

        }

        # Return result
        return $result;

    }

    /** Read All Records
     * 
     */
    public function readAllRecords(
        string $entity = "",
        array $body = [],
    ){

        # Set result
        $result = [];

        # Check entity
        if(!$entity)

            # Return result
            return $result;

        # New client
        $client = new Client();
        
        try {
            $response = $client->request(
                'POST',
                $this->instances[$this->currentInstance]['host'] ."/api/v1/entity/$entity/_search", 
                [
                    'headers' => $this->getHeader("search"),
                    'json' => $body,
                ]
            );

                # Set result
                $result = $response->getBody()->getContents();
        }
        catch (BadResponseException $e) {

            # Set result
            $result = $e->getMessage();

        }

        # Return result
        return $result;

    }

    public function test(){

        return $this->instances;

    }

    /** Read Record Relationship
     * 
     */
    public function readRecordRelationship(
        string $entity = "",
        int $id = 0,
        string $relationfield = "",
        array $body = [],
    ){

        # Set result
        $result = [];

        # Check entity & id & relationfield
        if(!$entity && !$id && !$relationfield)

            # Return result
            return $result;

        # New client
        $client = new Client();
        
        try {
            $response = $client->request(
                'GET',
                $this->instances[$this->currentInstance]['host'] ."/api/v1/entity/$entity/$id/relationships/$relationfield/", 
                [
                    'headers' => $this->getHeader(),
                    'json' => $body,
                ]
            );

                # Set result
                $result = $response->getBody()->getContents();
        }
        catch (BadResponseException $e) {

            # Set result
            $result = $e->getMessage();

        }

        # Return result
        return $result;

    }

    /**********************************************************************************
     * Methods
     */

    /** Read config
     * 
     */
    private function configRead(){

        # Get config
        $config = Config::read('app');

        # Check shotgrid is in config app
        if(isset($config['app']['shotgrid']) && !empty($config['app']['shotgrid']))

            # Iteration of config
            foreach($config['app']['shotgrid'] as $sg_instance)

                # Push data in instances
                $this->instances[] = $sg_instance;

    }


}