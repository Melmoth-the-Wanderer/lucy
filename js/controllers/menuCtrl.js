'use strict';

Lucy.controller( 'menuCtrl', function( $scope, $rootScope, $location, menuService, sessionService, kontoService, infoService, updateService, spinService ) {

  var wylogujSuccessCallback = function( response ) {
    var info = {};
    info.success = "Wsystko zabezpieczone, sesja wylogowana.";
    info.info = "Do zobaczenia!";
    infoService.setInfo( info );
    $location.path( '/login' );
    spinService.stop();
    $rootScope.zalogowany = false;
  };
  var wylogujFailureCallback = function( response ) {
    var info = {};
    info.error = "Błąd. Odpowiedź z serwera: " + response.statusText;
    infoService.setInfo( info );
    $location.path( '/login' );
    spinService.stop();
    $rootScope.zalogowany = false;
  };
  $rootScope.zalogowany = false;
  $scope.wyloguj = function( e ) {
    e.preventDefault();
    spinService.start( 'Zamykam sesję...' );
    kontoService.wyloguj( $scope, sessionService.getSecret(), wylogujSuccessCallback, wylogujFailureCallback );
  };
  $scope.activeClass = function( path ) {
    return menuService.activeClass( path, $scope );
  };
  
  $rootScope.lucy_v = updateService.getFromCookie();
  $rootScope.aktualizacjeSprawdz = function( e ) {
    e.preventDefault();
    spinService.start( 'Szukam lepszych plików...' );
    updateService.sprawdzAktualizacje( function() { 
      infoService.setInfo({
        success: 'System jest aktualny'
      }, 0 ); 
      spinService.stop();
    }, function() {
      spinService.stop(); 
    });
  };
   
});