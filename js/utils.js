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
var orientationChange = false; //variable for setting the flag on orientation
var tinyResponse; //variable for storing the response getting from tiny URL api
var tinyUrl; //variable for storing the tiny URL
var isContainerVisible = true; //variable for setting the flag on address container

function AddReferenceOverlays() {
    if (referenceOverlays != null)
    {
        for (var i = 0; i < referenceOverlays.length; i++) {
            map.addLayer(new esri.layers.FeatureLayer(referenceOverlays[i].URL, {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
            }));
        }
    }
}

//Reset service request values
function ResetRequestFields() {
    dojo.byId("requestTypeSel").selectedIndex = -1;
    dojo.byId('txtDescription').value = "";
    dojo.byId('txtName').value = "";
    dojo.byId('txtPhone').value = "";
    dojo.byId('txtMail').value = "";
    dojo.byId('txtFileName').value = "";
    dojo.byId('formFile').reset();
    dojo.byId('spanServiceErrorMessage').innerHTML = "";
}

//Show add service request info window
function AddServiceRequest(mapPoint) {
	dojo.byId("instructions").style.display = "none";
    map.getLayer(highlightPollLayerId).clear();
    map.infoWindow.hide();
    selectedMapPoint = mapPoint;
    ResetRequestFields();
    dojo.byId("divInfoDetails").style.position = "";
    dojo.byId("spanServiceErrorMessage").innerHTML = "";
    map.getLayer(tempGraphicsLayerId).clear();
    map.infoWindow.hide();
    if (isMobileDevice) {
        dojo.byId("submitDiv").style.bottom = "5px";
    }
    if (!isMobileDevice) {
        dojo.byId("divCreateRequestContainer").style.display = "none";
        dojo.byId("divInfoContent").style.display = "none";
        dojo.byId("divCreateRequestContainer").style.width = infoPopupWidth + "px";
        dojo.byId("divCreateRequestContainer").style.height = infoPopupHeight + "px";
    }
    if (serviceRequestSymbol) {
        var graphic = new esri.Graphic(mapPoint, serviceRequestSymbol, null, null);
        map.getLayer(tempGraphicsLayerId).add(graphic);
        (isMobileDevice) ? map.infoWindow.resize(225, 60) : map.infoWindow.resize(infoPopupWidth, infoPopupHeight);

        if (!isMobileDevice) {
            map.setExtent(GetBrowserMapExtent(selectedMapPoint));
        } else {
            map.setExtent(GetMobileMapExtent(selectedMapPoint));
        }
        setTimeout(function () {
            var screenPoint = map.toScreen(selectedMapPoint);
            screenPoint.y = map.height - screenPoint.y;
            map.infoWindow.show(screenPoint);
            if (isMobileDevice) {
                map.infoWindow.setTitle(intl.mobileSubmit);
                dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                    ResetRequestFields();
                    if (isMobileDevice) {
                        ShowCreateRequestContainer();
                        map.infoWindow.hide();
                    }
                    SetCreateRequestHeight();
                });
                map.infoWindow.setContent("");
            } else {
                dojo.byId("divCreateRequestContainer").style.display = "block";
                dojo.byId("divCreateRequestContent").style.display = "block";
                SetCreateRequestHeight();
            }
        }, 500)
    }
	dojo.byId("requestTypeSel").selectedIndex = -1;
}

//Show create request container
function ShowCreateRequestContainer() {
    dojo.byId("divInfoDetails").style.display = "none";
    dojo.byId("divCreateRequest").style.display = "block";
    dojo.replaceClass("divCreateRequest", "opacityShowAnimation", "opacityHideAnimation");
    dojo.byId("divCreateRequestContent").style.display = "block";
    dojo.replaceClass("divCreateRequestContainer", "showContainer", "hideContainer");
}

//Clear graphics on map
function ClearGraphics() {
    if (map.getLayer(tempGraphicsLayerId)) {
        map.getLayer(tempGraphicsLayerId).clear();
    }
}

//Show comments view
function ShowCommentsView() {
    if (showCommentsTab) {
        dojo.byId("imgComments").style.display = "none";
        dojo.byId('imgDirections').src = "images/Details.png";
        dojo.byId('imgDirections').title = intl.viewRequest;
        dojo.byId('imgDirections').alt = intl.viewRequest;
        dojo.byId('imgDirections').setAttribute("disp", "Details");
        dojo.byId("imgDirections").style.display = "block";
        ResetCommentValues();
        dojo.byId('divInfoComments').style.display = "block";
        dojo.byId('divInfoDetails').style.display = "none";
        SetCommentHeight();
    }
}

