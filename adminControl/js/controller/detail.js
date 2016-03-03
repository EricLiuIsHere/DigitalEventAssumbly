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
            $rootScope.processMsg = null;
            $rootScope.descInfo = data.descInfo;
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
    $scope.displayList = [];
    $rootScope.processMsg = '正在获取数据，请稍候······';
        adminService.getEventDetails(id).success(function(data){
            notAdmin(data);
            $rootScope.processMsg = null;
            $rootScope.descInfo = data.descInfo;
            
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
                            if($scope.selectedList[x].cid!=null &&  $rootScope.descInfo.comments[i].cid!=null &&  $scope.selectedList[x].cid == $rootScope.descInfo.comments[i].cid){
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
    $scope.selectedList = [];
    $scope.addToList = function(a, b){
        if(b){
            $scope.selectedList.push({"cid":a});
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].cid != null && $rootScope.descInfo.comments[i].cid == a){
                    $rootScope.descInfo.comments[i].choosen = '1';
                    $scope.displayList.push($rootScope.descInfo.comments[i]);
                }
            }
        }else{
            for(i in $scope.selectedList){
                if($scope.selectedList[i].cid!=null && $scope.selectedList[i].cid == a){
                    $scope.selectedList.remove(i);
                }
            }
            for(x in $scope.displayList){
                if($scope.displayList[x].cid != null && $scope.displayList[x].cid == a){
                    $scope.displayList.remove(x)
                }
            }
            for(w in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[w].cid != null && $rootScope.descInfo.comments[w].cid == a){
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
            tempA.push({"cid":id});
            console.log(tempA);
            adminService.deleteComment(encodeURIComponent(JSON.stringify(tempA))).success(function(data){
                notAdmin(data);
                if(data.Message == 'Success'){
                  for(i in $scope.thisComments){
                        if($scope.thisComments[i].cid!=null && $scope.thisComments[i].cid == id){
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
                
            }).error(function(err){
                $rootScope.processMsg = null;
                $rootScope.errorMsg = '服务器链接异常，请稍后再试。'
                console.log('error');
            });
        }
    }
    $scope.saveQuestion = function(){
        $rootScope.processMsg = '正在保存，请稍候······';
        adminService.saveQuestion(encodeURIComponent(JSON.stringify($scope.displayList))).success(function(data){
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
    $scope.saveAdminComments = function(){
        console.log($scope.adminComments)
        $scope.sumComments = [];
        $scope.thisChecked = '0';
        for(i in $scope.adminComments){
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
    $scope.ePort = currentPort;
    var addr = window.location.href.toString();
    $scope.eID = addr.substring((addr.indexOf("?eventId=")+1), addr.length);
}]);