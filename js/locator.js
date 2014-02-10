/*
 | Version 10.2
 | Copyright 2012 Esri
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | Citizen Service Request v10.2.0 / Demande de service municipal v10.2.0
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
 
//Get the extent based on the map-point
function GetExtent(point) {
    var xmin = point.x;
    var ymin = (point.y) - 30;
    var xmax = point.x;
    var ymax = point.y;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//function to display the current location of the user
function ShowMyLocation() {
    HideBaseMapLayerContainer();
    HideShareAppContainer();
    navigator.geolocation.getCurrentPosition(

    function (position) {
        ShowProgressIndicator();
        mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({
            wkid: 4326
        }));
        var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({
            wkid: 4326
        }));
        graphicCollection.addPoint(mapPoint);
        map.infoWindow.hide();
        geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
            for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
                if (map.getLayer(baseMapLayers[bMap].Key).visible) {
                    var bmap = baseMapLayers[bMap].Key;
                }
            }
            if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {
                mapPoint = null;
                selectedMapPoint = null;
                map.getLayer(tempGraphicsLayerId).clear();
                map.getLayer(highlightPollLayerId).clear();
                map.infoWindow.hide();
                HideProgressIndicator();
                alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
                return;
            }
            mapPoint = newPointCollection[0].getPoint(0);
            var ext = GetExtent(mapPoint);
            map.setExtent(ext.getExtent().expand(2));
            var graphic = new esri.Graphic(mapPoint, locatorMarkupSymbol, {
                "Locator": true
            }, null);
            map.getLayer(tempGraphicsLayerId).add(graphic);

            HideProgressIndicator();
        });
    },

    function (error) {
        HideProgressIndicator();
        switch (error.code) {
            case error.TIMEOUT:
                alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
                break;
            case error.POSITION_UNAVAILABLE:
                alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
                break;
            case error.PERMISSION_DENIED:
                alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
                break;
            case error.UNKNOWN_ERROR:
                alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
                break;
        }
    }, {
        timeout: 10000
    });
}

//Query the features while sharing
function ExecuteQueryTask() {
    ShowProgressIndicator();
    var queryTask = new esri.tasks.QueryTask(operationalLayers.ServiceRequestLayerURL);
    var query = new esri.tasks.Query;
    query.outSpatialReference = map.spatialReference;
    query.where = map.getLayer(serviceRequestLayerId).objectIdField + "=" + featureID;
    query.outFields = ["*"];
    query.returnGeometry = true;
    queryTask.execute(query, function (fset) {
        if (fset.features.length > 0) {
            ShowServiceRequestDetails(fset.features[0].geometry, fset.features[0].attributes, true);
        }
        HideProgressIndicator();
        map.setExtent(startExtent);
    }, function (err) {
        alert(err.Message);
    });
}

//Locate searched address on map with pushpin graphic, also handles selection of an address
function LocateAddressCML2(suggest,event) {
	if (dojo.isIE <= 7) {console.log("Delay");}

	//if searching for a request, divert to Request function
	if (searchType == "Request") {
		if (event && event.keyCode != dojo.keys.ENTER) {
			document.getElementById("noResultsWindowed").innerHTML = "";
			clearAutocomplete();
		}
		if (!(suggest)) {LocateServiceRequestCML2();}
		return;
	}
	
	//On selection of options with arrow keys, do not locate
	if (event) {
		var kc = event.keyCode;
		if (kc == dojo.keys.DOWN_ARROW || kc == dojo.keys.UP_ARROW || kc == dojo.keys.TAB) {
			if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
			return;
		}
	}
	
	//If selection made, do not proceed to new locator search
	if (!suggest && document.getElementById("autocompleteSelect") && document.getElementById("autocompleteSelect").selectedIndex >= 0) {
		var zCandidate = lastSearchResults[document.getElementById("autocompleteSelect").selectedIndex];
		lastSearchString = zCandidate.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
		document.getElementById("searchInput").value = lastSearchString;
		clearAutocomplete();
		mapPoint = zCandidate.location;
		LocateAddressOnMapCML2(mapPoint);
		return;
	}
	
	//No autocomplete on mobile devices (too unreliable due to device processing speeds)
	if ((isMobileDevice || isTablet || dojo.isIE <= 7) & suggest) {
		return;
	}

	document.getElementById("noResultsWindowed").innerHTML = "";
    selectedGraphic = null;
	var currSearch = dojo.byId("searchInput").value.trim();
    if (currSearch === '' || (currSearch == lastSearchString && suggest) || (currSearch.length < 4 && suggest/*No auto-suggest for small*/)) {
		if (currSearch != lastSearchString) {
			lastSearchString = currSearch;
			clearAutocomplete();
		}
        return;
    }
	if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
	lastSearchString = currSearch;
	var params = [];
	//CanMod: Modify locator to search in set extent only (makes it uncessary to type city, province, etc in the search field)
	params["address"] = {};
	params["address"][locatorSettings.Locators[0].LocatorParamaters] = currSearch;
	se = locatorSettings.Locators[0].SearchExtent;
	params.outFields = [locatorSettings.Locators[0].CandidateFields];
	if (se.wkid == 4326) {
		params.searchExtent = new esri.geometry.Extent(se.xmin,se.ymin,se.xmax,se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
	}
	else if (se.wkid == 3785) {
		require(["esri/geometry/webMercatorUtils"], function(webMercatorUtils) {
			var se_Original = new esri.geometry.Extent(se.xmin, se.ymin, se.xmax, se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
			params.searchExtent = webMercatorUtils.webMercatorToGeographic(se_Original);
		});
	}
    var locatorCML2 = new esri.tasks.Locator(locatorSettings.Locators[0].LocatorURL);
    locatorCML2.outSpatialReference = map.spatialReference;
    locatorCML2.addressToLocations(params, function (candidates) {
		var thisSearchTime = (new Date()).getTime();
        // Discard searches made obsolete by new typing from user
        if (!lastSearchTime || thisSearchTime > lastSearchTime) {
			lastSearchTime = (new Date()).getTime();
			ShowLocatedAddressCML2(candidates,suggest);
		}
    },

    function (err) {
		console.error(err);
    });

}

//Populate candidate address list in address container

function ShowLocatedAddressCML2(candidates,suggest) {
	//Keep top 10 candidates that pass minimum score from config file
	candidates = dojo.filter(candidates, function(item) {
		if (dojo.indexOf(locatorSettings.Locators[0].LocatorFieldValues, item.attributes[locatorSettings.Locators[0].LocatorFieldName]) >= 0) {
			return item.score > locatorSettings.Locators[0].AddressMatchScore;
		}
		else {return false;}
	});
	if (candidates.length > 10) {
		candidates = candidates.slice(0,10);
	}

    if (candidates.length > 0) {
		lastSearchResults = candidates;
		
		if (suggest) {
			var sel = document.createElement("select");
			sel.setAttribute("size",String(candidates.length));
			sel.setAttribute("id","autocompleteSelect");
			sel.setAttribute("onclick","LocateAddressCML2(false);");
			sel.setAttribute("onkeyup","if (event.keyCode == dojo.keys.ENTER) {LocateAddressCML2(false);} if (event.keyCode == dojo.keys.ESCAPE) {clearAutocomplete();}");
			dojo.forEach(candidates,function(item,i) {
				var opt = document.createElement("option");
				opt.innerHTML = item.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
				sel.appendChild(opt);
			});
			clearAutocomplete();
			document.getElementById("autocomplete").appendChild(sel);
		}
		else {
			var zCandidate = lastSearchResults[0];
			lastSearchString = zCandidate.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
			clearAutocomplete();
			mapPoint = zCandidate.location;
			LocateAddressOnMapCML2(mapPoint);
		}
    } else {
		var alert = document.createElement("div");
		alert.innerHTML = messages.getElementsByTagName("invalidSearch")[0].childNodes[0].nodeValue + "<hr>" + locatorSettings.Locators[0].Example;
		if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
		if (suggest) {
			timeouts.autocomplete = setTimeout(function() { //Reduce sporadic appearances of "No Results" as user types
				timeouts.autocomplete = null;
				clearAutocomplete();
				document.getElementById("autocomplete").appendChild(alert);
			},1000);
		}
		else {
			alert.setAttribute("role","alert"); //Alert screen reader users on form submission that no results found
			clearAutocomplete();
			if (isMobileDevice || isTablet || dojo.isIE <= 7) {
				document.getElementById("noResultsWindowed").appendChild(alert);
			}
			else {
				document.getElementById("autocomplete").appendChild(alert);
			}
		}
    }
}

//Clear Autocomplete
function clearAutocomplete() {
	document.getElementById("autocomplete").innerHTML = "";
}

//Change autocomplete selection from input using arrow keys
function selectAutocomplete(evt) {
	if (dojo.isIE <= 7) {return;}
	if (!(dojo.isIE < 9)) {evt.preventDefault();}
	if (document.getElementById("autocompleteSelect")) {
		var sel = document.getElementById("autocompleteSelect");
		var kc = evt.keyCode;
		if (kc == dojo.keys.DOWN_ARROW && sel.selectedIndex != sel.getAttribute("size") -1) {
			sel.selectedIndex ++;
			document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
		}
		else if (kc == dojo.keys.UP_ARROW && sel.selectedIndex != -1) {
			sel.selectedIndex --;
			if (sel.selectedIndex == -1) {
				document.getElementById("searchInput").value = lastSearchString;
			}
			else {
				document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
			}
		}
	}
	if (evt.keyCode == dojo.keys.ESCAPE) {
		clearAutocomplete();
	}
}

//Locate searched address on map with pushpin graphic

function LocateAddressOnMapCML2(mapPoint) {
	showHideSearch(true);
	HideCreateRequestContainer();
	map.infoWindow.hide();
	ClearGraphics();
	
	for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
        if (map.getLayer(baseMapLayers[bMap].Key).visible) {
            var bmap = baseMapLayers[bMap].Key;
        }
    }
    if (!map.getLayer(bmap).fullExtent.contains(mapPoint)) {
        map.infoWindow.hide();
        selectedMapPoint = null;
        mapPoint = null;
        map.getLayer(tempGraphicsLayerId).clear();
        HideProgressIndicator();
        alert(messages.getElementsByTagName("noDataAvlbl")[0].childNodes[0].nodeValue);
        return;
    }
    if (mapPoint) {
		ShowProgressIndicator();
        var ext = GetExtent(mapPoint);
        map.setExtent(ext.getExtent().expand(2));
        var graphic = new esri.Graphic(mapPoint, locatorMarkupSymbol, {
            "Locator": true
        }, null);
        map.getLayer(tempGraphicsLayerId).add(graphic);
		//CanMod: Automatically create Service Request on address search
		map.infoWindow.hide();
        selectedMapPoint = null;
        setTimeout(function () {
            dojo.byId("divInfoDetails").style.display = "none";
            AddServiceRequest(mapPoint);
            HideProgressIndicator();
        }, 1000);

    }
	clearAutocomplete();
}

