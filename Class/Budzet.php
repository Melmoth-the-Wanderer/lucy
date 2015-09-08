<?php
require_once( 'Baza.php' );
require_once( 'Sesja.php' );
require_once( 'Walidator.php' );

class Budzet extends Baza {
  
  private $session;
  private $walidator;
  
  public function __construct() {
    $this->session = new Sesja();
    $this->walidator = new Walidator();
  }
  
  public function budzetWyplujWszystkie( $secret ) {
    $uid = $this->session->sesjaPhpZwrocUseraIdPoNazwieSesji();
    $query = "SELECT * FROM `BUDZET`
    WHERE `USER_ID` = :uid
    ORDER BY `zmodyfikowany` DESC;";
    $params = array(
      ':uid' => $uid
    );
    return json_encode( parent::get( $query, $params ) );
  }
  
  public function budzetWyplujPoId( $id, $secret ) {
    $uid = $this->session->sesjaPhpZwrocUseraIdPoNazwieSesji();
    $query = "SELECT * FROM `BUDZET`
    WHERE 
    `ID` = :id 
    AND `USER_ID` = :uid";
    $params = array(
      ':id' => $id,
      ':uid' => $uid
    );
    return json_encode( parent::get( $query, $params ) );
  }
  
  public function budzetDodaj( $nazwa, $secret ) {
    if( !$this->walidator->budzetNazwaWaliduj( $nazwa ) ) {
      header("HTTP/1.1 401 Nazwa posiada niepoprawny format");
      return false;
    }
    $query = "INSERT INTO `BUDZET`
    ( `nazwa`, `USER_ID` )
    VALUES
    ( :nazwa, :uid );";
    $params = array(
      ':nazwa' => $nazwa,
      ':uid' => $this->session->sesjaPhpZwrocUseraId()
    );
    $budzet_id = parent::post( $query, $params );
    $this->budzetTouch( $budzet_id );
    return $budzet_id;
  }
  
  public function budzetEdytuj( $budzet, $secret ) {
    $minimum = (string)$budzet->min;
    $maximum = (string)$budzet->max;
    $budzet_id = $budzet->ID;
    $start = $budzet->start;
    $stop = $budzet->stop;
    if( !$this->walidator->kwotaWaliduj( $minimum ) || !$this->walidator->kwotaWaliduj( $maximum ) ) {
      header("HTTP/1.1 401 Zły format kwoty");
      return false;
    }
    if( !$this->budzetSprawdzId( $budzet_id, $secret ) ) {
      header("HTTP/1.1 401 Błąd 001");
      return false;
    }
    $query = "UPDATE `BUDZET` SET
      `start` = :start, 
      `stop` = :stop, 
      `max` = :max,
      `min` = :min
      WHERE `ID` = :id;";
    $params = array( 
      ':start' => $start,
      ':stop' => $stop,
      ':max' => $maximum, 
      ':min' => $minimum,
      ':id' => $budzet_id
    );
    parent::post( $query, $params );
    $this->budzetTouch( $budzet_id );
  }
  
  public function budzetUsun( $budzet_id, $secret ) {
    $uid = $this->session->sesjaPhpZwrocUseraId( $secret );
    $query = "SELECT `ID` FROM `BUDZET`
    WHERE `ID` = :id;";
    $params = array(
      ':id' => $budzet_id
    );
    if( parent::get( $query, $params ) === NULL ) {
      header("HTTP/1.1 401 Nie mogę rozwiązać budżetu, który nie istnieje...");
      return false;
    }
    $query = "DELETE FROM `BUDZET`
    WHERE 
    `ID` = :id AND
    `USER_ID` = :uid";
    $params = array(
      ':id' => $budzet_id,
      ':uid' => $uid
    );
    parent::post( $query, $params );
    
    $this->operacjeUsunWszystkiePoBudzetId( $budzet_id );
  }
  
  private function budzetZwrocKwote( $budzet_id ) {
    $query = "SELECT `kwota` FROM `BUDZET`
      WHERE `ID` = :id;";
    $params = array( 
      ':id' => $budzet_id
    );
    $results = parent::get( $query, $params );
    return $results[0]['kwota'];
  }
  
  private function budzetKwotaPrzygotuj( $budzet_id, $kwota ) {
    return floatval( $this->budzetZwrocKwote( $budzet_id ) ) + floatval( $kwota );
  }
  
