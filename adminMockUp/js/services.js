appServices.factory('adminService', function($http, $q){
	/**
	 * @file The global server of GCG Campus application, more API function refer right navigation bar.
	 * @author XIAO YU WANG <wxyu@cn.ibm.com>
	 * @author MING YUAN DU <dumingy@cn.ibm.com>
	 * @version 1.0
	 * */
	var host,
		userInfo;
	if(window.location.hostname == 'localhost' || window.location.hostname == '9.115.24.168'){
		host = 'http://9.115.24.168:9081/campus/';
		// host = 'http://9.115.28.96:9080/campus/';
		// host = 'https://9.115.24.168:9443/campus/';
	}else if(window.location.hostname == '170.225.225.31'){
		host = 'http://170.225.225.31:9080';
	}
	
	return {
		logIn: function(loginData){
			return $http.jsonp(host+'AdminLogin?username='+ loginData.username+ '&password='+loginData.password+'&callback=JSON_CALLBACK');
		},

		/**
		 * Returns $http x-domain service - get topic details by id and location
		 * @author XIAO YU WANG <wxyu@cn.ibm.com>
		 * @param {Number} tid topic ID
		 * @param {String} locationInfor The code of each school: e.g. 'BJU'
		 * @example
		 * // Get #43 and "BJU" location topic detail
		 * HRService.loadTopicList(43, 'BJU');
		 * @returns {Object}
		 */
		newStepOne: function(basicInfo){
			return $http.jsonp(host + 'SaveEvent?jsonStr=' + basicInfo + '&callback=JSON_CALLBACK');
		},
		
		/**
		 * Returns $http x-domain service - post comments
		 * @author XIAO YU WANG <wxyu@cn.ibm.com>
		 * @param {Object} postData Post data include topic id and comments content.
		 * @example
		 * // Post comemnt "You and me!" of topid id 43
		 * HRService.postComment({topicId: 43, comments: 'You and me!'});
		 * @returns {Object}
		 */
		saveTopic: function(topicInfo){
			return $http.jsonp(host + 'SaveTopic?jsonStr=' + topicInfo + '&callback=JSON_CALLBACK');
		},
		
		/**
		 * Returns $http x-domain service - post rating
		 * @author XIAO YU WANG <wxyu@cn.ibm.com>
		 * @param {Object} postData Post data include topic id and checked value(Y/N), Y: checked, N: un-checked.
		 * @example
		 * // Rate topid id 43
		 * HRService.rate({topicId: 43, checked: 'Y'});
		 * @returns {Object}
		 */
		getAllEvents: function(){
			return $http.jsonp(host + 'GetAllEvents?'+'&callback=JSON_CALLBACK');
		},
		
		/**
		 * Returns $http x-domain service - post code to the phone
		 * @author XIAO YU WANG <wxyu@cn.ibm.com>
		 * @deprecated OMG...
		 * @returns {Object}
		 */
		saveEventUrl: function(info){
			return $http.jsonp(host + 'SaveEventUrl?jsonStr=' + info + '&callback=JSON_CALLBACK');
		},
		getEventById: function(id){
			return $http.jsonp(host + 'GetEventById' + id + '&callback=JSON_CALLBACK');
		},
		deleteEvent:function(id){
			return $http.jsonp(host + 'DeleteEvent?id=' + id + '&callback=JSON_CALLBACK');
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
				var deferred = $q.defer(),
					loginfoStorageObj = null,
					now = +new Date(),
					expiriation = 0;
					
				if(window.localStorage && window.localStorage.loginfo){
					loginfoStorageObj = JSON.parse(localStorage.loginfo);
					expiriation = loginfoStorageObj.expiriation;
					storageLocation = loginfoStorageObj.location;
				}
				
				// Get user info from global or local storage data
				if(!!this.getUser() || (loginfoStorageObj && (now < expiriation) && (storageLocation == $cookies.locationCookie))){
					if(!this.getUser()){
						// Set user info from local storage data
						this.setUser(loginfoStorageObj);
					}
					
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