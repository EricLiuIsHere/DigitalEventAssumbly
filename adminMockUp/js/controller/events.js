var app = angular.module('eventsApp', ['appControllers','appServices']);
var notAdmin = function(data){
    if(data.IsAdmin=="False"){
        window.location.href = 'login.html';
	}
}
appControllers.controller('eventsBody',['$scope','$rootScope','adminService',function($scope,$rootScope,adminService){
	adminService.getAllEvents().success(function(data){
		notAdmin(data);
	       $scope.events = data.events
	        console.log(data.events);
	    }).error(function(err){
	        console.log(err);
	    });
	$scope.addNew = function(){
		window.location.href = 'new.html';
	}
	$scope.showDetail = function(id){
		// console.log(this)
		$scope.isShow = id;
	}
	$scope.hideDetail = function(id){
		$scope.isShow = -1;
	}
	
	$scope.editEvent = function(index,id){
		console.log(index+'========='+id)
		window.location.href="new.html?id="+id;
	}
	$scope.removeEvent = function(index,id){
		if(confirm('删除这条记录？')){
			adminService.deleteEvent(id).success(function(data){
				notAdmin(data);
				adminService.getAllEvents().success(function(data){
					notAdmin(data);
			       $scope.events = data.events
			        
			    }).error(function(err){
			        console.log(err);
			    });
		    }).error(function(err){
		        console.log(err);
		    });
		}
		
	}
	$scope.infoEvent = function(index,id){
		
	}
}]);