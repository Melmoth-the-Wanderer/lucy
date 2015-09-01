'use strict';

var Lucy = angular.module( 'Lucy', [ 'ngRoute', 'ngCookies' ] );

Lucy.filter('iif', function () {
  return function(input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});

Lucy.filter( 'abs', function() {
  return function( input ) {
    input = (parseFloat( input )).toFixed( 2 );
    return input >= 0 ? input : input * (-1);  
  }
});

Lucy.filter( 'round2', function() {
  return function( input ) {
    return Math.round( input * 100 ) / 100;  
  }
});