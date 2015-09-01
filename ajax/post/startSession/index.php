<?php

require_once( '../../../Class/Sesja.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$session = new Sesja();
print $session->sesjaPrzygotuj( $data->nazwa, $data->zapamietaj );