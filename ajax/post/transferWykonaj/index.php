<?php

require_once( '../../../Class/Budzet.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$budzet = new Budzet();
$budzet->transferWykonaj( $data->kwota, $data->budzet_dawca_id, $data->budzet_biorca_id, $data->secret );