//Show service request details info window
function ShowServiceRequestDetails(mapPoint, attributes) {
    map.infoWindow.hide();
    featureID = attributes[map.getLayer(serviceRequestLayerId).objectIdField]
    dojo.byId("divInfoDetails").style.position = "relative";
    if (showCommentsTab) {
        dojo.byId("imgComments").style.display = "block";
    } else {
        dojo.byId("imgComments").style.display = "none";
        dojo.byId("imgComments").style.width = 0 + "px";
    }
    if (!isMobileDevice) {
        dojo.byId('divCreateRequestContainer').style.display = "none";
        dojo.byId('divInfoContent').style.display = "none";
        dojo.byId('divInfoContent').style.width = infoPopupWidth + "px";
        dojo.byId('divInfoContent').style.height = infoPopupHeight + "px";
    }
    for (var i in attributes) {
        if (attributes.hasOwnProperty(i)) {
            if (!attributes[i]) {
                attributes[i] = "";
            }
        }
    }

    selectedRequestStatus = dojo.string.substitute(status, attributes);
    map.getLayer(tempGraphicsLayerId).clear();

    setTimeout(function () {
        (isMobileDevice) ? map.infoWindow.resize(225, 60) : map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
        if (!isMobileDevice) {
            map.setExtent(GetBrowserMapExtent(mapPoint));
        } else {
            map.setExtent(GetMobileMapExtent(mapPoint));
        }

        selectedMapPoint = mapPoint;
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;

        map.infoWindow.show(screenPoint);
        if (isMobileDevice) {
            var header;
            if (dojo.string.substitute(infoWindowHeader, attributes)) {
                header = dojo.string.substitute(infoWindowHeader, attributes).trimString(Math.round(225 / 14));
            } else {
                header = dojo.string.substitute(infoWindowHeader, attributes);
            }
            map.infoWindow.setTitle(header);
            dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                if (isMobileDevice) {
                    selectedMapPoint = null;
                    map.infoWindow.hide();
                    ShowServiceRequestContainer();
                }
                dojo.byId('divInfoContent').style.display = "block";
                ServiceRequestDetails(attributes);
            });
            var cont;
            if (dojo.string.substitute(infoWindowContent, attributes).trimString) {
                cont = dojo.string.substitute(infoWindowContent, attributes).trimString(Math.round(225 / 12));
            } else {
                cont = dojo.string.substitute(infoWindowContent, attributes);
            }
            map.infoWindow.setContent(cont);
        } else {
            ServiceRequestDetails(attributes);
        }
    }, 1000);
}

//Create service request details view
function ServiceRequestDetails(attributes) {
    ShowInfoDirectionsView();
    if (!isMobileDevice) {
        dojo.byId('divInfoContent').style.display = "block";
        dojo.byId("divInfoDetails").style.display = "block";
    }
    dojo.empty(dojo.byId('tblInfoDetails'));
    dojo.empty(dojo.byId('divCommentsContent'));
    if (isBrowser) {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 6));

        if (value.length > Math.round(infoPopupWidth / 6)) {
            dojo.byId('tdInfoHeader').title = dojo.string.substitute(infoWindowHeader, attributes);
        }
    } else {
        value = dojo.string.substitute(infoWindowHeader, attributes).trim();
        value = value.trimString(Math.round(infoPopupWidth / 10));
    }
    dojo.byId('tdInfoHeader').innerHTML = value;
    var tblInfoDetails = dojo.byId('tblInfoDetails');
    var tbody = document.createElement("tbody");
    tblInfoDetails.appendChild(tbody);
    var date = new js.date();
    for (var index in infoWindowData) {
        if (infoWindowData.hasOwnProperty(index)) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            switch (infoWindowData[index].DataType) {
                case "string":
                    CreateTableRow(tr, infoWindowData[index], dojo.string.substitute(infoWindowData[index].AttributeValue, attributes));
                    break;
                case "date":
                    // Extract the desired date field from the list of attributes. If the date is not available, the date field is an empty string
                    var dateField = dojo.string.substitute(infoWindowData[index].AttributeValue, attributes);
                    var dateString = showNullValueAs;
                    if (dateField.length > 0) 
                    {
                        var utcMilliseconds = Number(dateField);
                        dateString = dojo.date.locale.format(date.utcToLocal(date.utcTimestampFromMs(utcMilliseconds)), {
                            datePattern: formatDateAs,
                            selector: "date"
                        });
                    }
                    CreateTableRow(tr, infoWindowData[index], dateString);
                    break;
            }
        }
    }
    FetchRequestComments(dojo.string.substitute(requestId, attributes));
    FetchAttachmentDetails(attributes[map.getLayer(serviceRequestLayerId).objectIdField], tbody);
    SetViewDetailsHeight();
}

//Create table row
function CreateTableRow(tr, itemInfo, value) {
	var displayName = itemInfo.DisplayText;
    var td = document.createElement("td");
    td.innerHTML = displayName;
    td.style.height = "18px";
    td.style.width = "120px";
    td.vAlign = "middle";
    td.style.paddingTop = "5px";
    var td1 = document.createElement("td");
    td1.style.width = "180px";
    td1.style.paddingTop = "5px";
    if (itemInfo.isComment) {
        td.vAlign = "top";
        if (value == "") {
            value = messages.getElementsByTagName("noComment")[0].childNodes[0].nodeValue;
        } else {
            var wordCount = value.split(/\n/).length;
            if (wordCount > 1) {
                var value1 = value.split(/\n/)[0].length == 0 ? "<br>" : value.split(/\n/)[0].trim();
                for (var c = 1; c < wordCount; c++) {
                    var comment;
                    if (value1 != "<br>") {
                        comment = value.split(/\n/)[c].trim().replace("", "<br>");
                    } else {
                        comment = value.split(/\n/)[c].trim();
                    }
                    value1 += value.split(/\n/)[c].length == 0 ? "<br>" : comment;
                }
            } else {
                value1 = value;
            }
            td1.innerHTML += value1;
            if (CheckMailFormat(value) || dojo.string.substitute(value).match("http:" || "https:")) {
                td1.className = "tdBreakWord";
            } else {
                td1.className = "tdBreak";
            }
            var x = value.split(" ");
            for (var i in x) {
                if (x.hasOwnProperty(i)) {
                    w = x[i].getWidth(15) - 50;
                    var boxWidth = (isMobileDevice) ? (dojo.window.getBox().w - 10) : (infoPopupWidth - 40);
                    if (boxWidth < w) {
                        td1.className = "tdBreakWord";
                        continue;
                    }
                }
            }
        }

    }

    td1.innerHTML = value;
    tr.appendChild(td);
    tr.appendChild(td1);
}

