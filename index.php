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
# Autoload (composer)
require_once 'vendor/autoload.php';
# Load features of Double Screen
use fixStudioWiki AS app;
# New page
new app\Page();