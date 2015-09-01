<?php

class Baza {
  private $db;
  private static $db_name = 'epvk_lucyprod';
  private static $db_user = 'epvk_lucyprod';
  private static $db_pw = '1pUVIgBr';
  private static $db_host = 'sql.s14.vdl.pl';


  private function conn() {
    if( !$this->db instanceof PDO ) {
      try {
        $this->db = new PDO( "mysql:host=".self::$db_host.";dbname=".self::$db_name.";charset=utf8", self::$db_user, self::$db_pw );
      }
      catch( PDOException $exception ) {
        echo "Connection error: " . $exception->getMessage();
      }
    }
  }
  
  protected function htmlEncode( $string ) {
    
    return htmlentities( nl2br( $string ), ENT_QUOTES, 'UTF-8' );
  }
  
  protected function htmlDecode( $results ) {
    
    if( is_array( $results ) ) {
      foreach( $results as $key => $value ) {
        foreach( $results[ $key ] as $kkey => $vval ) {
           $results[ $key ][ $kkey ] = html_entity_decode( $vval, ENT_QUOTES, 'UTF-8' );
        }
      }
    }
    return $results;
  }
  

  protected function get( $query, $params = null ) {
    $this->conn();
    $stmt = $this->db->prepare( "SET NAMES utf8" );
    $stmt->execute();

    $stmt = $this->db->prepare( $query );
    
    if( gettype( $params ) == 'array' ) {
      foreach( $params as $p => $v ) {
        $stmt->bindParam( $p, $params[$p] );
      }
    } 
    
    $stmt->execute();
    $num = $stmt->rowCount();
    if( $num > 0 ) {
      $dane = Array();
      while( $row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push( $dane, $row );
      }
      return $dane;
    }
    else return null;
  }

  
  protected function post( $query, $params = null ) {
    $this->conn();
    $stmt = $this->db->prepare( "SET NAMES utf8" );
    $stmt->execute();
 
    $stmt = $this->db->prepare( $query );
    if( gettype( $params ) == 'array' ) {
      foreach( $params as $p => $v ) {
        $stmt->bindParam( $p, $params[$p] );
      }
    } 
    if( $stmt->execute() ) {
      return $this->db->lastInsertId();
    }
    else {
      return $this->db->errorInfo();
    }
  }
}
