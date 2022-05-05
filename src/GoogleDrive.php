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
use Google\Service\DriveActivity\QueryDriveActivityRequest;
use Symfony\Component\Finder\Finder;
use Google\Service\DriveActivity;
use LuckyPHP\Server\Exception;
use LuckyPHP\Server\Config;
use LuckyPHP\Front\Console;
use LuckyPHP\Code\Strings;
use LuckyPHP\Code\Arrays;
use Google\Service\Drive;
use LuckyPHP\File\Json;
use App\Markdown;
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

    # LAst update
    private $lastUpdate = null;

    # conditions
    private $conditions = [
        "folderNameExclude" =>  ["media"],
        "mimeTypeAllow"     =>  [
            # Markdown
            "text/markdown"     =>  [
                'icon'  =>  [
                    "class" =>  "fab fa-markdown",
                    "text"  =>  "",
                ]
            ],
            "text/plain"     =>  [
                'icon'  =>  [
                    "class" =>  "fab fa-markdown",
                    "text"  =>  "",
                ]
            ],
            # Pdf
            "application/pdf"   =>  [
                'icon'  =>  [
                    "class" =>  "fas fa-file-pdf",
                    "text"  =>  "",
                ]
            ], 
            # Google Doc
            "application/vnd.google-apps.document"  =>  [
                'icon'  =>  [
                    "class" =>  "fas fa-file-alt",
                    "text"  =>  "",
                ]
            ],
            # Movies
            "video/quicktime"   =>  [
                'icon'  =>  [
                    "class" =>  "fa-solid fa-film",
                ]
            ],
            "video/mp4"   =>  [
                'icon'  =>  [
                    "class" =>  "fa-solid fa-film",
                ]
            ]
        ],
        # Mime type allow search
        "searchMimeTypeAllowed" =>  [
            "application/vnd.google-apps.folder", 
            "video/mp4", 
            "video/quicktime", 
            "application/vnd.google-apps.document", 
            "application/pdf", 
            "text/plain", 
            "text/markdown"
        ],
        # Position delimiter
        "positionDelimiter" =>  "__",
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

        # Last update
        $this->getLastActivity();

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
    public function getAllFileFromSharedDrive($tigger = false, $custom = ""){

        # File cache
        $templateFolder = __ROOT_APP__."/cache/drive/";
        $templateFile = "navigation_".($custom ? $custom."_" : "");
        $fileCache = $templateFolder.$templateFile.$this->lastUpdate.".php";

        # Check lastUpdate
        if($this->lastUpdate && is_file($fileCache) && $tigger){

            # Read cache
            list($this->data["navigation"], $this->directory) = require($fileCache);

            # Return 
            return;

        }

        # Check if google drive driveId
        if(
            !isset($this->config['app']['google']['drive']['driveId']) ||
            empty($this->config['app']['google']['drive']['driveId'])
        )

            # Error
            throw new Exception('Id of the google drive shared is missing in config file.', 401);
            
        # Parameters
        $parameters = array(
            'includeItemsFromAllDrives' =>  true,
            'fields'                    =>  'nextPageToken, files(id, name, mimeType, parents, size, createdTime, modifiedTime, lastModifyingUser, webContentLink)',
            'supportsAllDrives'         =>  true,
            'driveId'                   =>  $this->config['app']['google']['drive']['driveId'],
            'corpora'                   =>  'drive',
            'pageSize'                  =>  1000,
            /**
             *  Folder and File Order #4 
             */
            'orderBy'                   =>  'name',
            'q'                         =>  'trashed=false',
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

        # check tigger
        if($tigger):

            # Delete old caches
            $finder = new Finder();
            $finder
                ->files()
                ->in($templateFolder)
                ->name("$templateFile*");

            # Check files
            if($finder->hasResults())
                # Iteration des fichiers
                foreach($finder as $file)
                    unlink($file->getRealPath());

            # File put content in cache
            file_put_contents(
                $fileCache,
                '<?php return ' . var_export([
                    0 => $this->data["navigation"],
                    1 => $this->directory
                ],
                true
                ) . ';'
            );

        endif;

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

                # Clean name
                $cleanName = preg_replace("/^[0-9]+(".$this->conditions['positionDelimiter'].")/", "", $file->getName());

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
                            /**
                             *  Folder and File Order #4 
                             */
                            "name"          =>  $cleanName,
                            "mime_type"     =>  $file->getMimeType(),
                            "parents"       =>  $file->getParents(),
                            "size"          =>  $file->getSize(),
                            //"lastModifyingUser"=>$file->getLastModifyingUser(),
                            "created_time"  =>  $file->getCreatedTime(),
                            "modified_time" =>  $file->getModifiedTime(),
                        ],
                        "_user_interface"   =>  [
                            'icon'  =>  [
                                "class" =>  "material-icons",
                                "text"  =>  "folder",  
                            ],
                            /**
                             *  Hide files beginning by dot #3
                             */
                            'hidden'=>  (($file->getName()[0] ?? "") == ".") ? true : false,
                            /**
                             *  Folder and File Order #4 
                             */
                            "position"  =>  preg_match("/^[0-9]+(".$this->conditions['positionDelimiter'].")/", $file->getName()) ?
                                explode($this->conditions['positionDelimiter'], $file->getName(), 1)[0] : 
                                    null,
                            'root'  =>  $rootName.Strings::clean(pathinfo($cleanName, PATHINFO_FILENAME))."/",
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
                            /**
                             *  Folder and File Order #4 
                             */
                            "name"          =>  $cleanName,
                            "mime_type"     =>  $file->getMimeType(),
                            "parents"       =>  $file->getParents(),
                            "size"          =>  $file->getSize(),
                            //"lastModifyingUser"=>$file->getLastModifyingUser(),
                            "created_time"  =>  $file->getCreatedTime(),
                            "modified_time" =>  $file->getModifiedTime(),
                        ],
                        "_user_interface"   => 
                            $this->conditions['mimeTypeAllow'][$file->getMimeType()] +
                            [
                                /**
                                 *  Folder and File Order #4 
                                 */
                                "position"  =>  preg_match("/^[0-9]+(".$this->conditions['positionDelimiter'].")/", $file->getName()) ?
                                    explode($this->conditions['positionDelimiter'], $file->getName(), 1)[0] : 
                                        null,
                                'root'      =>  $rootName.Strings::clean(pathinfo($file->getName(), PATHINFO_FILENAME)).'/',
                                /**
                                 *  Hide files beginning by dot #3
                                 */
                                'hidden'    =>  (($file->getName()[0] ?? "") == ".") ? true : false,
                            ]
                        ,
                        "entity"    =>  "file"
                    ];

                    # Push current result in result
                    $result["file"][] = $currentResult;
                    
                    # Push current result in directory
                    $this->pushDirectory(
                        $currentResult['_user_interface']['root'],
                        $file->getId()
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

    /** Set current file
     * 
     */
    public function setCurrentfileById(string $id = "", $media = true){
        
        # Check id
        if(!$id)

            # New error
            throw new Exception("You can't find file in Google Drive with invalid Id", 500);

        # Declare parameters
        $parameter = [
            'supportsAllDrives' => true, 
            'fields' => 'webContentLink, mimeType, name, id',
        ];

        # If $media
        if($media)
            $parameter['alt'] = 'media';

        # Set result
        $result = $this->drive->files->get(
            $id,
            $parameter
        );

        # Set current file
        $this->currentFile = $result;

    }

    /** Get info by if
     * @param string $id id of file...
     * @param array $fields Attributes to read in google drive
     * @return array
     */
    public function getDataInfoById(string $id = "", array $fields = ["id", "name"]):array {
        
        # Check id
        if(!$id)

            # New error
            throw new Exception("You can't find file in Google Drive with invalid Id", 500);

        # Declare result
        $result = [
            "entity" => "file"
        ];

        # Set result
        $record = $this->drive->files->get(
            $id,
            [
                'supportsAllDrives' => true, 
                'fields' => implode(", ", $fields),
            ]
        );

        # Iteration fields
        foreach($fields as $field){

            # Set method name
            $methodName = "get".ucfirst($field);

            # check method exist in record
            if(method_exists($record, $methodName))

                # Push value in result
                $result[$field] = $record->{$methodName}();

        }

        # Return result
        return $result;

    }

    /** Create cache file
     * 
     */
    public function createCacheForCurrentFile($id):array{
        

        # Set path
        $path = __ROOT_APP__."/cache/drive";
        #File name
        $filePath = $path."/".$id;

        # check cache > drive folder exist
        if(!is_dir($path))

            # Create folder
            mkdir($path, 0777, true);

        # Create file with cache
        file_put_contents(
            $filePath, 
            $this->currentFile->getBody()->getContents()
        );

        # Prepare result 
        $result = [
            "name"  =>  $id,
            "path"  =>  $path,
        ];

        # Return result
        return $result;

    }

    /** Get content of the current file
     * Depending of the type mime
     */
    public function getContentFile(){

        # If markdown
        if(in_array($this->currentFile->getMimeType(), ["text/markdown","text/plain"])){

            # Get content of file
            $ctx = $this->drive->files->get(
                $this->currentFile->getId(),
                [
                    'supportsAllDrives' => true, 
                    'fields' => 'webContentLink, mimeType, name',
                    'alt' => 'media',
                ]
            );

            # Set result
            $result = New Markdown($ctx->getBody()->getContents());

            # Return result
            return $result->execute();

        }else
        # Google Drive document
        if($this->currentFile->getMimeType() == "application/vnd.google-apps.document"){

            # Get content of file
            $ctx = $this->drive->files->get(
                $this->currentFile->getId(),
                [
                    'supportsAllDrives' => true, 
                    'fields' => 'webContentLink, webViewLink, mimeType, name'
                ]
            );

            # View link
            $webViewLink = $ctx->getWebViewLink();
            //$webContentLink = urlencode($ctx->getWebContentLink());

            # Set result
            $result = "<script type=\"text/javascript\">App.Google({webContentLink:\"$webViewLink\"});</script>";

            # Return result
            return $result ?? "";

        }else
        # Pdf
        if($this->currentFile->getMimeType() == "application/pdf"){

            /* # Get content of file
            $ctx = $this->drive->files->get(
                $this->currentFile->getId(),
                [
                    'supportsAllDrives' => true, 
                    'fields' => 'webContentLink, mimeType, name, downloadUrl',
                    'alt' => 'media',
                ]
            );

            # Set result
            $fileUContent = $ctx->getBody()->getContents(); */

            # Set id
            $id = $this->currentFile->getId();

            # Set name
            $name = $this->currentFile->getName();

            /** With default pdf viewer
             * 
             */
            # Return result
            $result = '<div id="pdf-viewer-default"><embed src="/media/file?id='.$id.'" /></div>';

            /**  Get tokken file of adobe
             *  {
             *      "name": "Fix Docs",
             *      "key": "5e88a369cf3e447ea27869b6621595d3",
             *      "allowedDomain": ["fixstudio.wiki"]
             *  }
             */
            /*
            $tokken_adobe = Json::open(__ROOT_APP__."resources/json/adobe_pdf.json");


            # Check config adobe pdf key
            if(
                !isset($tokken_adobe['key']) || 
                empty($tokken_adobe['key'])
            )

                # Error
                throw new Exception("If you want read PDF, please fill pdf key in config", 501);

            # set key
            $key = $tokken_adobe['key'];

            # Return result
            $result =
                '<div id="adobe-dc-view"></div>'.
                '<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>'.
                '<script type="text/javascript">document.addEventListener("adobe_dc_view_sdk.ready", function(){var adobeDCView = new AdobeDC.View({clientId: "'.$key.'",divId: "main"});adobeDCView.previewFile({content:{location: {url: "/media/file?id='.$id.'"}},metaData:{fileName: "'.$name.'"}}, {dockPageControls: false});App.Pdf();});</script>'
            ;
            */

            # Return result
            return $result ?? "";


        }else
        # Movie
        if(in_array($this->currentFile->getMimeType(), ['video/mp4', 'video/quicktime'])){

            # Set id
            $id = $this->currentFile->getId();

            # Set name
            $name = $this->currentFile->getName();

            # Return result
            return '<video src="/api/file/drive/id/'.$id.'/" id="movie-player" data-plyr-config=\'{"title":"'.$name.'"}\'></video>';

        }


    }

    /** Get id of current file
     * 
     */
    public function getCurrentId(){

        #Return
        return $this->currentFile->getId();

    }

    /** Search file by name
     * 
     */
    public function searchFile(string $need = ""){

        # Result
        $result = [];

        # clean need
        $need = addslashes(trim($need));

        # Check need
        if(!$need)
            return $result;

        # Get content of file
        $parameters = [
            'includeItemsFromAllDrives' =>  true,
            'fields'                    =>  'nextPageToken, files(id, name, mimeType, parents, size, createdTime, modifiedTime, lastModifyingUser, webContentLink)',
            'supportsAllDrives'         =>  true,
            'driveId'                   =>  $this->config['app']['google']['drive']['driveId'],
            'corpora'                   =>  'drive',
            'pageSize'                  =>  1000,
            'q'                         =>  "trashed = false and (name contains '$need' or fullText contains '$need')",
        ];

        # Get datas
        $batch = $this->drive->files->listFiles($parameters);

        # Data
        $result = [
            'id'        =>  $this->config['app']['google']['drive']['driveId'],
            "entity"    =>  "drive",
            "relationships" =>  [],
        ];

        # Set mimeTypeAllow
        $mimeTypeAllow = $this->conditions["searchMimeTypeAllowed"];

        //$result['raw'] = $batch->getFiles();

        # Check if result
        if(count($batch->getFiles()))

            # Iteration des files
            foreach ($batch->getFiles() as $file){

                # Check mime type
                if(!in_array($file->getMimeType(), $mimeTypeAllow))
                    
                    # Continue
                    continue;

                # Developpe folder
                if($file->getMimeType() === "application/vnd.google-apps.folder"):

                    # Extract folder
                    $this->searchFileInFolder($file->getId(), $result);

                    # continue
                    continue;

                endif;

                # size
                $size = $file->getSize();

                # Item
                $item = [
                    "name"      =>  $file->getName(),
                    "id"        =>  $file->getId(),
                    "mimeType"  =>  $file->getMimeType(),
                    "parents"   =>  $file->getParents(),
                    "size"      =>  $this->formatBytes(intval($size)),
                ];

                # Push item in result
                $result['relationships'][] = $item;

            }

        # Return result
        return $result;

    }

    /** Search file in folder
     * 
     */
    private function searchFileInFolder($id, &$data){

        # Get content of file
        $parameters = [
            'includeItemsFromAllDrives' =>  true,
            'fields'                    =>  'nextPageToken, files(id, name, mimeType, parents, size, createdTime, modifiedTime, lastModifyingUser, webContentLink)',
            'supportsAllDrives'         =>  true,
            'driveId'                   =>  $this->config['app']['google']['drive']['driveId'],
            'corpora'                   =>  'drive',
            'pageSize'                  =>  1000,
            'q'                         =>  "trashed = false and '$id' in parents",
        ];

        # Get datas
        $batch = $this->drive->files->listFiles($parameters);

        # Data
        $result = [
            'id'        =>  $this->config['app']['google']['drive']['driveId'],
            "entity"    =>  "drive",
            "relationships" =>  []
        ];
        
        # Set mimeTypeAllow
        $mimeTypeAllow = $this->conditions["searchMimeTypeAllowed"];

        # Push item in result
        //$data['raw'] = array_merge($data['raw'], $batch->getFiles());

        # Check if result
        if(count($batch->getFiles()))

            # Iteration des files
            foreach ($batch->getFiles() as $file){

                # Check mime type
                if(!in_array($file->getMimeType(), $mimeTypeAllow))
                    continue;

                # Developpe folder
                if($file->getMimeType() === "application/vnd.google-apps.folder"):
                    
                    # Extract folder
                    $this->searchFileInFolder($file->getId(), $data);

                    # continue
                    continue;

                endif;

                # size
                $size = $file->getSize();

                # Item
                $item = [
                    "name"      =>  $file->getName(),
                    "id"        =>  $file->getId(),
                    "mimeType"  =>  $file->getMimeType(),
                    "parents"   =>  $file->getParents(),
                    "size"      =>  $this->formatBytes(intval($size)),
                ];

                # Push item in result
                $data['relationships'][] = $item;

            }

    }

    /**********************************************************************************
     * Directory
     */

    /** push directory
     * 
     */
    private function pushDirectory(string $root, $id):void{

        # Push value in directory
        $this->directory[] = [
            'root'  =>  $root,
            'id'  =>  $id
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

    /**********************************************************************************
     * Media
     */

    /** search media
     * 
     * @param string Id of the element
     */
    public function searchMedia($parameters){

        # Declare result
        $result = null;

        # Reset conditions folderNameExclude
        $this->conditions['folderNameExclude'] = [];

        # Update condition mimeType Allow
        $this->conditions['mimeTypeAllow']["image/png"] = []; 
        $this->conditions['mimeTypeAllow']["image/jpg"] = []; 
        $this->conditions['mimeTypeAllow']["image/jpeg"] = []; 
        $this->conditions['mimeTypeAllow']["image/gif"] = [];

        # Set data with of all file in drive
        $this->getAllFileFromSharedDrive(true, "media");

        # Check data navigation
        if(!empty($this->data['navigation']))

            # Iteration data navigation
            foreach($this->data['navigation'] as $navigation){

                # Check if drive and children
                if(
                    $navigation['entity'] !== "drive" ||
                    !isset($navigation['relationships']) ||
                    empty($navigation['relationships'])
                )
                    continue;

                # Loop
                $result = $this->searchMediaLoop($parameters, $navigation['relationships']);

            }

        # Return result
        return $result;


    }

    public function searchMediaLoop($parameters, $relationships, $current = "/drive/", $parametersIndex = 0){

        # Result
        $result = [
            "status"    =>  true
        ];

        # Check current root
        $root = "root$parametersIndex";

        # Set theroy
        $theory = isset($parameters[$root]) ?
            "folder" : 
                "file";

        # Search file
        if($theory === "file"){

            # Search file
            if(isset($relationships['file']) && !empty($relationships['file'])):

                # Iteration file
                foreach($relationships['file'] as $file):
                    
                    # Check name match
                    if($parameters['name'] === $file['attributes']['name'])

                        # Return value
                        return $file['id'];

                endforeach;

            endif;

            # Set status
            $result['status'] = false;

        }else
        # Search folder
        if($theory === "folder"){

            # Search folder
            if(isset($relationships['folder']) && !empty($relationships['folder'])){

                # Iteration folder
                foreach($relationships['folder'] as $folder):

                    # Get clean name of current folder
                    $foldername = Strings::clean($folder['attributes']['name']);

                    # Check if name is current root
                    if($foldername === $parameters[$root]){

                        # Increment parametersIndex
                        $parametersIndex++;

                        # call loop
                        return $this->searchMediaLoop(
                            $parameters, 
                            $folder['relationships'] ?? [], 
                            $current.$foldername."/",
                            $parametersIndex
                        );

                    }

                endforeach;

            }

            # Set status
            $result['status'] = false;

        }

        # Check status
        if(!$result['status'])

            # No file found
            throw new Exception("No file \"".$parameters['name']."\" in \"$current\" in your Drive", 404);
        

    }

    /** Get last activity time
     * 
     */
    private function getLastActivity(){

        # Set result
        $result = null;

        # New drive activity
        $this->driveActivity = new DriveActivity($this->client);

        # New request
        $request = new QueryDriveActivityRequest();

        # Set folder
        $request->setAncestorName("items/".$this->config['app']['google']['drive']['driveId']);

        # Set pahe size
        $request->setPageSize(1);

        # Get results
        $results = $this->driveActivity->activity->query($request);

        # Get activity of the first value of results
        $activity = $results->getActivities()[0] ?? null;

        # Check activity
        if(!$activity)
            return;

        # Get time info
        $this->lastUpdate = str_replace(["-","T",".",":","Z"], "", $this->getTimeInfo($activity));

    }

    /** Get time info from activity
     * 
     */
    private function getTimeInfo($activity){

        if ($activity->getTimestamp() != null) {
            return $activity->getTimestamp();
        }
        if ($activity->getTimeRange() != null) {
            return $activity->getTimeRange()->getEndTime();
        }
        return null;
    }

    /** Convert byte to mb / kb / ...
     * @source https://stackoverflow.com/questions/2510434/format-bytes-to-kilobytes-megabytes-gigabytes
     **/
    public function formatBytes(int $size = 0, int $precision = 2):string {

        # Check size
        if(!$size)
            return "";

        # Base
        $base = log($size, 1024);

        # Suffixe
        $suffixes = ['', 'k', 'm', 'g', 't'];

        # Return
        return 
            round(
                pow(1024, $base - floor($base)), 
                $precision
            )
            .
            $suffixes[floor($base)].
            'b'
        ;

    }

}