<?php

require_once( '../../../Class/Konto.php' );

$postdata = file_get_contents( 'php://input' );
$data = json_decode( $postdata );

$konto = new Konto();
print $konto->zarejestruj( $data->nazwa, $data->haslo );