'use strict';

Lucy.controller( 'menuCtrl', function( $scope, $rootScope, $location, menuService, sessionService, kontoService, infoService, updateService ) {

  var wylogujSuccessCallback = function( response ) {
    var info = {};
    info.success = "Wsystko zabezpieczone, sesja wylogowana.";
    info.info = "Do zobaczenia!";
    infoService.setInfo( info );
    $location.path( '/login' );
    $scope.loading = false;
    $rootScope.zalogowany = false;
  };
  var wylogujFailureCallback = function( response ) {
    var info = {};
    info.error = "Błąd. Odpowiedź z serwera: " + response.statusText;
    infoService.setInfo( info );
    $location.path( '/login' );
    $scope.loading = false;
    $rootScope.zalogowany = false;
  };
  $rootScope.zalogowany = false;
  $scope.wyloguj = function( e ) {
    e.preventDefault();
    $scope.loading = true;
    kontoService.wyloguj( $scope, sessionService.getSecret(), wylogujSuccessCallback, wylogujFailureCallback );
  };
  $scope.activeClass = function( path ) {
    return menuService.activeClass( path, $scope );
  };
  
  $rootScope.lucy_v = updateService.getFromCookie();
  $rootScope.aktualizacjeSprawdz = function( e ) {
    e.preventDefault();
    updateService.sprawdzAktualizacje( function() { alert( 'System jest aktualny' ) } );
  };
   
});