'use strict'

Lucy.controller( 'registerCtrl', function( $scope, $rootScope, $location, kontoService, infoService, spinService ) {
  
  $rootScope.title = 'Rejestracja nowego konta';
  $rootScope.subtitle = false;
  
  var zarejestrujSuccessCallback = function( response ) {
    console.log( response.data );
    $scope.konto = {};
    $scope.message = {};
    $scope.message.success = response.statusText;
    infoService.setInfo({
      success: false,
      error: false,
      info: "Możesz się teraz zalogować",
      danger: false
    });
    $location.path( '/login' );
    spinService.stop();
  };
  var zarejestrujFailureCallback = function( response ) {
    console.log( response );
    $scope.message = {};
    $scope.message.error = response.statusText;
    spinService.stop();
  };
  $scope.kontoZarejestruj = function( e, konto ) {
    e.preventDefault();
    spinService.start( 'Tworzę...' );
    kontoService.zarejestruj( konto, zarejestrujSuccessCallback, zarejestrujFailureCallback );
  }
});