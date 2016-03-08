/*var SaveAs5 = function(imgURL){
    var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000");
    for(; oPop.document.readyState != "complete"; )
    {
    if (oPop.document.readyState == "complete")break;
    }
    oPop.document.execCommand("SaveAs");
    oPop.close();
    }*/
Array.prototype.remove= function(dx){if (isNaN(dx)||dx>this.length){ return false;}for (var i=0,n=0;i<this .length;i++){if( this[i]!=this [dx]){this[n++]= this[i]}}this.length-= 1};
console.log(window.location.hostname)
var currentHost,
    currentPort,
    eventPort,
    eventIP;
  if (window.location.hostname == 'localhost' || window.location.hostname == '9.115.24.168') {
    currentHost = 'http://9.115.24.168';
    currentPort= "9080";
    eventPort= "9080";
    eventIP = 'http://9.115.24.168';
    // host = 'http://9.115.28.96:9080/campus/';
    // host = 'https://9.115.24.168:9443/campus/';
  }else if(window.location.hostname == '159.122.251.251'){
    currentHost = 'http://159.122.251.251';
    currentPort= "9080";
    eventPort= "9080";
    eventIP = 'http://159.122.251.251';

  }  else if (window.location.hostname == '170.225.225.31' || window.location.hostname == 'dss.cn.edst.ibm.com') {
    currentHost = 'http://dss.cn.edst.ibm.com';
    eventIP = 'http://dss.cn.edst.ibm.com';
    currentPort = '9080';
    eventPort = '81';
  }else {
    currentHost = 'http://9.115.24.168';
    currentPort = '9080';
    eventPort= "9080";
    eventIP = 'http://9.115.24.168';
  }

var eventUrl = '';
var notAdmin = function(data){
    if(data.IsAdmin=="False"){
        window.location.href = '#/login';
    }
}
var mkQrcode = function(eventId){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 200,
        height : 200
    });
    // eventUrl = 'http://170.225.225.31:81/campus/#/login?checkIn=Y&eventID='+eventId;
    eventUrl =  eventIP  + ':' + eventPort+'/campus/#/login?checkIn=Y&eventId='+eventId;
    qrcode.makeCode(eventUrl);

};


appControllers.controller('phoneSim',['$scope','$rootScope','$location','adminService','tempSelect', function($scope,$rootScope,$location,adminService,tempSelect){
    // console.log($rootScope)
    var temp='';
    $scope.tabName='';
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
    $('a[role="tab"]').on('shown.bs.tab', function (e) {
      // console.log(e.target.innerHTML) // newly activated tab
      // console.log(e.relatedTarget) // previous active tab
      // e.target.innerHTML;
      // console.log(e.target.innerHTML);

      // if(e.target.innerHTML=="基本信息"){

      //   $rootScope.simImg = 'image/template_big_'+$rootScope.templateId+'.png';
      //   $scope.showTemplateSim = true;
      //   $scope.showTopicSim = false;
      // }else if(e.target.innerHTML=="演讲设置"){
      //   $rootScope.simImg = 'image/sim_topic.png';
      //   $scope.showTemplateSim = false;
      //   $scope.showTopicSim = true;
      // }else if(e.target.innerHTML=="结果"){

      //   $rootScope.simImg = 'image/template_big_'+$rootScope.templateId+'.png';
      //   $scope.showTemplateSim = true;
      //   $scope.showTopicSim = false;
      // }else{
      // }
      // console.log($rootScope.simImg)
      $scope.tabName=e.target.innerHTML;
      $scope.safeApply();
      // $scope.test($scope.tabName)
    });

    $scope.$watch('tabName', function () {
        if($scope.tabName=="基本信息"){
            tempSelect.updateImg('template_big_'+$rootScope.templateId+'.png');
        }else if($scope.tabName=="演讲设置"){
            tempSelect.updateImg('sim_topic_'+$rootScope.templateId+'.png');
        }else if($scope.tabName=="结果"){
            tempSelect.updateImg('template_big_'+$rootScope.templateId+'.png');
        }else{

        }

    });
    $scope.$watch('templateId', function(){
        if($scope.tabName==""||$scope.tabName=="基本信息"){
            // console.log(this + "again")
            tempSelect.updateImg('template_big_'+$rootScope.templateId+'.png');
        }else{

        }
    });
    $scope.$on('updateImg', function () {
       // 监听地址变化并获取相应数据
       console.log(tempSelect)
        var newValue = tempSelect.thisImg;
        console.log(newValue)
        if(typeof(newValue)=="string"){
            $rootScope.simImg = newValue;
        }else if(typeof(newValue) == 'number'){
            console.log(typeof(newValue))
            $rootScope.simImg = 'template_big_'+$rootScope.templateId+'.png';
        }
    });

/*    $scope.$watch('tabName', function(newValue, oldValue) {
        console.log(newValue+ '===' +oldValue);


    });

    $scope.test = function(str){
        console.log($rootScope.simImg)
    }*/
    /*$scope.simTab = function(str){
        console.log(str);
        console.log($scope.currentTab);
        if($scope.currentTab!=undefined&&str=='基本信息'){
            return true;
        }else if(str==$scope.currentTab){
            console.log(str)
            return true;
        }else{
            console.log(str)
            return false;
        }
    }*/

}]);

