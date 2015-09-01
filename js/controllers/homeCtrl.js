'use strict';

Lucy.controller( 'homeCtrl', function( $scope, $rootScope, kontoService, sessionService, budzetService ) {

  $rootScope.title = false;
  $rootScope.subtitle = false;
  $scope.wyloguj = function( e ) {
    e.preventDefault();
    kontoService.wyloguj( $scope );
    kontoService.czyZalogowany( $scope );
  };
  $scope.budzetLista = {};
});