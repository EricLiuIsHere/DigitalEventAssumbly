var app = angular.module('newEvent', ['appControllers','appServices','ngFileUpload']);
/*var SaveAs5 = function(imgURL){ 
    var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000"); 
    for(; oPop.document.readyState != "complete"; ) 
    { 
    if (oPop.document.readyState == "complete")break; 
    } 
    oPop.document.execCommand("SaveAs"); 
    oPop.close(); 
    }*/
var eventUrl = '';
var notAdmin = function(data){
    if(data.IsAdmin=="False"){
        window.location.href = 'login.html';
    }
}
var mkQrcode = function(eventId){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 200,
        height : 200
    });
    eventUrl = 'http://170.225.225.31:81/campus/#/login?checkIn=Y&eventID='+eventId;
    qrcode.makeCode(eventUrl);
        
};
appControllers.controller('newStepOne',['$scope','$rootScope','adminService',function($scope,$rootScope,adminService){
    console.log(window.location.href);
    var addr = window.location.href.toString();
    if(addr.indexOf("?id")>=0){
        var id = addr.substring(addr.indexOf("?id="), addr.length);
        adminService.getEventById(id).success(function(data){
            notAdmin(data);
            console.log(data);
            $rootScope.thisEvent = data.event;
            $scope.basic.college = $rootScope.thisEvent.college;
            $scope.basic.type = $rootScope.thisEvent.type;
            $scope.basic.date = $rootScope.thisEvent.date;
            $scope.basic.starttime = $rootScope.thisEvent.startTime;
            $scope.basic.endtime = $rootScope.thisEvent.endTime;
            $scope.basic.address = $rootScope.thisEvent.address;
            $scope.basic.describe = $rootScope.thisEvent.describe;
            $scope.basic.template = $rootScope.thisEvent.template;
            $scope.basic.shakeFlag = $rootScope.thisEvent.shakeFlag;
            $scope.basic.eventId = $rootScope.thisEvent.id;
            $rootScope.topics = $rootScope.thisEvent.speakers;
            console.log($rootScope.thisEvent);
        }).error(function(err){
            console.log(JSON.stringify(a));
        });
    }
    

    $scope.basic = {template:'1',shakeFlag: true};
    
	$scope.getAll = function(){
		if($rootScope.thisEvent){
            console.log($scope.basic)
        }
		var a = $scope.basic;
		var x=0;
		for(i in a){
			x++;
		}
		if(x>=9){
			adminService.newStepOne(JSON.stringify(a)).success(function(data){
                notAdmin(data);
				console.log(data);
                $('#stepTab a[href="#topics"]').attr('data-toggle','tab');
                $('#stepTab a[href="#topics"]').tab('show');
                $rootScope.EventID = data.EventID;
                mkQrcode(data.EventID);
			}).error(function(err){
				console.log(JSON.stringify(a));
			});
		}

        if(!$rootScope){
            $rootScope.topics = new Array();
            $rootScope.isHide = false;
        }else if(!$rootScope.thisEvent){
            console.log($rootScope.thisEvent)
            $rootScope.topics = new Array();
            $rootScope.isHide = false;
        }else if(!$rootScope.thisEvent.speakers){
            $rootScope.topics = new Array();
            $rootScope.isHide = false;
        }else{
            $rootScope.isHide = true;
            console.log($scope.isHide)
        }
	};
	$('.form_date').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
    $('.form_time').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        keyboardNavigation: false,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
}]);

