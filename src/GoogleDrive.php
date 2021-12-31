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
use LuckyPHP\Server\Exception;
use LuckyPHP\Server\Config;
use LuckyPHP\Front\Console;
use Google\Service\Drive;
use App\Google;

/** Class for manage Google Drive
 * 
 */
class GoogleDrive{

    # Drive
    private $drive;

    # Config
    private $config;

    /** Constructor
     * @param $client
     * @param array $input
     */
    public function __construct(array $input = []){

        # Set new drive service
        $this->newDrive();

        # Get config
        $this->getConfig();

    }

    /** New drive service
     * @return void
     */
    private function newDrive():void{

        # Set drive
        $this->drive = new Drive($this->client = (new Google)->get());

    }

    /** Get config of the app
     * @return void
     */
    private function getConfig():void{

        # Get app config
        $this->config = Config::read('app');

    }

    /** Get All files in Shared Drive
     * @source https://developers.google.com/resources/api-libraries/documentation/drive/v3/php/latest/class-Google_Service_Drive_DriveFile.html
     */
    public function getAllFileFromSharedDrive(){

        # Check if google drive driveId
        if(
            !isset($this->config['app']['google']['drive']['driveId']) ||
            empty($this->config['app']['google']['drive']['driveId'])
        )

            # Error
            throw new Exception('Id of the google drive shared is missing in config file.');
            
        # Parameters
        $parameters = array(
            'includeItemsFromAllDrives' => true,
            'fields'                    => 'nextPageToken, files(id, name, mimeType, parents)',
            'supportsAllDrives'         => true,
            'driveId'                   => $this->config['app']['google']['drive']['driveId'],
            'corpora'                   => 'drive',
            'q'                         => 'trashed=false',
        );

        # Get datas
        $batch = $this->drive->files->listFiles($parameters);

        $data = [];

        # 
        foreach($batch->getFiles() as $file){

            $data[] = [
                "Name"=>$file->getName(),
                "MimeType"=>$file->getMimeType(),
                "Parents"=>$file->getParents(),
            ];
        
        }

        Console::log($data);

    }

}