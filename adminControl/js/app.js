var myApp = angular.module('myApp', [
  'ngRoute',
  'appControllers',
  'appServices',
  'ngFileUpload',
  'ngFileSaver',
  'ngClipboard',
  'ngTable'
]);
myApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.href === '#result' || attrs.href === '#basic' || attrs.href === '#topics' || attrs.href === '#comments' || attrs.href === '#admincomments' || attrs.href === '#signup' || attrs.href === '#register' || attrs.href === '#lucky'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/feedback/list', {
      templateUrl: 'views/feedback_list.html',
      controller: 'FeedbackListController'
    })
    .when('/feedback/new', {
      templateUrl: 'views/feedback_new.html',
      controller: 'FeedbackNewItemController'
    })
    .when('/feedback/item/:id', {
      templateUrl: 'views/feedback_item.html',
      controller: 'FeedbackEditItemController'
    })
    .when('/feedback/user/:id', {
      templateUrl: 'views/feedback_user.html',
      controller: 'FeedbackUserController'
    })
    .when('/feedback/data/:id', {
      templateUrl: 'views/feedback_data.html',
      controller: 'FeedbackDataItemController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginForm'
    })
    .when('/events/list', {
      templateUrl: 'views/events.html',
      controller: 'eventsBody'
    })
    .when('/editEvent', {
      templateUrl: 'views/new.html',
    })
    .when('/newEvent', {
      templateUrl: 'views/new.html',
    })
    .when('/detail', {
      templateUrl: 'views/detail.html',
    })
    .when('/404', {
      templateUrl: 'views/404.html'
    })
    .otherwise({
      redirectTo: '/404'
    });
}]);
myApp.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("js/lib/ZeroClipboard.swf");
}]);

var appControllers = angular.module('appControllers', ['ngRoute']);
var appServices = angular.module('appServices', []);
