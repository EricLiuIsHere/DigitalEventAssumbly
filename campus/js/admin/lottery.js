var host;
var startTime = 0;

if(window.location.hostname == '170.225.225.31' || window.location.hostname == 'dss.cn.edst.ibm.com'){
    host = 'http://170.225.225.31:9080';
} else {
    host = 'http://9.115.24.168:9080';
} 

// $.ajax({
//   url: host + "/campus/StartShake?shakeSwitch=N",
//   dataType: "jsonp",
//   jsonp:"callback",
// });

$("#start").on("click",function() {
  $.ajax({
    type:"GET",
    url: host + "/campus/StartShake?shakeSwitch=Y&" + location.hash.split('#')[1],
    dataType: "jsonp",
    jsonp:"callback",
  })
  .done(function(json) { 
      $(".control img").hide();
      //$("#countdown").show();
      $("body").addClass("ani");
	  $("#end").show();
      //countDown();
  })
  .fail(function(error) {
      $(".control img").hide();
      $("#start").show();      
  })
  .always(function() {    
     startTime < 1 ? startTime = new Date().getTime() : "" ;
  });
});


$("#end").on("click",function() {
  //if (startTime > 0 && new Date().getTime() - startTime > 5000) {
    $.ajax({
      url: host + "/campus/StartShake?shakeSwitch=N&" + location.hash.split('#')[1],
      dataType: "jsonp",
      jsonp:"callback",
    })
    .done(function(data) { 
        
        $("#result").show();
        $("#countdown").hide();
        $(".control img").hide();
        
        setTimeout(function(){
          if (typeof(data.Result) != "undefined") {
            $("#show-box").html( data.Result.userName + "<br/>" + data.Result.cellphone); 
          } else {
            $("#show-box").html( data.Message);
          }
        }, 100);            
    })
    .fail(function(error) {
        $("#countdown").hide();
        $(".control img").hide();
        $("#end").show();
    })
    .always(function() {
        $("#waiting").show();
    });
  //}
    
}); 


function countDown() {
    var e = $("#countdown");
    var i = parseInt(e.text());    
    if(i > 0) {       
        e.text(i-1);
        e.show();
        e.attr("class", "zoomIn")
         .delay(1000)
         .animate(
            {  
            display: "none"       
            }, 
            { duration: 0,
              //easing: 'linear', 
              done: function() {
                e.removeClass("zoomIn");
                countDown();
              }   
            }
        );
    } else {
      $(".control img").hide();
      $("#end").show();
    }
}
