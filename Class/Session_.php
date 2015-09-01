<?php
require_once( 'Baza.php' );

class Session extends Baza {
  
  
  /*
   * Function sesjaPrzygotuj
   *
   *  Tworzy nową sesję, tymczasową lub trwałą
   *
   *  @param $username (STRING) Nazwa użytkownika, któremu chcemy założyć sesję
   *  @param $zapamiętaj (STRING) true lub false: czy zapamiętać sesję użytkownika do bazy danych
   *
   */
  public function sesjaPrzygotuj( $username, $zapamietaj ) {
    if( $this->sesjaPhpCzyAktywna() ) {
      $this->sesjaPhpWykasuj();
      $this->sesjaMysqlWykasuj( $username );
    }
    $secret = $this->sesjaPhpStworz( $username );
    if( $zapamietaj ) {
      $this->sesjaMysqlStworz( $secret );
    }
    return $secret;
  }
  
  public function sesjaWykasuj() {
    session_start();
    $username = $_SESSION[ 'name' ] ? $_SESSION[ 'name' ] : false;
    if( $username !== false )
      $this->sesjaMysqlWykasuj( $username );
    $this->sesjaPhpWykasuj();
  }
  
  /*
   * Function sesjaPhpCzyAktywna
   *
   *  Sprawdza, czy dane sesji są zapisane do zmiennej sesji PHP
   *
   *  @return (BOOL) true jeśli tak, false jeśli nie
   */
  private function sesjaPhpCzyAktywna() {
    session_start();
    if( !isset( $_SESSION[ 'loggedIn'] ) || !$_SESSION[ 'loggedIn'] || $_SESSION['loggedIn' ] === '' ) {
      return false; 
    }
    else return true;
  }
  
  /*
   *  Function sesjaPhpStworz
   *  
   *  Tworzy zmienne PHP dla sesji
   *
   *  @param $username (STRING) Login użytkownika
   *
   *  @return (STRING) wygenerowany klucz Secret sesji
   */
  private function sesjaPhpStworz( $username, $secret = false ) {
    session_start();
    if( !$secret )
      $secret = md5( openssl_random_pseudo_bytes( 25 ) );
    $_SESSION[ 'name' ] = $username;
    $_SESSION[ 'secret' ] = $secret;
    $_SESSION[ 'loggedIn' ] = true;
    return $secret;
  }
  
  /*
   *  Function sesjaPhpWykasuj
   *
   *  Kasuje wszelkie zmienne sesji PHP i usuwa sesję całkowicie
   */
  public function sesjaPhpWykasuj() {
    session_start();
    $_SESSION = array();
    if( ini_get( "session.use_cookies" ) ) {
      $params = session_get_cookie_params();
      setcookie( session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
      );
    }
    session_destroy();
  }
  
  /*
   * Function sesjaPhpWyplujNazwe
   *
   *  Zwraca nazwę sesji ze zmiennej sesji w PHP
   *
   *  @param $secret (STRING) Klucz Secret sesji
   *
   *  @return (SRING) Nazwa sesji lub false, jeśli nie istnieje
   */
  public function sesjaPhpWyplujNazwe( $secret ) {
    session_start();
    if( $this->sesjaSprawdzSecretKey( $secret, 'false' ) ) {
      return $_SESSION[ 'name' ];
    }
    else return false;
  }
  
  /*
   *  Function sesjaMysqlStworz
   *
   *  Tworzy w bazie danych nową sesję użytkownika
   *
   *  @param $secret (STRING) Wygenerowany uprzednio klucz secret
   */
  private function sesjaMysqlStworz( $secret ) {
    $username = $_SESSION[ 'name' ];
    $query = "UPDATE `USER`
      SET `sesja` = :sesja
      WHERE `nazwa` = :nazwa;";
    $params = array(
      ':sesja' => $secret,
      ':nazwa' => $username
    );
    parent::post( $query, $params );
  }
  
  /*
   *  Function sesjaMysqlWykasuj
   *
   *  Kasuje z bazy danych sesję użytkownika
   *
   *  @param $username (STRING) nazwa użytkoniwka, którego sesję chcemy wykasować
   */
  private function sesjaMysqlWykasuj( $username ) {
    $query = "UPDATE `USER`
      SET `sesja` = null
      WHERE `nazwa` = :nazwa;";
    $params = array(
      ':nazwa' => $username
    );
    parent::post( $query, $params );
  }
  
