/*global dojo */
/*ENGLISH
 | Version 10.2
 | Copyright 2012 Esri
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | Citizen Service Request v10.2.0.2 / Demande de service municipal v10.2.0.2
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
dojo.provide("js.config");
dojo.declare("js.config", null, {

    // This file contains various configuration settings for "Service Request" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application Name and Title         - [ Tag(s) to look for: ApplicationName, ApplicationTitle ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    // 5.  Specify URLs for base maps                 - [ Tag(s) to look for: BaseMapLayers ]
    // 5a. Specify URLs for any reference overlays    - [ Tag(s) to look for: ReferenceOverlays ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]

    // 7.  Tags for using map services:
    // 7a. Specify URLs for operational layers        - [ Tag(s) to look for: serviceRequestLayerURL, serviceRequestmobileLayerURL, serviceRequestCommentsLayerURL,RequestId,CommentId ]
    //
    // 7b. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoWindowContent ]
    // 7c. Customize info-Popup settings              - [ Tag(s) to look for: infoWindowData, Status, ShowCommentsTab, AllowAttachments ]
    // 7d. Customize info-Popup size                  - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    // 7e. Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs, FormatDateAs ]
    // 8a. Customize address search settings          - [ Tag(s) to look for: LocatorRippleSize, RippleColor, LocatorSettings ]
    // 8b. Customize Database fields 				  - [ Tag(s) to look for: DatabaseFields, ServiceRequestFields, CommentsInfoPopupFieldsCollection ]
    // 9.  Set URL for geometry service               - [ Tag(s) to look for: GeometryService ]
    // 10. Customize Language Toggle Button           - [ Tag(s) to look for: LanguageButton ]
    // 11.Specify URLs for map sharing                - [ Tag(s) to look for: MapSharingOptions ]



    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title
    ApplicationName: "Citizen Service Request - v2Dev",
    ApplicationTitle: "Citizen Service Request - v2Dev",
	//To meet WCAG 2.0 accessibility standards, the Window Title must also be changed in index.htm

    // Set application icon path
    ApplicationIcon: "images/logo.png",

    // Set splash window content - Message that appears when the application starts
    SplashScreenMessage: "<strong>Submit a Request for Service</strong><hr><br>Please search for an address or click directly on the map to locate your request for service. Then, provide additional detail and submit to initiate your request.<br><br>If you find a request has already been submitted, you can click or tap on the existing request, provide additional comments and increase the importance of the request.",

    // Set URL of help page/portal
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All base maps need to use the same spatial reference. By default, on application start the first basemap will be loaded

    BaseMapLayers: [{
        Key: "topographic",
        ThumbnailSource: "images/basemap_topo.png",
        Name: "Topographic",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"

    }, {
        Key: "imagery",
        ThumbnailSource: "images/basemap_imagery.png",
        Name: "Imagery",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }],
    //This section allows you to add a feature or map service layer, it must be an layer, not a service
    //use the following format {URL: ""},{URL: ""},...
    ReferenceOverlays: [
    ],

    // Initial map extent. Use comma (,) to separate values and don t delete the last comma
	// Coordonates should be in WGS84 Web Mercator metres (left, top, right, bottom).
    DefaultExtent: "-8846570,5405896,-8824595,5436318",


    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Configure operational layers:

    OperationalLayers: {
        //URL used for doing query task on the ServiceRequest layer (If using Secured Schema, use query feature service)
        ServiceRequestLayerURL: "http://yourserver:6080/arcgis/rest/services/ServiceRequest_Query/FeatureServer/0",
		ServiceRequestMobileLayerURL: "http://yourserver:6080/arcgis/rest/services/ServiceRequest_Query/FeatureServer/0",
		//URL used for doing updates to the ServiceRequest layer (If using Simple schema, use same as above; If using Secure schema, use update feature service)
		ServiceRequestUpdateURL: "http://yourserver:6080/arcgis/rest/services/ServiceRequest_Update/FeatureServer/0",
        //Set the primary key attribute for servicerequest
        RequestId: "${REQUESTID}",
		//Default Status (Status to be set on comment submit)
		DefaultStatus: "Unassigned",

        

        //URL used for doing query task on the comments layer (If using Secured schema, use query feature service)
        ServiceRequestCommentsLayerURL: "http://yourserver:6080/arcgis/rest/services/ServiceRequest_Query/FeatureServer/1",
        //Set the primary key attribute for the comments
        CommentId: "${REQUESTID}"

    },

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-WINDOW SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Info-window is a small, two line popup that gets displayed on selecting a feature
    // Set Info-window title. Configure this with text/fields
    InfoWindowHeader: "Request ID: ${REQUESTID}",

    // Choose content/fields for the info window
    InfoWindowContent: "${REQUESTTYPE}",

    //Define Service request layer name
    RequestLayerName: "REQUESTTYPE",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
	
	// Disable input boxes (do not request info from user, store null value in data)
	DisableFields: {Name: false, Phone: false, Email: false, Attach: false},
	
	// Service Request Type List
	// If useDomain is true, it will read the service request types from the service request feature class domain
	// If useDomain is false, it will use the reqList types (if only one item is included, it will be selected when creating a request)
	RequestTypes: {
		useDomain: true,
		reqList: ["Potholes","Graffiti","Tree Maintenance"]
	},

    // Info-popup is a popup dialog that gets displayed on selecting a feature
    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats
    InfoWindowData: [{
        DisplayText: "Type:",
        AttributeValue: "${REQUESTTYPE}",
        DataType: "string",
		isComment: false
    }, {
        DisplayText: "Comment:",
        AttributeValue: "${COMMENTS}",
        DataType: "string",
		isComment: true
    }, {
        DisplayText: "Date Submitted:",
        AttributeValue: "${REQUESTDATE}",
        DataType: "date",
		isComment: false
    }, {
        DisplayText: "Status:",
        AttributeValue: "${STATUS}",
        DataType: "string",
		isComment: false
    }],
	
	//Set the attribute for displaying status of serviceRequest
    Status: "${STATUS}",

    // Set this to true to show "Comments" tab in the info-Popup
    ShowCommentsTab: true,

    // Set this to true to show the Attach portion of the info-popup
    AllowAttachments: true,

    // Set size of the info-Popup - select maximum height and width in pixels (not applicable for tabbed info-Popup)
    //minimum height should be 270 for the info-popup in pixels
    InfoPopupHeight: 360,

    //minimum width should be 330 for the info-popup in pixels
    InfoPopupWidth: 330,

    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",

    // Set date format
    FormatDateAs: "MMM dd, yyyy",

    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
	
	//Set the locator ripple size
    LocatorRippleSize: 30,

    //set ripple colour for selected feature
    RippleColor: [60, 72, 36],

    // Set locator settings such as locator symbol, size, zoom level, display fields, match score

    LocatorSettings: {
        DefaultLocatorSymbol: "images/redpushpin.png",
        MarkupSymbolSize: {
            width: 35,
            height: 35
        },
        Locators: [{
			//Address Locator
			DisplayText: "Search for an address",
			LabelText: "Address",
			Example: "Try searching for a street address such as '12 Concorde Place'",
			LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			LocatorParamaters: ["SingleLine"],
			CandidateFields: "Loc_name, Score, Match_addr",
			DisplayFieldCML2: "Match_addr",
			ZoomLevel: 16,
			AddressMatchScore: 80,
			LocatorFieldName: 'Loc_name',
			LocatorFieldValues: ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
			//CanMod: Set the extent to be used when searching for an address, set wkid to 0000 in order to search whole of North America
			//CGS_WGS_1984: Use wkid 4326 and decimal degrees; WGS_1984_Web_Mercator: Use wkid 3785 and metres; Other systems not supported
			SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
        }, {
			//Service Request Locator
            DisplayText: "Search for a request ID",
			LabelText: "Request",
            Example: "Request ID's are 7 digit numbers",
            QueryString: "REQUESTID = '${0}'",
            DisplayField: "${REQUESTID}"
        }]
    },

    // Define the database field names
    // Note: DateFieldName refers to a date database field.
    // All other attributes refer to text database fields.
    DatabaseFields: {
        RequestIdFieldName: "REQUESTID",
        CommentsFieldName: "COMMENTS",
        DateFieldName: "SUBMITDT",
        RankFieldName: "RANK"
    },

    //Define service request input fields for submitting a new request
    ServiceRequestFields: {
        RequestIdFieldName: "REQUESTID",
        RequestTypeFieldName: "REQUESTTYPE",
        CommentsFieldName: "COMMENTS",
        NameFieldName: "NAME",
        PhoneFieldName: "PHONE",
        EmailFieldName: "EMAIL",
        StatusFieldName: "STATUS",
        RequestDateFieldName: "REQUESTDATE"
    },

    // Set info-pop fields for adding and displaying comment
    CommentsInfoPopupFieldsCollection: {
        Rank: "${RANK}",
        SubmitDate: "${SUBMITDT}",
        Comments: "${COMMENTS}"
    },
    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Set geometry service URL
    GeometryService: "http://yourserver:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
			
	// ------------------------------------------------------------------------------------------------------------------------
	// LANGUAGE TOGGLE BUTTON
	// ------------------------------------------------------------------------------------------------------------------------
	// Allows you to include a toggle button in the toolbar to switch between two version of the application
	LanguageButton: {
		Enabled: false,
		Image: "images/language_FR.png",
		Title: "Switch to French Application",
		AppURL: "http://yourserver/ArcGIS_CM/CitizenServiceRequest/FR/"
	},
			
	// ------------------------------------------------------------------------------------------------------------------------
	// STAFF MODE
	// ------------------------------------------------------------------------------------------------------------------------
	// Staff mode allows tracking of calls logged by call centre staff by appending a short string to the Request ID
	// Once enabled, it can be accessed by adding "?mode=" plus the modifier set below to the end of the URL (e.g. http://mycity.ca/servicerequests/?mode=staff)
	StaffMode: {
		Enabled: true,
		Modifier: "staff",
		IDSuffix: "-S"
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------

    // Set URL for TinyURL service, and URLs for social media
    MapSharingOptions:
	{
		TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
		TinyURLResponseAttribute: "data.url",

		//Set the default settings when sharing the app; Leave an empty set of quotation marks when a setting is not required.
		//The language displayed by the APIs is determined by the website and cannot be changed

		//FacebookText: Facebook has removed the option to include text. The user will instead by prompted for his own comment.

		TwitterText: "Citizen Service Request", //The text that will be added to the tweet
		TwitterHashtag: "esricanada", //Hashtag to append to the tweet (e.g. CityOfToronto).
		TwitterFollow: "EsriCanada", //Allows user to follow a Twitter account (e.g. the municipalities twitter account).

		EmailSubject: "Citizen Service Request",

		FacebookShareURL: "http://www.facebook.com/sharer.php",
		TwitterShareURL: "http://twitter.com/share"
	}
});
