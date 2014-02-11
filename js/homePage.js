/** @license
 | Version 10.2
 | Copyright 2012 Esri
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | Citizen Service Request v10.2.0.1 / Demande de service municipal v10.2.0.1
 | This file was modified by Esri Canada - Copyright 2014 Esri Canada
 |
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
*/
dojo.require("dojo.window");
dojo.require("dojo.date.locale");
dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.tasks.locator");
dojo.require("esri.tasks.query");
dojo.require("esri.layers.FeatureLayer");
dojo.require("js.config");
dojo.require("js.date");
dojo.require("js.InfoWindow");

//CanMod: Load internationalization object
var intl;
require(["dojo/i18n!js/nls/text"],function(i18n) {intl = i18n;});

var map; //variable to store map object
var isiOS = false;
var isBrowser = false; //This variable is set to true when the app is running on desktop browsers
var isMobileDevice = false; //This variable is set to true when the app is running on mobile device
var isAndroidDevice = false; //This variable is set to true when the app is running on Android device
var operationalLayers; //variable to store operational layers
var isTablet = false; //This variable is set to true when the app is running on tablets
var baseMapLayers; //Variable for storing base map layers
var referenceOverlays;
var showNullValueAs; //variable to store the default value for replacing null values
var mapSharingOptions; //variable for storing the tiny service URL
var geometryService; //variable to store the Geometry service
var serviceRequestLayerId = "serviceRequestLayerID"; //variable to store service request layer id
var highlightPollLayerId = "highlightPollLayerId"; //Graphics layer object for displaying selected service request
var tempGraphicsLayerId = "tempGraphicsLayerID"; //variable to store temporary graphics request layer id
var enablePhotoUploadiOS; //variable for storing uploading images into iOS devices
var photoUploadText; //object to store Message displayed for HTML text
var serviceRequestSymbol; //variable to store service Request Symbol object
var infoWindowContent; //variable used to store the info window content
var infoWindowHeader; //variable used to store the info window header
var infoPopupHeight; //variable used for storing the info window height
var infoPopupWidth; //variable used for storing the info window width
var showCommentsTab; //variable used for toggling the comments tab
var allowAttachments; //variable used for toggling visibility of attachments control
var mapPoint; //variable to store map point
var formatDateAs; //variable to store date format
var selectedMapPoint; // variable to store selected map point
var serviceRequestCommentsLayerId = "serviceRequestCommentsLayerID"; //variable for comment layer
var infoWindowData; //Variable used for Info window collection
var infoWindowDataTitle; //Variable used to store the header text of the pop up


var locatorMarkupSymbol;
var windowURL = window.location.toString();
var selectedRequest;
var rippleColor;
var locatorRippleSize;
var requestType;
var requestId;
var commentId;
var featureID;
var status;
var startExtent;
var stagedSearch; //variable for store the time limit for search
var commentsInfoPopupFieldsCollection;
var requestLayerName;
var serviceRequestFields;
var databaseFields;

var locatorSettings; //variable used to store address search setting
var lastSearchTime; //variable for store the time of last search
var lastSearchString; //variable for store the last search string
var lastSearchResults; //variable to store the last search candidates
var timeouts = {}; //object to store timeout objects
var searchType; //object to store which search is selected
var disableFields; //object to store which fields will not be request from user
var focus = {mapTab: false, onMap: false, mapClick: false}; //Keep track of various focus related values