//Fetch comments for a service request
function FetchRequestComments(requestID) {
    dojo.byId('btnAddComments').disabled = false;
    var reqId;
    var query = new esri.tasks.Query();
    commentId.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        reqId = key;
    });
    query.where = reqId + "= '" + requestID + "'";
    query.outFields = ["*"];
    selectedRequestID = requestID;
    //execute query
    map.getLayer(serviceRequestCommentsLayerId).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        var commentsTable = document.createElement("table");
        commentsTable.style.width = "95%";
        var commentsTBody = document.createElement("tbody");
        commentsTable.appendChild(commentsTBody);
        dojo.byId("divCommentsContent").appendChild(commentsTable);
        if (features.length > 0) {
            features.sort(SortResultFeatures); //Sort comments based on submitted date
            for (var i = features.length - 1; i >= 0; i--) {
                var trComments = document.createElement("tr");
                var commentsCell = document.createElement("td");
                commentsCell.className = "bottomborder";
                commentsCell.appendChild(CreateCommentRecord(features[i].attributes, i));
                trComments.appendChild(commentsCell);
                commentsTBody.appendChild(trComments);
                CreateRatingWidget(dojo.byId('commentRating' + i));
                SetRating(dojo.byId('commentRating' + i), dojo.string.substitute(commentsInfoPopupFieldsCollection.Rank, features[i].attributes));
            }
            SetCommentHeight();
        } else {
            var trComments = document.createElement("tr");
            var commentsCell = document.createElement("td");
            commentsCell.appendChild(document.createTextNode(intl.noComments));
            trComments.setAttribute("noComments", "true");
            trComments.appendChild(commentsCell);
            commentsTBody.appendChild(trComments);
        }
    }, function (err) {console.warn("FetchRequestComments Failed",err);});
}

//Fetch attachment details
function FetchAttachmentDetails(objectID, tbody) {
    map.getLayer(serviceRequestLayerId).queryAttachmentInfos(objectID, function (files) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.vAlign = "top";
        var tdTitle = document.createElement("td");
        tdTitle.innerHTML = intl.attachTitle;
        tdTitle.style.paddingTop = "5px";
        tr.appendChild(tdTitle);
        var tdAttachments = document.createElement("td");
        tdAttachments.style.paddingTop = "5px";
        tr.appendChild(tdAttachments);
        if (files.length == 0) {
            tdAttachments.innerHTML = intl.noAttachment;
        } else {
            if (files[0].contentType.indexOf("image") >= 0) {
                var filePreview = dojo.create("img");
                filePreview.style.height = "auto";
                filePreview.style.width = "130px";
                filePreview.style.cursor = "pointer";
                filePreview.src = files[0].url;
                filePreview.onclick = function () {
                    window.open(files[0].url);
                }
                tdAttachments.appendChild(filePreview);
            } else {
                var filespan = document.createElement("span");
                filespan.innerHTML = files[0].name;
                filespan.className = 'spanFileDetails';
                tdAttachments.appendChild(filespan);
                filespan.onclick = function () {
                    window.open(files[0].url);
                }
            }
        }
    });
}


//Convert string to bool
String.prototype.bool = function () {
    return (/^true$/i).test(this);
};

//Create Rating widget
function CreateRatingWidget(rating) {
    var numberStars = Number(rating.getAttribute("numstars"));
    var isReadOnly = String(rating.getAttribute("readonly")).bool();
    for (var i = 0; i < numberStars; i++) {
        var li = document.createElement("li");
        li.value = (i + 1);
		if (!isReadOnly) {
			li.setAttribute("tabindex","0");
			li.setAttribute("aria-label",intl.ratingTitle + " " + String(i + 1) + " " + intl.ratioOfFive);
			li.setAttribute("role","button");
		}
        li.className = isReadOnly ? "ratingStar" : "ratingStarBig";
        rating.appendChild(li);
        if (i < rating.value) {
            dojo.addClass(li, isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        }
        if (isBrowser) {
            li.onmouseover = function () {
                if (!isReadOnly) {
                    var ratingValue = Number(this.value);
                    var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                    for (var i = 0; i < ratingValue; i++) {
                        dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                }
            }
            li.onmouseout = function () {
                if (!isReadOnly) {
                    var ratings = Number(rating.value);
                    var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                    for (var i = 0; i < ratingStars.length; i++) {
                        if (i < ratings) {
                            dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                        } else {
                            dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                        }
                    }
                }
            }
        }
        li.onclick = function () {
            if (!isReadOnly) {
                rating.value = Number(this.value);
                var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
                for (var i = 0; i < ratingStars.length; i++) {
                    if (i < this.value) {
                        dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    } else {
                        dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
                    }
                }
            }
        }
		//CanAccess: make rating selection keyboard accessible
		li.onkeyup = function(event) {
			if (event.keyCode == dojo.keys.ENTER || event.keyCode == dojo.keys.SPACE) {
				if (!isReadOnly) {
					rating.value = Number(this.value);
					var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", rating);
					for (var i = 0; i < ratingStars.length; i++) {
						if (i < this.value) {
							dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
						}
						else {
							dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
						}
					}
				}
			}
		}
    }
}

//Set height for create request container
function SetCreateRequestHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 25) : dojo.coords(dojo.byId("divCreateRequestContainer")).h;
    dojo.byId('divCreateRequestScrollContent').style.height = (height - ((isBrowser) ? 105 : 130)) + "px";
    if (isMobileDevice) {
        dojo.byId('divCreateRequestScrollContent').style.height = (height - 100) + "px";
    }
}

