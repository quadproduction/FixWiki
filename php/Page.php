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

/** fixStudioWiki
 * 
 */
namespace fixStudioWiki;

/** Additonnal vendor
 * 
 */
# Lightncandy
use LightnCandy\LightnCandy;
use Symfony\Component\Finder\Finder;

/** Page
 * 
 * List of function to generate HTML page
 */
class Page /* extends Kglobal */ {

    /************************************************************************************************** 
     * Parameters
     * 
    **************************************************************************************************/

    # LightCandy (layout)
    private $LightCandy = null;
    /* 
       # Compile the template
       $php = LightnCandy::compile($template, $this->LightCandy);
       $render = LightnCandy::prepare($php);
       LightnCandy::prepare(LightnCandy::compile($this->layoutGet('toto'), $this->LightCandy))
    */

    /************************************************************************************************** 
     * Construct
     * 
    **************************************************************************************************/

    public function __construct(){
        
        # Parent constructor
        /* parent::__construct(); */

        # Init
        $this->lightCandyInit();

        # Auto Construct
        $this->autoConstruct();

    }

    /************************************************************************************************** 
     * Mathods
     * 
    **************************************************************************************************/

    /** Autoconstruct
     *  
     * Find auomatically construct function of current page
     */
    private function autoConstruct(){

        echo
        # First tags
        '<!DOCTYPE html>'.
        '<html lang="en">'.
            # Head
            '<head>'.
                $this->tagGenerator(self::META, 'meta').
                $this->tagGenerator(self::LINK, 'link').
                '<title>Fix Studio Wiki</title>'.
            '</head>'.
            # Body
            '<body class="has-fixed-sidenav">'.
                $this->templateGet('sidenav').
                '<main>'.
                    $this->templateGet(
                        ['header']
                    ).
                    'hello'.
                '</main>'.
                $this->tagGenerator(self::SCRIPT, 'script').
            '</body>'.
        '</html>';


    }

    /** Get tample
     * 
     */
    private function templateGet($template, $data = []){

        return $template ? 
            LightnCandy::prepare(LightnCandy::compile($this->layoutGet($template), $this->LightCandy))($data) :
                '';
    }

    /** Generator of tag
     * 
     */
    private function tagGenerator(array $array = [], string $tag = 'link'):string {

        # Check array not empty or no tag
        if(empty($array) || !$tag)
            return '';

        # Set str
        $str = '';

        # Iterations of element
        foreach($array as $tags):

            # Start of tag
            $str .= '<'.$tag;

            # Iteration of value
            foreach($tags as $key => $value)

                # Push parameter and value
                $str .= ' '.$key.'="'.$value.'"';

            # End of tag
            $str .= '>';

            # Check is tag is script
            if($tag == 'script')
                $str .= '</script>';


        endforeach;

        # Return str
        return $str;

    }

    /** Get content of layout
     * 
     * @return bool|string
     */
    protected function layoutGet($templates, $ext = 'hbs'){

        # result
        $result = '';

        # Convert to array
        if(!is_array($templates))
            $templates = [$templates];

        # Iteration des template
        foreach($templates AS $template):

            # Check template and ext
            if(!$template || !$ext)
                continue;

            # Init finder
            $finder = new Finder();

            # Search file in /app/layout
            $finder = $finder->files()->name('*/'.$template.'.'.$ext)->name('*\\'.$template.'.'.$ext)->in('layout/');

            # Iteration results
            foreach($finder as $file)

                # Return file content
                $result .= file_get_contents($file->getRealPath(), true);

        endforeach;

        # Return result
        return $result;

    }

    /************************************************************************************************** 
     * LightCandy
     * 
    **************************************************************************************************/