//Changes the label/variable when the search type is changed
function searchChange(lS) {
	if (dojo.byId("searchAddress").checked) {
		dojo.byId("searchInput").setAttribute("placeholder",lS.Locators[0].DisplayText);
		searchType = "Address";
	}
	else {
		dojo.byId("searchInput").setAttribute("placeholder",lS.Locators[1].DisplayText);
		searchType = "Request";
	}
}

function LocateServiceRequestCML2() {
	document.getElementById("noResultsWindowed").innerHTML = "";
	clearAutocomplete();
	mapPoint = null;
    if (dojo.byId("searchInput").value.trim() == '') {
        return;
    }
    var qTask = new esri.tasks.QueryTask(operationalLayers.ServiceRequestLayerURL);
    var query = new esri.tasks.Query();
    query.where = dojo.string.substitute(locatorSettings.Locators[1].QueryString, [dojo.byId('searchInput').value.trim()]);
    query.outFields = ["*"];
    query.returnGeometry = true;
    qTask.execute(query, function (featureset) {
        if (featureset.features.length > 0) {
			selectedRequest = featureset.features[0].geometry;
			showHideSearch(true);
			HideCreateRequestContainer();
			map.infoWindow.hide();
			LocateServiceRequestOnMapCML2(featureset.features[0].attributes);
        } else {
			var alert = document.createElement("div");
			alert.innerHTML = messages.getElementsByTagName("invalidSearch")[0].childNodes[0].nodeValue + "<hr>" + locatorSettings.Locators[1].Example;
            alert.setAttribute("role","alert"); //Alert screen reader users on form submission that no results found
			clearAutocomplete();
			if (isMobileDevice || isTablet || dojo.isIE <= 7) {
				document.getElementById("noResultsWindowed").appendChild(alert);
			}
			else {
				document.getElementById("autocomplete").appendChild(alert);
			}
        }
    }, function (err) {
        console.error("Query Task Failed - E001",err);
    });
}

function LocateServiceRequestOnMapCML2(attributes) {
    map.getLayer(tempGraphicsLayerId).clear();
    map.getLayer(highlightPollLayerId).clear();
    var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, locatorRippleSize, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(rippleColor), 4), new dojo.Color([0, 0, 0, 0]));
    AddGraphic(map.getLayer(highlightPollLayerId), symbol, selectedRequest);

    ShowServiceRequestDetails(selectedRequest, attributes);
}