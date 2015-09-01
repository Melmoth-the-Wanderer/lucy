'use strict';
Lucy.controller( 'budzetIdCtrl', function( $scope, $rootScope, $routeParams, $location, budzetService, operacjaService, sessionService, infoService, updateService ) {
  
  /*
   *  Wypluwanie danych budżetu po ID budzetu
   */
  
  $scope.loading = true;
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
    $rootScope.title = response.data === 'null' ? '???' : response.data[0].nazwa + ' (1999-12-31)';
    var budzet = response.data === 'null' ? {} : response.data[0];
    budzet = {
      kwota: budzet.kwota,
      start: budzet.start ? budzet.start : null,
      stop: budzet.stop ? budzet.stop : null,
      min: parseFloat( budzet.min ) ? budzet.min : null,
      max: parseFloat( budzet.max ) ? budzet.max : null,
      ID: budzet.ID,
      meta: {
        fromStart: budzet.start ? Math.round( ( new Date() - new Date( budzet.start ) ) / (1000*60*60*24) ) : null,
        tillStop: budzet.stop ? Math.round( ( new Date( budzet.stop ) - new Date() ) / (1000*60*60*24) ) : null,
        toMin: parseFloat( budzet.min ) ? 100 - parseFloat( budzet.kwota ) * 100 / parseFloat( budzet.min ) : null,
        toMax: parseFloat( budzet.max ) ? 100 - parseFloat( budzet.kwota ) * 100 / parseFloat( budzet.max ) : null
      }
    };
    budzet.meta.isEmpty = ( !budzet.meta.fromStart && !budzet.meta.tillStop && !budzet.meta.toMin && !budzet.meta.toMax ) ? true : false;
    $scope.budzet = budzet;
    $scope.loading = false;
  };
  var budzetWyplujPoIdFailureCallback = function( response ) {
    var info = {};
    info.error = "Błąd: " + response.statusText; 
    infoService.setInfo( info, 0 );
    $scope.loading = false;
  };
  budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
    
  /*
   *  Wypluwanie operacje po ID budżetu
   */
  var operacjeWyplujPoBudzetIdSuccess = function( response ) {
    if( response.data !== 'null' ) {
      $scope.operacjeLista = response.data;
    }
    $scope.loading = false;
  };
  var operacjeWyplujPoBudzetIdFailure = function( response ) {
    console.log( response.data );
    $scope.loading = false;
  };
  $scope.loading = true;
  operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
  
  /*
   *  ZMIENNE SCOPE'a
   */
  $rootScope.subtitle = "Szczegóły budżetu";
  $scope.message = {};
  $scope.budzet = {};
  $scope.przychod = {};
  $scope.operacjeLista = {};
  $scope.wydatek = {};
  $scope.opcjaUsunBudzet = false;
  $scope.opcjaDodajWydatek = false;
  $scope.opcjaDodajPrzyplyw = false;
  $scope.hideMainActions = false;
  $scope.loadingBudzetUsun = false;
  
  $scope.usunBudzetToggle = function() {
    updateService.sprawdzAktualizacje();
    $scope.opcjaUsunBudzet = ( $scope.opcjaUsunBudzet ? false : true );
    $scope.hideMainActions = ( $scope.hideMainActions ? false : true );
    $scope.message = {};
    infoService.setInfo( {} );
  };
  $scope.wydatekDodajToggle = function() {
    updateService.sprawdzAktualizacje();
    $scope.opcjaDodajWydatek = ( $scope.opcjaDodajWydatek ? false : true );
    $scope.opcjaDodajPrzyplyw = false;
    $scope.message = {};
  };
  $scope.przyplywDodajToggle = function() {
    updateService.sprawdzAktualizacje();
    $scope.opcjaDodajPrzyplyw = ( $scope.opcjaDodajPrzyplyw ? false : true );
    $scope.opcjaDodajWydatek = false;
    $scope.message = {};
  };
  
  $scope.loadingWydatekDodaj = false;
  $scope.wydatekDodaj = function( kwota, budzetId ) {
    $scope.message = {};
    $scope.loadingWydatekDodaj = true;
    updateService.sprawdzAktualizacje();
    operacjaService.wydatekDodaj( kwota || 0, budzetId, sessionService.getSecret(), $scope, function( response ) {
      budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
      operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
      $scope.wydatek.kwota = null;
      $scope.loadingWydatekDodaj = false;
      $scope.opcjaDodajWydatek = false;
    }, function( response ) {
      $scope.message.error = "Błąd: " + response.statusText;
      $scope.loadingWydatekDodaj = false;
    });
  };
  
  $scope.loadingPrzychodDodaj = false;
  $scope.przychodDodaj = function( kwota, budzetId ) {
    $scope.message = {};
    $scope.loadingPrzychodDodaj = true;
    updateService.sprawdzAktualizacje();
    operacjaService.przychodDodaj( kwota || 0, budzetId, sessionService.getSecret(), $scope, function( response ) {
      budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
      operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
      $scope.przychod.kwota = null;
      $scope.loadingPrzychodDodaj = false;
      $scope.opcjaDodajPrzyplyw = false;
    }, function( response ){
      $scope.message.error = "Błąd: " + response.statusText;
      $scope.loadingPrzychodDodaj = false;
    } );
  };
  
  $scope.budzetUsun = function( e, budzet_id ) {
    e.preventDefault;
    $scope.loading = true;
    $scope.loadginBudzetUsun = true;
    updateService.sprawdzAktualizacje();
    var info = {};
    budzetService.budzetUsun( budzet_id, sessionService.getSecret(), $scope, function( response ) {
      info.success = "Rozwiązałem budżet";
      infoService.setInfo( info );
      $location.path( '/budzet' );
      $scope.loading = false;
    }, function( response ) {
      info.error = "Błąd: " + response.statusText;
      info.info = "Wszystko w porządku? Jeżeli problem będzie się powtarzał, spróbuj skontaktować się z naczelnym."; 
      infoService.setInfo( info );
      $location.path( '/budzet' );
      $scope.loading = false;
    });
  };
});