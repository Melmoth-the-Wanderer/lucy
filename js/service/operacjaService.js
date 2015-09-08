'use strict';

Lucy.factory( 'operacjaService', function( $http, $location, infoService, sessionService ) {
  
  function operacjeWyplujPoBudzetId( budzetId, secret, scope, successCallback, failureCallback ) {
    var data = {
      id: budzetId,
      secret: secret
    };
    var $promise = $http.post( '/ajax/get/operacjeWyplujPoBudzetId/?'+lucy_v, data );
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
      var $promise = $http.post( '/ajax/post/przychodDodaj/?'+lucy_v, data );
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
      var $promise = $http.post( '/ajax/post/wydatekDodaj/?'+lucy_v, data );
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
  
  function transferWykonaj( kwota, budzet_dawca_id, budzet_biorca_id, secret, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        kwota: kwota.toString(),
        budzet_dawca_id: budzet_dawca_id,
        budzet_biorca_id: budzet_biorca_id,
        secret: secret
      };
      var $promise = $http.post( '/ajax/post/transferWykonaj/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response );
      });
    });
  }
  
  
  function operacjaUsunWszystkiePoBudzetId( budzetId ) {
    sessionService.check( function() {
      var data = {
        budzet_id: budzetId
      };
      var $promise = $http.post( '/ajax/post/operacjaUsunPoBudzetId/?'+lucy_v, data );
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
    transferWykonaj: transferWykonaj,
    operacjaUsunWszystkiePoBudzetId: operacjaUsunWszystkiePoBudzetId
  }
});