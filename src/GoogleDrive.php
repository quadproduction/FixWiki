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

    # conditions
    private $conditions = [
        "folderNameExclude" =>  ["media"],
        "mimeTypeAllow"     =>  ["text/markdown"/* , "application/vnd.google-apps.document" */]
    ];

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
            throw new Exception('Id of the google drive shared is missing in config file.', 401);
            
        # Parameters
        $parameters = array(
            'includeItemsFromAllDrives' => true,
            'fields'                    => 'nextPageToken, files(id, name, mimeType, parents, size, createdTime, modifiedTime, lastModifyingUser)',
            'supportsAllDrives'         => true,
            'driveId'                   => $this->config['app']['google']['drive']['driveId'],
            'corpora'                   => 'drive',
            'q'                         => 'trashed=false',
        );

        # Get datas
        $batch = $this->drive->files->listFiles($parameters);

        # Data
        $data = [
            'id'        =>  $this->config['app']['google']['drive']['driveId'],
            "entity"    =>  "drive",
            "relationships" =>  []
        ];

        # Set relationships of data
        $data['relationships'] = $this->stretchByParents($batch, $this->config['app']['google']['drive']['driveId']);

        # Push in global data
        $this->data["navigation"][] = $data;

    }

    /** Stretch array by parents
     * 
     */
    private function stretchByParents($batch, string $root = ""){

        # Set root
        if(!$root)
            return [];

        # Declare result
        $result = [];

        # Check if result
        if(count($batch->getFiles()))

            # Iteration des files
            foreach ($batch->getFiles() as $file){

                # Check if folder and not exclude and if file parent is root
                if(
                    $file->getMimeType() == "application/vnd.google-apps.folder" && 
                    !in_array(strtolower($file->getName()), $this->conditions['folderNameExclude']) &&
                    in_array($root, $file->getParents())
                ){

                    # Push file in result
                    $currentResult = [
                        #'instance'  =>  $file,
                        'id'        =>  $file->getId(),
                        'attributes'    =>  [
                            "name"          =>  $file->getName(),
                            "mime_type"     =>  $file->getMimeType(),
                            "parents"       =>  $file->getParents(),
                            "size"          =>  $file->getSize(),
                            "lastModifyingUser"=>$file->getLastModifyingUser(),
                            "created_time"  =>  $file->getCreatedTime(),
                            "modified_time" =>  $file->getModifiedTime(),
                        ],
                        "entity"    =>  "folder",
                        "relationships" =>  []
                    ];

                    # Set resationships
                    $currentResult["relationships"] = $this->stretchByParents($batch, $file->getId());

                    # Push current result in result
                    $result["folder"][] = $currentResult;                    

                }else
                # If file as root like parent and if mimetype of the file is allow
                if(
                    in_array($root, $file->getParents()) &&
                    in_array($file->getMimeType(), $this->conditions['mimeTypeAllow'])
                ){

                    # Push file in result
                    $currentResult = [
                        #'instance'  =>  $file,
                        'id'        =>  $file->getId(),
                        'attributes'    =>  [
                            "name"          =>  $file->getName(),
                            "mime_type"     =>  $file->getMimeType(),
                            "parents"       =>  $file->getParents(),
                            "size"          =>  $file->getSize(),
                            "lastModifyingUser"=>$file->getLastModifyingUser(),
                            "created_time"  =>  $file->getCreatedTime(),
                            "modified_time" =>  $file->getModifiedTime(),
                        ],
                        "entity"    =>  "file"
                    ];

                    # Push current result in result
                    $result["file"][] = $currentResult;

                }

            }

        # Return result
        return $result;

    }

    /** Get data
     * @param string $parameter get one specific value in data if exists
     */
    public function getData($parameter = ""):array|null{

        # Check parameter
        if($parameter)

            if(is_array($this->data) && in_array($parameter, $this->data))

                # Return specific value
                return $this->data[$parameter];

            else

                # Return null
                return null;

        # Else 
        return $this->data;

    }

}