appControllers.controller('newStepTwo',['$scope','$rootScope', 'Upload', '$timeout', 'adminService',function($scope, $rootScope, Upload, $timeout,adminService){
    console.log($rootScope.thisEvent)

	$scope.uploadImages = function(file, errFiles){
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if(!$scope.topic){
            $scope.topic.timestamp = new Date().getTime();
        }else if(!$scope.topic.timestamp){
            if($scope.topic.speakerImg && $scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerFile.slice($scope.topic.speakerFile.indexOf("_file")-13,$scope.topic.speakerFile.indexOf("_file")));
            }else if(!$scope.topic.speakerImg && $scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerFile.slice($scope.topic.speakerFile.indexOf("_file")-13,$scope.topic.speakerFile.indexOf("_file")));
            }else if($scope.topic.speakerImg && !$scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerImg.slice($scope.topic.speakerImg.indexOf("_img")-13,$scope.topic.speakerImg.indexOf("_img")));
            }else{
                $scope.topic.timestamp = new Date().getTime();
            }
        }

        console.log($scope.topic.timestamp + '_______')
        if ($scope.f/* && x>=6*/) {
            console.log($scope.f)
            $scope.f.upload = Upload.upload({
                url: 'http:///9.115.24.168:9081/campus/FileUpload',
                headers : {
                    "Time-Stamp": $scope.topic.timestamp,
                    "File-Type" : "img"
                },
                data: {'filename':$scope.f,'type':$scope.f.type,'file': $scope.f},
                
            });
            $scope.topic.speakerImg = $scope.topic.timestamp + '_img/'+ $scope.f.name;
            $scope.f.upload.then(function (response) {
                $timeout(function () {
                    $scope.f.result = response.data;

                });
                
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.f.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }
    };

    $scope.previousStep = function(){
        $('#stepTab a[href="#basic"]').tab('show');
    };
    $scope.uploadFiles = function(files, errFiles){
        $scope.files = files;
        $scope.errFiles = errFiles;
        if(!$scope.topic){
            $scope.topic.timestamp = new Date().getTime();
        }else if(!$scope.topic.timestamp){
            if($scope.topic.speakerImg && $scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerFile.slice($scope.topic.speakerFile.indexOf("_file")-13,$scope.topic.speakerFile.indexOf("_file")));
            }else if(!$scope.topic.speakerImg && $scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerFile.slice($scope.topic.speakerFile.indexOf("_file")-13,$scope.topic.speakerFile.indexOf("_file")));
            }else if($scope.topic.speakerImg && !$scope.topic.speakerFile){
                $scope.topic.timestamp = parseInt($scope.topic.speakerImg.slice($scope.topic.speakerImg.indexOf("_img")-13,$scope.topic.speakerImg.indexOf("_img")));
            }else{
                $scope.topic.timestamp = new Date().getTime();
            }
        }
        console.log($scope.topic.timestamp + '___++__')
        // angular.forEach(files, function(file) {
        //     file.upload = Upload.upload({
        //         url: '',
        //         data: {file: file}
        //     });

        //     file.upload.then(function(response) {
        //         $timeout(function() {
        //             file.result = response.data;
        //         });
        //     }, function (response) {
        //         if (response.status > 0)
        //             $scope.errorMsg = response.status + ': ' + response.data;
        //     }, function (evt) {
        //         file.progress = Math.min(100, parseInt(100.0 * 
        //                                  evt.loaded / evt.total));
        //     });
        // });
        if($scope.files/* && x>=6*/){
            angular.forEach($scope.files, function(file) {

            file.upload = Upload.upload({

                url: 'http:///9.115.24.168:9081/campus/FileUpload',
                 headers : {
                    "Time-Stamp":$scope.topic.timestamp,
                    "File-Type" : "file"
                },
                data: {'filename':file.name,'type':file.type,'file':file},
                
            });
            $scope.topic.speakerFile = $scope.topic.timestamp + '_file/'+ file.name;
            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });
                
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        });
        }
    };
    
	$scope.proceed = function(){

        $rootScope.eventUrl = eventUrl;
        var qrcode = $('#qrcode img').attr('src');
        console.log(qrcode);
        var a = {id:$rootScope.EventID,eventUrl:encodeURIComponent($rootScope.eventUrl.toString()),qrcode:qrcode}
    	adminService.saveEventUrl(JSON.stringify(a)).success(function(data){
                notAdmin(data);
                console.log(data);
                $('#stepTab a[href="#result"]').attr('data-toggle','tab');
                $('#stepTab a[href="#result"]').tab('show');
            }).error(function(err){
                console.log(JSON.stringify(a));
            });

    };

    $scope.save = function(){
        $scope.topic.eventId = $rootScope.EventID;
        var a = $scope.topic;
        var x=0;
        
        for(i in a){
            x++;
        }
        console.log($scope.topic)
        console.log(x)
        if($scope.topic && x>=6){
            adminService.saveTopic(JSON.stringify($scope.topic)).success(function(data){
                notAdmin(data);
                var flag = true;
                for(i in $rootScope.topics){
                    if($rootScope.topics[i].id == $scope.topic.id){
                        flag=false;
                        $rootScope.topics[i].topicName = $scope.topic.topicName;
                        $rootScope.topics[i].topicDesc = $scope.topic.topicDesc;
                        $rootScope.topics[i].speakerName = $scope.topic.speakerName;
                        $rootScope.topics[i].speakerDesc = $scope.topic.speakerDesc;
                        $rootScope.topics[i].startTime = $scope.topic.startTime;
                        $rootScope.topics[i].endTime = $scope.topic.endTime;
                    }
                }
                if(flag){
                    $scope.topic.id=data.TopicID;
                    $rootScope.topics.push($scope.topic);
                }
                $scope.topic = null;
                console.log($rootScope.topics)
                $scope.isHide = true;
                console.log(data)
            }).error(function(err){
                console.log(err);
            });
            
        }
    	
    }
    $scope.addItem = function(){
        $scope.isHide = false;
    }
    $scope.editTopic = function(data){
        console.log(data.topicName);
        
        $scope.topic = data;

        $scope.isHide = false;
    }
    $scope.dropTopic = function(data){
        console.log(data);
    }
}]);
appControllers.controller('finalStep',['$scope','$rootScope', function($scope, $rootScope){
    
    

   /* $scope.downloadQR = function(){
        // DownLoadReportIMG(document.getElementById('qrcode').children[1].src)
        
        
        SaveAs5(document.getElementById('qrcode').children[1].src);
    }*/

}]);