//This initialization function is called when the DOM elements are ready
function dojoInit() {
    esri.config.defaults.io.proxyUrl = "proxy.ashx"; //relative path
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000; // milliseconds

	//As of 2013, detects: Mobile: iOS/iPhone, Android Mobile, Blackberry Phone, Windows Phone, Symbian OS, Firefox OS, Opera Mini/Mobile
	//                     Tablet: iOS/iPad, Android Tablet, Blackberry Playbook, Windows RT (Microsoft Surface RT, Asus VivoTab RT, Dell XPS, Lumia Tablets...)
	//                     Browser: All others including Windows 7/8 tablets
    var userAgent = window.navigator.userAgent.toLowerCase(); //used to detect the type of devices
	if (userAgent.indexOf("ipad") >= 0) {
		isiOS = true;
        userAgent.replace(/OS ((\d+_?){2,3})\s/, function (match, key) {
            var version = key.split('_');
            if (version[0] < 6) {
                dojo.byId('trFileUpload').style.display = "none";
            }
        });
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
    } else if (userAgent.indexOf("iphone") >= 0) {
        isiOS = true;
        userAgent.replace(/OS ((\d+_?){2,3})\s/, function (match, key) {
            var version = key.split('_');
            if (version[0] < 6) {
                dojo.byId('trFileUpload').style.display = "none";
            }
        });
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    } else if (userAgent.indexOf("mobile") >= 0 || userAgent.indexOf("opera mini") >= 0 || userAgent.indexOf("opera mobi") >= 0 || userAgent.indexOf("symbian") >= 0) {
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
		isAndroidDevice = true;
    } else if (userAgent.indexOf("tablet") >= 0 || /*Android not mobile*/ userAgent.indexOf("android") >= 0 || (/*Windows RT*/ userAgent.indexOf("windows") >= 0 && userAgent.indexOf("arm") >= 0)) {
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
		isAndroidDevice = true;
    } else {
        isBrowser = true;
        dojo.byId('dynamicStyleSheet').href = "styles/browser.css";
    }

    if (!Modernizr.geolocation) {
        dojo.byId("imgGeolocate").style.display = "none";
    }
	if (!isMobileDevice) {
		dojo.byId("imgBaseMap").style.display = "inline";
	}
    var responseObject = new js.config();
	internationalization(responseObject);

	dojo.query("[for='searchAddress']")[0].innerHTML = responseObject.LocatorSettings.Locators[0].LabelText;
	dojo.query("[for='searchRequest']")[0].innerHTML = responseObject.LocatorSettings.Locators[1].LabelText;
	if (isMobileDevice || isTablet || dojo.isIE <= 7) {
		dojo.byId('imgSearch').style.display = "inline";
		dojo.replaceClass(dojo.byId("divAddressSearch"),"searchBlock","searchInline");
		dojo.byId("radioDiv").style.display = "block";
		dojo.byId("inputDiv").style.display = "block";
    } else {
		dojo.byId('divAddressSearch').style.display = "inline-block";
		searchChange(responseObject.LocatorSettings); //set placeholder text & searchType variable (FF does not reset forms on page refresh)
	}
	dojo.forEach(dojo.query("[name='searchType']"), function(item,i) {
		item.onclick = function() {searchChange(responseObject.LocatorSettings);}
	});

    mapSharingOptions = responseObject.MapSharingOptions;
    baseMapLayers = responseObject.BaseMapLayers;
    referenceOverlays = responseObject.ReferenceOverlays
    var infoWindow = new js.InfoWindow({
        domNode: dojo.create("div", null, dojo.byId("map"))
    });
    if (isMobileDevice) {
        dojo.byId('divCreateRequest').style.display = "none";
        dojo.byId('divInfoContainer').style.display = "none";
        dojo.replaceClass("divCreateRequest", "opacityShowAnimation", "opacityHideAnimation");
        dojo.removeClass(dojo.byId('divInfoContainer'), "opacityHideAnimation");
        dojo.byId('divSplashScreenContent').style.width = "95%";
        dojo.byId('divSplashScreenContent').style.height = "95%";
        dojo.byId('imgDirections').style.display = "none";
        dojo.byId("divHeaderTitle").style.display = "none";
    } else {
        dojo.byId("divSplashScreenContent").style.width = "350px";
        dojo.byId("divSplashScreenContent").style.height = "290px";
        dojo.byId('imgDirections').src = "images/details.png";
        dojo.byId('imgDirections').title = intl.viewRequest;
        dojo.byId('imgDirections').alt = intl.viewRequest;
        dojo.byId('imgDirections').style.display = "none";
    }
    dojo.byId('divSplashContent').innerHTML = responseObject.SplashScreenMessage;
    dojo.byId('divHeaderTitle').innerHTML = "<img alt='' src='" + responseObject.ApplicationIcon + "'>" + responseObject.ApplicationName;
    document.title = responseObject.ApplicationTitle;

    dojo.xhrGet({
        url: "ErrorMessages.xml",
        handleAs: "xml",
        preventCache: true,
        load: function (xmlResponse) {
            messages = xmlResponse;
        }
    });

    ShowProgressIndicator();


    operationalLayers = responseObject.OperationalLayers;
    serviceRequestCommentsLayerUrl = responseObject.ServiceRequestCommentsLayerURL;
    formatDateAs = responseObject.FormatDateAs;
    serviceRequestmobileLayer = responseObject.ServiceRequestmobileLayerURL;
    showNullValueAs = responseObject.ShowNullValueAs;
    infoPopupHeight = responseObject.InfoPopupHeight;
    infoPopupWidth = responseObject.InfoPopupWidth;
	if (isTablet) {infoPopupWidth += 20;}
    infoWindowData = responseObject.InfoWindowData;
	disableFields = responseObject.DisableFields

	if (disableFields.Name) {
		dojo.byId("nameRow").style.display = "none";
	}
	if (disableFields.Phone) {
		dojo.byId("phoneRow").style.display = "none";
	}
	if (disableFields.Email) {
		dojo.byId("emailRow").style.display = "none";
	}
	if (disableFields.Attach) {
		dojo.byId("trFileUpload").style.display = "none";
	}
    infoWindowContent = responseObject.InfoWindowContent;
    infoWindowHeader = responseObject.InfoWindowHeader;

	//CanMod: Language Button
	if (responseObject.LanguageButton.Enabled && !isMobileDevice) {
		var langB = document.getElementById("imgLang");
		langB.src = responseObject.LanguageButton.Image;
		langB.alt = responseObject.LanguageButton.Title;
		langB.title = responseObject.LanguageButton.Title;
		
		dojo.connect(langB, "onclick", function() {
			window.location.href = responseObject.LanguageButton.AppURL;
		});
		dojo.connect(langB, "onkeydown", function (evt) {
			var kc = evt.keyCode;
			if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
				window.location.href = responseObject.LanguageButton.AppURL;
			}
		});
		
		langB.style.display = "inline";
	}


    showCommentsTab = responseObject.ShowCommentsTab;
    allowAttachments = responseObject.AllowAttachments;
    geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);
    rippleColor = responseObject.RippleColor;
    locatorRippleSize = responseObject.LocatorRippleSize;
    locatorSettings = responseObject.LocatorSettings;
    requestLayerName = responseObject.RequestLayerName;
    requestId = operationalLayers.RequestId;
    commentId = operationalLayers.CommentId;
    status = responseObject.Status;
    commentsInfoPopupFieldsCollection = responseObject.CommentsInfoPopupFieldsCollection;
    serviceRequestFields = responseObject.ServiceRequestFields;
    databaseFields = responseObject.DatabaseFields;
    map = new esri.Map("map", {
        slider: true,
        infoWindow: infoWindow
    });
    dojo.connect(map, "onClick", function (evt) {
        map.infoWindow.hide();
        selectedMapPoint = null;
        ShowProgressIndicator();
        setTimeout(function () {
            dojo.byId("divInfoDetails").style.display = "none";
            AddServiceRequest(evt.mapPoint);
            HideProgressIndicator();
        }, 500);
    });
    dojo.connect(map, "onLoad", function () {
        var zoomExtent;
        var extent = GetQuerystring('extent');
        if (extent != "") {
            zoomExtent = extent.split(',');
        } else {
            zoomExtent = responseObject.DefaultExtent.split(",");
        }
        initializeMap();
        startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);
        map.setExtent(startExtent);
		keyboardAccess();
    });

    CreateBaseMapComponent();
    AddReferenceOverlays();
    if (!allowAttachments) {
        dojo.byId('trFileUpload').style.display = "none";
    }

    dojo.connect(dojo.byId('imgHelp'), "onclick", function () {
        window.open(responseObject.HelpURL);
    });
	dojo.connect(dojo.byId('imgHelp'), "onkeyup", function (evt) {
		var kc = evt.keyCode;
		if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
			window.open(responseObject.HelpURL);
		}
	});

    dojo.connect(map, "onExtentChange", function () {
        SetMapTipPosition();
        if (dojo.coords("divAppContainer").h > 0) {
            ShareLink();
        }
    });
    if (dojo.isIE <= 7) {
		dojo.byId("trFileUpload").style.display = "none";
    }
}


