<?php declare(strict_types=1);
/*******************************************************
 * Copyright (C) 2019-2021 Kévin Zarshenas
 * kevin.zarshenas@gmail.com
 * 
 * This file is part of Double Screen.
 * 
 * This code can not be copied and/or distributed without the express
 * permission of Kévin Zarshenas @kekefreedog
 *******************************************************/

/** fixStudioWiki
 * 
 */
namespace fixStudioWiki;

/** Additonnal vendor
 * 
 */

/** Page
 * 
 * List of function to generate HTML page
 */
class Google {

    /************************************************************************************************** 
     * Parameters
     * 
    **************************************************************************************************/

    // Service
    private $service = [
        'drive' => null,
    ];

    // Client
    private $client = null;

    // Data
    public $data = [];

    // Data temp
    private $dataTemp = [];

    /************************************************************************************************** 
     * Construct
     * 
    **************************************************************************************************/

    public function __construct(){

        // Get client
        $this->clientGet();

    }

    /************************************************************************************************** 
     * Mathods
     * 
    **************************************************************************************************/

    /** Get client
     * 
     */
    private function clientGet(){

        # Get client
        $this->client = new \Google_Client();
        $this->client->setApplicationName('Fix Studio Wiki');
        $this->client->setScopes(\Google_Service_Drive::DRIVE_METADATA_READONLY);
        $this->client->setAuthConfig('php/google/credentials.json');
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        # Load previously authorized token from a file, if it exists. The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
        $tokenPath = 'json/token/token-'.base64_encode($this->IpUserGet()).'.json';
        #$tokenPath = 'token.json';
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $this->client->setAccessToken($accessToken);
        }

        // If there is no previous token or it's expired.
        if ($this->client->isAccessTokenExpired()) {

            // Refresh the token if possible, else fetch a new one.
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            } else {

                // Your redirect URI can be any registered URI, but in this example
                // we redirect back to this same page


                $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . str_replace('index.php', '',$_SERVER['PHP_SELF']);
                $this->client->setRedirectUri($redirect_uri);

                $authUrl = $this->client->createAuthUrl();

                // Request authorization from the user.
                header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
    
                // Exchange authorization code for an access token.
                $accessToken = $this->client->fetchAccessTokenWithAuthCode($_GET['code']);

                $this->client->setAccessToken($accessToken);
    
                // Check to see if there was an error.
                if (array_key_exists('error', $accessToken)) {
                    throw new \Exception(join(', ', $accessToken));
                }
            }

            // Save the token to a file.
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }

            file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
        }

    }

    /** Get all file
     * 
     */
    public function navigationInit(){

        // Check service
        if($this->service['drive'] == null)

            // New google drive service
            $this->service['drive'] = new \Google_Service_Drive($this->client);

        // Print the names and IDs for up to 10 files.
        $optParams = array(
            'includeItemsFromAllDrives' => true,
            'fields'      => 'nextPageToken, files(id, name, mimeType, parents)',
            'supportsAllDrives'         => true,
            'driveId'                   => '0AKnhm_EZNuVfUk9PVA',
            'corpora'                   => 'drive',
            'q'                         => 'trashed=false',
        );

        // Get result
        $results = $this->service['drive']->files->listFiles($optParams);

        // Check result
        if(count($results->getFiles())){

            // Clear data temp
            $this->dataTemp = [];

            // Iteration des fichiers
            foreach($results->getFiles() as $file){

                // Push file in data temps
                $this->dataTemp[] = [
                    'id'        =>  $file['id'],
                    'name'      =>  $file->getName(),
                    'parent'    =>  $file['parents'][0],
                    'mimeType'  =>  $file->getMimeType(),
                ];

            }

        }

        # Push navigation in data
        $this->data['navigation'] = $this->unflattenArray($this->dataTemp);

        # Return data
        return $this->data['navigation'];

    }

    function unflattenArray($flatArray){

        $refs = array(); //for setting children without having to search the parents in the result tree.
            $result = array();
        
            //process all elements until nohting could be resolved.
            //then add remaining elements to the root one by one. 
            while(count($flatArray) > 0){
                for ($i=count($flatArray)-1; $i>=0; $i--){
                    if ($flatArray[$i]["parent"]==0){
                        //root element: set in result and ref!
                        $result[$flatArray[$i]["id"]] = $flatArray[$i]; 
                        $refs[$flatArray[$i]["id"]] = &$result[$flatArray[$i]["id"]];
                        unset($flatArray[$i]);
                $flatArray = array_values($flatArray);
                    }
        
                    else if ($flatArray[$i]["parent"] != 0){
                        //no root element. Push to the referenced parent, and add to references as well. 
                        if (array_key_exists($flatArray[$i]["parent"], $refs)){
                            //parent found
                            $o = $flatArray[$i];
                            $refs[$flatArray[$i]["id"]] = $o;
                $refs[$flatArray[$i]["parent"]]["children"][] = &$refs[$flatArray[$i]["id"]];
                            unset($flatArray[$i]);
                $flatArray = array_values($flatArray);
                        }
                    }
                }
        }
        return $result;

    }
    
    /** Filter array by key value
	 * 
	 */
	private function filterArrayByKeyValue($array, $key, $keyValue){
		return array_filter($array, function ($var) use ($keyValue, $key) {
			return ($var[$key] == $keyValue);
		});
	}

    /** Get ip of user
     * 
     * https://stackoverflow.com/questions/13646690/how-to-get-real-ip-from-visitor
     */
    private function IpUserGet(){

        // Get real visitor IP behind CloudFlare network
        if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
                  $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
                  $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
        }
        $client  = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote  = $_SERVER['REMOTE_ADDR'];
    
        if(filter_var($client, FILTER_VALIDATE_IP))
        {
            $ip = $client;
        }
        elseif(filter_var($forward, FILTER_VALIDATE_IP))
        {
            $ip = $forward;
        }
        else
        {
            $ip = $remote;
        }
        return $ip;

    }
  

    /************************************************************************************************** 
     * Constants
     * 
    **************************************************************************************************/

}