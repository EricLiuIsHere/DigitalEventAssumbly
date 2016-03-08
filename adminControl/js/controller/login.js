appControllers.controller('errorMsg',['$scope','$timeout','$rootScope', function($scope,$timeout,$rootScope){
    $rootScope.showErrorMsg = false;
    $rootScope.errorMsg = null;
    $rootScope.$watch('errorMsg', function () {
        if($rootScope.errorMsg){
            $rootScope.showErrorMsg = true;
            $timeout(function(){
                $rootScope.showErrorMsg = false;
                $rootScope.errorMsg = null;
            }, 5000); 
        }
        
        
    });
}]);
appControllers.controller('processMsg',['$scope','$timeout','$rootScope', function($scope,$timeout,$rootScope){
    $rootScope.showProcessMsg = false;
    $rootScope.processMsg = null;
    $rootScope.$watch('processMsg', function () {
        if($rootScope.processMsg){
            $rootScope.showProcessMsg = true;
        }else{
        	$rootScope.showProcessMsg = false;
        }
        
        
    });
}]);
appControllers.controller('loginForm',['$scope','adminService','$timeout','$rootScope',function($scope,adminService,$timeout,$rootScope){
  $scope.submitForm = function(){
  	$scope.isDisabled = true;
  	if($scope.user != null && $scope.user.username!= null && $scope.user.password!= null ){
  		console.log($scope.user)
		adminService.logIn($scope.user).success(function(data){
			console.log(data)
			if(data.Message == "Error"){
				$rootScope.errorMsg = '用户名或者密码不正确';
				$scope.isDisabled = false;
			}else if(data.Message == "User admin have successfully logged in."){
				$scope.isDisabled = false;
				window.location.href = '#/events/list';

			}else if(data.Message =='User or Password is not correct!'){
				$scope.isDisabled = false;
				$rootScope.errorMsg = '用户名或者密码不正确';
			}else{
				$scope.isDisabled = false;
				$rootScope.errorMsg = '请稍后片刻再进行尝试'
			}
		}).error(function(err){
			console.log(err);
			$rootScope.errorMsg = '链接错误，请稍后片刻再进行尝试';
			$scope.isDisabled = false;
		});
  	}
  };
}]);