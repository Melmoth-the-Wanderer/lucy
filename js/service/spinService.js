'use strict';

Lucy.factory( 'spinService', function( $rootScope, $timeout ) {
  
  function start( message ) {
    $timeout( function( message ) {
      if( message )
        $rootScope.loadingMessage = message;
      else 
        $rootScope.loadingMessage = 'Czekaj...';
      $rootScope.loading++;
    }, 200, true, message );
  }
  function stop() {
    $timeout( function() {
      $rootScope.loading--;
    }, 200 );
  }
  
  return {
    start: start,
    stop: stop
  }
});