//Set rating for rating control
function SetRating(control, rating) {
    control.value = rating;
    var isReadOnly = String(control.getAttribute("readonly")).bool();
    var ratingStars = dojo.query(isReadOnly ? ".ratingStar" : ".ratingStarBig", control);
    for (var i = 0; i < ratingStars.length; i++) {
        if (i < rating) {
            dojo.addClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        } else {
            dojo.removeClass(ratingStars[i], isReadOnly ? "ratingStarChecked" : "ratingStarBigChecked");
        }
    }
}

//Adds a new comment
function AddRequestComment() {
    var text = dojo.byId('txtComments').value.trim('');
    if (text == "") {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('spanCommentError', messages.getElementsByTagName("enterComment")[0].childNodes[0].nodeValue);
        return;
    }
    if (dojo.byId('txtComments').value.length > 250) {
        dojo.byId('txtComments').focus();
        ShowSpanErrorMessage('spanCommentError', messages.getElementsByTagName("commentsLength")[0].childNodes[0].nodeValue);
        return;
    }
    ShowProgressIndicator();
    var commentGraphic = new esri.Graphic();
    var date = new js.date();
    var attr = {};
    attr[databaseFields.RequestIdFieldName] = selectedRequestID;
    attr[databaseFields.CommentsFieldName] = text;
    attr[databaseFields.DateFieldName] = date.utcMsFromTimestamp(date.localToUtc(date.localTimestampNow()));
    attr[databaseFields.RankFieldName] = Number(dojo.byId('commentRating').value);
    commentGraphic.setAttributes(attr);

    dojo.byId('btnAddComments').disabled = true;
    map.getLayer(serviceRequestCommentsLayerId).applyEdits([commentGraphic], null, null, function (msg) {
        if (msg[0].error) { } else {
            var table = dojo.query('table', dojo.byId("divCommentsContent"));
            if (table.length > 0) {
                var x = dojo.query("tr[noComments = 'true']", table[0]);
                if (x.length > 0) {
                    dojo.empty(table[0]);
                }
                var tr = table[0].insertRow(0);
                var commentsCell = document.createElement("td");
                commentsCell.className = "bottomborder";
                var index = dojo.query("tr", table[0]).length;
                if (index) {
                    index = 0;
                }
                commentsCell.appendChild(CreateCommentRecord(attr, index));
                tr.appendChild(commentsCell);
                CreateRatingWidget(dojo.byId('commentRating' + index));
                SetRating(dojo.byId('commentRating' + index), attr[databaseFields.RankFieldName]);
            }
        }
        dojo.byId('btnAddComments').disabled = false;
        ResetCommentValues();
        HideProgressIndicator();
        SetCommentHeight();
    }, function (err) {
        dojo.byId('btnAddComments').disabled = false;
        HideProgressIndicator();
    });
}

//Create comment record
function CreateCommentRecord(attributes, i) {
    var table = document.createElement("table");
    table.style.width = "100%";
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    tbody.appendChild(tr);
    var td3 = document.createElement("td");
    td3.align = "left";
    td3.appendChild(CreateRatingControl(true, "commentRating" + i, 0, 5,attributes[databaseFields.RankFieldName]));
    var trDate = document.createElement("tr");
    tbody.appendChild(trDate);
    var td1 = document.createElement("td");
    var utcMilliseconds = Number(dojo.string.substitute(commentsInfoPopupFieldsCollection.SubmitDate, attributes));
    var date = new js.date();
    td1.innerHTML = intl.dateLabel + " " + dojo.date.locale.format(date.utcToLocal(date.utcTimestampFromMs(utcMilliseconds)), {
        datePattern: formatDateAs,
        selector: "date"
    });
    td1.align = "left";
    td1.colSpan = 2;
    tr.appendChild(td3);
    trDate.appendChild(td1);
    var tr1 = document.createElement("tr");
    var td2 = document.createElement("td");
    td2.colSpan = 2;
    td2.id = "tdComment";
    if (isMobileDevice) {
        td2.style.width = "100%";
    } else {
        td2.style.width = (infoPopupWidth - 40) + "px";
    }
    td2.colSpan = 2;
    if (dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)) {
        var wordCount = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/).length;
        if (wordCount > 1) {
            var value = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[0].length == 0 ? "<br>" : dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[0].trim();
            for (var c = 1; c < wordCount; c++) {
                var comment;
                if (value != "<br>") {
                    comment = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].trim().replace("", "<br>");
                } else {
                    comment = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].trim();
                }
                value += dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(/\n/)[c].length == 0 ? "<br>" : comment;
            }
        } else {
            value = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes);
        }
        td2.innerHTML += value;
        if (CheckMailFormat(dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)) || dojo.string.substitute(dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)).match("http:") || dojo.string.substitute(dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes)).match("https:")) {
            td2.className = "tdBreakWord";
        } else {
            td2.className = "tdBreak";
        }
        var x = dojo.string.substitute(commentsInfoPopupFieldsCollection.Comments, attributes).split(" ");
        for (var i in x) {
            if (x.hasOwnProperty(i)) {
                w = x[i].getWidth(15) - 50;
                var boxWidth = (isMobileDevice) ? (dojo.window.getBox().w - 10) : (infoPopupWidth - 40);
                if (boxWidth < w) {
                    td2.className = "tdBreakWord";
                    continue;
                }
            }
        }
    } else {
        td2.innerHTML = showNullValueAs;
    }
    tr1.appendChild(td2);
    tbody.appendChild(tr1);
    table.appendChild(tbody);
    return table;
}