appControllers.controller('specificEdit',['$scope','$location','adminService', function($scope,$location,adminService){
    $scope.urlForA = $location.url();
    $scope.signOut = function(){
        adminService.signOut().success(function(data){
        window.location.href = '#/login';
        }).error(function(err){
            console.log(err);
        });
    };
}]);
appControllers.controller('newStepOne',['$scope','$rootScope','adminService','$location','tempSelect',function($scope,$rootScope,adminService,$location,tempSelect){

    var addr = window.location.href.toString();
    if(addr.indexOf("?eventId")>=0){
        var id = addr.substring(addr.indexOf("?eventId="), addr.length);
        $rootScope.processMsg = '正在获取数据，请稍候······';
        adminService.getEventById(id).success(function(data){
            notAdmin(data);
            $rootScope.processMsg = null;
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
            $rootScope.EventID = $rootScope.thisEvent.id;
            if($rootScope.topics.length>0){
                $rootScope.isHide = true;
            }
            console.log($rootScope.thisEvent);

            if(!document.getElementById('qrcode').hasChildNodes()){
                mkQrcode($scope.basic.eventId);
                $rootScope.eventUrl = eventUrl;
            }
            $('#stepTab a[href="#topics"]').attr('data-toggle','tab');
            $('#stepTab a[href="#result"]').attr('data-toggle','tab');
            $rootScope.eventDate = $scope.basic.date;
        }).error(function(err){
            $rootScope.processMsg = null;
            $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
        });
    }else{
            $rootScope.thisEvent = null;
            $rootScope.topics = null;
            $rootScope.EventID = null;
    }


    $scope.basic = {template:'1',shakeFlag: true};
    $rootScope.templateId = '1';
    // $rootScope.simImg = 'template_big_'+$rootScope.templateId+'.png';
    console.log($scope.basic)
    $scope.showTemplate = function(data){
        if($scope.basic.template == data){
            $rootScope.templateId = data;
            // $rootScope.simImg = 'template_big_'+$rootScope.templateId+'.png';
            // tempSelect.updateImg(data);
            return true;
            // $scope.bigTemplate = "image/template_big_"+data+".png"

        }else{
            return false;
        }
    },
	$scope.getAll = function(){
        if(!$scope.basic.college){
            $rootScope.errorMsg = '请填写学校';
            return;
        }
        if(!$scope.basic.type){
            $rootScope.errorMsg = '请填写类型';
            return;
        }
        if(!$scope.basic.date){
            $rootScope.errorMsg = '请选择日期';
            return;
        }
        if(!$scope.basic.starttime){
            $rootScope.errorMsg = '请选择开始时间';
            return;
        }
        if(!$scope.basic.endtime){
            $rootScope.errorMsg = '请选择结束时间';
            return;
        }
        if(!$scope.basic.address){
            $rootScope.errorMsg = '请填写地点';
            return;
        }
        if(!$scope.basic.describe){
            $rootScope.errorMsg = '请填写描述';
            return;
        }
        if(!$scope.basic.template){
            $rootScope.errorMsg = '请选择模板';
            return;
        }
        console.log($rootScope.EventID)
        if($rootScope.EventID){
            $scope.basic.eventId = $rootScope.EventID;
        }
        var a = $scope.basic;
        if($scope.isDisabled==undefined||$scope.isDisabled==false){
            $scope.isDisabled = true;
            $rootScope.processMsg = '正在保存数据，请稍候······';
            adminService.newStepOne(encodeURIComponent(JSON.stringify(a))).success(function(data){
                a = null;
                $scope.isDisabled = false;
                notAdmin(data);
                $rootScope.processMsg = null;
                console.log(data);
                $('#stepTab a[href="#topics"]').attr('data-toggle','tab');
                $('#stepTab a[href="#topics"]').tab('show');
                $rootScope.EventID = data.EventID;
                if(!$rootScope.eventDate){
                    $rootScope.eventDate = a.date;
                }

                if(!document.getElementById('qrcode').hasChildNodes()){
                    mkQrcode(data.EventID);
                }

            }).error(function(err){
                $scope.isDisabled = false;
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log(encodeURIComponent(JSON.stringify(a)));
            });
        }

        console.log($rootScope);
        if(!$rootScope){
            $rootScope.isHide = false;
        }else if(!$rootScope.thisEvent){
            console.log($rootScope.thisEvent)
            $rootScope.isHide = false;
        }else if(!$rootScope.thisEvent.speakers){
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
		// todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
    $('[data-link-field="dtp_input1"]').datetimepicker().on('change', function(ev){
        $rootScope.eventDate = $scope.basic.date;
    });
    $('.form_date').datetimepicker().on('show', function(ev){
        $('.form_date').datetimepicker('update');
    });
    $('.form_time').datetimepicker().on('show', function(ev){
        $('.form_time').datetimepicker('update');
        if(!$scope.basic||!$scope.basic.endtime){
            $('[data-link-field="dtp_input2"]').datetimepicker('setEndDate',  $rootScope.eventDate+' 23:59');
        }else{
            $('[data-link-field="dtp_input2"]').datetimepicker('setEndDate',  $rootScope.eventDate+' '+$scope.basic.endtime);
        }

        $('[data-link-field="dtp_input2"]').datetimepicker('setStartDate',  $rootScope.eventDate);
        if(!$scope.basic||!$scope.basic.starttime){
            $('[data-link-field="dtp_input3"]').datetimepicker('setStartDate', $rootScope.eventDate+' 23:59');
        }else{
            $('[data-link-field="dtp_input3"]').datetimepicker('setStartDate', $rootScope.eventDate+' '+$scope.basic.starttime);
        }

        $('[data-link-field="dtp_input3"]').datetimepicker('setEndDate', $rootScope.eventDate+' 23:59');

    });
}]);

appControllers.controller('newStepTwo',['$scope','$rootScope', 'Upload', '$timeout', 'adminService',function($scope, $rootScope, Upload, $timeout,adminService){
    console.log($rootScope.thisEvent)
    // if($scope.topic){
   $('.form_time').datetimepicker().on('show', function(ev){
    console.log($rootScope.eventDate)
        if(!$scope.topic||!$scope.topic.endTime){
            $('[data-link-field="dtp_input4"]').datetimepicker('setEndDate',  $rootScope.eventDate+' 23:59');
        }else{
            $('[data-link-field="dtp_input4"]').datetimepicker('setEndDate',  $rootScope.eventDate+' '+$scope.topic.endTime);
        }

        $('[data-link-field="dtp_input4"]').datetimepicker('setStartDate',  $rootScope.eventDate);
        if(!$scope.topic||!$scope.topic.startTime){
            $('[data-link-field="dtp_input5"]').datetimepicker('setStartDate', $rootScope.eventDate+' 0:00');
        }else{
            $('[data-link-field="dtp_input5"]').datetimepicker('setStartDate', $rootScope.eventDate+' '+$scope.topic.startTime);
        }

        $('[data-link-field="dtp_input5"]').datetimepicker('setEndDate', $rootScope.eventDate+' 23:59');
    });
    $scope.displayExistImg = false;
    $scope.displayExistFile = false;
	$scope.uploadImages = function(file, errFiles){
        $scope.displayExistImg = false;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if(!$scope.topic){
            $scope.topic={};
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
                url: currentHost + ':' +currentPort+'/campus/FileUpload',
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
        $scope.displayExistFile = false;
        $scope.files = files;
        $scope.errFiles = errFiles;
        if(!$scope.topic){
            $scope.topic={};
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

                url: currentHost + ':' +currentPort+'/campus/FileUpload',
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
        $rootScope.processMsg = '正在保存数据，请稍候······';
        var a = {id:$rootScope.EventID,eventUrl:encodeURIComponent($rootScope.eventUrl.toString()),qrcode:''};
    	adminService.saveEventUrl(encodeURIComponent(JSON.stringify(a))).success(function(data){
                notAdmin(data);
                $rootScope.processMsg = null;
                console.log(data);
                $('#stepTab a[href="#result"]').attr('data-toggle','tab');
                $('#stepTab a[href="#result"]').tab('show');
            }).error(function(err){
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log(encodeURIComponent(JSON.stringify(a)));
            });

    };

    $scope.save = function(){
        $scope.saveDisabled = true;
        if(!$scope.topic){
            $rootScope.errorMsg = '请填写演讲详细信息';
            return;
        }
        $scope.topic.eventId = $rootScope.EventID;
        if(!$scope.isHide){
            if(!$scope.topic.topicName){
                $rootScope.errorMsg = '请填写演讲主题';
                return;
            }
            if(!$scope.topic.topicDesc){
                $rootScope.errorMsg = '请填写演讲描述';
                return;
            }
            if(!$scope.topic.speakerName){
                $rootScope.errorMsg = '请填写主讲姓名';
                return;
            }
            if(!$scope.topic.speakerDesc){
                $rootScope.errorMsg = '请填写主讲信息';
                return;
            }
            if(!$scope.topic.startTime){
                $rootScope.errorMsg = '请选择开始时间';
                return;
            }
            if(!$scope.topic.endTime){
                $rootScope.errorMsg = '请选择结束时间';
                return;
            }
        }
        if($scope.topic.speakerImg==null){
            $scope.topic.speakerImg='';
        }
        if($scope.topic.speakerFile==null){
            $scope.topic.speakerFile='';
        }
        $rootScope.processMsg = '正在保存数据，请稍候······';
        adminService.saveTopic(encodeURIComponent(JSON.stringify($scope.topic))).success(function(data){
            $scope.saveDisabled = false;
            notAdmin(data);
            $rootScope.processMsg = null;
            if(data.Message =='Error'){
                $rootScope.errorMsg = '保存失败，请刷新页面重新尝试。'
                return;
            }
            var flag = true;
            for(i in $rootScope.topics){
                if($rootScope.topics[i].id == data.TopicID){
                    flag=false;
                    $rootScope.topics[i].topicName = $scope.topic.topicName;
                    $rootScope.topics[i].topicDesc = $scope.topic.topicDesc;
                    $rootScope.topics[i].speakerName = $scope.topic.speakerName;
                    $rootScope.topics[i].speakerDesc = $scope.topic.speakerDesc;
                    $rootScope.topics[i].startTime = $scope.topic.startTime;
                    $rootScope.topics[i].endTime = $scope.topic.endTime;
                }
            }
            if($scope.topic.speakerImg && $scope.topic.speakerImg.indexOf(currentHost + ':'+eventPort+'/CampusFileUpload/')<0){
                // $scope.topic.speakerImg = 'http://9.115.24.168/CampusFileUpload/'+ $scope.topic.speakerImg;
                if(!($scope.topic.speakerImg==null)){
                    $scope.topic.speakerImg = currentHost + ':'+eventPort+'/CampusFileUpload/'+ $scope.topic.speakerImg;
                }
            }
            if($scope.topic.speakerFile && $scope.topic.speakerFile.indexOf(currentHost + '/CampusFileUpload/')<0){
                // $scope.topic.speakerFile = 'http://9.115.24.168/CampusFileUpload/'+ $scope.topic.speakerFile;
                if(!($scope.topic.speakerFile==null)){
                    $scope.topic.speakerFile = currentHost + ':'+eventPort+'/CampusFileUpload/'+ $scope.topic.speakerFile;
                }
            }
            console.log(flag)
            if(flag){
                $scope.topic.id=data.TopicID;
                if(!$rootScope.topics){
                    $rootScope.topics = [];
                }
                $rootScope.topics.push($scope.topic);
            }
            $scope.topic = null;
            console.log($rootScope.topics)
            $scope.isHide = true;
            console.log(data)
        }).error(function(err){
            $rootScope.processMsg = null;
            $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
            console.log(err);
        });


    }
    $scope.addItem = function(){
        $scope.files = null;
        $scope.f= null;
        $scope.displayExistImg = false;
        $scope.displayExistFile = false;
        $scope.isHide = false;
    }
    $scope.editTopic = function(data){
        console.log(data.topicName);
        $scope.f=null;
        $scope.files=null;
        $scope.topic = data;
        if($scope.topic.speakerImg!=''&&$scope.topic.speakerImg){
            console.log($scope.topic.speakerImg)
            $scope.displayExistImg = true;
        }else{
            $scope.displayExistImg = false;
        }
        if($scope.topic.speakerFile!=''&&$scope.topic.speakerFile){
            console.log($scope.topic.speakerFile)
            $scope.displayExistFile = true;
        }else{
            $scope.displayExistFile = false;
        }
        $scope.isHide = false;
    }
    $scope.dropTopic = function(data){
        var thisId = data.id;
        console.log(data);
        if(confirm("确定删除这条记录？")){
           adminService.dropTopic(thisId).success(function(data){
                notAdmin(data);
                for(i in $rootScope.topics){
                    if($rootScope.topics[i].id==thisId){
                        $rootScope.topics.remove(i);
                    }
                }
            }).error(function(err){
                console.log(err);
            });
        }

    }
}]);
appControllers.controller('finalStep',['$scope','$rootScope','$timeout','FileSaver','Blob', function($scope, $rootScope,$timeout,FileSaver,Blob){



    $scope.downloadQR = function(){
        // DownLoadReportIMG(document.getElementById('qrcode').children[1].src)
        var canvas = document.getElementById('qrcode').children[0];
        // draw to canvas...
        canvas.toBlob(function(blob) {
            FileSaver.saveAs(blob, "event-"+$rootScope.EventID+".png");
        });
    };
    $scope.copyDone = function(){
        $scope.doneMessage = '复制成功';
        $timeout(function(){
            $scope.doneMessage = '';
        }, 1000);
    }

}]);
