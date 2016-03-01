appServices.factory('tempSelect',['$rootScope', function ($rootScope) {
  var imageName = {};
  imageName.thisImg = '';
  imageName.updateImg = function (value) {
    this.thisImg = value;
    $rootScope.$broadcast('updateImg');
  };
  console.log('success');
  return imageName;

}]);
appServices.factory('adminService', function($http, $q) {
  /**
   * @file The global server of GCG Campus application, more API function refer right navigation bar.
   * @author XIAO YU WANG <wxyu@cn.ibm.com>
   * @author MING YUAN DU <dumingy@cn.ibm.com>
   * @version 1.0
   * */
  var host,
    userInfo;
    console.log(window.location.hostname)
  if (window.location.hostname == 'localhost' || window.location.hostname == '9.115.24.168') {
    host = 'http://9.115.24.168:9080/campus/';
    // host = 'http://9.112.69.0:9080/campus/';
    // host = 'https://9.115.24.168:9443/campus/';
  }else if(window.location.hostname == '159.122.251.251'){
    host = 'http://159.122.251.251:9080/campus/'
  } else if (window.location.hostname == '170.225.225.31' || window.location.hostname == 'dss.cn.edst.ibm.com') {
    host = 'http://9.98.15.31:9080/campus/';
  }else {
    host = 'http://9.115.24.168:9080/campus/';
  }

  return {
    logIn: function(loginData) {
      return $http.jsonp(host + 'AdminLogin?username=' + loginData.username + '&password=' + loginData.password + '&callback=JSON_CALLBACK');
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
    newStepOne: function(basicInfo) {
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
    saveTopic: function(topicInfo) {
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
    getAllEvents: function() {
      return $http.jsonp(host + 'GetAllEvents?' + '&callback=JSON_CALLBACK');
    },

    /**
     * Returns $http x-domain service - post code to the phone
     * @author XIAO YU WANG <wxyu@cn.ibm.com>
     * @deprecated OMG...
     * @returns {Object}
     */
    saveEventUrl: function(info) {
      return $http.jsonp(host + 'SaveEventUrl?jsonStr=' + info + '&callback=JSON_CALLBACK');
    },
    getEventById: function(id) {
      return $http.jsonp(host + 'GetEventById' + id + '&callback=JSON_CALLBACK');
    },
    deleteEvent: function(id) {
      return $http.jsonp(host + 'DeleteEvent?id=' + id + '&callback=JSON_CALLBACK');
    },
    dropTopic: function(id) {
      return $http.jsonp(host + 'DeleteTopic?speakerId=' + id + '&callback=JSON_CALLBACK');
    },
    signOut: function() {
      return $http.jsonp(host + 'AdminLogout?&callback=JSON_CALLBACK');
    },
    getEventDetails: function(id){
      return $http.jsonp(host + 'GetEventDesc' + id + '&callback=JSON_CALLBACK');
    },
    deleteComment: function(id){
      return $http.jsonp(host + 'DeleteComment?jsonStr=' + id + '&callback=JSON_CALLBACK');
    },
    saveQuestion: function(data){
      return $http.jsonp(host + 'SaveQuestion?jsonStr=' + data + '&callback=JSON_CALLBACK');
    },
    saveAdminComments:function(id,data){
      return $http.jsonp(host + 'SaveAdminComments' + id + '&jsonStr=' + data + '&callback=JSON_CALLBACK');
    },
    /**
     * Returns
     * @author Jun Jie Zhang <dlzhjj@cn.ibm.com>
     */
    getAllFeedbacks: function() {
      return $http.jsonp(host + 'GetAllTitles' + '?callback=JSON_CALLBACK');
    },

    getOneFeedback: function(id) {
      return $http.jsonp(host + 'GetQuestions?id=' + id + '&callback=JSON_CALLBACK');
    },

    deleteFeedback: function(id) {
      return $http.jsonp(host + 'DeleteTitle?titleId=' + id + '&callback=JSON_CALLBACK');
    },

    addFeedback: function(jsonStr) {
      return $http.jsonp(host + 'SaveFeedbackQuestion?jsonStr=' + jsonStr + '&callback=JSON_CALLBACK');
    },

    saveFeedback: function(jsonStr) {
      return $http.jsonp(host + 'SaveFeedbackQuestion?jsonStr=' + jsonStr + '&callback=JSON_CALLBACK');
    },

    getUserAnswer: function(id) {
      return $http.jsonp(host + 'GetAnswers?titleId=' + id + '&callback=JSON_CALLBACK');
    },

    getUserInfo: function(phone, id) {
      return $http.jsonp(host + 'IsSubmitted?tel=' + phone + '&titleId='+ id + '&callback=JSON_CALLBACK');
    },

    saveUserQuestion: function(question) {
      return $http.jsonp(host + 'SaveAnswers?jsonStr=' + question + '&callback=JSON_CALLBACK');
    },

    /**
     * Returns $http x-domain service - post code to the phone
     * @author XIAO YU WANG <wxyu@cn.ibm.com>
     * @deprecated OMG...
     * @returns {Object}
     */
    saveEventUrl: function(info) {
      return $http.jsonp(host + 'SaveEventUrl?jsonStr=' + info + '&callback=JSON_CALLBACK');
    },

    Auth: {
      appStatus: '',

      userReg: function(paramStr) {
        return $http.jsonp(host + '/campus/Register?' + paramStr + '&callback=JSON_CALLBACK');
      },

      userLogin: function(postData) {
        var paramStr = $.param(postData);
        return $http.jsonp(host + '/campus/Login?' + paramStr + '&callback=JSON_CALLBACK');
      },

      setUser: function(uArr) {
        userInfo = uArr;
      },

      getUser: function() {
        return userInfo;
      },

      isLoggedIn: function() {
        var deferred = $q.defer(),
          loginfoStorageObj = null,
          now = +new Date(),
          expiriation = 0;

        if (window.localStorage && window.localStorage.loginfo) {
          loginfoStorageObj = JSON.parse(localStorage.loginfo);
          expiriation = loginfoStorageObj.expiriation;
          storageLocation = loginfoStorageObj.location;
        }

        // Get user info from global or local storage data
        if (!!this.getUser() || (loginfoStorageObj && (now < expiriation) && (storageLocation == $cookies.locationCookie))) {
          if (!this.getUser()) {
            // Set user info from local storage data
            this.setUser(loginfoStorageObj);
          }

          this.appStatus = 'LOGGED';
          deferred.resolve('LOGGED');
        } else {
          this.appStatus = 'UNLOGGED';
          deferred.reject('UNLOGGED');
        }

        return deferred.promise;
      }
    }
  };
});