//Sort comments according to date
function SortResultFeatures(a, b) {
    var x = dojo.string.substitute(commentsInfoPopupFieldsCollection.SubmitDate, a.attributes);
    var y = dojo.string.substitute(commentsInfoPopupFieldsCollection.SubmitDate, b.attributes)
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

//Function to append ... for a long string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//Reset the comments textarea
function ResetTextArea() {
    dojo.byId('txtComments').style.overflow = "hidden";
    ResetCommentValues();
    SetCommentHeight();
}

//Reset comments data
function ResetCommentValues() {
    dojo.byId('txtComments').style.overflow = "auto";
    dojo.byId('txtComments').value = '';
    SetRating(dojo.byId('commentRating'), 0);
    document.getElementById('spanCommentError').innerHTML = "";
    document.getElementById('spanCommentError').style.display = 'none';
    dojo.byId('divAddComment').style.display = "none";
    dojo.byId('divCommentsView').style.display = "block";
    dojo.byId('divCommentsList').style.display = "block";
}

//Create rating control
function CreateRatingControl(readonly, ctlId, intitalValue, numStars, rank) {
    var ratingCtl = document.createElement("ul");
    ratingCtl.setAttribute("readonly", readonly);
    ratingCtl.id = ctlId;
    ratingCtl.setAttribute("value", intitalValue);
    ratingCtl.setAttribute("numStars", numStars);
	ratingCtl.setAttribute("arial-label", intl.ratingTitle + " " + String(rank) + " " + intl.ratioOfFive);
    ratingCtl.style.padding = 0;
    ratingCtl.style.margin = 0;
    return ratingCtl;
}

//Show service request container
function ShowServiceRequestContainer() {
    dojo.byId('divInfoContainer').style.display = "block";
    dojo.byId("divInfoDetails").style.display = "block";
    dojo.replaceClass("divInfoContent", "showContainer", "hideContainer");
}

//Trim string
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}

//Make the text fields blur on scroll
function BlurTextIsos() {
    dojo.byId("txtDescription").blur();
    dojo.byId("txtName").blur();
    dojo.byId("txtPhone").blur();
    dojo.byId("txtMail").blur();

}
//Show error message span
function ShowSpanErrorMessage(controlId, message) {
    dojo.byId(controlId).style.display = "block";
    dojo.byId(controlId).innerHTML = "<span role='alert'>" + message + "</span>";
}

//Get width of a control when text and font size are specified
String.prototype.getWidth = function (fontSize) {
    var test = document.createElement("span");
    document.body.appendChild(test);
    test.style.visibility = "hidden";
    test.style.fontSize = fontSize + "px";
    test.innerHTML = this;
    var w = test.offsetWidth;
    document.body.removeChild(test);
    return w;
}


//Create new service request
function SubmitIssueDetails() {
    dojo.byId('txtPhone').value = dojo.byId('txtPhone').value.trim('');
    dojo.byId('txtMail').value = dojo.byId('txtMail').value.trim('');
    dojo.byId('txtName').value = dojo.byId('txtName').value.trim('');
    if (!ValidateRequestData()) {
        return;
    }

    dojo.byId('spanServiceErrorMessage').innerHTML = "";
    ShowProgressIndicator('map');
    var mapPoint = map.getLayer(tempGraphicsLayerId).graphics[0].geometry;
    var date = new js.date();
    var serviceRequestAttributes = {};
	var e = document.getElementById("requestTypeSel");
    serviceRequestAttributes[serviceRequestFields.RequestTypeFieldName] = e.options[e.selectedIndex].value;
    serviceRequestAttributes[serviceRequestFields.CommentsFieldName] = dojo.byId('txtDescription').value.trim();
    serviceRequestAttributes[serviceRequestFields.NameFieldName] = dojo.byId('txtName').value.trim();
    serviceRequestAttributes[serviceRequestFields.PhoneFieldName] = dojo.byId('txtPhone').value.replace(/[^0-9]/g, "");
    serviceRequestAttributes[serviceRequestFields.EmailFieldName] = dojo.byId('txtMail').value.trim();
    serviceRequestAttributes[serviceRequestFields.StatusFieldName] = operationalLayers.DefaultStatus;
    serviceRequestAttributes[serviceRequestFields.RequestDateFieldName] = date.utcMsFromTimestamp(date.localToUtc(date.localTimestampNow()));

    var serviceRequestGraphic = new esri.Graphic(mapPoint, null, serviceRequestAttributes, null);
    map.getLayer(serviceRequestLayerId).applyEdits([serviceRequestGraphic], null, null, function (addResults) {
        if (addResults[0].success) {
            var objectIdField = map.getLayer(serviceRequestLayerId).objectIdField;
            var requestID = {};
            requestID[serviceRequestFields.RequestIdFieldName] = String(addResults[0].objectId);
            requestID[objectIdField] = addResults[0].objectId;
            var requestGraphic = new esri.Graphic(mapPoint, null, requestID, null);
            map.getLayer(serviceRequestLayerId).applyEdits(null, [requestGraphic], null, function () {
                serviceRequestAttributes[serviceRequestFields.RequestIdFieldName] = String(addResults[0].objectId);
                if (dojo.byId('txtFileName').value != "") {
                    map.getLayer(serviceRequestLayerId).addAttachment(addResults[0].objectId, dojo.byId('formFile'), function (sucess) {
                        ShowServiceRequestDetails(mapPoint, serviceRequestGraphic.attributes);
                        HideProgressIndicator();
                        ResetRequestFields();
                        HideCreateRequestContainer();
                    }, function (err) {
						console.error("Failed to retreive attachment",err);
						ShowServiceRequestDetails(mapPoint, serviceRequestGraphic.attributes);
						HideProgressIndicator();
						ResetRequestFields();
						HideCreateRequestContainer();
                        alert(dojo.string.substitute(messages.getElementsByTagName("fileSize")[0].childNodes[0].nodeValue, [addResults[0].objectId]));

                    });

                } else {
                    ShowServiceRequestDetails(mapPoint, serviceRequestGraphic.attributes);
                    HideProgressIndicator();
                    ResetRequestFields();
                    HideCreateRequestContainer();
                }

            }, function (err) {
                HideProgressIndicator();
                ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementByTagName("requestFailed")[0].childNodes[0].nodeValue);

            });
        }
    }, function (err) {
        HideProgressIndicator();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementByTagName("requestFailed")[0].childNodes[0].nodeValue);
    });
}

