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

/** Dependances
 *
 */
use LuckyPHP\Interface\Controller as ControllerInterface;
use LuckyPHP\Base\Controller as ControllerBase;
use App\Shotgrid;

/** Class for manage the workflow of the app
 *
 */
class sgProjectsAction extends ControllerBase implements ControllerInterface{

    # Conditions
    private $conditions = [
        "statusAllowed" =>  [
            "expanded",
            "collapse"
        ]
    ];

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
        $this->name="sgProjectsAction";

    }

    /** Records
     * 
     */
    public function pushRecords(){

        # New shotgrid
        $this->shotgrid = new Shotgrid();

        # Get all projects active
        $records = $this->shotgrid->readAllRecords(
            "projects",
            [
                # Filters
                "filters"   =>  [
                    ["sg_status", "is", "Active"],
                    ["name", "not_contains", "PP2"],
                    ["name", "not_contains", "PP3"],
                    ["image", "is_not", null],
                    ["is_demo", "is", false],
                    ["is_template", "is", false],
                    ["sg_type", "in", ["Commercial", "Print", "Feature Film", "Short Film", "Documentary", "Tv Show", "Music Video Clip"]]
                ],
                # Fields
                "fields"    =>  [
                    "name", "sg_type", "sg_description", "image", "sg_fix_project_overview"
                ],
                # Sort
                "sort"      =>  "-created_at"
            ]
        );

        # Push records
        $this->model->pushRecords(json_decode($records, true)['data']);

        # Push layouts
        $this->model->pushDataInUserInterface(["actions"  => [
            [
                "type"      =>  "hbs",
                "target"    =>  "#sg-projects",
                "content"   =>  file_get_contents(__ROOT_APP__."/resources/hbs/components/medialist.hbs")
            ]
        ]]);

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