//Create graphics and feature layer
function initializeMap() {
    if (dojo.query('.logo-med', dojo.byId('map')).length > 0) {
        dojo.query('.logo-med', dojo.byId('map'))[0].id = "esriLogo";
    } else if (dojo.query('.logo-sm', dojo.byId('map')).length > 0) {
        dojo.query('.logo-sm', dojo.byId('map'))[0].id = "esriLogo";
    }

    dojo.addClass("esriLogo", "esriLogo");
    dojo.byId('divSplashScreenContainer').style.display = "table";
    SetSplashScreenHeight();
    if (isMobileDevice) {
        SetCommentHeight();
        SetViewDetailsHeight();
        SetCmtControlsHeight();
    }

    dojo.byId("esriLogo").style.bottom = "10px";
    CreateRatingWidget(dojo.byId('commentRating'));
    var glayer = new esri.layers.GraphicsLayer();
    glayer.id = tempGraphicsLayerId;
    map.addLayer(glayer);


    var gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = highlightPollLayerId;
    map.addLayer(gLayer);
    var serviceRequestLayer = new esri.layers.FeatureLayer(isBrowser ? operationalLayers.ServiceRequestLayerURL : operationalLayers.ServiceRequestMobileLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"],
        id: serviceRequestLayerId,
        displayOnPan: false
    });
    map.addLayer(serviceRequestLayer);
    var handle = dojo.connect(serviceRequestLayer, "onUpdateEnd", function (features) {
        serviceRequestSymbol = serviceRequestLayer.renderer.infos[0].symbol;
        var symbolSize = isBrowser ? 25 : 44;
        locatorMarkupSymbol = (locatorSettings.DefaultLocatorSymbol == "") ? serviceRequestLayer.renderer.infos[0].symbol : new esri.symbol.PictureMarkerSymbol(locatorSettings.DefaultLocatorSymbol, Number(symbolSize), Number(symbolSize));
        CreateRequestTypesList(serviceRequestLayer.fields);
		if (dojo.isIE <= 7) {setTimeout(function() {map.resize();},1000);}
        HideProgressIndicator();
        var url = esri.urlToObject(window.location.toString());
        if (url.query && url.query != null) {
            if (url.query.extent.split("$featureID=").length > 0) {
                featureID = url.query.extent.split("$featureID=")[1];
            }
        }
        if (featureID != "" && featureID != null && featureID != undefined) {
            ExecuteQueryTask();
        }
        dojo.disconnect(handle);
    });


    dojo.connect(serviceRequestLayer, "onClick", function (evt) {
        map.infoWindow.hide();
        map.getLayer(tempGraphicsLayerId).clear();
        map.getLayer(highlightPollLayerId).clear();
        // cancel event propagation
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        ShowProgressIndicator();
        setTimeout(function () {
            ShowServiceRequestDetails(evt.graphic.geometry, evt.graphic.attributes);
            HideProgressIndicator();
        }, 700);
    });

    // Add comment layer
    var serviceRequestCommentsLayer = new esri.layers.FeatureLayer(operationalLayers.ServiceRequestCommentsLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: ["*"],
        id: serviceRequestCommentsLayerId,
        displayOnPan: false
    });
    map.addLayer(serviceRequestCommentsLayer);

    window.onresize = function () {
        if (!isMobileDevice) {
            ResizeHandler();
        }
        else {
            orientationChange = true;
            if (map) {
                var timeout = (isMobileDevice && isiOS) ? 100 : 700;
                map.infoWindow.hide();
                setTimeout(function () {
                    if (isMobileDevice) {
                        map.reposition();
                        map.resize();
                        SetCommentHeight();
                        SetSplashScreenHeight();
                        SetViewDetailsHeight();
                        SetCmtControlsHeight();
                        setTimeout(function () {
                            if (selectedMapPoint) {
                                map.setExtent(GetMobileMapExtent(selectedMapPoint));
                            }
                            orientationChange = false;
                            return;
                        }, 1000);

                    }
                }, timeout);
            }
        }
    }

}