//Validate service request data
function ValidateRequestData() {
    if (dojo.byId("requestTypeSel").selectedIndex == -1) {
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("selectRequestType")[0].childNodes[0].nodeValue);
        return false;
    }
    if (dojo.byId('txtDescription').value.trim().length > 0 && dojo.byId('txtDescription').value.trim().length > 250) {
        dojo.byId('txtDescription').focus();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("commentsLength")[0].childNodes[0].nodeValue);
        return false;
    }
	if (dojo.byId('txtName').value.trim() == "" && !(disableFields.Name)) {
		dojo.byId('txtName').focus();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterName")[0].childNodes[0].nodeValue);
        return false;
	}
    if (dojo.byId('txtName').value.length > 0 && !(disableFields.Name)) {
        if (!IsName(dojo.byId('txtName').value.trim())) {
            dojo.byId('txtName').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("nameProvisions")[0].childNodes[0].nodeValue);
            return false;
        }
    }
	if (!(disableFields.Phone) && !(disableFields.Email)) {
		if (dojo.byId('txtMail').value == '' && dojo.byId('txtPhone').value == '') {
			ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterContact")[0].childNodes[0].nodeValue);
			return;
		}
	}
    if (dojo.byId('txtPhone').value == '' && !(disableFields.Email)) {
        if (!CheckMailFormat(dojo.byId('txtMail').value)) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidEmailId")[0].childNodes[0].nodeValue);
            return false;
        }
    } else if (dojo.byId('txtMail').value == '' && !(disableFields.Phone)) {
        if (!IsPhoneNumber(dojo.byId('txtPhone').value.trim())) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtPhone').value.replace(/[^0-9]/g, "").length < 10 || dojo.byId('txtPhone').value.replace(/[^0-9]/g, "").length > 10) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    if (dojo.byId('txtPhone').value.length > 0) {
        if (!IsPhoneNumber(dojo.byId('txtPhone').value.trim())) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    if (dojo.byId('txtPhone').value.replace(/[^0-9]/g, "").length > 10) {
        dojo.byId('txtPhone').focus();
        ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
        return false;
    }
    if (dojo.byId('txtMail').value.length > 0) {
        if (!CheckMailFormat(dojo.byId('txtMail').value)) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidEmailId")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtMail').value.length > 100) {
            dojo.byId('txtMail').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("emailIdLength")[0].childNodes[0].nodeValue);
            return false;
        }
        if (dojo.byId('txtPhone').value.replace(/[^0-9]/g, "").length > 10) {
            dojo.byId('txtPhone').focus();
            ShowSpanErrorMessage("spanServiceErrorMessage", messages.getElementsByTagName("enterValidPhone")[0].childNodes[0].nodeValue);
            return false;
        }
    }
    return true;
}

//Validate name
function IsName(name) {
    var namePattern = /^[A-Za-z\.\-\' ]{1,150}$/;
    if (namePattern.test(name)) {
        return true;
    } else {
        return false;
    }
}

//Validate 10 digit number
function IsPhoneNumber(value) {
    if (value.replace(/[^0-9]/g, "").length == 10) {
        return true;
    } else {
        return false;
    }
}

//Hide create request container
function HideCreateRequestContainer() {
    selectedMapPoint = null;
    map.getLayer(tempGraphicsLayerId).clear();
    map.infoWindow.hide();
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divCreateRequest').style.display = "none";
            dojo.replaceClass("divCreateRequest", "opacityShowAnimation", "opacityHideAnimation");
            dojo.replaceClass("divCreateRequestContainer", "hideContainer", "showContainer");
        }, 500);
    } else {
        dojo.byId('divCreateRequestContainer').style.display = "none";
        dojo.byId("divCreateRequestContent").style.display = "none";
    }
}

//Handle orientation change event
function OrientationChanged() {
    orientationChange = true;
    if (map) {
        var timeout = (isMobileDevice && isiOS) ? 100 : 500;
        map.reposition();
        map.resize();
        map.infoWindow.hide();
        setTimeout(function () {
            map.reposition();
            map.resize();
            if (isMobileDevice) {
                map.reposition();
                map.resize();
                SetCommentHeight();
                SetSplashScreenHeight();
                SetCreateRequestHeight();
                SetViewDetailsHeight();
                SetCmtControlsHeight();
                BlurTextIsos();
                setTimeout(function () {
                    if (selectedMapPoint) {
                        map.setExtent(GetMobileMapExtent(selectedMapPoint));
                    }
                    orientationChange = false;
                    return;
                }, 1000);

            } else {
                setTimeout(function () {
                    if (selectedMapPoint) {
                        map.setExtent(GetBrowserMapExtent(selectedMapPoint));
                    }
                    orientationChange = false;
                }, 500);
            }
        }, timeout);
    }
}

