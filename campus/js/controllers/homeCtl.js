appControllers.controller('homeCtl', ['$rootScope','$scope','$sce','$timeout','$cookies','HRService',function($rootScope, $scope, $sce, $timeout, $cookies, HRService){
	var dd =  new Date();
	var scrollItems = [];
	var preLoadData = HRService.preLoad.getPreDate();
	$('body').addClass('loading');
	$scope.loading = true;
	$scope.eventDate = preLoadData.initInfo.date ? (Number(preLoadData.initInfo.date.split('-')[1]) + '月' + Number(preLoadData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
	HRService.loadTopicList(preLoadData.initInfo.eventId).success(function(response){
		$('body').removeClass('loading');
		$scope.loading = false;
		$scope.scrollItems = response.topics;		
		$scope.rate = function(e,i){
			e.stopPropagation();
   			e.preventDefault();
   			if(i.item.isRating == "1"){
				i.item.isRating = "0";
				i.item.rating -= 1;
			}else{
				i.item.isRating = "1";				
				i.item.rating += 1;
			}
			HRService.rate({
				topicId: i.item.topicID, 
				checked: (i.item.isRating == "1") ? 'Y' : 'N'
			}).success(function(){}).error(function(){});
		};
	}).error(function(error){
		console.log(error);
	});
}]);