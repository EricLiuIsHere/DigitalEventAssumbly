'use strict'
var mkQrcode_F = function(feedbackId) {
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 200,
    height: 200
  });
  var feedbackUrl = eventIP + '/adminControl/#/feedback/user/' + feedbackId;
  qrcode.makeCode(feedbackUrl);
};
var feedbackApp = angular.module('feedbackApp', ['appControllers', 'appServices']);
appControllers.controller('FeedbackListController', ['$scope', '$timeout', '$route', 'adminService', function($scope, $timeout, $route, adminService) {
  $scope.feedbacks = [];
  adminService.getAllFeedbacks().success(function(res) {
    console.log('getAllFeedbacks', res);
    $scope.feedbacks = res.titles;
  }).error(function(res) {
    console.error(res);
  });
  $scope.showDetail = function(id) {
    $scope.isShow = id;
  };
  $scope.hideDetail = function(id) {
    $scope.isShow = -1;
  };
  $scope.signOut = function() {
    adminService.signOut().success(function(data) {
      window.location.href = '#/login';
    }).error(function(err) {
      console.log(err);
    });
  };

  function showWarning(message) {
    $scope.errorMsg = message;
    $timeout(function() {
      $scope.errorMsg = "";
    }, 5000);
  };

  $scope.deleteFeedback = function(id) {
    if (confirm("确定要删除该调查问卷吗？")) {
      adminService.deleteFeedback(id).success(function(res) {
        if (res.Message == "Success") {
          $route.reload();
        } else {
          showWarning("删除该反馈表失败，请重试！");
        }
      }).error(function(res) {
        console.error(res, 'Delete Feedback Error');
        showWarning("删除该反馈表失败，请重试！");
      });
    };
  };
}]);