//Hide splash screen container
function HideSplashScreenMessage() {
    if (dojo.isIE < 9 || isAndroidDevice) {
        dojo.byId("divSplashScreenContent").style.display = "none";
        dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    } else {
        dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
        dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");

    }

}

//Set height for splash screen
function SetSplashScreenHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 110) : (dojo.coords(dojo.byId('divSplashScreenContent')).h - 80);
    dojo.byId('divSplashContent').style.height = (height + 14) + "px";
}

//Handle resize event
function ResizeHandler() {
    if (map) {
        map.reposition();
        map.resize();
    }
}

//Hide Info request container
function HideInfoContainer() {
    featureID = null;
    map.getLayer(tempGraphicsLayerId).clear();
    map.getLayer(highlightPollLayerId).clear();
    selectedMapPoint = null;
    if (isMobileDevice) {
        setTimeout(function () {
            dojo.byId('divInfoContainer').style.display = "none";
            dojo.replaceClass("divInfoContent", "hideContainer", "showContainer");
        }, 500);
    } else {
        map.infoWindow.hide();
        dojo.byId('divInfoContent').style.display = "none";
        dojo.byId("divInfoDetails").style.display = "none";
    }
}

//Set height for view details
function SetViewDetailsHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h) : dojo.coords(dojo.byId('divInfoContent')).h;
    if (height > 0) {
        dojo.byId('divInfoDetailsScroll').style.height = (height - ((!isTablet) ? 55 : 55)) + "px";
    }
}

//Set height and create scroll bar for comments
function SetCommentHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h + 20) : (dojo.coords(dojo.byId('divInfoContent')).h - 10);
    if (height > 0) {
        dojo.byId('divCommentsContent').style.height = (height - ((isBrowser) ? 120 : 150)) + "px";
    }
    if (isMobileDevice) {
        dojo.byId('divInfoComments').style.width = dojo.window.getBox().w - 15 + "px";
    }
}

//Show Info request directions view
function ShowInfoDirectionsView() {
    if (dojo.byId('imgDirections').getAttribute("disp") == "Details") {
        dojo.byId('imgComments').src = "images/comments.png";
        dojo.byId('imgComments').title = intl.viewComments;
        dojo.byId('imgComments').alt = intl.viewComments;
        dojo.byId('imgComments').setAttribute("disp", "Comments");
        dojo.byId('divInfoComments').style.display = "none";
        dojo.byId('divInfoDetails').style.display = "block";
        dojo.byId('imgDirections').style.display = "none";
        dojo.byId('imgComments').style.display = "block";
        SetViewDetailsHeight();
    }
}

//Get the extent based on the map point
function GetBrowserMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 3);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Get the extent based on the map-point
function GetMobileMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 4);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Show add comments view
function ShowAddCommentsView() {
    dojo.byId('divAddComment').style.display = "block";
    dojo.byId('divCommentsView').style.display = "none";
    dojo.byId('divCommentsList').style.display = "none";
    SetCmtControlsHeight();
}

//Show add-comments view
function CreateRequestTypesList(serviceRequestLayerFields) {
    var serviceRequestFields;
    for (var i = 0; i < serviceRequestLayerFields.length; i++) {
        if (serviceRequestLayerFields[i].name.toUpperCase() == requestLayerName.toUpperCase()) {
            serviceRequestFields = serviceRequestLayerFields[i].domain.codedValues;
            break;
        }
    }
    if (!isMobileDevice) {
        dojo.byId('divCreateRequestContainer').style.width = infoPopupWidth + "px";
        dojo.byId('divCreateRequestContainer').style.height = infoPopupHeight + "px";
    }

    for (var i = 0; i < serviceRequestFields.length; i++) {
		var opt = document.createElement("option");
		opt.value = serviceRequestFields[i].code;
		opt.innerHTML = serviceRequestFields[i].name;
		dojo.byId("requestTypeSel").appendChild(opt);
		

    }

}

//Show comments controls with scrollbar
function SetCmtControlsHeight() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h + 20) : dojo.coords(dojo.byId('divInfoContent')).h;
    dojo.byId("divCmtIpContainer").style.height = (height - ((isTablet) ? 100 : 80)) + "px";
    dojo.byId('divCmtIpContent').style.height = (height - ((isTablet) ? 100 : 80)) + "px";
}

//Reset map position
function SetMapTipPosition() {
    if (!orientationChange) {
        if (map.getLayer(tempGraphicsLayerId)) {
            if (map.getLayer(tempGraphicsLayerId).graphics.length > 0) {
                if (map.getLayer(tempGraphicsLayerId).graphics[0].attributes) {
                    return;
                }
                mapPoint = map.getLayer(tempGraphicsLayerId).graphics[0].geometry;
                var screenPoint = map.toScreen(mapPoint);
                screenPoint.y = map.height - screenPoint.y;
                map.infoWindow.setLocation(screenPoint);
                return;
            }
            if (selectedMapPoint) {
                var screenPoint = map.toScreen(selectedMapPoint);
                screenPoint.y = map.height - screenPoint.y;
                map.infoWindow.setLocation(screenPoint);
            }
        }
    }
}

