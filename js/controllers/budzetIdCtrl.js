'use strict';
Lucy.controller( 'budzetIdCtrl', function( $scope, $rootScope, $routeParams, $location, budzetService, operacjaService, sessionService, infoService, updateService, spinService ) {
  
  /*
   *  Wypluwanie danych budżetu po ID budzetu
   */
  
  spinService.start( 'Przeliczam drobniaki' );
  var budzetWyplujPoIdSuccessCallback = function( response ) {
    var info = {};
    if( response.data === 'null' ) {
      info.error = "Nie mogę znaleźć wskazanego budżetu...";
      info.info = "Jesteś pewien, że nie usunąłeś tego budżetu wcześniej?";
      infoService.setInfo( info );
      $location.path( '/budzet' );
      spinService.stop();
      return false;
    }
    $rootScope.title = response.data === 'null' ? '???' : response.data[0].nazwa;
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
    spinService.stop();
  };
  var budzetWyplujPoIdFailureCallback = function( response ) {
    var info = {};
    info.error = "Błąd: " + response.statusText; 
    infoService.setInfo( info, 0 );
    spinService.stop();
  };
  budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
    
  /*
   *  Wypluwanie operacje po ID budżetu
   */
  var operacjeWyplujPoBudzetIdSuccess = function( response ) {
    if( response.data !== 'null' ) {
      $scope.operacjeLista = response.data;
    }
    spinService.stop();
  };
  var operacjeWyplujPoBudzetIdFailure = function( response ) {
    console.log( response.data );
    spinService.stop();
  };
  spinService.start( 'Czytam historię...' );
  operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
  
  /*
   *  Uzupełnienie listy budżetów do transferu
   */
  var budzetWyplujWszystkieSuccessCallback = function( response ) {
    if( response.data === 'null' ) {
      var budzetLista = [];
    } else {
      var budzetLista = response.data;
      for( var key in budzetLista ) {
        if( budzetLista[key].ID === $routeParams.id ) {
          budzetLista.splice( key, 1 );
        }
      }
    }
    console.log( budzetLista );
    //alert( 'nie działa: budzetIdCtrl:79 -> wypluwa złą listę budżetów' );
    $scope.budzetLista = budzetLista;
    spinService.stop();
  };
  var budzetWyplujWszystkieFailureCallback = function( response ) {
    console.log( response );
    spinService.stop(); 
  };
  spinService.start( 'Wypełniam listę budżetów...' );
  budzetService.budzetWyplujWszystkie( $scope, sessionService.getSecret(), budzetWyplujWszystkieSuccessCallback, budzetWyplujWszystkieFailureCallback );
  
  /*
   *  ZMIENNE SCOPE'a
   */
  $rootScope.subtitle = "Szczegóły budżetu";
  $scope.message = {};
  $scope.budzet = {};
  $scope.wydatek = {};
  $scope.przychod = {};
  $scope.transfer = {};
  $scope.operacjeLista = {};
  $scope.budzetLista = {};
  $scope.opcjaUsunBudzet = false;
  $scope.opcjaDodajWydatek = false;
  $scope.opcjaDodajPrzyplyw = false;
  $scope.opcjaWykonajTransfer = false;
  $scope.hideMainActions = false;
  
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
  $scope.opcjaWykonajTransfer = false;
    $scope.message = {};
  };
  $scope.przyplywDodajToggle = function() {
    updateService.sprawdzAktualizacje();
    $scope.opcjaDodajPrzyplyw = ( $scope.opcjaDodajPrzyplyw ? false : true );
    $scope.opcjaDodajWydatek = false;
    $scope.opcjaWykonajTransfer = false;
    $scope.message = {};
  };
  $scope.transferWykonajToggle = function() {
    updateService.sprawdzAktualizacje();
    $scope.opcjaWykonajTransfer = ( $scope.opcjaWykonajTransfer ? false : true );
    $scope.opcjaDodajPrzyplyw = false;
    $scope.opcjaDodajWydatek = false;
  };
  
  $scope.wydatekDodaj = function( kwota, budzetId ) {
    $scope.message = {};
    spinService.start();
    updateService.sprawdzAktualizacje();
    operacjaService.wydatekDodaj( kwota || 0, budzetId, sessionService.getSecret(), $scope, function( response ) {
      budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
      operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
      $scope.wydatek.kwota = null;
      spinService.stop();
      $scope.opcjaDodajWydatek = false;
    }, function( response ) {
      $scope.message.error = "Błąd: " + response.statusText;
      spinService.stop();
    });
  };
  
  $scope.przychodDodaj = function( kwota, budzetId ) {
    $scope.message = {};
    spinService.start();
    updateService.sprawdzAktualizacje();
    operacjaService.przychodDodaj( kwota || 0, budzetId, sessionService.getSecret(), $scope, function( response ) {
      budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
      operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
      $scope.przychod.kwota = null;
      spinService.stop();
      $scope.opcjaDodajPrzyplyw = false;
    }, function( response ){
      $scope.message.error = "Błąd: " + response.statusText;
      spinService.stop();
    } );
  };
  
  $scope.transferWykonaj = function( transfer, dawcaID ) {
    var data = {
      kwota: transfer && transfer.kwota ? transfer.kwota : 0,
      biorcaID: transfer && transfer.biorcaID ? transfer.biorcaID : 0,
      dawcaID: dawcaID
    };
    spinService.start( 'Przekładam słoiki...' );
    operacjaService.transferWykonaj( data.kwota, data.dawcaID, data.biorcaID, sessionService.getSecret(), function( response ) {
      $scope.transfer.kwota = '';
      spinService.start( 'Liczę...' );
      $scope.opcjaWykonajTransfer = false;
      operacjaService.operacjeWyplujPoBudzetId( $routeParams.id, sessionService.getSecret(), $scope, operacjeWyplujPoBudzetIdSuccess, operacjeWyplujPoBudzetIdFailure );
      spinService.start( 'Liczę' );
      budzetService.budzetWyplujPoId( $routeParams.id, sessionService.getSecret(), $scope, budzetWyplujPoIdSuccessCallback, budzetWyplujPoIdFailureCallback );
      spinService.stop();
    }, function( response ) {
      infoService.setInfo({
        error: response.statusText
      }, 0 );
      console.log( response );
      spinService.stop();
    });
  }
  
  $scope.budzetUsun = function( e, budzet_id ) {
    e.preventDefault
    spinService.start( 'Palę papierki...' );
    $scope.loadginBudzetUsun = true;
    updateService.sprawdzAktualizacje();
    var info = {};
    budzetService.budzetUsun( budzet_id, sessionService.getSecret(), $scope, function( response ) {
      info.success = "Rozwiązałem budżet";
      infoService.setInfo( info );
      $location.path( '/budzet' );
      spinService.stop();
    }, function( response ) {
      info.error = "Błąd: " + response.statusText;
      infoService.setInfo( info, 0 );
      $location.path( '/budzet' );
      spinService.stop();
    });
  };
});