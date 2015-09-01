'use strict';

Lucy.controller( 'budzetCtrl', function( $scope, $rootScope, $location, kontoService, sessionService, budzetService, infoService, updateService ) {
  $rootScope.title = "Twoje aktywne budżety";
  $rootScope.subtitle = "Znajdują się tu wszystkie budżety, niezależnie od posiadanej kwoty czy terminów wykorzystania.";
  $scope.message = {};
  $scope.budzetLista = {};
  $scope.budzet = {};
  $scope.opcjaDodajBudzet = false;
  $scope.loadingBudzetDodaj = false;
  $scope.dodajBudzetToggle = function() {
    $scope.opcjaDodajBudzet = ( $scope.opcjaDodajBudzet ? false : true );
    $scope.message = {};
    $scope.budzet = {};
  };

  
  var budzetDodajSuccessCallback = function( response ) {
    var info = {};
    $scope.opcjaDodajBudzet = false;
    info.success = "Dodałam nowy budżet";
    info.info = "Możesz teraz ustawić główne parametry. Interpretuj je dowolnie, to Twój budżet! Po zapisaniu będziesz mógł dodać pierwszą wpłatę. Miłego planowania!";
    infoService.setInfo( info );
    $scope.budzet = {};
    $scope.budzet.ID = response.data;
    $location.path( '/budzet/'+response.data+'/edytuj' );
    $scope.loadingBudzetDodaj = false;
  };
  var budzetDodajFailureCallback = function( response ) {
    $scope.message = {};
    $scope.message.error = response.statusText;
    $scope.loadingBudzetDodaj = false;  
  };
  $scope.budzetDodaj= function( e, budzet ) {
    e.preventDefault;
    $scope.loadingBudzetDodaj = true;
    updateService.sprawdzAktualizacje();
    budzetService.budzetDodaj( budzet, sessionService.getSecret(), $scope, budzetDodajSuccessCallback, budzetDodajFailureCallback );
  };

  $scope.loading = true;
  var budzetWyplujWszystkieSuccessCallback = function( response ) {
    if( response.data === 'null' ) {
      var budzetLista = [];
      infoService.setInfo( {
        success: null,
        error: null,
        danger: null,
        info: "Człowiek bez budżetu, a żyje... :)"
      }, 0 );        
    }
    else {
      var budzetLista = response.data;
      var kwotaSuma = parseFloat( 0 );
      budzetLista.forEach( function( budzet ) {
        kwotaSuma += parseFloat( budzet.kwota );
      });
      budzetLista.forEach( function( budzet ) {
        budzet.meta = {
          fromStart: budzet.start ? Math.round( ( new Date() - new Date( budzet.start ) ) / (1000*60*60*24) ) : null,
          tillStop: budzet.stop ? Math.round( ( new Date( budzet.stop ) - new Date() ) / (1000*60*60*24) ) : null,
          toMin: parseFloat( budzet.min ) ? 100 - parseFloat( budzet.kwota ) * 100 / parseFloat( budzet.min ) : null,
          toMax: parseFloat( budzet.max ) ? 100 - parseFloat( budzet.kwota ) * 100 / parseFloat( budzet.max ) : null,
          percentage: Math.round( budzet.kwota * 100 / kwotaSuma )
        };
        budzet.meta.isEmpty = ( !budzet.meta.fromStart && !budzet.meta.tillStop && !budzet.meta.toMin && !budzet.meta.toMax ) ? true : false;
      });
    }
    $scope.budzetLista = budzetLista;
    $scope.loading = false; 
  };
  var budzetWyplujWszystkieFailureCallback = function( response ) {
    console.log( response ); 
  };
  budzetService.budzetWyplujWszystkie( $scope, sessionService.getSecret(), budzetWyplujWszystkieSuccessCallback, budzetWyplujWszystkieFailureCallback );
});