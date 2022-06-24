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
ini_set('display_errors', 1);

/** Dependances
 *
 */
use LuckyPHP\Interface\Controller as ControllerInterface;
use LuckyPHP\Base\Controller as ControllerBase;
use App\GoogleDrive;
use LuckyPHP\Front\Console;

/** Class for manage the workflow of the app
 *
 */
class DriveSearchAction extends ControllerBase implements ControllerInterface {

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
        $this->name="DriveSearchAction";

    }

    /** Records
     * 
     */
    public function pushRecords(){

        # Set records
        $records = [];

        # New google drive
        $this->google_drive = new GoogleDrive();

        # Get search name
        $name = $this->parameters["name"];

        # Get all data
        $records = $this->google_drive->searchFile($name);

        # Check relationships
        if(!empty($records["relationships"]))

            # Iteration
            foreach($records["relationships"] as $k => $v){

                /* Check position pattern in file name */

                # Check if two first character are "__"
                if(strlen($v['name']) >= 3 && substr($v['name'], 1, 2) == "__")

                    # Remove three first character
                    $records["relationships"][$k]['name'] = substr($v['name'], 3);

                /* Check not hide file */

                # Check first character is .
                if(strlen($v['name']) > 1 && $v['name'][0] == ".")

                    # Remove item
                    unset($records["relationships"][$k]);

            }

        # Push records
        $this->model->pushRecords([$records]);

        # Push user interface
        $this->model->pushDataInUserInterface([
            "list" => [
                "template"  =>  file_get_contents(__ROOT_APP__."/resources/hbs/search/list.hbs")
            ]
        ]);

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
