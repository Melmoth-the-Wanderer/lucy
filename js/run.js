'use strict';

Lucy.run( function( $rootScope, $location, $q, kontoService, sessionService, infoService, spinService ) {
  var routePermissions = [ '/login', '/register', '/404' ]; //route that dont requires login 
  $rootScope.$on( '$routeChangeStart', function() {
    spinService.start( 'Przyglądam Ci się...' );
    if( routePermissions.indexOf( $location.path() ) === -1 ) {
      var successCallback = function( response ) {
        if( response.status === 200 ) {
          $rootScope.zalogowany = true;
        }
        spinService.stop();
      };
      var failureCallback = function( response ) {
        console.log( response );
        var canceler = $q.defer();
        canceler.resolve();
        if( response == 0 ) {
          $location.path( '/login' );
          infoService.setInfo({
            error: "Zaloguj się."
          }, 0 );
        }
        else if( response.status === 401 ) {
          kontoService.wyloguj( $rootScope, sessionService.getSecret(), function( response ) {
            infoService.setInfo({
              error: "Nieprawidłowy klucz sesji.",
              info: "Prawdopodobnie Twoja poprzednia sesja nie była prawidłowo wylogowana. Wszystko poprawione, możesz się zalogować ponownie."
            });
            $location.path( '/login' );
            $rootScope.zalogowany = false;
          }, function( response ) {
            infoService.setInfo({
              error: "Błąd. Odpowiedź z serwera: " + response.statusText,
              info: "Wygląda na to, że Twoja poprzednia sesja nie była wylogowana. Próbowaliśmy Cię wylogować, ale coś poszło nie tak jak powinno..."
            });
            $location.path( '/login' );
            $rootScope.zalogowany = false;
          });
        }
        spinService.stop;
        canceler.resolve();
      };
    }
    else {
      var successCallback = function( response ) {
        var info = {};
        if( response.status === 200 ) {
          $rootScope.zalogowany = true;
        }
        spinService.stop();
      };
      var failureCallback = function( response ) {
        console.log( response );
        if( response == 0 ) {
          spinService.stop();
        }
        else if( response.status === 401 ) {
          kontoService.wyloguj( $rootScope, sessionService.getSecret(), function( response ) {
            infoService.setInfo({
              success: "Nieprawidłowy klucz sesji.",
              info: "Wygląda na to, że Twoja poprzednia sesja nie była wylogowana. Wszystko poprawione, możesz się zalogować ponownie."
            });
            $location.path( '/login' );
            $rootScope.zalogowany = false;
          }, function( response ) {
            infoService.setInfo({
              error: "Błąd. Odpowiedź z serwera: " + response.statusText,
              info: "Wygląda na to, że Twoja poprzednia sesja nie była wylogowana. Próbowaliśmy Cię wylogować, ale coś poszło nie tak jak powinno..."
            });
            $location.path( '/login' );
            $rootScope.zalogowany = false;
          });
          spinService.stop();
        }
      };
    }
    kontoService.czyZalogowany( successCallback, failureCallback, true );
  });
  $rootScope.$on( '$locationChangeStart', function() {
    if( $rootScope.keepInfo === 0 ) {
      infoService.clearInfo();
    }
    else {
      $rootScope.keepInfo = 0;
    }
  });
});