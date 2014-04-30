/*FRANÇAIS
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | Citizen Service Request v10.2.0.2 / Demande de service municipal v10.2.0.2
 | This file was written by Esri Canada - Copyright 2014 Esri Canada
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

define({
	splashClose: /*Fermer écran de garde*/ "OK",
	closeWindow: /*Fermer fenêtre*/ "Fermer fenêtre",
	submitButton: /*Boutton soumettre*/ "Soumettre",
	cancelButton: /*Boutton annuler*/ "Annuler",
	changeBasemap: /*Changer le fond de carte*/ "Changer le fond de carte à",
	basemapActiveIndicator: /*Indicateur de carte active*/ "actif",
	
	//Bar d'outil
	searchTooltip: /*Infobulle Recherche*/ "Rechercher par adresse ou par numéro de demande",
	searchLegend: /*Légende Recherche*/ "Rechercher pour:",
	searchButton: /*Boutton Recherche*/ "Rechercher",
	geolocateTooltip: /*Infobulle Geolocaliser*/ "Géolocaliser",
	basemapTooltip: /*Infobulle fond de carte*/ "Fond de carte",
	shareTooltip: /*Infobulle partage*/ "Partager",
	shareTitle: /*Titre Partage*/ "Partager cet carte",
	facebookTooltip: /*Infobulle Facebook*/ "Partager sur Facebook",
	twitterTooltip: /*Infobulle Twitter*/ "Partager sur Twitter",
	emailTooltip: /*Infobulle courriel*/ "Partager par courriel",
	helpTooltip: /*Infobulle aide*/ "Aide",
	
	//Fenêtre-info de nouvelle demande
	newRequestHeader: /*Titre Nouvelle Demande*/ "Détails de la demande de service",
	typeLabel: /*Étiquette type*/ "Type:",
	commentLabel: /*Étiquette commentaire*/ "Commentaire:",
	nameLabel: /*Étiquette nom*/ "Nom:",
	phoneLabel: /*Étiquette téléphone*/ "Téléphone:",
	emailLabel: /*Étiquette courriel*/ "Courriel",
	attachLabel: /*Étiquette fichier joint*/ "Joindre image:",
	
	//Fenêtre-info d'affichage des demandes et commentaires
	viewRequest: /*Afficher Demande*/ "Retourner à la demande",
	mobileSubmit: /*Soumettre Mobile*/ "Soumettre détails",
	viewComments: /*Afficher commentaires*/ "Commentaires",
	addComment: /*Ajouter commentaire*/ "Ajouter un commentaire",
	ratingTitle: /*Titre classement*/ "Classement",
	commentTitle: /*Titre commentaire*/ "Commentaire",
	noComments: /*Aucun commentaire*/ "Aucun commentaire",
	attachTitle: /*Titre pièce jointe*/ "Pièce jointe:",
	noAttachment: /*Aucune pièce jointe*/ "Aucune pièce jointe",
	dateLabel: /*Étiquette Date*/ "Date:",
	ratioOfFive: /*rapport sur cinq*/ "sur 5",
	
	//Instructions
	instrTitle: /*Titre des instructions*/ "Afin de créer une nouvelle demande de service:",
	instrHTML: /*HTML des instructions*/ "<ol><li>Identifiez votre emplacement en recherchant pour une adresse (bar-d’outils) ou cliquez sur la carte.</li><li>Remplissez et soumettez le formulaire de demande de service.</li></ol>",
	staffMode: /*Mode du personnel*/ "Mode du personnel actif",
	
	//Accessible Map (only visible when accessing map with keyboard and/or screen reader)
	//Carte accessible (seulement visible lorsque la carte est accéddée avec le clavier ou un lecteur d'écran)
	mapAria /*Instructions de la carte pour les aveugles*/: "Carte des demandes de service actuelles. Si vous venez de compléter une recherche pour une adresse, appuyez la touche retour afin de créer une demande de service à cet endroit. Si vous venez de compléter une recherche pour une demande de service, continuez à utiliser la touche Tab afin de vous rendre au panneau d’information sur la demande.",
	/*Navigation de la carte avec le clavier*/
	kmnTitle: /*Titre*/ "Naviguer la carte avec le clavier",
	kmnAlt: /*Text alternatif*/ "Disposition du pavé numérique",
	kmnCaption: /*Sous-titre*/ "Pour naviguer la carte avec le clavier, utilisez le pavé numérique. Utilisez les touches <strong>numériques</strong> afin de déplacer la carte, <strong>plus</strong> afin de faire un zoom-avant, <strong>moins</strong> afin de faire un zoom-arrière et <strong>Retour</strong> afin de faire un clique sur la carte à l'endroit du réticule."
});