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
use \ParsedownExtra;

/** Exetends of parsdown extra
 * 
 */
class ParsedownCustom extends ParsedownExtra{

    public function __construct(){

        # Parent
        parent::__construct();

        # Checkbox
        $this->InlineTypes['['][]= 'CheckboxOrIframe';

    }

    /**
     *  ADD CHECKBOX #12
     */
    protected function inlineCheckboxOrIframe($excerpt){

        if (preg_match('/\[ ]|\[x]/', $excerpt['text'], $matches)){

            return array(

                // How many characters to advance the Parsedown's
                // cursor after being done processing this tag.
                'extent' => 3, 
                'element' => [
                    'name' => 'i',
                    'text' => $matches[0] == "[x]" ? "check_box" : "check_box_outline_blank",
                    'attributes' => [
                        "class"     =>  "checkbox material-icons"
                    ] 
                ],

            );
        }
        /**
         *  ADD CHECKBOX #12 | END
         */


        /**
         *  ADD IFRAME #8
         */
        else if (preg_match('/\[\[\[.*?\]\]\]/', $excerpt['text'], $matches)){

            return array(

                // How many characters to advance the Parsedown's
                // cursor after being done processing this tag.
                'extent' => strlen($matches[0]),
                'element' => [
                    'name'  => 'iframe',
                    'text'  =>  '',
                    'attributes' => [
                        "src"       =>  trim(str_replace(["[[[", "]]]"], "", $matches[0])),
                        "class"     =>  "extract"
                    ]
                ],

            );
        }
        /**
         *  ADD IFRAME #8 | END
         */

    }


}

/** Class for manage Google Drive
 * 
 */
class Markdown{

    # Content
    public $content = "";

    # Set result
    private $result = "";

    # Instance
    private $instance;

    /** Constructor
     * @param $client
     * @param array $input
     */
    public function __construct(string|array $input = [], array $options = []){

        # ingest input
        $this->ingestInput($input);

    }

    /** Ingest input
     * 
     */
    private function ingestInput(array|string $inputs):void{

        # Set content
        $this->content = is_array($inputs) ?
            implode("", $inputs) :
                $inputs;

    }

    /** Parse content
     *
     */
    private function parseContent(){

        $parsdown = new ParsedownCustom();
        $this->result = $parsdown->text($this->content);

        /*
        $markdown = new MarkdownExtra();
        $this->result = $markdown->parse($this->content);
        */

    }

    /** Execute
     * 
     */
    public function execute():string{

        # Parse content
        $this->parseContent();

        # Return result
        return $this->result;

    }

}