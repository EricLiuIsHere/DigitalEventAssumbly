Array.prototype.uniqueJson = function(){
   var res = [];
   var json = {};
   var arr = this;
   var count = 0;
   for(i in arr){
        if(arr[i].topicId!=null){
            for(x in res){
                if(res[x].topicId != null && res[x].topicId == arr[i].topicId){
                    count++;
                }
            }
            if(count<=0){
                res.push(arr[i]);
                count = 0;
            }else{
                count = 0;
            }
        }
   }
   return res;
}

appControllers.controller('refreshAll',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    
    $scope.refreshAll = function(){
        $rootScope.processMsg = '正在获取数据，请稍候······';
        var addr = window.location.href.toString();
    var id = addr.substring(addr.indexOf("?eventId="), addr.length);
    
        adminService.getEventDetails(id).success(function(data){
            notAdmin(data);
            
            $rootScope.descInfo = data.descInfo;
            $rootScope.processMsg = '成功';
            $timeout(function(){
                $rootScope.processMsg = null;
            }, 2000);
        }).error(function(err){
            $rootScope.processMsg = null;
            $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
            console.log('error');
        });
    }
}]);
appControllers.controller('commentsDetails',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    console.log('id');
    var addr = window.location.href.toString();
    var id = addr.substring(addr.indexOf("?eventId="), addr.length);
    
    $rootScope.processMsg = '正在获取数据，请稍候······';
        adminService.getEventDetails(id).success(function(data){
            notAdmin(data);
            $rootScope.processMsg = null;
            $rootScope.descInfo = data.descInfo;
            $scope.displayList = [];
            $scope.selectedList = [];
        }).error(function(err){
            $rootScope.processMsg = null;
            $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
            console.log('error');
        });
    $scope.$watch('descInfo',function(){
        $scope.selector = '选择主讲';
        $scope.change('选择主讲');
        $scope.topicArray = [];
            console.log($rootScope.descInfo.comments);
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].topicId!=null){
                    $scope.topicArray.push({topicId:$rootScope.descInfo.comments[i].topicId,speakerName:$rootScope.descInfo.comments[i].speakerName});
                    // console.log($rootScope.descInfo.comments[i].topicId)
                    if($rootScope.descInfo.comments[i].choosen=='1'){
                        $scope.selectedList.push({"cid":$rootScope.descInfo.comments[i].cid});
                    }else{
                        for(x in $scope.selectedList){
                            if($scope.selectedList[x] && $scope.selectedList[x].cid!=null &&  $rootScope.descInfo.comments[i].cid!=null &&  $scope.selectedList[x].cid == $rootScope.descInfo.comments[i].cid){
                                $scope.selectedList.remove(x);
                            }
                        }

                    }

                    if($rootScope.descInfo.comments[i].choosen!=null && $rootScope.descInfo.comments[i].choosen == '1'){
                        $scope.displayList.push($rootScope.descInfo.comments[i]);
                    }
                }
                
            }
            console.log($scope.topicArray)
            $scope.topicArray = $scope.topicArray.uniqueJson();
            console.log($scope.topicArray)
    })

    $scope.getCommentsById = function(id){
        console.log(id)
        
        console.log($scope.thisComments)
    }
    $scope.selector = '选择主讲';
    $scope.change = function(x){
        console.log(x);
        $scope.thisComments = [];
        if(x!='选择主讲'){
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].topicId!=null && $rootScope.descInfo.comments[i].topicId==x){
                    $scope.thisComments.push($rootScope.descInfo.comments[i]);
                    // console.log($rootScope.descInfo.comments[i].topicId)
                }
                
            }

        }else{
           $scope.thisComments = $rootScope.descInfo.comments; 
        }
    }
    // console.log($scope.selectAll)
    
    $scope.addToList = function(a, b){
        console.log($scope.selectedList)
        if(b){
            $scope.selectedList.push({"cid":a});
            for(i in $rootScope.descInfo.comments){
                for(m in $scope.displayList){
                    if($scope.displayList[m].cid != null && $scope.displayList[m].cid == a){
                        $scope.displayList[m].choosen = '1';
                        return;
                    }
                }
                if($rootScope.descInfo.comments[i].cid != null && $rootScope.descInfo.comments[i].cid == a){
                    $rootScope.descInfo.comments[i].choosen = '1';
                    $scope.displayList.push($rootScope.descInfo.comments[i]);
                }
            }
        }else{
            for(n in $scope.selectedList){
                console.log(n)
                if($scope.selectedList[n] && $scope.selectedList[n].cid!=null && $scope.selectedList[n].cid == a){
                    $scope.selectedList.remove(n);
                }
            }
            for(x in $scope.displayList){
                if($scope.displayList[x] && $scope.displayList[x].cid != null && $scope.displayList[x].cid == a){
                    $scope.displayList[x].choosen = '0';
                }
            }
            for(w in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[w] && $rootScope.descInfo.comments[w].cid != null && $rootScope.descInfo.comments[w].cid == a){
                    console.log($rootScope.descInfo.comments[w].cid == a)
                    $rootScope.descInfo.comments[w].choosen = '0';
                }
            }
        }
        console.log(a+    '      '   +b)
        console.log($scope.selectedList)
        console.log($scope.displayList)
    }
    $scope.removeComments = function(){
        console.log($scope.selectedList)
        if(confirm("确定删除这些留言？")){

            adminService.deleteComment(encodeURIComponent(JSON.stringify($scope.selectedList))).success(function(data){
                notAdmin(data);
                if(data.Message == 'Success'){
                  for(i in $scope.thisComments){
                        for(x in $scope.selectedList){
                           if($scope.thisComments[i].cid!=null && $scope.selectedList[x].cid!=null && $scope.thisComments[i].cid == $scope.selectedList[x].cid){
                                console.log($scope.thisComments[i])
                               $scope.thisComments.remove(i); 
                            } 
                        }
                    }

                    $scope.selectedList = [];
                }
                
            }).error(function(err){
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log('error');
            });
        }

    }

    $scope.removeComment = function(id){
        console.log(id);
        var tempA = [];
        if(confirm("确定删除此条留言？")){
            $rootScope.processMsg = '正在操作······';
            $timeout(function(){
                $rootScope.processMsg = null;
            }, 2000);
            tempA.push({"cid":id});
            console.log(tempA);
            adminService.deleteComment(encodeURIComponent(JSON.stringify(tempA))).success(function(data){
                notAdmin(data);
                if(data.Message == 'Success'){
                  for(i in $scope.thisComments){
                        if($scope.thisComments[i] && $scope.thisComments[i].cid!=null && $scope.thisComments[i].cid == id){
                           console.log($scope.thisComments[i])
                           $scope.thisComments.remove(i); 
                        }
                    }
                    for(i in $rootScope.descInfo.comments){
                        if($rootScope.descInfo.comments[i].cid == id){
                            $rootScope.descInfo.comments.remove(i);
                        }
                    }
                }
                $rootScope.processMsg = '删除成功';
                $timeout(function(){
                    $rootScope.processMsg = null;
                }, 2000);
            }).error(function(err){
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log('error');
            });
        }
    }
    $scope.saveQuestion = function(){
        $rootScope.processMsg = '正在保存，请稍候······';
        $scope.refinedDisplayList = [];
        for(var i=0;i<$scope.displayList.length;i++){
           $scope.refinedDisplayList.push({"choosen":$scope.displayList[i].choosen,"cid":$scope.displayList[i].cid});
        }
        adminService.saveQuestion(encodeURIComponent(JSON.stringify($scope.refinedDisplayList))).success(function(data){
                notAdmin(data);
                $rootScope.processMsg = null;
                console.log(data);
                if(data.Message == 'Success'){
                    $rootScope.processMsg = '成功投到大屏';
                    $timeout(function(){
                        $rootScope.processMsg = null;
                    }, 2000); 
                }else{
                    $rootScope.errorMsg = "投到大屏幕失败，请稍后重试";
                }
            }).error(function(err){
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log('error');
            });
    }
}]);

