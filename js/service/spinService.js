'use strict';

Lucy.factory( 'spinService', function( $rootScope, $timeout ) {
  
  function start( message ) {
    if( message ) {
      $rootScope.loadingMessage = message;
    }
    else { 
      $rootScope.loadingMessage = 'Czekaj...';
    }
    $rootScope.loading++;
  }
  function stop( message ) {
    if( message === undefined )
      var message = 'undefined';
    $timeout( function( message ) {
      $rootScope.loading--;
    }, 200, true, message );
  }
  
  return {
    start: start,
    stop: stop
  }
});