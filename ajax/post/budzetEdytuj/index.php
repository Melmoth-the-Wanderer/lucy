<?php

require_once( '../../../Class/Budzet.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$budzet = new Budzet();
print $budzet->budzetEdytuj( $data->budzet, $data->secret );