  private function budzetKwotaZmien( $budzet_id, $kwota ) {
    $query = "UPDATE `BUDZET`
      SET `kwota` = :kwota
      WHERE `ID` = :id;";
    $params = array( 
      ':kwota' => (string)$kwota,
      ':id' => $budzet_id
    );
    parent::post( $query, $params );
  }
  
  private function budzetTouch( $budzet_id ) {
    $query = "UPDATE `BUDZET`
      SET `zmodyfikowany` = :zmodyfikowany
      WHERE `ID` = :id;";
    $params = array( 
      ':zmodyfikowany' => date('Y-m-d H:i:s'),
      ':id' => $budzet_id
    );
    parent::post( $query, $params );
  }
  
  private function budzetSprawdzId( $budzet_id, $secret ) {
    $query = "SELECT `USER_ID` from `BUDZET`
      WHERE `ID` = :id;";
    $params = array(
      ':id' => $budzet_id
    );
    $results = parent::get( $query, $params );
    $uid = $this->session->sesjaPhpZwrocUseraId();
    if( !$results || $results[0]['USER_ID'] !== $uid ) {
      return false;
    }
    else {
      return true; 
    }
  }
  
  public function operacjeWyplujWszystkie( $budzet_id, $secret ) {
    if( !$this->budzetSprawdzId( $budzet_id, $secret ) ) {
      header("HTTP/1.1 401 Błąd 1");
      return false;
    }
    $query = "SELECT `rodzaj`, `ID`, `OPERACJA_TYP_ID`, `data`, `kwota` FROM
      (
        SELECT  'Przychód' `RODZAJ`, `ID`, `OPERACJA_TYP_ID`, `data`, `kwota`
        FROM    `PRZYCHOD`
        WHERE `BUDZET_ID` = :budzet_id
        UNION   ALL
        SELECT  'Wydatek' `RODZAJ`, `ID`, `OPERACJA_TYP_ID`, `data`, `kwota`
        FROM    `WYDATEK`
        WHERE `BUDZET_ID` = :budzet_id
        UNION ALL
        SELECT 'Wydatek (TRANSFER)' `RODZAJ`, `BUDZET_DAWCA_ID`, 1 `OPERACJA_TYP_ID`, `data`, `kwota`
        FROM `TRANSFER`
        WHERE `BUDZET_DAWCA_ID` = :budzet_id
        UNION ALL
        SELECT 'Przychód (TRANSFER)' `RODZAJ`, `BUDZET_BIORCA_ID`, 2 `OPERACJA_TYP_ID`, `data`, `kwota`
        FROM `TRANSFER`
        WHERE `BUDZET_BIORCA_ID` = :budzet_id
      ) subquery
      ORDER BY `data` DESC";
    $params = array(
      ':budzet_id' => $budzet_id
    );
    return json_encode( parent::get( $query, $params ) );
  }
  
  public function operacjeUsunWszystkiePoBudzetId( $budzet_id ) {
    $query = "DELETE FROM `PRZYCHOD`
      WHERE `BUDZET_ID` = :budzet_id;
      DELETE FROM `WYDATEK`
      WHERE `BUDZET_ID` = :budzet_id;";
    $params = array( 
      ':budzet_id' => $budzet_id
    );
    parent::post( $query, $params );
  }
  
  public function przychodDodaj( $kwota, $budzet_id, $secret ) {
    $kwota = (string)$kwota;
    if( !$this->walidator->kwotaWaliduj( $kwota ) ) {
      header("HTTP/1.1 401 Zły format kwoty");
      return false;
    }
    if( !$this->budzetSprawdzId( $budzet_id, $secret ) ) {
      header("HTTP/1.1 401 Błąd 1");
      return false;
    }
    $budzet_kwota = $this->budzetKwotaPrzygotuj( $budzet_id, floatval($kwota) );
    if( !$this->walidator->kwotaWaliduj( (string)$budzet_kwota ) ) {
      header("HTTP/1.1 401 Budżet przekracza dozwoloną kwotę");
      return false;
    }
    $this->budzetKwotaZmien( $budzet_id, $budzet_kwota );
    $this->budzetTouch( $budzet_id );
    $query = "INSERT INTO `PRZYCHOD`
      ( `kwota`, `BUDZET_ID`, `OPERACJA_TYP_ID`, `data` )
      VALUES
      ( :kwota, :budzet_id, 2, :czas );";
    $params = array(
      ':kwota' => $kwota,
      ':budzet_id' => $budzet_id,
      ':czas' => date('Y-m-d H:i:s')
    );
    return parent::post( $query, $params );
  }
  
