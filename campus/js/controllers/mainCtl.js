appControllers.controller('mainCtl', ['$rootScope', '$scope', '$sce', '$timeout', '$routeParams','$cookies', 'HRService', function($rootScope, $scope, $sce, $timeout, $routeParams,$cookies, HRService){
	var preLoadData = HRService.preLoad.getPreDate();
	if(preLoadData.initInfo.isShaked == "1") {
		$scope.hash = 'lucky';
	}else {
		$scope.hash = '';
		$('.menu-list li:last').css('visibility','hidden');
	}
	var dd = new Date();
	$scope.eventTitle = preLoadData.initInfo.college ? (preLoadData.initInfo.college) : 'IBM校园招聘';
	$scope.eventDate = preLoadData.initInfo.date ? (Number(preLoadData.initInfo.date.split('-')[1]) + '月' + Number(preLoadData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
	$scope.currDate = dd.getFullYear();
	$scope.description = preLoadData.initInfo.description ? preLoadData.initInfo.description : 'Tips：“手滑”退出系统....，请速速就近找到登陆二维码，轻松扫描即重返宣讲会。 欢迎参加IBM校园宣讲会！童靴们，这里不仅有行业大佬的精彩演讲和独家分享，现场还有趣味游戏和重磅彩蛋等着你喔！</p><p>到早啦？没关系，一起体验最酷炫的【增强现实】游戏吧！拿起你的手机，扫一扫身边的IBM海报，我们带你“无缝”穿梭虚拟与现实！参与就有奖品喔~有想法不吐不快？传说中的牛人大咖云集于此，你还等什么？在【评论】区给我们留言，问题被选中就有豪礼赠送喔~意犹未尽？还想跟IBMer零距离沟通？快来关注“IBM校园行”微信，进入“IBM蓝色导师”应用，这里有专属于你的职场导师！更大的惊喜现场揭晓~';
}]);