function keyboardAccess() {
	//CanAccess: keyboard navigation inteferes with accessibility when map isn't focused
	if (dojo.isIE <= 7) {return;} //IE7 not compatible with advanced event handling
	dojo.require("dojo.on");
	map.disableKeyboardNavigation();

	document.getElementById("map_gc").setAttribute("focusable",false);
	//Detect when tabbing over to map
	dojo.on(dojo.byId("accessForward"),"focus",tabToMap);
	dojo.on(dojo.byId("accessBackward"),"focus",tabToMap);
	function tabToMap(evt) {
		focus.mapTab = true;
		document.getElementById("map").focus();
	}
	
	//Activate/deactivate custom keyboard navigation
	dojo.on(dojo.byId("map"),"mousedown",function(evt){
		document.getElementById("map").focus();
		if (evt.target.id == "map_gc" || evt.target.id.indexOf("_tile_")>= 0) {
			evt.preventDefault();
		}
		focus.mapClick = true;
		setTimeout(function() {focus.mapClick = false;},500);
	});
	dojo.on(dojo.byId("map"),"focus",function(evt){
		document.getElementById("accessForward").setAttribute("tabIndex","-1");
		document.getElementById("accessBackward").setAttribute("tabIndex","-1");
		focus.onMap = true;
		if (focus.mapTab && dojo.isIE <= 8) {
			focus.mapTab = false;
		}
		else if (focus.mapTab) {
			document.getElementById("crosshair").style.display = "block";
			centerCrossHair();
			document.getElementById("mapNavigation").style.display = "block";
		}
	});
	dojo.connect(dojo.byId("map"),"onblur",function(evt){
		if (dojo.isIE <= 7 && focus.mapClick) {document.getElementById("map").focus();return;}
		focus.mapTab = false;
		focus.onMap = false;
		document.getElementById("crosshair").style.display = "none";
		document.getElementById("mapNavigation").style.display = "none";
		document.getElementById("accessForward").setAttribute("tabIndex","0");
		document.getElementById("accessBackward").setAttribute("tabIndex","0");
	});
	//Custom Keyboard Navigation
	esriConfig.defaults.map.panDuration = 0;
	dojo.on(dojo.byId("map"),"keydown",function(evt){
		if (!focus.onMap) {return;}
		kc = evt.keyCode;
		var zooms = [1565430,782715,391357,195678,97839,48919,24459,12229,6114,3057,1528,764,382,191,95,47,24,12,6,3];
		if (kc == dojo.keys.NUMPAD_PLUS) {map.setLevel(map.getLevel() + 1);}
		else if (kc == dojo.keys.NUMPAD_MINUS) {map.setLevel(map.getLevel() - 1);}
		else {
			var dx = 0;
			var dy = 0;
			var lv = map.getLevel();
			if (dojo.indexOf([dojo.keys.RIGHT_ARROW,dojo.keys.PAGE_UP,dojo.keys.PAGE_DOWN,dojo.keys.NUMPAD_6,dojo.keys.NUMPAD_9,dojo.keys.NUMPAD_3],kc) >= 0) {
				dx = zooms[lv];
			}
			else if (dojo.indexOf([dojo.keys.LEFT_ARROW,dojo.keys.HOME,dojo.keys.END,dojo.keys.NUMPAD_4,dojo.keys.NUMPAD_7,dojo.keys.NUMPAD_1],kc) >= 0) {
				dx = zooms[lv] * -1;
			}
			if (dojo.indexOf([dojo.keys.UP_ARROW,dojo.keys.HOME,dojo.keys.PAGE_UP,dojo.keys.NUMPAD_8,dojo.keys.NUMPAD_7,dojo.keys.NUMPAD_9],kc) >= 0) {
				dy = zooms[lv];
			}
			else if (dojo.indexOf([dojo.keys.DOWN_ARROW,dojo.keys.END,dojo.keys.PAGE_DOWN,dojo.keys.NUMPAD_2,dojo.keys.NUMPAD_1,dojo.keys.NUMPAD_3],kc) >= 0) {
				dy = zooms[lv] * -1;
			}
			map.setExtent(map.extent.offset(dx,dy));
		}
	});
	//CanAccess: Keyboard click on map
	dojo.on(dojo.byId("map"),"keyup",function(evt){
		if (focus.mapTab && focus.onMap && evt.keyCode == 13) {
			document.getElementById("crosshair").style.display = "none";
			var screenCoords = map.toScreen(map.extent.getCenter());
			var centerObject = document.elementFromPoint(screenCoords.x,screenCoords.y);
			HideInfoContainer();
			//Click on the map
			if (centerObject.id == "map_gc" || centerObject.className == "layerTile") {
				//If points are displayed, check if a point is under the crosshair
					var extentGeom = pointToExtent(map,map.extent.getCenter(),10);
					xExtent = extentGeom;
					var filteredGraphics = dojo.filter(map.getLayer(serviceRequestLayerId).graphics, function(graphic) {
						return extentGeom.contains(graphic.geometry);
					})
				if (filteredGraphics && filteredGraphics.length > 0) {
					ShowServiceRequestDetails(filteredGraphics[0].geometry,filteredGraphics[0].attributes);
				}
				//No points under crosshair, select location under crosshair as new request location
				else {
					showHideSearch(true);
					AddServiceRequest(map.extent.getCenter());
				}
			}
			document.getElementById("crosshair").style.display = "block";
		}
	});
	//Center Crosshaire
	function centerCrossHair() {
		var crossBox = dojo.getContentBox(dojo.byId("crosshair"));
		var center = map.toScreen(map.extent.getCenter());
		dojo.byId("crosshair").style.top = String(center.y - (crossBox.h/2)) + "px";
		dojo.byId("crosshair").style.left = String(center.x - (crossBox.w/2)) + "px";
	}
	centerCrossHair();
	dojo.on(map,'resize',centerCrossHair);
}