  /*
   * Function sesjaMysqlWyplujSecret
   *
   *  Zwraca klucz secret zapisany w bazie danych
   *
   *  @param $secret (STRING) Klucz Secret pobrany z sesji przeglądarki lub ciastka
   *
   *  @return (STRING) Wynik z DB
   */
  private function sesjaMysqlWyplujSecret( $secret ) {
    $uid = $this->sesjaMysqlZwrocUseraId( $secret );
    if( !$uid )
      return false;
    $query = "SELECT `sesja` FROM `USER`
      WHERE `ID` = :id;";
    $params = array(
      ':id' => $uid
    );
    $results = parent::get( $query, $params );
    return $results;
  }
  
  // ???????????????????????
  public function sesjaMysqlZwrocUseraId( $secret ) {
    $query = "SELECT `ID` FROM `USER`
    WHERE `sesja` = :secret;";
    $params = array( 
      ':secret' => $secret
    );
    $results = parent::get( $query, $params );
    return ( $results === 'NULL' ? false : $results[0]['ID'] );
  }
  
  public function sesjaPhpZwrocUseraId() {
    session_start();
    $name = $_SESSION[ 'name' ];
    $query = "SELECT `ID` FROM `USER`
      WHERE `nazwa` = :nazwa;";
    $params = array( 
      ':nazwa' => $name
    );
    $results = parent::get( $query, $params );
    return ( $results === 'NULL' ? false : $results[0]['ID'] );
  }
  
  private function sesjaMysqlWyplujUsera( $secret ) {
    $query = "SELECT `nazwa` FROM `USER`
      WHERE `sesja` = :secret;";
    $params = array( 
      ':secret' => $secret
    );
    $results = parent::get( $query, $params );
    return ( $results === 'NULL' ? false : $results[0]['nazwa'] );
  }
  
  /*
   *  Funkcja sprawdzSecretKey
   *  Funkcja sprawdza czy w sesji lub w bazie danych (jeśli jest cookieValue) istnieje poprawny klucz sesji.
   *
   *  @param $secret (STRING) Klucz Secret, który jest sprawdzany
   *  @param $cookieValue (STRING) Wartość ciasteczka, lub 'false' jeśli brak
   *
   *  @return (bool) TRUE, jeśli secret OK, FALSE, jeśli secret nie pasuje lub inny błąd
   */
  private function sesjaSprawdzSecretKey( $secret, $cookieValue ) {
    if( $secret === 'login' ) 
      return true;
    session_start();
    if( $cookieValue !== 'false' && $_SESSION[ 'loggedIn' ] !== true ) {
      $mysqlSecret = $this->sesjaMysqlWyplujSecret( $secret );
      if( $mysqlSecret !== 'null' && $mysqlSecret[0][ 'sesja' ] === $secret ) {
        return true;
      }
    }
    else {
      if( $_SESSION[ 'secret' ] === $secret )
        return true;
      else
        return false;
    }
    return false;
  }
  
  /*
   * Function sesjaSprawdzPoprawnosc
   *
   *  Sprawdza, czy sesja istnieje na serwerze i czy klucze sesji są poprawne
   *
   *  @param $secret (STRING) Klucz sesji przesłany z session storage przeglądarki
   *  @param $cookieValue (STRING) Klucz sesji przesłany z ciasteczka LUB 'false', jeśli ciastko nie istnieje
   *
   *  @return (INT) 1 jeśli sesja istnieje i jest porpawna, 0 (oraz http 401) jeśli sesja nie istnieje / jest niepoprawna
   */
  public function sesjaSprawdzPoprawnosc( $secret, $cookieValue ) {
    session_start();
    $isSecretValid = $this->sesjaSprawdzSecretKey( $secret, $cookieValue );
    if( $isSecretValid ) {
      if( !$this->sesjaPhpCzyAktywna() ) {
        $username = $this->sesjaMysqlWyplujUsera( $secret );
        if( !$username ) {
          header("HTTP/1.1 401 Sesja jest niepoprawna");
          return 0; 
        }
        else
          $this->sesjaPhpStworz( $username, $secret );
      }
      return 1;
    }
    else {
      $this->sesjaPhpWykasuj();
      header("HTTP/1.1 401 Sesja jest niepoprawna");
      return 0; 
    }
  }
  
}