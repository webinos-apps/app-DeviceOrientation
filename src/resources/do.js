$(document).ready(function () {

    var deviceOrientationServiceType = 'http://webinos.org/api/deviceorientation';
	
    // List of services found using the service discovery
    var foundServices = [];
    // The service we are currently bound to
    var devOrientationToUse;

    $("#cmdEnroll").bind('click', function() {
        webinos.dashboard.open({ module: 'config' }, function () { console.log("enrollment opened"); });
    });

    $("#selectViaDashboard").bind('click', function() {
        webinos.dashboard.open({
            module: 'explorer',
            data: {
                service: deviceOrientationServiceType
            }
        }, function () {
            console.log("***Dashboard opened");
        }).onAction(function (data) {
            // If user selected anything
            if (data.result.length == 1) {
                var serviceFilters = data.result[0];
                webinos.discovery.findServices(new ServiceType(serviceFilters.api), {
                    onFound: function (service) {
                        if (service.id == serviceFilters.id) {
                            appendFoundServiceToList(service);
                        }
                    }
                }, {}, { zoneId: [serviceFilters.address] }); // Filter zone for the specific device
            }
        });
    });
    
    function appendFoundServiceToList(service) {
        foundServices[btoa(service.serviceAddress)] = service;
        $('#buttonlist').append("<a class='devicestobind'><button>" + service.serviceAddress + "</button></a>");
        $('div[data-role=content]').trigger('create');
    }
	
    $('#find').bind('click', function() {
        webinos.discovery.findServices(new ServiceType(deviceOrientationServiceType), {
				        onFound: function (service) {
				            appendFoundServiceToList(service);
				        }
        });
    });
         
    $('#clear').bind('click', function () {
        // Reload page to redo stuff
        location.reload();
    });
    
    function bindToDeviceOrientationService(theService) {
        theService.bindService({
            onBind: function () {
                $("#boundResult").html("bound with " + theService.serviceAddress);
                var winH = $(window).height();
                var winW = $(window).width();
                $('.Popup').css('top', winH / 2 - $('.Popup').height() / 2);
                $('.Popup').css('left', 50);
                $('.Popup').fadeIn("slow");
                $('#overlay').fadeIn("slow");
            }
        });
    };
    
    function deviceOrientationEventHandler(event) {
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

    function startListeningEvents(theService) {
        if (theService != null) {
            theService.addEventListener("deviceorientation", deviceOrientationEventHandler, true);
            theService.isListening = true;
        }
    }

    function stopListeningEvents(theService) {
        if (theService != null) {
            theService.removeEventListener("deviceorientation", deviceOrientationEventHandler, true);
            theService.isListening = false;
        }
    }

    $('.closePopup').live("click", function (e) {
        e.preventDefault();
        $(".Popup").fadeOut("slow");
        $("#overlay").fadeOut("slow");
    });
       
    // Handle clicks on the discovered services
    $('.devicestobind').live('click', function (elem) {
        devOrientationToUse = foundServices[btoa(elem.target.textContent)];
        bindToDeviceOrientationService(devOrientationToUse);
    });
       
    // 
    $('#run').bind('click', function() {
        if (devOrientationToUse != null) {
            if (!devOrientationToUse.isListening)
                startListeningEvents(devOrientationToUse);
            else
                alert("Service is already listening");
        }else{
            alert("Please bind to a service first!");
        }	   
    });
	
    $('#stop').bind('click', function() {
        stopListeningEvents(devOrientationToUse);
    });    
});
    