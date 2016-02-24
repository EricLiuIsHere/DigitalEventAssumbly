appControllers.controller('loginCtl', ['$rootScope', '$scope', '$sce', '$location', '$timeout', '$cookies', 'HRService', function($rootScope, $scope, $sce, $location, $timeout, $cookies, HRService){
	//Pre-load values from server e.g. college / data / eventId / template
	var dd = new Date();
	var telNumber = '';
	var eventIdVal = location.hash.match(/eventId=(.*)/) ? location.hash.match(/eventId=(.*)/)[1].split('&')[0] : undefined;
	var preLoadData = HRService.preLoad.getPreDate();
	$loginButton = $('.hr-login-buttom');
	$scope.loading = true;

	//5 conditions contain eventIdVal / preLoadData / $cookies.eventIdInCookies
	//Note condition -_-
	if(eventIdVal != undefined && preLoadData == undefined){
		requireData(eventIdVal);
	}
	else if(preLoadData != undefined){
		$rootScope.theme = preLoadData.initInfo.template;
		initLoginPage(preLoadData);
	}
	else if(eventIdVal == undefined && preLoadData == undefined && $cookies.eventIdInCookies != undefined){
		requireData($cookies.eventIdInCookies);
	}
	else if(eventIdVal == undefined && preLoadData == undefined && $cookies.eventIdInCookies == undefined){
		inValidateEvent();
	}

	//When request error OR $location.path('/login') without param
	function requireData(eventId){
		HRService.preLoad.getDataFromServer(eventId).success(function(data){
			//Set preLoad data Start
			data.initInfo.eventId = eventId;
			HRService.preLoad.setPreData(data);
			$cookies.eventIdInCookies = eventId;
			//Set preLoad data End
			$rootScope.theme = data.initInfo.template;
			$scope.loginMsg = '登录';
			initLoginPage(data);
		}).error(function(err){
			inValidateEvent();
		}).finally(function(){		
			console.log('Initialize page successfully!!!');
		});
	}

	//When request error OR $location.path('/login') without param
	function inValidateEvent(){
		$('body').removeClass('loading');
		$scope.loading = false;
		$rootScope.theme = '1';
		$scope.loginMsg = '请重新扫描二维码';
		$scope.eventTitle = 'IBM校园招聘';
		$scope.eventDate = dd.getFullYear();
		$loginButton.prop('disabled', true);
	}

	//Initialize page function
	function initLoginPage(initData){
		$scope.eventTitle = initData.initInfo.college ? (initData.initInfo.college + ' - 登录') : 'IBM校园招聘';
		$scope.eventDate = initData.initInfo.date ? (Number(initData.initInfo.date.split('-')[1]) + '月' + Number(initData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
		$('body').removeClass('loading');
		$scope.loading = false;
		$scope.$watch('tel', function(newVal, oldVal){	
			telNumber = newVal;
		});
		$scope.loginMsg = '登录';
		$scope.regUrl = '#/reg?checkIn=Y&eventId=' + initData.initInfo.eventId;
		$scope.login = function(){
			$loginButton.prop('disabled', true);
			validateTel(telNumber,initData.initInfo.eventId);
		};
	}

	//Validate telephone & redirect function Start
	function validateTel(tel,id){
		var regExp = /^1\d{10}$/;
		var checkInVal = '';
		try{
			checkInVal = location.hash.match(/checkIn=(.?)/)[1];
		}catch(e){
			checkInVal = '';
		}
    	HRService.Auth.userLogin({tel: tel, checkIn: checkInVal, eventId: id}).success(function(data){
    		if(data.flag == '0'){
    			switch(data.msg){
					case 'error_tel_not_existed':						
						$scope.loginMsg = '手机尚未注册';
						$loginButton.prop('disabled', true);
						
					break;
				}
    			$timeout(function(){
		    		$scope.loginMsg = '登录';
		    		$loginButton.prop('disabled', false);
		    	}, 2000);
    		}else{
    			data.tel = tel;
	    		HRService.Auth.setUser(data);
	    		$location.path('/main');
    		}
    	}).error(function(err){
    		HRService.Auth.setUser('');
			$scope.loginMsg = '网络错误 :(';
			$loginButton.prop('disabled', true);
				$timeout(function(){
		    		$scope.loginMsg = '登录';
		    		$loginButton.prop('disabled', false);
		    	}, 2000);
    	}).finally(function(){
    		$loginButton.prop('disabled', false);
		});
	}

}]);