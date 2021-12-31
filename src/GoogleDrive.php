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
use Google\Service\Drive;
use App\Google;

/** Class for manage Google Drive
 * 
 */
class GoogleDrive{

    # Drive
    private $drive;

    /** Constructor
     * @param Google $client
     * @param array $input
     */
    public function __construct(
        Google $client,
        array $input = []
    ){

        # Set new drive service
        $this->newDrive($client);

    }

    /** New drive service
     * 
     */
    private function newDrive(Google $client){

        # Set drive
        $this->drive = new Drive($client);

    }

}