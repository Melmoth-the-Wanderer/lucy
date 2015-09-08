'use strict';

Lucy.factory( 'budzetService', function( $http, $location, infoService, sessionService, kontoService, operacjaService ) {
  
  function budzetWyplujWszystkie( scope, secret, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        secret: secret
      }
      var $promise = $http.post( '/ajax/get/budzetWyplujWszystkie/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response ); 
      });
    },  function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    }, false );
  }

  function budzetWyplujPoId( budzetId, secret, scope, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        id: budzetId,
        secret: secret
      };
      var $promise = $http.post( '/ajax/get/budzetWyplujPoId/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response )
      }, function( response ) {
        failureCallback( response ) 
      });
    },  function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    }, false );
  }
  
  function budzetDodaj( budzet, secret, scope, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        budzet: budzet,
        secret: secret
      };
      sessionService.check( function() {}, function() {} );
      var $promise = $http.post( '/ajax/post/budzetDodaj/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response );
      });
    }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    }, true );
  }
  
  function budzetUsun( budzetId, secret, scope, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        id: budzetId,
        secret: secret
      };
      sessionService.check( function() {}, function() {} );
      var $promise = $http.post( '/ajax/post/budzetUsun/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response );
      });
    }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    }, true );
  }
  
  function budzetEdytuj( budzet, secret, successCallback, failureCallback ) {
    sessionService.check( function() {
      var data = {
        secret: secret,
        budzet: budzet
      };
      sessionService.check( function() {}, function() {} );
      var $promise = $http.post( '/ajax/post/budzetEdytuj/?'+lucy_v, data );
      $promise.then( function( response ) {
        successCallback( response );
      }, function( response ) {
        failureCallback( response );
      });
    }, function() {
      sessionService.destroy( scope, secret, function(){
        $location.path( '/login' );
      }, function(){} );
    }, true );
  }
  
  return {
    budzetWyplujWszystkie: budzetWyplujWszystkie,
    budzetWyplujPoId: budzetWyplujPoId,
    budzetDodaj: budzetDodaj,
    budzetEdytuj: budzetEdytuj,
    budzetUsun: budzetUsun
  }
  
});