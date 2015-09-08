'use strict' ;

Lucy.factory( 'updateService', function( $http, $q, $cookies, $window, infoService ) {
  
  function sprawdzAktualizacje( successCallback, failureCallback ) {
    getFromServer( function( response ) {
      if( !sprawdzCzyIstnieje() )
        putToCookie( response.data );
      if( getFromCookie() !== response.data ) {
        var canceler = $q.defer();
        canceler.resolve();
        alert( 'Uwaga! Pojawiła się nowa wersja systemu. Aby zapewnić poprawne działanie aplikacji strona zostanie przeładowana. Dziękuję. \n\nTwoja wersja: ' + ( getFromCookie() || 'brak' ) + ' \nDostępna wersja: ' + response.data );
        $window.location.reload();
        putToCookie( response.data );
        return false;
      }
      else {
        if( successCallback && failureCallback )
          successCallback()
      };
    }, function( response ) {
       failureCallback();
    }); 
  }
  
  function sprawdzCzyIstnieje() {
    return $cookies.get( 'wersja' ) ? true : false;  
  }
  
  function putToCookie( wersja ) {
    if( !wersja ) {
      getFromServer( function( response ) {
        $cookies.put( 'wersja', response.data );
      });
    }
    else {
      $cookies.put( 'wersja', wersja ); 
    }
  }
  
  function getFromCookie() {
    return $cookies.get( 'wersja' ); 
  }
  
  function getFromServer( successCallback, failureCallback ) {
    var $promise = $http.post( '/ajax/get/systemWersjaWypluj/?'+lucy_v, {cache: false} );
    $promise.then( function( response ) { 
      if( successCallback ) {
        successCallback( response ); 
      }
    }, function( response ) {
      console.log( response );
      return false;
    });
  }
  
  return {
    sprawdzAktualizacje: sprawdzAktualizacje,
    getFromCookie: getFromCookie
  }
});