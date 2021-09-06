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

    private $client = null;

    /************************************************************************************************** 
     * Construct
     * 
    **************************************************************************************************/

    public function __construct(){

        $this->clientInit();

        $this->getFilesAndFolders();

    }

    /************************************************************************************************** 
     * Mathods
     * 
    **************************************************************************************************/

    /** Client Init
     * 
     */
    private function clientInit(){

        /* $this->client = new \Google\Client();
        $this->client->setApplicationName("FIX-STUDIO-WIKI");
        $this->client->setDeveloperKey("AIzaSyCqXhPLFuxqCTm-Cm_IjfBwR07REA0_lA4");
        $this->client->setAuthConfig('json/fix-studio-wiki-9f4d7a01629a.json'); */

        $this->client = new \Google_Client();
        $this->client->setApplicationName('FIX-STUDIO-WIKI');
        $this->client->setScopes(\Google_Service_Drive::DRIVE_METADATA_READONLY);
        $this->client->setAuthConfig('json/client_secret_465549178856-nche96mvcvom9taaqp4pfadslg365j9c.apps.googleusercontent.com.json');
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
    


    }

    /** Get files and folders
     * 
     */
    private function getFilesAndFolders(){
        $service = new \Google\Service\Drive($this->client);
    
        $parameters['q'] = "mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false";
        $files = $service->files->listFiles($parameters);
        
/*         echo "<ul>";
        foreach( $files as $k => $file ){
            echo "<li> 
            
                {$file['name']} - {$file['id']} ---- ".$file['mimeType'];
    
                try {
                    // subfiles
                    $sub_files = $service->files->listFiles(array('q' => "'{$file['id']}' in parents"));
                    echo "<ul>";
                    foreach( $sub_files as $kk => $sub_file ) {
                        echo "<li&gt {$sub_file['name']} - {$sub_file['id']}  ---- ". $sub_file['mimeType'] ." </li>";
                    }
                    echo "</ul>";
                } catch (\Throwable $th) {
                    // dd($th);
                }
            
            echo "</li>";
        }
        echo "</ul>"; */
    }

}