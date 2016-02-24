var notAdmin = function(data){
    if(data.IsAdmin=="False"){
        window.location.href = '#/login';
	}
}
appControllers.controller('eventsBody',['$scope','$rootScope','$timeout','adminService',function($scope,$rootScope,$timeout,adminService){
	$scope.showErrorMsg = false;
	adminService.getAllEvents().success(function(data){
		notAdmin(data);
	       $scope.events = data.events
	        console.log(data.events);
	    }).error(function(err){
	        console.log(err);
	    });
	
    $rootScope.errorMsg = null;
    $scope.$watch('errorMsg', function () {
        if($rootScope.errorMsg){
            $scope.showErrorMsg = true;
            $timeout(function(){
                $scope.showErrorMsg = false;
                $rootScope.errorMsg = null;
            }, 5000); 
        }
        
        
    });
	$scope.signOut = function(){
		adminService.signOut().success(function(data){
		window.location.href = '#/login';
	    }).error(function(err){
	        console.log(err);
	    });
	},
 	$scope.addNew = function(){
		window.location.href = '#/newEvent';
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
		window.location.href="#/editEvent?eventId="+id;
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
	$scope.detailEvent = function(index,id){
		console.log(index+'========='+id)
		window.location.href="#/detail?eventId="+id;
	}
}]);