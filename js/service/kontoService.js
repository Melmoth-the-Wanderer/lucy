'use strict';

Lucy.factory( 'kontoService', function( $rootScope, $http, $location, sessionService, infoService ) {
  
  function czyZalogowany( successCallback, failureCallback, updateSystem ) { 
    if( updateSystem === undefined )
      updateSystem = true;
    sessionService.check( successCallback, failureCallback, updateSystem );
  };
  
  function zaloguj( konto, scope, successCallback, failureCallback ) {
    wyloguj( scope, function(){}, function(){} );
    var $promise = $http.post( '/ajax/get/kontoSprawdzLogin/', konto );
    $promise.then( function( response ) {
      sessionService.set( konto, scope, successCallback, failureCallback );
    }, function( response ) {
      scope.message = {};
      scope.message.error = response.statusText;
      scope.loading = false;
    });
  };
  
  function wyloguj( scope, secret, successCallback, failureCallback ) {
    sessionService.destroy( scope, secret, successCallback, failureCallback );
  };
  
  function zarejestruj( konto, successCallback, failureCallback ) {
    var $promise = $http.post( '/ajax/post/kontoToCreate/', konto );
    $promise.then( function( response ) {  
      successCallback( response );
    }, function( response ) {
      failureCallback( response );
    });
  };
  
  return {
    zarejestruj: zarejestruj,
    zaloguj: zaloguj,
    wyloguj: wyloguj,
    czyZalogowany: czyZalogowany
  }
  
});