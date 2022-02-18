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

/** Register The Auto Loader (composer)
 * 
 */
require __DIR__.'/../vendor/autoload.php';

/** Register Application
 * 
 */
$app = require_once __DIR__.'/../src/App.php';