//Internationalization of pre-loaded content
function internationalization(responseObject) {
	//General
	dojo.byId("splashClose").innerHTML = intl.splashClose;
	
	//Header
	dojo.byId("imgSearch").alt = intl.searchTooltip;
	dojo.byId("imgSearch").title = intl.searchTooltip;
	dojo.byId("searchLegend").innerHTML = intl.searchLegend;
	dojo.byId("searchSubmit").setAttribute("aria-label",intl.searchButton);
	dojo.byId("imgGeolocate").alt = intl.geolocateTooltip;
	dojo.byId("imgGeolocate").title = intl.geolocateTooltip;
	dojo.byId("imgBaseMap").alt = intl.basemapTooltip;
	dojo.byId("imgBaseMap").title = intl.basemapTooltip;
	dojo.byId("imgShare").alt = intl.shareTooltip;
	dojo.byId("imgShare").title = intl.shareTooltip;
	dojo.query("#divAppHolder div")[0].innerHTML = intl.shareTitle;
	dojo.byId("imgFacebook").alt = intl.facebookTooltip;
	dojo.byId("imgFacebook").title = intl.facebookTooltip;
	dojo.byId("imgTwitter").alt = intl.twitterTooltip;
	dojo.byId("imgTwitter").title = intl.twitterTooltip;
	dojo.byId("imgMail").alt = intl.emailTooltip;
	dojo.byId("imgMail").title = intl.emailTooltip;
	dojo.byId("imgHelp").alt = intl.helpTooltip;
	dojo.byId("imgHelp").title = intl.helpTooltip;
	
	//Info Windows (Create)
	dojo.byId("createPopUpTitle").innerHTML = intl.newRequestHeader;
	dojo.query("[for=requestTypeSel]")[0].innerHTML = intl.typeLabel;
	dojo.query("[for=txtDescription]")[0].innerHTML = intl.commentLabel;
	dojo.query("[for=txtName]")[0].innerHTML = intl.nameLabel;
	dojo.query("[for=txtPhone]")[0].innerHTML = intl.phoneLabel;
	dojo.query("[for=txtMail]")[0].innerHTML = intl.emailLabel;
	dojo.query("[for=txtFileName]")[0].innerHTML = intl.attachLabel;
	dojo.query("#submitDiv [type=submit]")[0].setAttribute("value",intl.submitButton);
	dojo.byId("cancelButton").innerHTML = intl.cancelButton;
	dojo.byId("imgClose").alt = intl.closeWindow;
	dojo.byId("imgClose").title = intl.closeWindow;
	
	//Info Windows (Display/Add Comment)
	dojo.byId("imgDirections").alt = intl.viewRequest;
	dojo.byId("imgDirections").title = intl.viewRequest;
	dojo.byId("imgComments").alt = intl.viewComments;
	dojo.byId("imgComments").title = intl.viewComments;
	dojo.byId("closeDisplay").alt = intl.closeWindow;
	dojo.byId("closeDisplay").title = intl.closeWindow;
	dojo.query("#divCommentsView img")[0].alt = intl.addComment;
	dojo.byId("addCommentTitle").innerHTML = intl.addComment;
	dojo.byId("ratingTitle").innerHTML = intl.ratingTitle;
	dojo.byId("commentTitle").innerHTML = intl.commentTitle;
	dojo.byId("btnAddComments").innerHTML = intl.submitButton;
	dojo.byId("btnCancelComments").innerHTML = intl.cancelButton;
	
	//Instructions
	dojo.query("#instructions strong")[0].innerHTML = intl.instrTitle;
	dojo.byId("instructions").innerHTML += intl.instrHTML;
	
	//Map
	dojo.byId("map").setAttribute("aria-label",intl.mapAria);
	dojo.query("#mapNavigation strong")[0].innerHTML = intl.kmnTitle;
	dojo.query("#mapNavigation img")[0].alt = intl.kmnAlt;
	dojo.query("#mapNavigation figcaption")[0].innerHTML = intl.kmnCaption;
}

dojo.addOnLoad(dojoInit);