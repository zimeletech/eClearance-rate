sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/BusyIndicator"
], function(Controller, MessageToast, MessageBox, BusyIndicator) {
	"use strict";

	return Controller.extend("clearance_portal.controller.Startpage", {
		onInit: function() {},
		onNavToWizard: function() {
			this.getRouter().navTo("wizard");
		},
		onNavToLogQuery: function() {
			this.getRouter().navTo("logquery");
		},
		onNavToStartpage: function() {
			this.getRouter().navTo("login");
		},
		onNavToMemo: function() {
			this.getRouter().navTo("memo");
		},
		onNavToHistory: function() {
			this.getRouter().navTo("history");
		},
		onNavToDraft: function() {
			this.getRouter().navTo("draft");
		},
		onNavToRewewals: function() {
			this.getRouter().navTo("renewals");
		},
		onNavToRefunds: function() {
			this.getRouter().navTo("refunds");
		},
		onNavToBankmain: function() {
			this.getRouter().navTo("bankmain");
		},
		onNavToUsermain: function() {
			this.getRouter().navTo("usermain");
		},
			onNavButtonback: function() {
			this.getRouter().navTo("adminhomeportal");
		},
			onNavButtonback2: function() {
			this.getRouter().navTo("homeportal");
		},
			onNavButtonback3: function() {
			this.getRouter().navTo("userstartpage");
		},
		
		/*onNavToUserPage:function(){
				this.getRouter().navTo("userstartpage");
		},*/
		onNavButtonPressed: function() {
			this.getOwnerComponent().getRouter().navTo("home");
		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		onLogin: function() {
			var username = this.getView().byId("loginuser");
			var user = "ngcebo";

			if (username.getValue() === "") {
				MessageBox.error("Please enter username!");
				return;
			} else {
				if (username.getValue() === user) {
					// MessageBox.success("LogIn Successfull!");
					this.getRouter().navTo("userstartpage");
				} else {
					MessageBox.error("Invalid Username ");
					return;
				}
			}
		},
		add: function() {
			var new_chq_no = parseInt($('#total_chq').val()) + 1;
			var new_input = "<input type='text' id='new_" + new_chq_no + "'>";
			$('#new_chq').append(new_input);
			$('#total_chq').val(new_chq_no);
		},
		remove: function() {
			var last_chq_no = $('#total_chq').val();
			if (last_chq_no > 1) {
				$('#new_' + last_chq_no).remove();
				$('#total_chq').val(last_chq_no - 1);
			}
		}
	});
});