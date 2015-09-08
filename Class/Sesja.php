<?php
require_once( 'Baza.php' );
require_once( 'Konto.php' );

class Sesja extends Baza {
  
  private $konto;
  
  public function __construct() {
    $this->konto = new Konto(); 
  }
  
  /*
   * Function sesjaPrzygotuj
   *
   *  Tworzy nową sesję, tymczasową lub trwałą
   *
   *  @param $username (STRING) Nazwa użytkownika, któremu chcemy założyć sesję
   *  @param $zapamiętaj (STRING) true lub false: czy zapamiętać sesję użytkownika do bazy danych
   *
   */
  public function sesjaPrzygotuj( $username, $zapamietaj, $secret = false ) {
    $secret = $this->sesjaPhpStworz( $username, $secret );
    $czas = date('Y-m-d H:i:s');
    if( $zapamietaj ) {
      $this->sesjaMysqlStworz( $secret, $czas, $_SERVER[ 'HTTP_USER_AGENT' ] );
    }
    $data = array( 'secret' => $secret, 'utworzona' => $czas );
    return json_encode( $data );
  }
  
  public function sesjaWykasujWszystko( $secret ) {
    session_start();
    $this->sesjaMysqlWykasujPoUseridUa( $_SESSION[ 'user_id' ], $_SERVER[ 'HTTP_USER_AGENT' ] );
    $this->sesjaMysqlWykasujPoSecret( $secret );
    $this->sesjaPhpZniszcz();
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
  private function sesjaPhpStworz( $username, $secret ) {
    session_start();
    if( !$secret )
      $secret = md5( openssl_random_pseudo_bytes( 25 ) );
    $_SESSION[ 'name' ] = $username;
    $_SESSION[ 'user_id' ] = $this->sesjaPhpZwrocUseraIdPoNazwieSesji();
    $_SESSION[ 'secret' ] = $secret;
    $_SESSION[ 'loggedIn' ] = true;
    return $secret;
  }
  
  /*
   *  Function sesjaPhpZniszcz
   *
   *  Kasuje wszelkie zmienne sesji PHP i usuwa sesję całkowicie
   */
  public function sesjaPhpZniszcz() {
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
   
  public function sesjaPhpZwrocUseraIdPoNazwieSesji() {
    session_start();
    $name = $_SESSION[ 'name' ];
    $query = "SELECT `ID` FROM `USER`
      WHERE `nazwa` = :nazwa;";
    $params = array( 
      ':nazwa' => $name
    );
    $results = parent::get( $query, $params );
    return ( $results === NULL ? false : $results[0]['ID'] );
  }
  
  public function sesjaPhpZwrocUseraId() {
    session_start();
    return $_SESSION[ 'user_id' ];
  }
  
  private function sesjaPhpCzyIstnieje() {
    session_start();
    if( !isset( $_SESSION[ 'loggedIn' ] ) || $_SESSION[ 'loggedIn' ] === '' || !$_SESSION[ 'loggedIn' ] )
      return false;
    return true;
  }
  
  private function sesjaPhpSprawdz( $secret ) {
    session_start();
    if( $_SESSION[ 'secret' ] !== $secret )
      return false;
    return true;
  }
  
  /*
   *  Function sesjaMysqlStworz
   *
   *  Tworzy w bazie danych nową sesję użytkownika
   *
   *  @param $secret (STRING) Wygenerowany uprzednio klucz secret
   */
  private function sesjaMysqlStworz( $secret, $czas, $ua ) {
    session_start();
    $user_id = $_SESSION[ 'user_id' ];
    $sesjaCzyIstnieje = $this->sesjaMysqlWyplujPoUseridUaSecret( $user_id, $ua );
    if( !$sesjaCzyIstnieje ) {
      $query = "INSERT INTO `SESJA`
        ( `USER_ID`, `secret`, `ua`, `utworzona` )
        VALUES
        ( :user_id, :secret, :ua, :utworzona );";
    }
    else {
      $query = "UPDATE `SESJA` SET
        `secret` = :secret,
        `utworzona` = :utworzona
        WHERE
        `USER_ID` = :user_id
        AND `ua` = :ua;";
    }
    $params = array(
      ':user_id' => $user_id,
      ':secret' => $secret,
      ':ua' => $ua,
      ':utworzona' => $czas
    );
    return parent::post( $query, $params );
  }
  
  private function sesjaMysqlTouch( $secret, $czas, $ua ) {
    $query = "UPDATE `SESJA` SET
      `sprawdzono` = :sprawdzono
      WHERE
      `secret` = :secret
      AND `ua` = :ua
      AND `utworzona` = :utworzona;";
    $params = array(
      ':sprawdzono' => date('Y-m-d H:i:s'),
      ':secret' => $secret,
      ':ua' => $ua,
      ':utworzona' => $czas
    );
    var_dump( parent::post( $query, $params ) );
  }
  
  /*
   *  Function sesjaMysqlZwróć
   *
   *  Zwraca 
   *
   *  @param $secret (STRING) Wygenerowany uprzednio klucz secret
   */
  private function sesjaMysqlWyplujPoUseridUaSecret( $user_id, $ua ) {
    $query = "SELECT * FROM `SESJA`
      WHERE
      `USER_ID` = :user_id
      AND `ua` = :ua;";
    $params = array(
      ':user_id' => $user_id,
      ':ua' => $ua
    );
    return parent::get( $query, $params );
  }
  
  private function sesjaMysqlWyplujPoUaSecretCzas( $ua, $secret, $czas ) {
    $query = "SELECT * FROM `SESJA`
      WHERE
      `ua` = :ua
      AND `secret` = :secret
      AND `utworzona` = :utworzona;";
    $params = array( 
      ':ua' => $ua,
      ':secret' => $secret,
      'utworzona' => $czas
    );
    return parent::get( $query, $params );
  }
  
  private function sesjaMysqlWykasujPoUseridUa( $user_id, $ua ) {
    $query = "DELETE FROM `SESJA`
      WHERE
      `USER_ID` = :user_id
      AND `ua` = :ua;";
    $params = array(
      ':user_id' => $user_id,
      ':ua' => $ua
    );
    parent::post( $query, $params );
  }
  
  private function sesjaMysqlWykasujPoSecret( $secret ) {
    $query = "DELETE FROM `SESJA`
      WHERE
      `secret` = :secret;";
    $params = array(
      ':secret' => $secret
    );
    parent::post( $query, $params );
  }
  
  public function sesjaSprawdzPoprawnosc( $secret, $cookieValue ) {    
    if( !$cookieValue ) {
      if( !$this->sesjaPhpCzyIstnieje() || !$this->sesjaPhpSprawdz( $secret ) ) {
        header("HTTP/1.1 401 Sesja jest niepoprawna");
        return false;
      }
      return true;
    }
    else {
      if( $this->sesjaPhpCzyIstnieje() ) { // TUTAJ NIE MA BYĆ NOT'a ( ! )
        if( !$this->sesjaPhpSprawdz( $secret ) ) { 
          $this->sesjaWykasujWszystko( $secret );
          header("HTTP/1.1 401 Sesja jest niepoprawna");
          return false;
        }
        $this->sesjaMysqlTouch( $secret, $cookieValue->utworzona, $_SERVER[ 'HTTP_USER_AGENT' ] );
        return true;
      }
      else {
        $dbSesja = $this->sesjaMysqlWyplujPoUaSecretCzas( $_SERVER[ 'HTTP_USER_AGENT' ], $secret, $cookieValue->utworzona );
        if( !$dbSesja ) {
          $this->sesjaWykasujWszystko( $secret );
          header("HTTP/1.1 401 Sesja jest niepoprawna, próba zalogowania ze złym kluczem");
          return false;
        }
        $user_results = $this->konto->uzytkownikZwrocNazwaPoId( $dbSesja[0]['USER_ID'] );
        $this->sesjaPrzygotuj( $user_results[0]['nazwa'], false, $secret );
        $this->sesjaMysqlTouch( $secret, $cookieValue->utworzona, $_SERVER[ 'HTTP_USER_AGENT' ] );
        return true;
      }
    }
  }
}