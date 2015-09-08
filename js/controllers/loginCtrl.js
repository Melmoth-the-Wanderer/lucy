'use strict';

Lucy.controller( 'loginCtrl', function( $scope, $rootScope, $location, kontoService, sessionService, infoService, spinService ) {
  
  $rootScope.title = "Logowanie";
  $rootScope.subtitle = false;
  $scope.message = {};
  $scope.konto = {
    zapamietaj: false
  };
  
  var zalogujSuccessCallback = function( response ) {
    var secret = response.data.secret,
        utworzona = response.data.utworzona;
    sessionService.setSecret( secret );
    if( $scope.konto.zapamietaj === true ) {
      sessionService.setCookie( response.data );
    }
    else {
      if( sessionService.getCookie() )
        sessionService.removeCookie();
    }
    infoService.setInfo({
      success: "Klucz jest poprawny, rozpoczynam sesję.",
      error: false,
      info: "Dzień dobry!",
      danger: false
    });
    $location.path( '/home' );
    spinService.stop();
    $rootScope.zalogowany = true;
  };
  var zalogujFailureCallback = function( response ) {
    console.log( response );
    kontoService.wyloguj( $scope, function() {}, function() {} );
    spinService.stop();
  }
  $scope.zaloguj = function( e, konto ) {
    e.preventDefault();
    spinService.start( 'Loguję...' );
    kontoService.zaloguj( konto, $scope, zalogujSuccessCallback, zalogujFailureCallback );
  };
});