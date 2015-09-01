<?php

require_once( '../../../Class/Sesja.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$sesja = new Sesja();
print $sesja->sesjaWykasujWszystko( $data->secret );