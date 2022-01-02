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
use LuckyPHP\Code\Strings;
use LuckyPHP\Code\Arrays;
use Google\Service\Drive;
use App\Google;

/** Class for manage Google Drive
 * 
 */
class GoogleDrive{

    # Drive
    private $drive;

    # Current file
    private $currentFile = null;

    # Config
    private $config;

    # Directory (annuaire)
    private $directory = [];

    # conditions
    private $conditions = [
        "folderNameExclude" =>  ["media"],
        "mimeTypeAllow"     =>  [
            "text/markdown"     =>  [
                'icon'  =>  [
                    "class" =>  "fab fa-markdown",
                    "text"  =>  "",
                ]
            ]
            /* , "application/vnd.google-apps.document" */
        ]
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
            'fields'                    => 'nextPageToken, files(id, name, mimeType, parents, size, createdTime, modifiedTime, lastModifyingUser, webContentLink)',
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
    private function stretchByParents($batch, string $root = "", string $rootName = "/drive/"){

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
                        "_user_interface"   =>  [
                            'icon'  =>  [
                                "class" =>  "material-icons",
                                "text"  =>  "folder",  
                            ],
                            'root'  =>  $rootName.Strings::clean(pathinfo($file->getName(), PATHINFO_FILENAME))."/",
                        ],
                        "entity"    =>  "folder",
                        "relationships" =>  []
                    ];

                    # Set resationships
                    $currentResult["relationships"] = $this->stretchByParents(
                        $batch,
                        $file->getId(),
                        $currentResult['_user_interface']['root']
                    );

                    # Push current result in result
                    $result["folder"][] = $currentResult;    

                }else
                # If file as root like parent and if mimetype of the file is allow
                if(
                    in_array($root, $file->getParents()) &&
                    array_key_exists($file->getMimeType(), $this->conditions['mimeTypeAllow'])
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
                        "_user_interface"   => 
                            $this->conditions['mimeTypeAllow'][$file->getMimeType()] +
                            [
                                'root'  =>  $rootName.Strings::clean(pathinfo($file->getName(), PATHINFO_FILENAME)).'/'
                            ]
                        ,
                        "entity"    =>  "file"
                    ];

                    # Push current result in result
                    $result["file"][] = $currentResult;
                    
                    # Push current result in directory
                    $this->pushDirectory(
                        $currentResult['_user_interface']['root'],
                        $file
                    );

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

    /**********************************************************************************
     * Current file
     */

    /** Set current file
     * 
     */
    public function setCurrentfile(\Google\Service\Drive\DriveFile $file){

        # Set current file
        $this->currentFile = $file;

    }

    /** Get content of the current file
     * Depending of the type mime
     */
    public function getContentFile(){

        # If markdown
        if($this->currentFile->getMimeType() == "text/markdown"){

            $ctx = $this->drive->files->get(
                $this->currentFile->getId(),
                [
                    'supportsAllDrives' => true, 
                    'fields' => 'webContentLink, mimeType, name',
                    'alt' => 'media',
                ]
            );

            //print_r($ctx->getBody()->getContents());

        }

    }

    /**********************************************************************************
     * Directory
     */

    /** push directory
     * 
     */
    private function pushDirectory(string $root, $file):void{

        # Push value in directory
        $this->directory[] = [
            'root'  =>  $root,
            'file'  =>  $file
        ];

    }

    /** get directory
     * 
     */
    public function getDirectory(string $root){

        # Search root
        $results = Arrays::filter_by_key_value($this->directory, 'root', $root);

        # Clean root
        $root = str_replace("/drive", "", $root);
        $root = rtrim($root, '/');

        # If 1 result
        if(count($results) === 1)

            # Return first value
            return $results[array_key_first($results)];

        else
        # If 0 result
        if(empty($results))

            # New error
            throw new Exception("There is no file named \"$root\" in Google... Check the trash", 404);

        # Else multiple response
        else

            # New error
            throw new Exception("There are multiple files in Google Drive with the same name and in the same folder \"$root\". Please rename one of them !", 409);

    }

    /** get directory conflict
     * 
     */
    private function hasDirectoryConflict(string $root):bool{

        # Search root
        $results = Arrays::filter_by_key_value($this->directory, 'root', $root);

        # If more than 1 result
        return (count($results) > 1) ? true : false;

    }


}