  public function wydatekDodaj( $kwota, $budzet_id, $secret ) {
    $kwota = (string)$kwota;
    if( !$this->walidator->kwotaWaliduj( $kwota ) ) {
      header("HTTP/1.1 401 Zły format kwoty");
      return false;
    }
    if( !$this->budzetSprawdzId( $budzet_id, $secret ) ) {
      header("HTTP/1.1 401 Błąd 1");
      return false;
    }
    $budzet_kwota = $this->budzetKwotaPrzygotuj( $budzet_id, 0 - floatval($kwota) );
    if( !$this->walidator->kwotaWaliduj( (string)$budzet_kwota ) ) {
      header("HTTP/1.1 401 Nie posiadasz tyle funduszy w budżecie");
      return false;
    }
    $query = "INSERT INTO `WYDATEK`
      ( `kwota`, `BUDZET_ID`, `OPERACJA_TYP_ID`, `data` )
      VALUES
      ( :kwota, :budzet_id, 1, :czas );";
    $params = array(
      ':kwota' => $kwota,
      ':budzet_id' => $budzet_id,
      ':czas' => date('Y-m-d H:i:s')
    );
    $this->budzetKwotaZmien( $budzet_id, $budzet_kwota );
    $this->budzetTouch( $budzet_id );
    return parent::post( $query, $params );
  }

  public function transferWykonaj( $kwota, $budzet_dawca_id, $budzet_biorca_id, $secret ) {
    if( $budzet_dawca_id === $budzet_biorca_id ) {
      header("HTTP/1.1 401 Budżet dawcy musi być inny niż budżet biorcy");
      return false;
    }
    if( floatval($kwota) === 0 || $kwota === '0' ) {
      header("HTTP/1.1 401 Podaj kwotę przelewu");
      return false;
    }
    if( $budzet_dawca_id === 0 || $budzet_biorca_id === 0 ) {
      header("HTTP/1.1 401 Wybierz budżet biorcy");
      return false;
    }
    $kwota = (string)$kwota;
    if( !$this->walidator->kwotaWaliduj( $kwota ) ) {
      header("HTTP/1.1 401 Zły format kwoty");
      return false;
    }
    if( !$this->budzetSprawdzId( $budzet_dawca_id, $secret ) || !$this->budzetSprawdzId( $budzet_biorca_id, $secret ) ) {
      header("HTTP/1.1 401 Błąd 1");
      return false;
    }
    $budzet_dawca_kwota = $this->budzetKwotaPrzygotuj( $budzet_dawca_id, 0 - floatval($kwota) );
    $budzet_biorca_kwota = $this->budzetKwotaPrzygotuj( $budzet_biorca_id, floatval($kwota) );
    if( !$this->walidator->kwotaWaliduj( (string)$budzet_dawca_kwota ) ) {
      header("HTTP/1.1 401 Nie posiadasz tyle funduszy w budżecie");
      return false;
    }
    if( !$this->walidator->kwotaWaliduj( (string)$budzet_biorca_kwota ) ) {
      header("HTTP/1.1 401 Budżet biorcy przekracza dozwoloną kwotę");
      return false;
    }
    $query = "INSERT INTO `TRANSFER`
      ( `BUDZET_DAWCA_ID`, `BUDZET_BIORCA_ID`, `data`, `kwota` )
      VALUES
      ( :budzet_dawca_id, :budzet_biorca_id, :data, :kwota )";
    $params = array(
      ':budzet_dawca_id' => $budzet_dawca_id,
      ':budzet_biorca_id' => $budzet_biorca_id,
      ':data' => date('Y-m-d H:i:s'),
      ':kwota' => $kwota
    );
    $this->budzetKwotaZmien( $budzet_dawca_id, $budzet_dawca_kwota );
    $this->budzetKwotaZmien( $budzet_biorca_id, $budzet_biorca_kwota );
    $this->budzetTouch( $budzet_dawca_id );
    return parent::post( $query, $params );
  }
}














