appControllers.controller('regCtl', ['$rootScope', '$scope', '$sce', '$location', '$timeout', '$cookies', 'HRService', function($rootScope, $scope, $sce, $location, $timeout, $cookies, HRService){
	//Pre-load values from server e.g. college / data / eventId / template
	var dd = new Date();
	var eventIdVal = location.hash.match(/eventId=(.*)/) ? location.hash.match(/eventId=(.*)/)[1].split('&')[0] : undefined;
	var preLoadData = HRService.preLoad.getPreDate();
	$('body').addClass('loading');
	$scope.loading = true;
	$regForm = $('#hr-reg-form');
	$regBtn = $('.hr-reg-btn');

	//5 conditions contain eventIdVal / preLoadData / $cookies.eventIdInCookies
	//Note condition -_-
	if(eventIdVal != undefined && preLoadData == undefined){
		requireData(eventIdVal);
	}
	else if(preLoadData != undefined){
		$rootScope.theme = preLoadData.initInfo.template;
		initRegPage(preLoadData);
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
			initRegPage(data);
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
		$scope.regMsg = '无效地点';
		$scope.eventTitle = 'IBM校园招聘';
		$scope.eventDate = dd.getFullYear();
		$regBtn.prop('disabled', true);
	}

	//Initialize page function
	function initRegPage(initData){
		$scope.eventTitle = initData.initInfo.college ? (initData.initInfo.college + ' - 登录') : 'IBM校园招聘';
		$scope.eventDate = initData.initInfo.date ? (Number(initData.initInfo.date.split('-')[1]) + '月' + Number(initData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
		$('body').removeClass('loading');
		$scope.loading = false;
		$scope.regMsg = '注册并登录';
		$scope.regFn = function() {
			if (validateForm()) {
				$scope.regMsg = msg;
				$timeout(function() {
					$regBtn.prop('disabled', false);
					$scope.regMsg = '注册并登录';
				}, 3000)
			} else {
				$regBtn.prop('disabled', true);				
				$scope.regMsg = '注册中……';
				var checkInVal = 'Y';
				try {
					checkInVal = location.hash.match(/checkIn=(.?)/)[1]
				} catch (e) {
					checkInVal = ''
				}
				HRService.Auth.userReg($regForm.serialize() + "&checkIn=" + checkInVal + "&eventId=" + eventIdVal).success(function(data) {
					if (data.flag == '0') { //?????
						switch (data.msg) {
						case 'error_tel_existed':
							$scope.regMsg = '手机已注册';
							break;
						case 'error_code':
							$scope.regMsg = '验证码错误';
							break;
						case 'error_blank_fields':						
							$scope.regMsg = '请完善信息';
							break;
						case 'error_email':
							$scope.regMsg = '请填写正确的邮箱';
							break;
						case 'error_tel':						
							$scope.regMsg = '请填写正确的手机号';
							break;
						}
						$timeout(function() {
							$regBtn.prop('disabled', false);
							$scope.regMsg = '注册并登录';
						}, 3000);
					} else {
						data.tel = $('input[name=tel]').val();
						HRService.Auth.setUser(data);
			    		$location.path('/main');
					}
				}).error(function(err) {
					$scope.regMsg = '注册失败 :(';
					$timeout(function() {
						$scope.regMsg = '注册并登录';
						$regBtn.prop('disabled', false);
					}, 3000)
				}).
				finally(function() {});
			}
		};

		//Validate form function
		function validateForm() {
			var flag = false;
			var regExpTel = /^1\d{10}$/;
			var regExpEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;			
			$('input', '#hr-reg-form').each(function(i, n) {				
				var label = $(n).data().label;
				if (n.value.trim() === '') {
					msg = '请填写' + label;
					$(n)[0].focus();
					flag = true;
					return false
				} else if (label == '手机' && !regExpTel.test(n.value.trim())) {
					msg = '请填写正确的手机号';
					$(n)[0].focus();
					flag = true;
					return false
				} else if (label == '邮箱' && !regExpEmail.test(n.value.trim())) {
					msg = '请填写正确的邮箱';
					$(n)[0].focus();
					flag = true;
					return false
				} else {
					msg = '';
					flag = false;
					return true
				}
			});
			return flag
		}
	}
}]);