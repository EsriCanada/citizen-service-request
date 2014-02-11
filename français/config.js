/*global dojo */
/* FRANÇAIS
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
dojo.provide("js.config");
dojo.declare("js.config", null, {

    // Ce fichier contient divers options permettant de configurer l'application Demande de services municipaux
    //
    // Utilisez ce fichier afin de configurer:
    //
    // 1.  Le titre de l'application                   - [ Balise(s) HTML: ApplicationName, ApplicationTitle ]
    // 2.  Le chemin vers l'îcone                      - [ Balise(s) HTML: ApplicationIcon ]
    // 3.  Le message de l'écran de garde              - [ Balise(s) HTML: SplashScreenMessage ]
    // 4.  L'URL pour la page d'aide                   - [ Balise(s) HTML: HelpURL ]
    // 5.  Les URL pour les fonds de carte             - [ Balise(s) HTML: BaseMapLayers ]
    // 5a. Les URL pour les couches de recouvrement    - [ Balise(s) HTML: ReferenceOverlays ]
    // 6.  L'étendue initiale de la carte              - [ Balise(s) HTML: DefaultExtent ]

    // 7.  Les services de carte:
    // 7a. Les URL pour les couches opérationelles     - [ Balise(s) HTML: serviceRequestLayerURL, serviceRequestmobileLayerURL, serviceRequestCommentsLayerURL,RequestId,CommentId ]
    //
    // 7b. Les fenêtres infos                          - [ Balise(s) HTML: InfoWindowHeader, InfoWindowContent ]
    // 7c. Les fenêtres contextuelles                  - [ Balise(s) HTML: infoWindowData, Status, ShowCommentsTab, AllowAttachments ]
    // 7d. Taille des fenêtres contextuelles           - [ Balise(s) HTML: InfoPopupHeight, InfoPopupWidth ]
    // 7e. Le format des données                       - [ Balise(s) HTML: ShowNullValueAs, FormatDateAs ]
    // 8a. La recherche par address et demande         - [ Balise(s) HTML: LocatorRippleSize, RippleColor, LocatorSettings ]
    // 8b. Les champs de la base de données 	       - [ Balise(s) HTML: DatabaseFields, ServiceRequestFields, CommentsInfoPopupFieldsCollection ]
    // 9.  Le service de géométrie                     - [ Balise(s) HTML: GeometryService ]
    // 10. Le bouton à bascule de la langue            - [ Balise(s) HTML: LanguageButton ]
    // 11. Le partage de la carte                      - [ Balise(s) HTML: MapSharingOptions ]



    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION GÉNÉRALE
    // ------------------------------------------------------------------------------------------------------------------------
    // Titre de l'application
    ApplicationName: /*Nom de l'application*/ "Demande de service municipal",
    ApplicationTitle: /*Titre de la fenêtre*/ "Demande de service municipal",
	//Afin de satisfaire les normes WCAG 2.0 concernant l'accès, le titre de l'application doit aussi être spécifié dans index.htm

    // Chemin vers l'icône de l'application
    ApplicationIcon: "images/logo.png",

    // Contenu de l'écran de garde (l'écran qui s'affiche lors du lancement de l'application)
    SplashScreenMessage: "<strong>Placer une demande de service</strong><hr><br>Veuillez chercher pour une adresse ou cliquer directement sur la carte afin d’indiquer l’endroit où vous voulez placer une demande pour service; puis fournissez les détails concernant votre demande.<br><br>Si vous trouvez qu’une demande existe déjà, vous pouvez cliquer ou taper sur cette demande afin d’ajouter un commentaire et augmenter l’importance de la demande.",

    // L'URL de la page/du portail d'aide
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES FONDS DE CARTE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez le couches de fond de carte
    // NB: Tous les cartes de fond doivent avoir la même référence spatiale. Par default, l'application affiche le premier fond de carte.

    BaseMapLayers: [{ /*Couches de fond de carte*/
        Key: /*Clef*/ "topographic",
        ThumbnailSource: /*Imagette*/ "images/basemap_topo.png",
        Name: /*Nom*/ "Topographique",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"

    }, {
        Key: /*Clef*/ "imagery",
        ThumbnailSource: /*Imagette*/ "images/basemap_imagery.png",
        Name: /*Nom*/ "Imagerie",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }],
	
	// Couche de recouvrement: doit être une couche et non un service
	// Utilisez le format suivant {URL: ""},{URL: ""},...
    ReferenceOverlays: [
    ],

    // Étendu initiale de la carte. Utilisez une virgule afin de séparer chaque valeur (ne supprimez pas la dernière virgule).
	// Les coordonnées devraient être en mètres WGS84 Web Mercator. (gauche, haut, droite, bas)
    DefaultExtent: "-8846570,5405896,-8824595,5436318",


    // ------------------------------------------------------------------------------------------------------------------------
    // COUCHES OPÉRATIONELLES
    // ------------------------------------------------------------------------------------------------------------------------

    // Configurez les couches opérationelles:

    OperationalLayers: {
		//URL de la couche de Demande de service
        ServiceRequestLayerURL: "http://votreserveur:6080/arcgis/rest/services/CitizenRequest/FeatureServer/0",
        //Clef primaire pour la couche de Demande de service
        RequestId: "${REQUESTID}",
		//Stade par default (utilisé lors de la création de nouveau commentaire)
		DefaultStatus: "Non attribué",

        ServiceRequestMobileLayerURL: /*Demande de service mobile*/ "http://votreserveur:6080/arcgis/rest/services/CitizenRequest/FeatureServer/0",

        //URL pour la couche de commentaires
        ServiceRequestCommentsLayerURL: "http://votreserveur:6080/arcgis/rest/services/CitizenRequest/FeatureServer/1",
        //Clef primaire pour la table de commentaire (Doit s’agencer avec la clef primaire Demande de service)
        CommentId: "${REQUESTID}"

    },

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES FENÊTRES INFOS
    // ------------------------------------------------------------------------------------------------------------------------

    // La fenêtre infos est affiché lorqu'un point est sélectionné sur la carte mobile
    // Titre de la fenêtre info (Champ et/ou texte)
    InfoWindowHeader: "# de demande: ${REQUESTID}",

	// Contenue/champ de la fenêtre info
    InfoWindowContent: "${REQUESTTYPE}",

	//Nom de la couche de Demande de service
    RequestLayerName: "REQUESTTYPE",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES FENÊTRES CONTEXTUELLES
    // ------------------------------------------------------------------------------------------------------------------------
	
	// Désactiver les champs de saissie (ne pas demander cette information au près des utilisateurs, enregistrer une valeur Null dans les données)
	DisableFields: {Name: /*Nom*/ false, Phone: /*Téléphone*/ false, Email: /*Courriel*/ false, Attach: /*Pièce jointe*/ false},

	// La fenêtre contextuelle est affiché lorsqu'un point est sélectionné (sur mobile: lorsque la fenêtre info est agrandi)
	// Configurez le contenue à affiché dans la fenêtre contextuelle.
    InfoWindowData: [{
        DisplayText: /*Texte d'affichage*/ "Type:",
        AttributeValue: /*Valeur de l'attribut*/ "${REQUESTTYPE}",
        DataType: /*Type de donnée*/ "string",
		isComment: /*Est un commentaire*/ false
    }, {
        DisplayText: "Commentaire:",
        AttributeValue: "${COMMENTS}",
        DataType: "string",
		isComment: true
    }, {
        DisplayText: "Date:",
        AttributeValue: "${REQUESTDATE}",
        DataType: "date",
		isComment: false
    }, {
        DisplayText: "Phase:",
        AttributeValue: "${STATUS}",
        DataType: "string",
		isComment: false
    }],
	
	//Configurer l'attibut pour affiché la phase de la demande
    Status: "${STATUS}",

	//Activer l'option des commentaires
    ShowCommentsTab: true,

    //Activer l'option des pièces jointes
    AllowAttachments: true,

	//Configurez la taille des fenêtres contextuelles en pixels
	//Hauteur minimal de 270
    InfoPopupHeight: 360,
    //Largeur minimal de 330
    InfoPopupWidth: 330,

    //Le texte utilisé pour remplacer les données nulles
    ShowNullValueAs: "S.O.",

    //Configurez le format des dates (utilise le formatage des dates DOJO)
    FormatDateAs: "dd MMM yyyy",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DE LA RECHERCHE PAR ADRESSE ET DEMANDE DE SERVICE
    // ------------------------------------------------------------------------------------------------------------------------
	
	//Taille de l'anneau de sélection
    LocatorRippleSize: 30,

    //Couleur de l'anneau de sélection
    RippleColor: [60, 72, 36],

    //Configurez les paramètres du service localisateur d'adresse et de la requête de demande

    LocatorSettings: {
        DefaultLocatorSymbol: /*Symbole de localisation*/ "images/redpushpin.png",
        MarkupSymbolSize: { /*Taille du symbole*/
            width: /*largeur*/ 35,
            height: /*hauteur*/ 35
        },
        Locators: [{
			//Localisateur par adresse
			DisplayText: /*Texte d'affichage*/ "Rechercher pour une adresse",
			LabelText: /*Texte de l'étiquette*/ "Adresse",
			Example: /*Exemple*/ "Essayez de recherché une adresse tel que «12 Place Concorde»",
			LocatorURL: /*URL du localisateur*/ "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			LocatorParamaters: /*Paramètre du localisateur*/ ["SingleLine"],
			CandidateFields: /*Champs candidates*/ "Loc_name, Score, Match_addr",
			DisplayFieldCML2: /*Champ d'affichage*/ "Match_addr",
			ZoomLevel: /*Niveau du zoom*/ 16,
			AddressMatchScore: /*Score d'appariement minimum*/ 80,
			LocatorFieldName: /*Nom du champ du localisateur*/ 'Loc_name',
			LocatorFieldValues: /*Valeur du champ du localisateur*/ ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
			//Configurez l'étendue utilisé lors d'une recherche par adresse; saisissez un wkid de 0000 afin
			//de chercher l'Amérique du Nord en entier. CGS_WGS_1984: Utilisez wkid 4326 et des degrées décimaux;
			//WGS_1984_Web_Mercator: Utilisez wkid 3785 et des mètres; Aucun autre système accepté.
			SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
        }, {
			//Localisateur de Demande de service
            DisplayText: /*Texte d'affichage*/ "Rechercher pour une demande",
			LabelText: /*Texte de l'étiquette*/ "Demande",
            Example: /*Exemple*/ "Les numéros de demande consistent de 7 chiffres",
            QueryString: /*Requête utilisé pour trouver la demande*/ "REQUESTID = '${0}'",
            DisplayField: /*Champ d'affichage*/ "${REQUESTID}"
        }]
    },

	// Configurez les champs de la base de données
	// NB: DateFieldName renvoie au champ de type date de la base de données
    // Tout autres champs renvoie au champs textes
    DatabaseFields: {
        RequestIdFieldName: /*Identifiant de la requête*/ "REQUESTID",
        CommentsFieldName: /*Commentaires*/ "COMMENTS",
        DateFieldName: /*Date*/ "SUBMITDT",
        RankFieldName: /*Classement*/ "RANK"
    },

	//Configurez les champs de Demande de service lorsqu'une nouvelle demande est créer
    ServiceRequestFields: {
        RequestIdFieldName: /*Identifiant de la requête*/ "REQUESTID",
        RequestTypeFieldName: /*Type de requête*/ "REQUESTTYPE",
        CommentsFieldName: /*Commentaire*/ "COMMENTS",
        NameFieldName: /*Nom*/ "NAME",
        PhoneFieldName: /*Téléphone*/ "PHONE",
        EmailFieldName: /*Courriel*/ "EMAIL",
        StatusFieldName: /*Phase*/ "STATUS",
        RequestDateFieldName: /*Date de la demande*/ "REQUESTDATE"
    },

	// Configurez les champs pour ajouter et affiché les commentaires
    CommentsInfoPopupFieldsCollection: {
        Rank: /*Classement*/ "${RANK}",
        SubmitDate: /*Date*/ "${SUBMITDT}",
        Comments: /*Commentaire*/ "${COMMENTS}"
    },
    // ------------------------------------------------------------------------------------------------------------------------
    // SERVICE DE GÉOMÉTRIE
    // ------------------------------------------------------------------------------------------------------------------------

    // URL du service de géométrie
    GeometryService: "http://votreserveur:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
			
	// ------------------------------------------------------------------------------------------------------------------------
	// BOUTON DE BASCULE DE LA LANGUE
	// ------------------------------------------------------------------------------------------------------------------------
	// Permet d'inclure un bouton dans la barre d'outils afin de changer d'application
	LanguageButton: {
		Enabled: /*Activé*/ true,
		Image: "images/language_EN.png",
		Title: /*Titre*/ "Afficher l'application en anglais",
		AppURL: /*URL de l'application*/ "http://votreserveur/ArcGIS_CM/CitizenServiceRequest/EN/"
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DU PARTAGE DE LA CARTE
    // ------------------------------------------------------------------------------------------------------------------------

    // Configurez l'URL pour le service TinyURL
    MapSharingOptions:
	{
		TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
		TinyURLResponseAttribute: "data.url",

		//Configurez les paramètres de partage par réseau sociaux; Laissez une paire de guillemets vides lorsqu'un paramètre n'est
		//pas requis. Veuillez noter que la langue des interfaces est déterminé par le site web même et ne peut être changé.

		//FacebookText: Facebook ne permet plus de configurer le texte du bulletin. L'utilisateur seras demander de saisir son propre commentaire.

		TwitterText: "Demande de service municipal", //Le texte qui sera ajouté au tweet
		TwitterHashtag: "esricanada", //Le hashtag qui seras ajouté au tweet (e.g. VilleDeToronto)
		TwitterFollow: "EsriCanada", //L'utilisateur seras invité à suivre ce compte sur Twitter (ex: le compte Twitter de la municipalité).

		EmailSubject: /*Sujet du courriel*/ "Demande de service municipal",

		FacebookShareURL: /*URL de partage de Facebook*/ "http://www.facebook.com/sharer.php",
		TwitterShareURL: /*URL de partage Twitter*/ "http://twitter.com/share"
	}
});
