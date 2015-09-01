<?php
require_once( 'Baza.php' );

class System extends Baza {

  public function wyplujAktualnaWersje() {
    $query = "SELECT `wartosc` FROM `SYSTEM`
      WHERE `opcja` = 'wersja';";
    $results = parent::get( $query, array() );
    if( $results !== NULL ) {
      return $results[0]['wartosc'];
    }
    else return false;
  }
}