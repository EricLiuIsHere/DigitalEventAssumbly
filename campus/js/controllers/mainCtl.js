appControllers.controller('mainCtl', ['$rootScope', '$scope', '$sce', '$timeout', '$routeParams','$cookies', 'HRService', function($rootScope, $scope, $sce, $timeout, $routeParams,$cookies, HRService){
	var preLoadData = HRService.preLoad.getPreDate();
	var dd = new Date();
	$scope.eventTitle = preLoadData.initInfo.college ? (preLoadData.initInfo.college) : 'IBM校园招聘';
	$scope.eventDate = preLoadData.initInfo.date ? (Number(preLoadData.initInfo.date.split('-')[1]) + '月' + Number(preLoadData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
	$scope.currDate = dd.getFullYear();
}]);