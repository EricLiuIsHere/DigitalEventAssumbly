'use strict'
var mkQrcode = function(feedbackId) {
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 200,
    height: 200
  });
  var feedbackUrl = 'http://170.225.225.31:81/campus/#/user/' + feedbackId;
  qrcode.makeCode(feedbackUrl);
};
var feedbackApp = angular.module('feedbackApp', ['appControllers', 'appServices']);
appControllers.controller('FeedbackListController', ['$scope', 'adminService', function($scope, adminService) {
  $scope.feedbacks = [];
  adminService.getAllFeedbacks().success(function(res) {
    console.log(res);
    $scope.feedbacks = res.titles;
  }).error(function(res) {
    console.error(res);
  });
  $scope.showDetail = function(id) {
    $scope.isShow = id;
  }
  $scope.hideDetail = function(id) {
    $scope.isShow = -1;
  }
}]);

appControllers.controller('FeedbackNewItemController', ['$scope', '$location', 'adminService', function($scope, $location, adminService) {
  $scope.feedback = {
    title: '',
    questions: [{
      'type': '1',
      'question': '',
      'options': ['', '', '']
    }]
  };
  $scope.addQuestion = function() {
    $scope.feedback.questions.push({
      type: '1',
      question: '',
      options: ['', '', '']
    })
  };
  // $scope.isFinished = true;
  $scope.delQuestion = function(index) {
    console.log(index);
    $scope.feedback.questions.splice(index, 1);
  };
  $scope.addOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index + 1, 0, '');
    console.log($scope.feedback.questions[index_0].options);
  };
  $scope.delOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index, 1);
    console.log($scope.feedback.questions[index_0].options);
  };
  $scope.save = function() {
    var josnStr = angular.toJson($scope.feedback);
    console.log(josnStr);
    adminService.saveFeedback(josnStr).success(function(res) {
      if (res.message === "Error") {
        alert("保存失败，请重试");
        console.error(res);
      } else {
        $scope.isFinished = true;
        var feedbackId = res.message;
        $scope.url = 'http://170.225.225.31:81/campus/#/user/' + feedbackId;
        mkQrcode(feedbackId);
      }
    }).error(function(res) {
      alert("保存失败，请重试");
    });
  };
}]);

appControllers.controller('FeedbackUserController', ['$scope', '$location', '$routeParams', 'adminService', function($scope, $location, $routeParams, adminService) {
  $('#telModal').modal({
    backdrop: false,
    keyboard: false,
    show: true
  });
  $scope.feedback = {
    title: '',
    questions: []
  };
  $scope.check = function() {
    $('#checkBtn').button('loading');
    adminService.getUserInfo($scope.feedback.tel).success(function(res) {
      $('#checkBtn').button('reset');
      $('#telModal').modal('hide');
      if (res.Success) {
        $scope.isNew = true;
      } else {
        $scope.isNew = false;
      };
    }).error(function(res) {
      $('#checkBtn').button('reset');
    });
  };
  adminService.getOneFeedback($routeParams.id).success(function(res) {
    console.log(res);
    $scope.feedback = {
      title: res.questions.title,
      questions: []
    };
    angular.forEach(res.questions.questionList, function(item) {
      var ques = {
        id: item.id,
        question: item.question,
        type: item.type,
        answer: '',
        options: item.options
      };
      $scope.feedback.questions.push(ques);
    })
  }).error(function(res) {
    console.error(res)
  });
  $scope.save = function() {
    var count = 0;
    angular.forEach($scope.feedback.questions, function(item) {
      console.log(item);
      if (item.answer) {
        count++;
      }
    });
    if (count != $scope.feedback.questions.length && $scope.feedback.questions.length != 0) {
      alert('请填写完整');
      return;
    };
    var ans = {
      tel: $scope.feedback.tel.toString(),
      answers: []
    };
    angular.forEach($scope.feedback.questions, function(item) {
      var temp = {
        questionId: item.id.toString(),
        answer: item.answer.toString()
      };
      ans.answers.push(temp);
    })
    var str = angular.toJson(ans);
    console.log(str);
    adminService.saveUserQuestion(str).success(function(res) {
      if (res.Message == "Success"){
        $scope.isNew = false;
      }else{
        $scope.isNew = true;
      }
    }).error(function(res) {});
  };
}]);