appControllers.controller('adminCommentsController',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    $scope.$watch('descInfo.adminComments',function(){
        $scope.adminComments = null;
        if($rootScope.descInfo.adminComments){
            console.log($rootScope.descInfo.adminComments)
            var checkbox=false,comment,From;
            for(var i=0;i< $rootScope.descInfo.adminComments.length;i++){
                if($rootScope.descInfo.adminComments[i].choosen == 1){
                    checkbox = true;
                }else{
                    checkbox = false;
                }
                if($rootScope.descInfo.adminComments[i].comments&&$rootScope.descInfo.adminComments[i].comments!=''){
                    comment = $rootScope.descInfo.adminComments[i].comments;
                }else{
                    comment = '';
                }
                if($rootScope.descInfo.adminComments[i].userName&&$rootScope.descInfo.adminComments[i].userName!=''){
                    From = $rootScope.descInfo.adminComments[i].userName;
                }else{
                    From = '';
                }
                console.log($scope.adminComments)
                if(!$scope.adminComments){
                    $scope.adminComments = []
                    $scope.adminComments[0] = {comment: comment, from: From, checkbox: checkbox};
                }else{
                    $scope.adminComments[i] = {comment: comment, from: From, checkbox: checkbox};
                }
                // $scope.adminComments.push({comment: comment, from: From, checkbox: checkbox});
                console.log($scope.adminComments)
            }
        }
    })

    // console.log()
    $scope.saveAdminComments = function(){
        
        $scope.sumComments = [];
        $scope.thisChecked = '0';
        for(i in $scope.adminComments){
            console.log($scope.adminComments[i])
            if(!(i == 'remove' || i  == 'uniqueJson')){
                if($scope.adminComments[i].comment){
                }else{
                    $scope.adminComments[i].comment = '';
                }
                if($scope.adminComments[i].from){
                }else{
                    $scope.adminComments[i].from = '';
                }
                if($scope.adminComments[i].checkbox){
                    $scope.thisChecked = '1';
                }else{
                    $scope.thisChecked = '0';
                }
                $scope.sumComments.push({"comments":$scope.adminComments[i].comment,"from":$scope.adminComments[i].from,"checked":$scope.thisChecked})
            }
            
        }
        console.log($scope.sumComments)
        var addr = window.location.href.toString();
        var id = addr.substring(addr.indexOf("?eventId="), addr.length);
        $rootScope.processMsg = '正在保存管理员留言，请稍候······';
        adminService.saveAdminComments(id,encodeURIComponent(JSON.stringify($scope.sumComments))).success(function(data){
            notAdmin(data);
            $rootScope.processMsg = null;
            $rootScope.processMsg = '成功投到大屏';
            $timeout(function(){
                $rootScope.processMsg = null;
            }, 2000); 
        }).error(function(err){
            $rootScope.processMsg = null;
            $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
            console.log('error');
        });
        
    }
    $scope.resetAdminComments = function(){
        $scope.adminComments = null;
    }
    
}]);
appControllers.controller('otherInfo',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    $scope.eIP = eventIP;
    $scope.ePort = eventPort;
    var addr = window.location.href.toString();
    $scope.cIP = currentHost;
    $scope.cPort = currentPort;
    $scope.eID = addr.substring((addr.indexOf("?eventId=")+1), addr.length);
}]);