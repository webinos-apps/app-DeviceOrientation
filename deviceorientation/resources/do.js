//document.location.hash = "#selectDevices";
//$.mobile.changePage("#selectDevices");

$(document).ready(function() {
    //$("#pzhName").html(result.pzhName);
	
	var launcherAPIS = [];
	var devOrientationToUse;
	//var buttonklassname = "buttonlist";
	var buttonklassname = "devicestobind";
	var buttonthema = "b";
	var infoclass = "infoclass";
	var linuxclass = "linuxclass";
	var infodevice = "infodevice";
	var find_a_mobil = "no";
	var bind_a_device = "no";
	//int i = 0;
	
	$('#find').bind('click', function() {
	   //alert("Value: " + $("#find").attr("name"));
		webinos.discovery.findServices(new ServiceType('http://webinos.org/api/deviceorientation'), 
				    {onFound: function (service) {
		   //alert("find a device:  " + service.serviceAddress);
		   launcherAPIS[btoa(service.serviceAddress)] = service;
		   { body: "Thanks, webinos" }
		   
		   var testString = service.serviceAddress;
		   if (testString.match('Mobil')) {
		       find_a_mobil = "yes";
		       console.log("Find a smartphone!! "+ find_a_mobil);
		       //$('.'+infoclass).remove();
		       //$('.'+linuxclass).remove();
		       //$('#messages').append("<a class="+infoclass +">Please click a mobilphone.</a><br>");
		       $('#buttonlist').append("<a class="+buttonklassname +"><button>"+service.serviceAddress + "</button></a>");		    
		       $('div[data-role=content]').trigger('create');
		   }
		    if (find_a_mobil === "no") {
		    console.log("There's no smartphone!! "+ find_a_mobil);
		    //$('#buttonlist').append("<a class="+infoclass +"><button> Ops, there's no smartphone! </button></a>");
		    //$('#buttonlist').append("<a class="+infoclass +"> Ops, there's no smartphone! </a><br>");
		    $('#buttonlist').append("<a class="+buttonklassname +"><button>"+service.serviceAddress + "</button></a>");
		    $('div[data-role=content]').trigger('create');
		    }
					    
		    //$('#buttonlist').append("<a class="+buttonklassname +"><button>"+service.serviceAddress + "</button></a>");		    
		    //$('div[data-role=content]').trigger('create');
		    //$('#buttonlist').append("<a class="+infoclass +"> Ops, there's no smartphone! </a>");		    
		    //$('div[data-role=content]').trigger('create');
		   
		}});

	});
         
       $('#clear').bind('click', function() {
	   //console.log(buttonklassname+ " list removed.");
	   //$('.'+buttonklassname).remove();  
	   //$('.'+infoclass).remove();
	   //refresh page
	   location.reload();
	   });
       
       $('.'+buttonklassname).live('click', function(elem,bla){	    
	    
	   devOrientationToUse = launcherAPIS[btoa(elem.target.textContent)];
	   devOrientationToUse.bindService({onBind:function(){
	       //$(this).buttonMarkup({ theme: "b" });
	       console.log("bind with "+ elem.target.textContent);
	       //alert("bind with:  " + elem.target.textContent);
	       bind_a_device = "yes";
	       
	       var id = $(this).attr('href');
	        var winH = $(window).height();
		var winW = $(window).width();
	       $('.Popup').css('top',  winH/2-$(id).height()/2);
	       $('.Popup').css('left', 50);
	       //$('.Popup').css('mittel');
	       $('.Popup').fadeIn("slow");
	       $('#overlay').fadeIn("slow");

	       
	       	$('.closePopup').live("click", function() {
		    $(".Popup").fadeOut("slow");
		    $("#overlay").fadeOut("slow");
		    return false;
		});
	       //$('#messages').append('<li> DeviceOrientation API ' + devOrientationToUse.api + ' bound.</li>');
	    }});
	   
       });
       
       var testHandler = function(event){
	console.log("find_a_mobil: "+ find_a_mobil);
       };
       
       var eventHandler = function(event) {
    	    // process event.alpha, event.beta and event.gamma
	    //$('#lastevent').html('<li> Latest Orientation Event: alpha ' + event.alpha  + ' beta ' + event.beta + ' gamma ' + event.gamma + '</li>');
			
            // gamma is the left-to-right tilt in degrees, where right is positive
	    var tiltLR = event.gamma;
            // beta is the front-to-back tilt in degrees, where front is positive
	    var tiltFB = event.beta;
            // alpha is the compass direction the device is facing in degrees
	    var dir = event.alpha;

	   // Apply the transform to the image	 
	       
	   document.getElementById("pic").style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
       
	   document.getElementById("pic").style.MozTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
	     
	   document.getElementById("pic").style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
			   
	   };
	          
	$('#run').bind('click', function() {
           if (bind_a_device === "yes") {
	    devOrientationToUse.addEventListener("deviceorientation", eventHandler, true);
	   }else{
	        alert("please bind a smartohone first!");
	   }	   
	   });
	//});
	
       $('#stop').bind('click', function() {
	
	   //bind_a_device = "no";
	   devOrientationToUse.removeEventListener("deviceorientation", eventHandler, true);
	   	    
       });
       
       $('#settings').bind('click', function() {
	// Set the pzp name
	var options = {"type": 'prop', "payload":{"status": "getFriendlyName"}};
        //webinos.session.message_send(options, webinos.session.getSessionId());
	webinos.session.message_send(options, webinos.session.getPZPId());
	webinos.session.addListener('friendlyName', function(msg){
                $("#deviceName").val(msg.payload.message);
                });
		
	//$("#cmdSaveSettings").click(function(){
	//    var newName = $("#deviceName").val().trim();
	//    if (newName.length>0){
	//	// Save
	//	var options = {"type": 'prop', "payload":{"status": "setFriendlyName", value: newName}};
	//	webinos.session.message_send(options, webinos.session.getPZPId());
	//	// and reload the widget after 500ms to refresh the session
	//	setTimeout("document.location.reload(true);", 500);
	//    }else{
	//	$("#errorMessage").html("Device name can not be empty!");
	//	$("#showSettingsError").click();
	//    }
	//});
       });
 });

//$(document).bind('pageshow', function(e){
//    if (e.target.id=="Settings") {
//	                // Set the pzp name
//                var options = {"type": 'prop', "payload":{"status": "getFriendlyName"}};
//                webinos.session.message_send(options, webinos.session.getPZPId());
//	//Hookup event
//	$("#cmdSaveSettings").click(function(){
//	    var newName = $("#deviceName").val().trim();
//	    if (newName.length>0){
//		// Save
//		var options = {"type": 'prop', "payload":{"status": "setFriendlyName", value: newName}};
//		webinos.session.message_send(options, webinos.session.getPZPId());
//		// and reload the widget after 500ms to refresh the session
//		setTimeout("document.location.reload(true);", 500);
//	    }else{
//		$("#errorMessage").html("Device name can not be empty!");
//		$("#showSettingsError").click();
//	    }
//	});
//	//Friendly name response hookup
//	webinos.session.addListener('friendlyName', function(msg){
//	    $("#deviceName").val(msg.payload.message);
//	});	
//    }
//});
    