	protected function lightCandyInit(){

		/** Light Candy
		 * 
		 */
		$this->LightCandy = [
			'flags' => LightnCandy::FLAG_HANDLEBARSJS,
			'helpers' => [
				'ifEquals' => function ($arg1, $arg2, $options) {
					return ($arg1 === $arg2) ? $options['fn']() : $options['inverse']();
				},
				'cleanString' => function ($string) {
					if($string && is_string($string)):
						/* Reg Ex */
						$utf8 = [
							'/[áàâãªä]/u'   =>   'a',
							'/[ÁÀÂÃÄ]/u'    =>   'a',
							'/[ÍÌÎÏ]/u'     =>   'i',
							'/[íìîï]/u'     =>   'i',
							'/[éèêë]/u'     =>   'e',
							'/[ÉÈÊË]/u'     =>   'e',
							'/[óòôõºö]/u'   =>   'o',
							'/[ÓÒÔÕÖ]/u'    =>   'o',
							'/[úùûü]/u'     =>   'u',
							'/[ÚÙÛÜ]/u'     =>   'u',
							'/ç/'           =>   'c',
							'/Ç/'           =>   'c',
							'/ñ/'           =>   'n',
							'/Ñ/'           =>   'n',
							'/\s+/'         =>   '_',
							'/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
							'/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
							'/[“”«»„]/u'    =>   ' ', // Double quote
							'/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160),
							'/[(]/'			=>	 '',  // Round brackets
							'/[)]/'			=>	 '',  // Round brackets
						];
						/* Return value */
						$string = strtolower(preg_replace(array_keys($utf8), array_values($utf8), $string));
					endif;
					return $string;
				},
				'colorText' => function ($string) {
					return (strpos(trim($string), ' ') !== false) ? 
						str_replace(' ', '-text text-', trim($string)) :
							trim($string).'-text';
				},
			],
		];

	}

    /************************************************************************************************** 
     * Constant
     * 
    **************************************************************************************************/

    /** List of meta
     * 
     */
    const META = [
        [
            "http-equiv"=>  "Content-Type",
            "content"   =>  "text/html; charset=UTF-8",
        ],
        [
            "charset"   =>  "UTF-8",
        ],
        [
            "name"      =>  "viewport",
            "content"   =>  "width=device-width, initial-scale=1",
        ],
        [
            "http-equiv"=>  "X-UA-Compatible",
            "content"   =>  "IE=edge",
        ],
        [
            "name"      =>  "msapplication-tap-highlight",
            "content"   =>  "no",
        ],
        [
            "name"      =>  "description",
            "content"   =>  "Le wiki de Fix Studio",
        ],
        [
            "name"      =>  "robots",
            "content"   =>  "noindex,nofollow",
        ],
        [
            "name"      =>  "googlebot",
            "content"   =>  "noindex",
        ],
    ];

    /** List of links
     * 
     */
    const LINK = [
        [
            "href"  =>  "css/jqvmap.css",
            "rel"   =>  "stylesheet",
        ],
        [
            "href"  =>  "css/flag-icon-css/css/flag-icon.min.css",
            "rel"   =>  "stylesheet",
        ],
        [
            "href"  =>  "css/admin-materialize.css",
            "rel"   =>  "stylesheet",
        ],
        [
            "href"  =>  "https://fonts.googleapis.com/icon?family=Material+Icons",
            "rel"   =>  "stylesheet",
        ],
        # To delete
        [
            "href"  =>  "https://cdn.datatables.net/v/dt/dt-1.10.16/datatables.min.css",
            "rel"   =>  "stylesheet",
        ],
        [
            "href"  =>  "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.7.0/fullcalendar.min.css",
            "rel"   =>  "stylesheet",
        ],
    ];

    /** List of script
     * 
     */
    const SCRIPT = [
        [
            "src"   =>  "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/materialize.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/admin.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/init.js",
            "type"  =>  "text/javascript",
        ],
        # To delete
        [
            "src"   =>  "js/jqvmap/jquery.vmap.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/jqvmap/jquery.vmap.world.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/jqvmap/jquery.vmap.sampledata.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/Chart.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/Chart.Financial.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.7.0/fullcalendar.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "https://cdn.datatables.net/v/dt/dt-1.10.16/datatables.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/imagesloaded.pkgd.min.js",
            "type"  =>  "text/javascript",
        ],
        [
            "src"   =>  "js/masonry.pkgd.min.js",
            "type"  =>  "text/javascript",
        ],
    ];

}