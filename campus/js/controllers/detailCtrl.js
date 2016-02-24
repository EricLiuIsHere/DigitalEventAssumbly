appControllers.controller('detailCtl', ['$rootScope', '$scope', '$sce', '$timeout', '$routeParams','$cookies', 'HRService', function($rootScope, $scope, $sce, $timeout, $routeParams,$cookies, HRService){
	var dd = new Date();
	var preLoadData = HRService.preLoad.getPreDate();
	var topicId = $routeParams.id;
	var	userInfo = HRService.Auth.getUser();
	$('body').addClass('loading');
	$scope.loading = true;
	$scope.eventDate = preLoadData.initInfo.date ? (Number(preLoadData.initInfo.date.split('-')[1]) + '月' + Number(preLoadData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
	$scope.submitText = '提交';

	// Escapte HTML tags
	var escapeHTML = function(str){
		var htmlEscapes = {
		  '&': '&amp;',
		  '<': '&lt;',
		  '>': '&gt;',
		  '"': '&quot;',
		  "'": '&#x27;',
		  '/': '&#x2F;',
		  '\n': '<br />',
		  '\r': '<br />'
		};
		var htmlEscaper = /[&<>"'\/\n\r]/g;
		return str.replace(htmlEscaper, function(match) {
		    return htmlEscapes[match];
		});
	};
	
	HRService.loadDetail(topicId).success(function(data){
		$('body').removeClass('loading');
		$scope.loading = false;
		var topicObj = data.result.topic;
		var commentsObj = data.result.comments;
		$scope.hideBand = true;
		$('.hr-comments-item').remove();		
		$scope.topic = {
			pageTitle: topicObj.topicName,
			speaker: topicObj.speakerName,
			topicDesc: topicObj.topicDesc,
			rating: topicObj.rating,
			hadRated: topicObj.isRating,
			speakerDesc: topicObj.speakerDesc,
			speakerImage: topicObj.speakerImg,
			ID: '',
			userName: '',
			userAvatar: '',
			postComment: function(){
				$scope.commentsMsg = '';
				if(valideForm('hr-detail-comments-area')){
					$scope.submitText = '提交中';
					var commentsNode = $('#hr-detail-comments-area'),
						submitBtnNode = $('.hr-detail-buttom');
					submitBtnNode.prop('disabled', true);
					HRService.postComment({topicId: topicId, comments: commentsNode.val()}).success(function(){
						$scope.hideBand = false;
						var originalHtml = $('.comment-list').html()
						$('.comment-list').html(originalHtml + '<li><p class="comment-name">'+ (userInfo.uname || '未知') +'</p><p style="word-wrap: break-word;">'+ escapeHTML(commentsNode.val()) +'</p></li>');
						commentsNode.val('');
						$scope.submitText = '提交成功';
						$scope.commentsCount += 1;
						$scope.commentsMsg = $sce.trustAsHtml('<span style="color: green;"><i class="fa fa-check"></i> 感谢您的有力评论 :)</span>');
					}).error(function(){
						$scope.commentsMsg = $sce.trustAsHtml('<span style="color: darkorange;"><i class="fa fa-exclamation-triangle"></i> 评论失败 :(</span>');
					}).finally(function(){
						$timeout(function(){
				    		$scope.submitText = '提交';
				    		submitBtnNode.prop('disabled', false);
				    	}, 2000);						
					});
				}				
				return false;
			},
			rate: function(){
				if($scope.topic.hadRated == '1'){
					$scope.topic.hadRated = '0';
					$scope.topic.rating -= 1;
				}else{
					$scope.topic.hadRated = '1';
					$scope.topic.rating += 1;
				}				
				HRService.rate({topicId: topicId, checked: ($scope.topic.hadRated == '1') ? 'Y' : 'N'}).success(function(){
					
				}).error(function(){
					
				});
			}
		};
		
		$scope.$watch('commentsArea', function(newVal, oldVal){
			if(newVal && newVal.length > 140){
				$('#hr-detail-comments-area').css('borderColor', 'red');
				$scope.submitText = '控制140字';
			}else{
				$('#hr-detail-comments-area').css('borderColor', '#CCCCCC');
				$scope.submitText = '提交';
			}
		});
		
		// load comments
		var commentsHTML = '';
		$scope.commentsCount = commentsObj.length;
		if(commentsObj.length > 0){
			$scope.hideBand = false;
			$.each(commentsObj, function(i, comment){
				var name = comment.userName;				
				commentsHTML += '<li><p class="comment-name">'+ name +'<p><p style="word-wrap: break-word;">'+ escapeHTML(comment.comments) +'</p></li>';
			});
			$('.comment-list').html(commentsHTML);
		}
		
		// validate from comment value
		function valideForm(id){
			var commentsVal = $('#' + id).val();		
			if(commentsVal.length == 0 || commentsVal.length > 140){				
				if(commentsVal.length > 140){
					$scope.submitText = '控制140字';
				}else{
					$scope.submitText = '请写入您的评论 :(';
				}				
				return false;
			}else{
				$scope.submitText = '提交';
				return true;
			};
		}
	}).error(function(err){
		$scope.submitText = '加载出错!';
	});
}]);