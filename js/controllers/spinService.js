'use strict';

Lucy.factory( 'spinService', function( $rootScope, $timeout ) {
  
  function start( message ) {
    if( message )
      $rootScope.loadingMessage = message;
    else 
      $rootScope.loadingMessage = 'Czekaj...';
    $rootScope.loading++;
    console.log( $rootScope.loading );
  }
  function stop() {
    $timeout( function() {
      $rootScope.loading--;
      console.log( $rootScope.loading );
    }, 200, true );
  }
  
  return {
    start: start,
    stop: stop
  }
});