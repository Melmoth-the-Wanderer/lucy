<?php

class Walidator {
  
  public function uzytkownikNazwaWaliduj( $uzytkownik ) {
    return preg_match( '/^\w{5,}$/', $uzytkownik );
  }
  
  public function uzytkownikHasloWaliduj( $haslo ) {
    if( strlen($haslo) <= '5' ) {
        //"Your Password Must Contain At Least 8 Characters!";
      return false;
    }
    elseif( !preg_match( "#[0-9]+#", $haslo ) ) {
        //"Your Password Must Contain At Least 1 Number!";
      return false;
    }
    elseif( !preg_match( "#[A-Z]+#", $haslo ) ) {
        //"Your Password Must Contain At Least 1 Capital Letter!";
      return false;
    }
    elseif( !preg_match( "#[a-z]+#", $haslo ) ) {
        //"Your Password Must Contain At Least 1 Lowercase Letter!";
      return false;
    }
    return true;
  }
  
  public function kwotaWaliduj( $kwota ) {
    return preg_match( "/^[0-9]{0,13}+(?:\.[0-9]{1,2})?$/", $kwota );
  }
  
  public function budzetNazwaWaliduj( $nazwa ) {
    return ( strlen( $nazwa ) > 1 ? true : false ); 
  }
  
}