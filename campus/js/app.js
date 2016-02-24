var appControllers = angular.module('appControllers', ['ngCookies']);
var appServices = angular.module('appServices', []);
var app = angular.module('HR', [
  'ngRoute',
  'ngAnimate',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'appControllers',
  'appServices'
]);

app.run(['$transform', '$rootScope', '$location', '$cookies', 'HRService', function($transform, $rootScope, $location, $cookies,HRService) {
	$('body').addClass('loading');
	window.$transform = $transform;
	HRService.Auth.isLoggedIn();
	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
		console.log(rejection);
		if (rejection == 'UNLOGGED'){
            $location.path('/login');
			//location.href = location.pathname + '#login?checkIn=Y&eventId=' + $cookies.eventId;
        }else{
        	
        }
	});
	
}]);

app.config(function($routeProvider) {
	$routeProvider
		.when('/',            {templateUrl: 'fragments/home.html', controller: 'homeCtl', resolve: {access: ["HRService", function(HRService) {return HRService.Auth.isLoggedIn();}]}})
		.when('/main',        {templateUrl: 'fragments/main.html', controller: 'mainCtl', resolve: {access: ["HRService", function(HRService) {return HRService.Auth.isLoggedIn();}]}})	
		.when('/lucky',       {templateUrl: 'fragments/lucky.html', controller: 'luckyCtl', resolve: {access: ["HRService", function(HRService) {return HRService.Auth.isLoggedIn();}]}})
		.when('/login',       {templateUrl: 'fragments/login.html', controller: 'loginCtl'})
		.when('/reg',         {templateUrl: 'fragments/reg.html', controller: 'regCtl'})
		.when('/detail/:id',  {templateUrl: 'fragments/detail.html', controller: 'detailCtl', resolve: {access: ["HRService", function(HRService) {return HRService.Auth.isLoggedIn();}]}})
		.otherwise({redirectTo: '/'});
});

/* ------------- GLOBAL CONFIGURATION START ------------- */
var config = {
	"STATIC_DOMAIN": 'http://gcghrcampus.b0.upaiyun.com/' // Use CDN to store static files, e.g. (.js, .css, .jpg)
};
/* ------------- GLOBAL CONFIGURATION END ------------- */