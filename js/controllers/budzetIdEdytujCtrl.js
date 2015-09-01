'use strict';
Lucy.controller( 'budzetIdEdytujCtrl', function( $scope, $rootScope, $routeParams, $location, budzetService, sessionService, infoService, updateService ) {
  $rootScope.subtitle = "Edycja budżetu";
  var budzetWyplujPoIdSuccessCallback = function( response ) {
    var info = {};
    if( response.data === 'null' ) {
      info.error = "Nie mogę znaleźć wskazanego budżetu...";
      info.info = "Jesteś pewien, że nie usunąłeś tego budżetu wcześniej?";
      infoService.setInfo( info );
      $location.path( '/budzet' );
      $scope.loading = false;
      return false;
    }
    $rootScope.title = response.data === 'null' ? '???' : response.data[0].nazwa;
    var budzet = response.data === 'null' ? {} : response.data[0];
    $scope.budzet = {
      kwota: budzet.kwota,
      start: budzet.start ? new Date( budzet.start ) : null,
      stop: budzet.stop ? new Date( budzet.stop ) : null,
      min: budzet.min !== '0.00' ? parseFloat( budzet.min ) : null,
      max: budzet.max !== '0.00' ? parseFloat( budzet.max ) : null,
      ID: budzet.ID
    };
    $scope.loading = false;
  };
  var budzetWyplujPoIdFailureCallback = function( response ) {
    var info = {};
    info.error = "Błąd: " + response.statusText; 
    infoService.setInfo( info, 0 );
    $scope.loading = false;
  };
  budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
  
  var budzetEdytujSuccessCallback = function( response ) {
    $scope.loading = false;
    $location.path( '/budzet/'+$routeParams.id );
  };
  var budzetEdytujFailureCallback = function( response ) {
    console.log( response ); 
    $scope.loading = false;
  };
  $scope.budzetEdytuj = function( e, budzet ) {
    e.preventDefault();
    $scope.loading = true;
    updateService.sprawdzAktualizacje();
    budzet.start = budzet.start ? new Date( budzet.start ) : null;
    budzet.stop = budzet.stop ? new Date( budzet.stop ) : null;
    budzet.min = budzet.min ? budzet.min : null;
    budzet.max = budzet.max ? budzet.max : null;
    budzetService.budzetEdytuj( budzet, sessionService.getSecret(), budzetEdytujSuccessCallback, budzetEdytujFailureCallback);
  };
});