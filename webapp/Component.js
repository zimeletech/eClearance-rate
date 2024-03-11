sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"clearance_portal/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("clearance_portal.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// Check if local storage contains data indicating a user is logged in
			var isLoggedIn = localStorage.getItem("isLoggedIn");
			var userDetails = localStorage.getItem("userDetails");
			// Create and set the global model
			var oGlobalModel = new sap.ui.model.json.JSONModel({
				isLoggedIn: isLoggedIn || false, // Set isLoggedIn flag based on local storage or default to false
				userDetails: userDetails || {} // Initialize userDetails as an empty object
			});
			this.setModel(oGlobalModel, "loginModel");

			// Call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			// If user is not logged in, redirect to login page
			if (!isLoggedIn) {
				this.getRouter().navTo("login");
			}
		},

		/**
		 * Function to handle logout
		 * Clears isLoggedIn flag and user details from local storage
		 * Redirects to login page
		 */
		logout: function() {
			// Clear isLoggedIn flag and user details from local storage
			localStorage.removeItem("isLoggedIn");
			localStorage.removeItem("userDetails");

			// Redirect to the logout or login page
			// For example, navigate to the login page
			this.getRouter().navTo("login");
		},
		loggedIn: function(globalModel) {
			// Check if isLoggedIn and userDetails are not already set in localStorage
			if (!localStorage.getItem("isLoggedIn") || !localStorage.getItem("userDetails")) {
				localStorage.setItem("isLoggedIn", globalModel.getProperty("/isLoggedIn"));
				localStorage.setItem("userDetails", JSON.stringify(globalModel.getProperty("/userDetails")));
			} else {
				// If already set in localStorage, update the global model properties
				if (localStorage.getItem("userDetails") !== JSON.stringify(globalModel.getProperty("/userDetails"))) {
					localStorage.setItem("userDetails", JSON.stringify(globalModel.getProperty("/userDetails")));
				}
				globalModel.setProperty("/isLoggedIn", localStorage.getItem("isLoggedIn"));
				globalModel.setProperty("/userDetails", JSON.parse(localStorage.getItem("userDetails")));
			}

		}

	});
});