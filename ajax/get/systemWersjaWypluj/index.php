<?php

require_once( '../../../Class/System.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$system = new System();
print $system->wyplujAktualnaWersje();