'use strict';

Lucy.factory( 'operacjaService', function( $http, $location, infoService, sessionService ) {
  
  function operacjeWyplujPoBudzetId( budzetId, secret, scope, successCallback, failureCallback ) {
    scope.loading = true;
    var data = {
      id: budzetId,
      secret: secret
    };
    var $promise = $http.post( '/ajax/get/operacjeWyplujPoBudzetId/', data );
    $promise.then( function( response ) {
      successCallback( response ); 
    }, function( response ) {
      successCallback( response );
    });
  }
  
  function przychodWyplujPoBudzetId( budzetId, secret, scope, successCallback, failureCallback ) {
    console.log( 'przychodWyplujPoBudzetId' );
  }
  
  function wydatekWyplujPoBudzetId( budzetId, secret, scope, successCallback, failureCallback ) {
    console.log( 'wydatekWyplujPoBudzetId' );
  }
  
  function przychodDodaj( kwota, budzetId, secret, scope, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        kwota: kwota.toString(),
        budzet_id: budzetId,
        secret: secret
      };
      var $promise = $http.post( '/ajax/post/przychodDodaj/', data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback(response ); 
      });
    }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    });
  }
  
  function wydatekDodaj( kwota, budzetId, secret, scope, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        kwota: kwota.toString(),
        budzet_id: budzetId,
        secret: secret
      };
      var $promise = $http.post( '/ajax/post/wydatekDodaj/', data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback(response ); 
      });
     }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    });
  }
  
  function wykonajTransfer( kwota, budzet_dawca_id, budzet_biorca_id, successCallback, failureCallback ) {
    
  }
  
  function operacjaUsunWszystkiePoBudzetId( budzetId ) {
    sessionService.check( function() {
      var data = {
        budzet_id: budzetId
      };
      var $promise = $http.post( '/ajax/post/operacjaUsunPoBudzetId/', data );
     }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    });
  }
  
  return {
    operacjeWyplujPoBudzetId: operacjeWyplujPoBudzetId,
    przychodWyplujPoBudzetId: przychodWyplujPoBudzetId,
    wydatekWyplujPoBudzetId: wydatekWyplujPoBudzetId,
    przychodDodaj: przychodDodaj,
    wydatekDodaj: wydatekDodaj,
    wykonajTransfer: wykonajTransfer,
    operacjaUsunWszystkiePoBudzetId: operacjaUsunWszystkiePoBudzetId
  }
});