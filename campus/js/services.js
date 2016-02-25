appServices.factory('HRService', function($http, $q){
	var host,
		userInfo,
		preData;
	if(window.location.hostname == '170.225.225.31'){
	    host = 'http://170.225.225.31:9080';
	} else {
	    //host = 'http://9.115.24.168:9081';
	    host = 'http://9.115.24.168:9080';
	} 
	return {
		loadTopicList: function(eventId){
			return $http.jsonp(host + '/campus/GetTopicList?eventId='+ eventId +'&callback=JSON_CALLBACK');
		},

		loadDetail: function(tid,eventId){
			return $http.jsonp(host + '/campus/TopicDetail?topicId=' + tid + '&callback=JSON_CALLBACK');
		},
		
		postComment: function(postData){
			var paramStr = $.param(postData);
			return $http.jsonp(host + '/campus/AddComment?' + paramStr + '&callback=JSON_CALLBACK');
		},
		
		rate: function(postData){
			var paramStr = $.param(postData);
			return $http.jsonp(host + '/campus/HandleRating?' + paramStr + '&callback=JSON_CALLBACK');
		},
		
		postCode: function(tel){
			return $http.jsonp(host + '/campus/PostCode?tel=' + tel + '&callback=JSON_CALLBACK');
		},

		preLoad: {
			getDataFromServer: function(eventId){
				return $http.jsonp(host + '/campus/GetInitInfo?eventId=' + eventId + '&callback=JSON_CALLBACK');
			},
			setPreData: function(data){
				preData = data;
			},
			getPreDate: function(){
				return preData;
			}
		},

		Auth: {
			appStatus: '',
			
			userReg: function(paramStr){
				return $http.jsonp(host + '/campus/Register?' + paramStr + '&callback=JSON_CALLBACK');
			},
			
			userLogin: function(postData){
				var paramStr = $.param(postData);
				return $http.jsonp(host + '/campus/Login?' + paramStr + '&callback=JSON_CALLBACK');
			},
			
			setUser: function(uArr){
				userInfo = uArr;
			},
			
			getUser: function(){
				return userInfo;
			},
			
			isLoggedIn: function(){
				var deferred = $q.defer();
				
				if(!!this.getUser()){
					this.appStatus = 'LOGGED';
					deferred.resolve('LOGGED');
			    }else{
			    	this.appStatus = 'UNLOGGED';
			    	deferred.reject('UNLOGGED');
			    }
				
				return deferred.promise;
			}
		}
	};
});