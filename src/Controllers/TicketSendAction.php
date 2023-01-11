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

use Error;
use LuckyPHP\Interface\Controller as ControllerInterface;
use LuckyPHP\Server\Exception as CrazyException;
use LuckyPHP\Base\Controller as ControllerBase;
use League\HTMLToMarkdown\HtmlConverter;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
use LuckyPHP\Server\Config;
use LuckyPHP\File\Json;

/** Class for manage the workflow of the app
 *
 */
class TicketSendAction extends ControllerBase implements ControllerInterface{

    /** Attributes
     * 
     */
    private ?PHPMailer $mail = null;

    /**
     * Ticket Config
     */
    private ?array $ticketConfig = null;
    private ?array $ticketSettings = null;
    private ?array $mailConfig = null;

    /** Constructor
     *
     */
    public function __construct(...$arguments){

        # Parent constructor
        parent::__construct(...$arguments);

        # Set ticket config
        $this->setTicketConfig();

        # New model
        $this->newModel();

        # Push records
        $this->pushRecords();

        # Prepare mail
        $this->prepareMail();

        # Set name
        $this->name="ticketSendAction";

    }

    /** Set Ticket Config
     * 
     */
    public function setTicketConfig():void {

        # Set ticket config
        $this->ticketConfig = Config::read("/config/ticket.yml");

        # Get mail config path 
        $mailConfigPath = $this->ticketConfig["ticket"]["mail"]["settings"] ?? null;

        # Check file exists
        if($mailConfigPath !== null && file_exists(__ROOT_APP__.$mailConfigPath))

            # Try
            try{

                # Set mail config
                $this->mailConfig = Json::open(__ROOT_APP__.$mailConfigPath);

            }catch(CrazyException $error){

                # Print message
                echo "Please create and fill the mail_settings.json !";

            }

    }

    /** Records
     * 
     */
    public function pushRecords(){

        # Push records
        $this->model->pushRecords([]);

        # Set model data in data
        $this->setData($this->model->execute());

    }

    /** Prepare mail
     *
     */
    public function prepareMail(){

        # New php mailer instance
        $mail = new PHPMailer();
        
        # Server settings
        # $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Host = $this->mailConfig["Host"];
        $mail->SMTPAuth = $this->mailConfig["SMTPAuth"];
        $mail->Username = $this->mailConfig["Username"];
        $mail->Password = $this->mailConfig["Password"];
        $mail->SMTPSecure = $this->mailConfig["SMTPSecure"];
        $mail->Port = $this->mailConfig["Port"];

        # Recipients
        $mail->setFrom($_POST["email"], $this->parseNameFromEmail($_POST["email"]));

        ## To

        # Get to
        $mailto = $this->ticketConfig["ticket"]["mail"]["to"] ?? [];

        # Check to
        if(!empty($mailto))

            # Iteration of to
            foreach($mailto as $to){

                # Set address
                $mail->addAddress(...$this->parseEmail($to));

            }

        # Check post tool
        if(isset($_POST["tool"]) && filter_var($_POST["tool"], FILTER_VALIDATE_EMAIL))

            # Set address
            $mail->addAddress($_POST["tool"]);

        ## Cc

        # Get Cc
        $mailCc = $this->ticketConfig["ticket"]["mail"]["cc"] ?? [];

        # Check to
        if(!empty($mailCc))

            # Iteration of to
            foreach($mailCc as $cc)

                # Set address
                $mail->addCC(...$this->parseEmail($cc));
        ## bcc

        # Get bcc
        $mailBcc = $this->ticketConfig["ticket"]["mail"]["bcc"] ?? [];

        # Check to
        if(!empty($mailBcc))

            # Iteration of to
            foreach($mailBcc as $bcc)

                # Set address
                $mail->addBCC(...$this->parseEmail($bcc));

        # Get images in message
        $result = $this->parseImages($_POST["message"]);

        # Check images
        if(!empty($result["images"]))

            # Iteration images
            foreach($result["images"] as $cid => $path){

                # Push embedded image
                $mail->addEmbeddedImage($path, $cid);

            }

        # Content
        $mail->isHTML(true);
        $mail->Subject = $_POST["title"];

        # Body
        $converter = new HtmlConverter([
            'header_style'=>'atx'
        ]);

        # Prepare markdown
        $markdown = $converter->convert($result["message"]); 
        $markdown = $this->cleanMarkdown($markdown);

        $mail->Body = $result["message"];
        $mail->AltBody = $markdown;


        # Send email
        if($mail->send()){

            # Check images
            if(!empty($result["images"]))

                # Iteration images
                foreach($result["images"] as $path){

                    # Delete image
                    unlink($path);

                }

        }

    }

    /** Parse email
     * 
     * @param array $input Input with mail and name keys
     * @return array
     */
    private function parseEmail(array $input = []):array {

        # Set result
        $result = [];

        # Check input
        if(!(count($input) >= 2 && ($input["mail"] ?? false) && ($input["name"] ?? false)))

            # New error
            throw new Error("Given email \"".json_encode($input)."\" isn't valid...");

        # Iteration settings
        foreach($input as $k => $v)

            $input[$k] = $this->parseToken($v);

        # Check name
        if(!isset($input["name"]) || $input["name"] == null)

            # Parse name from email
            $input["name"] = $this->parseNameFromEmail($input["email"]);

        # Set email
        $result[0] = $input["mail"];
        
        # Set name
        $result[1] = ucwords($input["name"]);

        # Return result
        return $result;
        
    }

