appControllers.controller('luckyCtl', ['$rootScope', '$scope', '$timeout', '$cookies', 'HRService', function($rootScope, $scope, $timeout, $cookies, HRService){
    var dd = new Date();
    var preLoadData = HRService.preLoad.getPreDate();
    $scope.eventDate = preLoadData.initInfo.date ? (Number(preLoadData.initInfo.date.split('-')[1]) + '月' + Number(preLoadData.initInfo.date.split('-')[2]) + '日') : dd.getFullYear();
    switch($rootScope.theme)
    {
    case '1':
        $scope.shakeImg = './images/dark_shake_bg.png';
        break;
    case '2':
        $scope.shakeImg = './images/blue_shake_m.png';
        break;
    case '3':
        $scope.shakeImg = './images/green_shake_bg.png';
        break;
    default:
        $scope.shakeImg = './images/dark_shake_bg.png';
    }

    $(".button-container").on("click", "#continue", function(){
        reShake();
    });

    var posted = false;
    var shakeStart = -1;
    var shakeEnd = -1;
    var shakePostStart = -1;
    var soundStart = -1;
    var shakePeriod = 1000;    
    var noShakeThreshold = 500;  //连续n毫秒没有摇动，视为手机停止摇动
    var myShakeEvent = false;
    var ifShakingInterval = false;

    

    normalStart();

    function normalStart() {
        //create a new instance of shake.js.
        myShakeEvent = new Shake({
            threshold: 15,
            timeout: 1000 // 事件发生频率，是可选值
        });

        // start listening to device motion
        myShakeEvent.start();

        // register a shake event
        //window.addEventListener('shake', shakeEventDidOccur, false);     
        shakeEventDidOccur();          
    }   

    
    //shake event callback
    function shakeEventDidOccur() {
        shakeStart < 0 ? shakeStart = new Date().getTime() : '';
        shakeEnd < 0 ? shakeEnd = new Date().getTime() : '';
        playSound();
        playAnimation();        
        var tel = HRService.Auth.getUser().tel;
	 var uid = HRService.Auth.getUser().uid;
        var condition1 = !posted; //是否已提交
        var condition2 = shakePostStart < 0; //是否正在提交
        if (condition2) {
            shakePostStart = new Date().getTime();

            var host;            
            if(window.location.hostname == '170.225.225.31' || window.location.hostname == 'dss.cn.edst.ibm.com'){
                host = 'http://170.225.225.31:9080/campus/Shaking';
            } else {
                host = 'http://9.115.24.168:9080/campus/Shaking';
            } 

            $.ajax({
                url: host, 
                type: "get",
                data: {pnum: tel, uid: uid},
                dataType: "jsonp",
                timeout: 1000,
            })
            .done(function(response) { //{status: 1} //status=0, 出错; status=1, 成功; status=2, 后动未开始
                console.log(response.status);
                var i = isNaN(response.status) ? -1 : parseInt(response.status);   
                if (i == 0) { 
                    showMessage("error");
                } else if (i == 1) {
                    posted = true;
                    showMessage("succeed");
                } else if (i == 2) {
                    shakePostStart = -1;
                    showMessage("unavailable");
                } else {
                    shakePostStart = -1;
                    showMessage("failed");
                }          
            })
            .fail(function() {
                shakePostStart = -1;
                showMessage("failed");
            })
            .always(function() {
                shakeEnd = new Date().getTime();                
            });
        }

    }

    
    function ifShaking() {
        if (shakeEnd > 0 && new Date().getTime() - shakeEnd > noShakeThreshold) {
            stopSound();
            stopAnimation();
        }
    }

    function playSound() {
        var sound = document.getElementById("sound");
        sound.paused ? sound.play() : '';
        soundStart = new Date().getTime();
    }

    function stopSound() {
        var sound = document.getElementById("sound");
        sound.paused ? '': sound.pause();
        shakeEnd = -1;
    }

    function playAnimation() {
        var eleShake = $("#shakeAnimation");
        eleShake.hasClass('active') ? '': eleShake.addClass('active');
    }

    function stopAnimation() {
        var eleShake = $("#shakeAnimation");
        eleShake.hasClass('active') ? eleShake.removeClass('active') : '';
    }

    function showOverlay() {
        //$("#note").html(str);
        $(".overlay").fadeIn();        
    }

    function closeOverlay() {
        $(".overlay").hide();
        $("#face").removeClass("unhappy");
        $("#note").empty();

        shakeStart = -1;
        shakeEnd = -1;
        shakePostStart = -1;
        normalStart();
    }

    function stopAll() {
        myShakeEvent ? myShakeEvent.stop() : "";
       // window.removeEventListener('devicemotion', deviceMotionHandler);
        window.removeEventListener('shake', shakeEventDidOccur); 
        //stopSound();
        stopAnimation();
    }

    

    function showMessage(type) {
        var str = "", str2 = "";
        switch (type) {
            case "succeed":
                str = "已收到，谢谢参与，请关注大屏结果";
                str2= "OK，完成";
                $("#face").attr("class", "face");
                break;
            case "error":
                str = "同学们太热情了，您的号码正在排队中";
                str2= "正在提交";
                $("#face").attr("class", "face");
                break;
            case "unavailable":
                var i = parseInt(Math.random() * 10) % 3;

                if (i == 0) {
                    str = "同学，还没有开始哦";
                    str2= "再等等";                    
                } else if (i == 1) {
                    str = "也许你是个急性子~";
                    str2= "还有一小会儿";                        
                } else if (i == 2) {
                    str = "不要太心急了，耐心再等等";
                    str2= "还没开始哦";                    
                };

                $("#face").attr("class", "face unhappy"+(i+2));
                break;
            case "failed":
                str = "也许中的就是你";
                str2= "使劲儿摇吧";
                $("#face").attr("class", "face");
                break;
            default:
                break;
        }

        $("#face").html(str2);
        $("#note").html(str);

        var t = new Date().getTime();
        var n = t - shakeStart;

        console.log(shakeStart +"/"+ n +"/"+ shakePeriod+"/"+ shakeStart)

        if (shakeStart > 0 && n < shakePeriod) {
            setTimeout(function(){
                stopAll();                
                $(".overlay").is(":hidden") ? showOverlay() : "";
            }, (shakePeriod-n));
        } else {
            stopAll();
            $(".overlay").is(":hidden") ? showOverlay() : "";
        } 
    }


    function reShake() {
        closeOverlay();        
    }


    /////////////////////////////////

    $scope.closeOverlay = function () {
        closeOverlay();
    }

}]);