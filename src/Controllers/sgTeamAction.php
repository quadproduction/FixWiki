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
class sgTeamAction extends ControllerBase implements ControllerInterface{

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
        $this->name="sgTeamAction";

    }

    /** Records
     * 
     */
    public function pushRecords_old(){

        # Get id
        $idProject = intval($this->parameters['id']);

        # New shotgrid
        $this->shotgrid = new Shotgrid();

        # Get all projects active
        $response = $project = json_decode($this->shotgrid->readRecordRelationship( "Project",$idProject,"sg_supervisors_1",), true);

        # Set variables
        $team = [
            # Supervisors
            "sg_supervisors_1" => json_decode($this->shotgrid->readRecordRelationship( "Project",$idProject,"sg_supervisors_1",), true)['data'],
            # Coordinators
            "sg_fix_coordinators" => json_decode($this->shotgrid->readRecordRelationship( "Project",$idProject,"sg_fix_coordinators",), true)['data'],
            "sg_producers_1" => json_decode($this->shotgrid->readRecordRelationship( "Project",$idProject,"sg_producers_1",), true)['data'],
            "users" => json_decode($this->shotgrid->readRecordRelationship( "Project",$idProject,"users",), true)['data']
        ];

        # Iterations de la team
        foreach($team as $k => $v){

            # Check value not empty
            if(!empty($v)):

                # Get all projects active
                $records = $this->shotgrid->readAllRecords(
                    "human_users",
                    [
                        # Filters
                        "filters"   =>  [
                            ["projects", "is", ["type"=> "Project", "id"=>$idProject]],
                        ],
                        # Fields
                        "fields"    =>  [
                            "image"
                        ]
                    ]
                );

                # Push result in response
                $response['data']['relationships'][$k]['data'] = json_decode($records, true)['data'];

            endif;
        }

        # Push records
        $this->model->pushRecords($response['data']);

        # Push layouts
        /* $this->model->pushDataInUserInterface(["actions"  => [
            [
                "type"      =>  "hbs",
                "target"    =>  "#sg-projects",
                "content"   =>  file_get_contents(__ROOT_APP__."/resources/hbs/components/medialist.hbs")
            ]
        ]]); */

        # Set model data in data
        $this->setData($this->model->execute());

    }
    /** Records
     * 
     */
    public function pushRecords(){

        # Get id
        $idProject = intval($this->parameters['id']);

        # New shotgrid
        $this->shotgrid = new Shotgrid();

        # Get all projects active
        $records = $this->shotgrid->readOneRecord(
            "Project",
            $idProject,
            [
                # Fields
                "fields"    =>  [
                    "sg_supervisors_1", "sg_fix_coordinators", "sg_producers_1", "users", "name"
                ]
            ]
        );

        # Get response
        $response = $project = json_decode($records, true);

        # Set variables
        $team = [
            # Supervisors
            "sg_supervisors_1" => [
                "data"  =>  $project['data']['relationships']['sg_supervisors_1']['data'] ?? [],
                "field" =>  "project_sg_supervisors_1_projects"
            ],
            # Coordinators
            "sg_fix_coordinators" => [
                "data"  =>  $project['data']['relationships']['sg_fix_coordinators']['data'] ?? [],
                "field" =>  "project_sg_fix_coordinators_projects"
            ],
            "sg_producers_1" => [
                "data"  =>  $project['data']['relationships']['sg_producers_1']['data'] ?? [],
                "field" =>  "project_sg_producers_1_projects"
            ],
            "users" => [
                "data"  =>  $project['data']['relationships']['users']['data'] ?? [],
                "field" =>  "projects"
            ]
        ];

        # Iterations de la team
        foreach($team as $k => $v){

            # Clean $records
            $records = [];

            # Check value not empty
            if(!empty($v['data'])):

                # Get all projects active
                $records = $this->shotgrid->readAllRecords(
                    "human_users",
                    [
                        # Filters
                        "filters"   =>  [
                            [$v["field"], "is", ["type"=> "Project", "id"=>$idProject]],
                        ],
                        # Fields
                        "fields"    =>  [
                            "image", "login", "department", "name", "sg_status_list", "sg_speciality"
                        ]
                    ]
                );

                # Push result in response
                $response['data']['relationships'][$k]['data'] = json_decode($records, true)['data'];

            else:

                # Empty area
                $response['data']['relationships'][$k] = null;

            endif;
        }

        # Push records
        $this->model->pushRecords([$response['data']]);

        # Push layouts
        $this->model->pushDataInUserInterface(["actions"  => [
            [
                "type"      =>  "hbs",
                "target"    =>  "Swal",
                "content"   =>  file_get_contents(__ROOT_APP__."/resources/hbs/popup/header.hbs").file_get_contents(__ROOT_APP__."/resources/hbs/popup/main/teamlist.hbs")
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