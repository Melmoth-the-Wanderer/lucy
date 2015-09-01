<?php 
require_once( 'Baza.php' );
require_once( 'Walidator.php' );
require_once( 'password.php' );

Class Konto extends Baza {
  
  private $walidator;
  
  public function __construct() {
    $this->walidator = new Walidator();
  }
  
  private function uzytkownikCzyPoprawny( $uzytkownik ) {
    return $this->walidator->uzytkownikNazwaWaliduj( $uzytkownik );
  }
  
  public function uzytkownikHasloSprawdzKlucz( $uzytkownik, $haslo ) {
    if( !$this->uzytkownikCzyPoprawny( $uzytkownik ) ) {
      header("HTTP/1.1 401 Błędna nazwa użytkownia");
      return false;
    }
    if( !$this->uzytkownikCzyIstnieje( $uzytkownik ) ) {
      header("HTTP/1.1 401 Błędny login lub hasło");
      return false;
    }
    if( !$haslo || $haslo === '' ) {
      header("HTTP/1.1 401 Hasło nie może być puste");
      return false;
    }
    $query = "SELECT `password` FROM `USER`
      WHERE `nazwa` = :nazwa;";
    $params = array(
      ":nazwa" => parent::htmlencode( $uzytkownik )
    );
    $results = parent::get( $query, $params );
    if( !password_verify( $haslo, $results[0]['password'] ) ) {
      header("HTTP/1.1 401 Błędny login lub hasło");
      return false;
    }
    else {
      return true;
    }
  }
  
  private function uzytkownikCzyIstnieje( $uzytkownik ) {
    $query = "SELECT `ID` FROM `USER`
    WHERE `nazwa` = :nazwa;";
    $params = array( 
      ':nazwa' => parent::htmlencode( $uzytkownik )
    );
    if( parent::get( $query, $params ) === NULL )
      return false;
    else return true;
  }
  
  public function uzytkownikZwrocNazwaPoId( $user_id ) {
    $query = "SELECT  `nazwa` FROM `USER`
      WHERE `ID` = :user_id;";
    $params = array( 
      ':user_id' => $user_id
    );
    return parent::get( $query, $params );
  }  
  
  private function passwordHash( $password ) {
    return password_hash( $password, PASSWORD_BCRYPT );
  }
                                
  private function uzytkownikUtworz( $uzytkownik, $haslo ) {
    $query = "INSERT INTO `USER`
      ( `nazwa`, `password` )
      VALUES
      ( :nazwa, :password );";
      $params = array(
        ':nazwa' => parent::htmlencode( $uzytkownik ), 
        ':password' => $this->passwordHash( $haslo )
      );
      return parent::post( $query, $params );
  }
  
  public function zarejestruj( $uzytkownik, $haslo ) {
    if( !$this->uzytkownikCzyPoprawny( $uzytkownik ) ) {
      header("HTTP/1.1 401 Błędny format nazwy konta");
      return 0;
    }
    if( $this->uzytkownikCzyIstnieje( $uzytkownik ) ) {
      header("HTTP/1.1 401 Wybrana nazwa jest zajęta");
      return 0;
    }
    else if ( !$this->walidator->uzytkownikHasloWaliduj( $haslo ) ) {
      header("HTTP/1.1 401 Błędny format hasła");
      return 0;
    }
    else {
      $this->uzytkownikUtworz( $uzytkownik, $haslo );
    }
  }
}