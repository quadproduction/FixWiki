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
namespace App;

/** Dependances
 * 
 */
use Google\Client;
use Google\Service\Drive;

/** Class for manage Google client
 * 
 */
class Google{

    # Client
    private $client;
    private $pathJson = "resources/json/code_secret_client_847121260194-s5i8sg36rph7od7gs7l38kol22lhh7e8.apps.googleusercontent.com.json";
    private $pathTokken = "resources/json/tokken.json";

    /** Constructor
     *  
     */
    public function __construct(){

        # Prepare Client
        $this->prepareClient();

        # Check tokken
        $this->checkTokken();

        # Return client
        return $this->client;

    }

    /** Prepare client
     * 
     */
    private function prepareClient(){

        # New client
        $this->client = new Client();
        $this->client->setApplicationName('Fixstudio Wiki');
        $this->client->setScopes(Drive::DRIVE_READONLY);
        $this->client->setAuthConfig(__ROOT_APP__.$this->pathJson);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

    }

    private function checkTokken(){

        # Set redirect
        $redirect_uri = $_SERVER['REQUEST_SCHEME'].'://'. $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

        # Check if code as get content
        if(isset($_GET['code'])){

            # Push in client
            $this->client->setRedirectUri($redirect_uri);
        
            # Exchange authorization code for an access token.
            $accessToken = $this->client->fetchAccessTokenWithAuthCode($_GET['code']);

            # Check not NULL
            if($accessToken !== null)
                $this->client->setAccessToken($accessToken);

            // Save the token to a file.
            if (!file_exists(dirname($this->pathTokken))) {
                mkdir(dirname($this->pathTokken), 0700, true);
            }

            file_put_contents($this->pathTokken, json_encode($this->client->getAccessToken()));

        }else if (file_exists($this->pathTokken)){

            $accessToken = json_decode(file_get_contents($this->pathTokken), true);

            // Check not NULL
            if($accessToken !== null)
                $this->client->setAccessToken($accessToken);

        }

        // If there is no previous token or it's expired.
        if ($this->client->isAccessTokenExpired()) {

            // Refresh the token if possible, else fetch a new one.
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            } else {

                # Set redirect uri
                $this->client->setRedirectUri($redirect_uri);

                # Create Auth url
                $authUrl = $this->client->createAuthUrl();

                # Go to connection page
                header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));

            }

            # Check if file of tokken exists
            if (!file_exists(dirname($this->pathTokken))) {
                mkdir(dirname($this->pathTokken), 0700, true);
            }

            # Put content in path tokken file
            file_put_contents($this->pathTokken, json_encode($this->client->getAccessToken()));
        }

        # Redirect to page
        if(isset($_GET['code'])){

            # Set redirect uri
            $this->client->setRedirectUri($redirect_uri);

            # Redirect to current page
            header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));

        }

    }

}