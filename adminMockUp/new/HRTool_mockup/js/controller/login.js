appControllers.controller('loginForm',['$scope','adminService',function($scope,adminService){
  $scope.submitForm = function(){

  	if($scope.user != null && $scope.user.username!= null && $scope.user.password!= null ){
  		console.log($scope.user)
		adminService.logIn($scope.user).success(function(data){
			console.log(data)
			if(data.Message == "Error"){
				$scope.errorMsg = '用户名或者密码不正确';
			}else if(data.Message == "User admin have successfully logged in."){
				window.location.href = '#/events/list';
			}else{
				$scope.errorMsg = '请稍后片刻再进行尝试'
			}
		}).error(function(err){
			console.log(err);
		});
  	}
  };
}]);