//Hide the base map container
function HideBaseMapLayerContainer() {
    dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
    dojo.byId('divLayerContainer').style.height = '0px';
	//CanAccess
	document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
	dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
		item.tabIndex = "-1";
	});
}

//Hide the share link container
function HideShareAppContainer() {
    dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
    dojo.byId('divAppContainer').style.height = '0px';
	//CanAccess
	document.getElementById('imgShare').setAttribute("aria-expanded",false);
	document.getElementById('imgFacebook').tabIndex="-1";
	document.getElementById('imgTwitter').tabIndex="-1";
	document.getElementById('imgMail').tabIndex="-1";
}

//Create the tiny URL with current extent and selected feature
function ShareLink(ext) {
    tinyUrl = null;
    mapExtent = GetMapExtent();
    var url = esri.urlToObject(windowURL);
    if (featureID) {
        var urlStr = encodeURI(url.path) + "?extent=" + mapExtent + "$featureID=" + featureID;
    } else {
        var urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
    }

    url = dojo.string.substitute(mapSharingOptions.TinyURLServiceURL, [urlStr]);
    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            if (ext) {
                HideBaseMapLayerContainer();
				showHideSearch(true);
                var cellHeight = (isMobileDevice || isTablet) ? 81 : 60;

                if (dojo.coords("divAppContainer").h > 0) {
                    HideShareAppContainer();
                } else {
                    dojo.byId('divAppContainer').style.height = cellHeight + "px";
                    dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
					//CanAccess
					document.getElementById('imgShare').setAttribute("aria-expanded",true);
					document.getElementById('imgFacebook').tabIndex="0";
					document.getElementById('imgTwitter').tabIndex="0";
					document.getElementById('imgMail').tabIndex="0";
                }
            }
        },
        error: function (error) {
            alert(tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
            return;
        }
    }, 6000);
}

//Open login page for facebook,tweet and open Email client with shared link for Email
function Share(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
   //CanMod: Modified to take in strings for post/status/subject in the config file
    if (tinyUrl) {
		var ShareURL;
        switch (site) {
            case "facebook":
				ShareURL = mapSharingOptions.FacebookShareURL + "?";
				ShareURL += dojo.objectToQuery({u:tinyUrl});
                window.open(ShareURL);
                break;
            case "twitter":
				ShareURL = mapSharingOptions.TwitterShareURL + "?";
				ShareURL += dojo.objectToQuery({text:mapSharingOptions.TwitterText, url:tinyUrl, related:mapSharingOptions.TwitterFollow, hashtags:mapSharingOptions.TwitterHashtag});
				window.open(ShareURL);
                break;
            case "mail":
				ShareURL = "mailto:%20?"
				ShareURL += dojo.objectToQuery({subject: mapSharingOptions.EmailSubject, body:tinyUrl});
                parent.location = ShareURL;
                break;
        }
	//End of CanMod
    } else {
        alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
        return;
    }
}

//Get current map Extent
function GetMapExtent() {
    var extents = Math.round(map.extent.xmin).toString() + "," + Math.round(map.extent.ymin).toString() + "," +
                  Math.round(map.extent.xmax).toString() + "," + Math.round(map.extent.ymax).toString();
    return (extents);
}

//Get the query string value of the provided key if not found the function returns empty string
function GetQuerystring(key) {
    var _default;
    if (!_default) {
        _default = "";
    }
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (!qs) {
        return _default;
    } else {
        return qs[1];
    }
}

//Restrict the maximum no of characters in the text area control
function ImposeMaxLength(Object, MaxLen) {
    return (Object.value.length <= MaxLen);
}

//Show progress indicator
function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
}

//Hide progress indicator
function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";
}

//validate Email in comments tab
function CheckMailFormat(emailValue) {
    var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i
    if (pattern.test(emailValue)) {
        return true;
    } else {
        return false;
    }
}

//Set changed value for address/requestid
function ResetTargetValue(target, title, color) {
    if (target.value == '' && target.getAttribute(title)) {
        target.value = target.title;
        if (target.title == "") {
            target.value = target.getAttribute(title);
            target.style.color = color;
        }
    }
}

//Add graphic to a layer.
function AddGraphic(layer, symbol, point, attr) {
    var graphic = new esri.Graphic(point, symbol, attr, null);
    layer.add(graphic);
}

//CanAccess: Run function from keyboard Enter/Space instead of onclick
function accessClick(evt,fxn,params) {
	var kc = evt.keyCode;
	if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
		window[fxn](params);
	}
}

//Show/Hide the IE7/Mobile/Tablet search window
function showHideSearch(closeOnly) {
	var disp = dojo.byId("divAddressSearch").style.display;
	if (disp == "block") {
		dojo.byId("divAddressSearch").style.display = "none";
		dojo.byId("imgSearch").setAttribute("aria-expanded","false");
	}
	else if (disp == "none" && !closeOnly) {
		dojo.byId("instructions").style.display = "none";
		HideBaseMapLayerContainer();
		HideShareAppContainer();
		dojo.byId("divAddressSearch").style.display = "block";
		dojo.byId("imgSearch").setAttribute("aria-expanded","true");
	}
}

//--Point To Extent------------------------------------------------------|
function pointToExtent(map, point, toleranceInPixel) {
	var pixelWidth = map.extent.getWidth() / map.width;
	var toleranceInMapCoords = toleranceInPixel * pixelWidth;
	return new esri.geometry.Extent(point.x - toleranceInMapCoords, point.y - toleranceInMapCoords, point.x + toleranceInMapCoords, point.y + toleranceInMapCoords, map.spatialReference);
}