appControllers.controller('FeedbackNewItemController', ['$scope', '$location', '$timeout', 'FileSaver', 'adminService', function($scope, $location, $timeout, FileSaver, adminService) {
  $scope.feedback = {
    title: '',
    description: '',
    questions: [{
      type: '1',
      question: '',
      rateType: '1',
      options: ['', '', '']
    }]
  };
  $scope.feedbackId = 0;

  function removeCh() {
    if ($scope.feedback.title && $scope.feedback.title.search(/[\s\#\%\&]+/) != -1) {
      $scope.feedback.title = $scope.feedback.title.replace(/[\s\#\%\&]+/g, '');
    };
    if ($scope.feedback.description && $scope.feedback.description.search(/[\s\#\%\&]+/) != -1) {
      $scope.feedback.description = $scope.feedback.description.replace(/[\s\#\%\&]+/g, '');
    };
    angular.forEach($scope.feedback.questions, function(item) {
      if (item.question && item.question.search(/[\s\#\%\&]+/) != -1) {
        item.question = item.question.replace(/[\s\#\%\&]+/g, '');
      };
      for (var i = 0; i < item.options.length; i++) {
        if (item.options[i] && item.options[i].search(/[\s\#\%\&]+/) != -1) {
          item.options[i] = item.options[i].replace(/[\s\#\%\&]+/g, '');
        };
      };
    });
  };
  $scope.addQuestion = function() {
    $scope.feedback.questions.push({
      type: '1',
      question: '',
      rateType: '1',
      options: ['', '', '']
    });
    $('html, body').animate({
      scrollTop: $(document).height()
    }, 500);
  };

  function showWarning(message) {
    $scope.errorMsg = message;
    $timeout(function() {
      $scope.errorMsg = "";
    }, 5000);
  };

  function showSuccess(message) {
    $scope.successMsg = message;
    $timeout(function() {
      $scope.successMsg = "";
    }, 5000);
  };
  $scope.delQuestion = function(index) {
    if (confirm("确认要删除该问题吗？")) {
      $scope.feedback.questions.splice(index, 1);
    };
  };
  $scope.addOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index + 1, 0, '');
  };
  $scope.delOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index, 1);
  };
  $scope.signOut = function() {
    adminService.signOut().success(function(data) {
      window.location.href = '#/login';
    }).error(function(err) {
      console.log(err);
    });
  };
  $scope.copyDone = function() {
    $scope.doneMessage = '复制成功';
    $timeout(function() {
      $scope.doneMessage = ' ';
    }, 1000);
  }
  $scope.downloadQR = function() {
    // DownLoadReportIMG(document.getElementById('qrcode').children[1].src)
    var canvas = document.getElementById('qrcode').children[0];
    // draw to canvas...
    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, "feedback-" + $scope.feedbackId + ".png");
    });
  };

  $scope.save = function() {
    removeCh();
    var str = angular.toJson($scope.feedback);
    var data = angular.fromJson(str);
    angular.forEach(data.questions, function(item) {
      if (item.type == "4") {
        delete item.options;
        delete item.rateType;
      } else if (item.type == "2") {
        delete item.options;
        if (item.rateType == "2") {
          item.type = "3";
        };
        delete item.rateType;
      };
    });
    var josnStr = angular.toJson(data);
    console.log("AddFeedback", data);
    adminService.addFeedback(josnStr).success(function(res) {
      console.log("AddFeedback-res", res);
      if (res.Message == "Error") {
        showWarning("增加反馈表失败，请重试！");
      } else {
        showSuccess("增加反馈表成功！");
        $scope.isFinished = true;
        $scope.feedbackId = res.Message;
        $scope.url = eventIP + '/adminControl/#/feedback/user/' + $scope.feedbackId;
        mkQrcode_F($scope.feedbackId);
      };
    }).error(function(res) {
      showWarning("增加反馈表失败，请重试！");
    });
  };
}]);

appControllers.controller('FeedbackEditItemController', ['$scope', '$location', '$timeout', '$route', 'FileSaver', 'adminService', function($scope, $location, $timeout, $route, FileSaver, adminService) {
  $scope.feedback = {};
  adminService.getOneFeedback($route.current.params.id).success(function(res) {
    console.log('GetOneFeedback', res);
    var data = {
      titleId: $route.current.params.id,
      title: res.questions.title,
      description: res.questions.description,
      questions: res.questions.questionList
    };
    angular.forEach(data.questions, function(item) {
      item.rateType = "1";
      if (item.type != "1") {
        item.options = ['', '', ''];
      };
      if (item.type == "3") {
        item.rateType = "2";
        item.type = "2";
      };
    });
    $scope.feedback = data;
    console.log("EditItem", $scope.feedback);
    $scope.url = eventIP + '/adminControl/#/feedback/user/' + $route.current.params.id;
    mkQrcode_F($route.current.params.id);
  }).error(function(res) {
    console.error('EditItem', res);
  });

  function showWarning(message) {
    $scope.errorMsg = message;
    $timeout(function() {
      $scope.errorMsg = "";
    }, 5000);
  };

  function showSuccess(message) {
    $scope.successMsg = message;
    $timeout(function() {
      $scope.successMsg = "";
    }, 3000);
  };

  function removeCh() {
    if ($scope.feedback.title && $scope.feedback.title.search(/[\s\#\%\&]+/) != -1) {
      $scope.feedback.title = $scope.feedback.title.replace(/[\s\#\%\&]+/g, '');
    };
    angular.forEach($scope.feedback.questions, function(item) {
      if (item.question && item.question.search(/[\s\#\%\&]+/) != -1) {
        item.question = item.question.replace(/[\s\#\%\&]+/g, '');
      };
      for (var i = 0; i < item.options.length; i++) {
        if (item.options[i] && item.options[i].search(/[\s\#\%\&]+/) != -1) {
          item.options[i] = item.options[i].replace(/[\s\#\%\&]+/g, '');
        };
      };
    });
  };

  $scope.addQuestion = function() {
    $scope.feedback.questions.push({
      type: '1',
      question: '',
      rateType: '1',
      options: ['', '', '']
    });
    $('html, body').animate({
      scrollTop: $(document).height()
    }, 500);
  };
  $scope.delQuestion = function(index) {
    if (confirm("确认要删除该问题吗？")) {
      $scope.feedback.questions.splice(index, 1);
    };
  };
  $scope.addOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index + 1, 0, '');
  };
  $scope.delOption = function(index, index_0) {
    $scope.feedback.questions[index_0].options.splice(index, 1);
  };
  $scope.signOut = function() {
    adminService.signOut().success(function(data) {
      window.location.href = '#/login';
    }).error(function(err) {
      console.log(err);
    });
  };
  $scope.copyDone = function() {
    $scope.doneMessage = '复制成功';
    $timeout(function() {
      $scope.doneMessage = ' ';
    }, 1000);
  }
  $scope.downloadQR = function() {
    // DownLoadReportIMG(document.getElementById('qrcode').children[1].src)
    var canvas = document.getElementById('qrcode').children[0];
    // draw to canvas...
    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, "feedback-" + $route.current.params.id + ".png");
    });
  };

  $scope.save = function() {
    if (confirm("将删除所有提交的调查问卷数据，确定要修改吗？")) {
      removeCh();
      var str = angular.toJson($scope.feedback);
      var data = angular.fromJson(str);
      angular.forEach(data.questions, function(item) {
        if (item.type == "4") {
          delete item.options;
          delete item.rateType;
        } else if (item.type == "2") {
          delete item.options;
          if (item.rateType == "2") {
            item.type = "3";
          };
          delete item.rateType;
        };
      });
      var josnStr = angular.toJson(data);
      console.log("SaveFeedback", data);
      adminService.saveFeedback(josnStr).success(function(res) {
        console.log("SaveFeedback-res", res);
        if (res.Message == "Error") {
          showWarning("修改反馈表失败，请重试！");
        } else {
          showSuccess("修改反馈表成功！");
        };
      }).error(function(res) {
        showWarning("修改反馈表失败，请重试！");
      });
    };
  };
}]);

appControllers.controller('FeedbackDataItemController', ['$scope', '$location', '$timeout', '$route', 'FileSaver', 'NgTableParams', 'adminService', function($scope, $location, $timeout, $route, FileSaver, NgTableParams, adminService) {

  $scope.question = {
    id: $route.current.params.id,
    title: '',
    description: '',
    list: []
  };
  adminService.getOneFeedback($route.current.params.id).success(function(res) {
    console.log('GetOneFeedback res=', res);
    $scope.question.title = res.questions.title;
    $scope.question.description = res.questions.description;
    $scope.question.list = res.questions.questionList;
  }).error(function(res) {
    console.error('[GetOneFeedback] res=', res);
  });

  $scope.answer = [];
  adminService.getUserAnswer($route.current.params.id).success(function(res) {
    console.log('getUserAnswer res=', res);
    $scope.answer = res.answers;
    $scope.tableParams = new NgTableParams({
      count: 5
    }, {
      filterOptions: {
        filterComparator: false
      },
      counts: [5, 10, 25],
      dataset: $scope.answer
    });
  }).error(function(err) {
    console.error('[GetUserAnswer] err=', err);
  });

  $scope.signOut = function() {
    adminService.signOut().success(function(data) {
      window.location.href = '#/login';
    }).error(function(err) {
      console.log(err);
    });
  };
}]);

appControllers.controller('FeedbackUserController', ['$scope', '$location', '$routeParams', '$timeout', 'adminService', function($scope, $location, $routeParams, $timeout, adminService) {
  $('#telModal').modal({
    backdrop: false,
    keyboard: false,
    show: true
  });
  $scope.status = 0;
  $scope.check = function() {
    $('#checkBtn').button('loading');
    adminService.getUserInfo($scope.feedback.tel, $routeParams.id).success(function(res) {
      $('#checkBtn').button('reset');
      $('#telModal').modal('hide');
      if (res.Success) {
        $scope.status = 1;
      } else {
        $scope.status = 3;
      };
    }).error(function(res) {
      $('#checkBtn').button('reset');
    });
  };

  function removeCh() {
    angular.forEach($scope.feedback.questions, function(item) {
      if (item.answer && item.answer.search(/[\s\#\%\&]+/) != -1) {
        item.answer = item.answer.replace(/[\s\#\%\&]+/g, '');
      };
    });
  };

  adminService.getOneFeedback($routeParams.id).success(function(res) {
    console.log('getOneFeedback', res);
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
    removeCh();
    $scope.isFinished = true;
    for (var i = 0; i < $scope.feedback.questions.length; i++) {
      if (!$scope.feedback.questions[i].answer) {
        $scope.isFinished = false;
        $scope.status = 5;
        $timeout(function() {
          $scope.status = 1;
        }, 3000);
        break;
      };
    }
    if ($scope.isFinished) {
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
      });
      var str = angular.toJson(ans);
      console.log('saveUserQuestion', str);
      $('#saveBtn').button('loading');
      adminService.saveUserQuestion(str).success(function(res) {
        $('#saveBtn').button('reset');
        if (res.Message == "Success") {
          $scope.status = 2;
        } else {
          $scope.status = 4;
          $timeout(function() {
            $scope.status = 1;
          }, 3000);
        };
      }).error(function(res) {
        $('#saveBtn').button('reset');
      });
    };
  };
}]);
