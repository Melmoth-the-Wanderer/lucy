<?php

require_once( '../../../Class/Sesja.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$sesja = new Sesja();
$sesja->sesjaSprawdzPoprawnosc( $data->secret, $data->cookieValue );