    /** Parse token
     * 
     */
    private function parseToken(string $value = ""):string {

        # Declare result
        $result = $value;

        # Check value given
        if(!$value)

            # Return
            return $result;

        # Get items between brackets
        preg_match_all('/\{(.+?)\}/', $value, $items);

        # Check items
        if(!empty($items[1]))

            # Iteration items
            foreach($items[1] as $key => $item){

                # Split item by separator
                $itemExploded = explode(".", $item);

                # Check first value is post
                if($itemExploded[0] === "post")

                    # Replace value in string
                    $result = str_replace(
                        $item[0][$key],
                        $_POST[$itemExploded[1]] ?? "",
                        $result
                    );

                else
                # Check forst value is get
                if($itemExploded[0] === "get")

                    # Replace value in string
                    $result = str_replace(
                        $item[0][$key],
                        $_GET[$itemExploded[1]] ?? "",
                        $result
                    );

                else
                # Delete brackets

                    # Replace value in string
                    $result = str_replace(
                        $item[0][$key],
                        "",
                        $result
                    );

            }

        # Return result
        return $result;

    }

    /** Parse Name From Email
     * 
     */
    private function parseNameFromEmail(string $email = ""):string {

        # Set result
        $result = $email;

        # Explode with @
        $result = explode("@", $result, 2)[0];

        # Check email
        if(!$result)

            # Return result
            return $result;

        # Explode result
        $result = implode(" ", explode(".", $result));

        # Return result
        return $result;

    }

    /** Parse image
     * 
     */
    public function parseImages(string $message = ""):array{

        # Declare reponse
        $result = [
            "message"   =>  $message,
            "images"    =>  [],
        ];

        # Check message
        if(!$message)
            
            # Return response
            return $result;

        # Search image in message
        preg_match_all('/<img src="data:(.*?)" alt="">/', $message, $matches);

        # Alternative
        if(empty($matches[0])){

            # Search image in message
            preg_match_all('/<img src="data:(.*?)">/', $message, $matches);

        }

        # Check matches
        if(!empty($matches[1]))

            # Iteration matches
            foreach($matches[1] as $key => $imageString){

                # Get type of image
                $type = explode(";", $imageString, 2)[0];

                # Format corespondance
                $typeToFormat = [
                    "image/png" =>  "png",
                ];

                # Get format type
                $format = $typeToFormat[$type] ?? null;

                # Check format in null
                if($format === null)

                    # Continue
                    continue;

                # Extract the actual base64 encoded image data
                $imageData = base64_decode(explode(',', $imageString)[1]);

                /*
                $imageData = base64_decode(
                    preg_replace(
                        '#^data:image/\w+;base64,#i',
                        '', 
                        str_replace(" ", "+", $imageString)
                    )
                );
                 */
                  
                # Get randorm file name
                $random_filename = $this->generateRandomFilename(10);

                # Create folder
                if(!file_exists(__ROOT_APP__."/cache/mail") && !mkdir(__ROOT_APP__."/cache/mail", 0777, true))

                    # New error
                    throw new Error("Please create \"/cache/mail/\" and give it 0777 permission !");

                # Save the image data to a file
                file_put_contents(__ROOT_APP__."/cache/mail/$random_filename.$format", $imageData);

                # Clean message
                $result["message"] = str_replace($matches[0][$key], "<img alt=\"Fixwiki\" src=\"cid:$random_filename\">", $result["message"]);

                # Push in result in images
                $result["images"][$random_filename] = __ROOT_APP__."cache/mail/$random_filename.$format";

            }

        # Return response
        return $result;

    }

    # Function random file name
    private function generateRandomFilename($length = 10) {
        return substr(bin2hex(random_bytes($length)), 0, $length);
    }

    /** Clean Markdown
     * 
     */
    private function cleanMarkdown(string $markdown = ""):string {

        # Set result
        $result = $markdown;

        # Check markdown
        if(!$markdown)

            # Return result
            return $result;

        # Clean bug of markdown parser
        $result = str_replace("\-", "-", $result);

        # Catch pre
        preg_match_all("/(```(?:.|\n)*?```|    .*(?:\n|$))/", $markdown, $matches);

        # Check match
        if(!empty($matches[1]))

            # Iteration of match
            foreach($matches[1] as $match)

                # Replace match
                $result = str_replace($match, strip_tags($match), $result);

        # Fix image href
        preg_match_all("/!\[(.*?)\]\(cid:(.*?)\)/", $markdown, $matches);

        # Check match
        if(!empty($matches[0]))

            # Iteration of match
            foreach($matches[0] as $key => $match){

                # Replace string
                $result = str_replace(
                    $match,
                    "<img alt=\"".$matches[1][$key]."\" src=\"cid:".$matches[2][$key]."\">",
                    $result
                );

            }

        # Return result
        return $result;

    }

    /** Response
     *
     */
    public function response(){

        # Return reponse
        return $this->name;

    }
}
