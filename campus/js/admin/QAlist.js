var app = angular.module( "HRadmin", [] );
app.controller("QAController",function($scope,getDataService){
  getDataService.getData().success(function(data){
    var questions = [];

    data.allQuestions.forEach(function(item,index){
    	questions = questions.concat(item.Questions);
    });
    $scope.questions = questions;
    
  });
});
app.service("getDataService",function($http){
  return({getData: getData});
  function getData() {
    var host;
	if(window.location.hostname == 'localhost' || window.location.hostname == '9.115.24.168'){
		host = 'http://9.115.24.168:9080';
	}else if(window.location.hostname == '170.225.225.31'){
		host = 'http://170.225.225.31:9080';
	}
    return $http.jsonp(host +'/campus/GetQuestion?'+ location.hash.split('#')[1] +'&callback=JSON_CALLBACK');
  }
});