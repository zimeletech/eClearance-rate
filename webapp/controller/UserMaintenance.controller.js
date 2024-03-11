sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/Table",
	"sap/m/Column",
	"sap/m/ColumnListItem",
	"sap/m/Toolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/SearchField",
	"sap/m/OverflowToolbar",
	"sap/m/Image",
	"sap/m/VBox",
	"sap/m/FlexBox",
	"sap/m/Bar",
	"sap/m/Select"
], function(Controller, Fragment, Dialog, Button, MessageBox, JSONModel, Label, Text, Table, Column, ColumnListItem, Toolbar,
	ToolbarSpacer, SearchField, OverflowToolbar, Image, VBox, FlexBox, Bar, Select) {
	"use strict";
	var oDataModel;
	var oGlobalModel;
	var adminUser;

	return Controller.extend("clearance_portal.controller.UserMaintenance", {
		onInit: function() {
			//declare the global model to retrieve admin user details
			oGlobalModel = this.getOwnerComponent().getModel("loginModel");
			//adminUser = oGlobalModel.getProperty("/userDetails");
             adminUser = JSON.parse(localStorage.getItem("userDetails"));
			oDataModel = this.getOwnerComponent().getModel("MyData");

			var initialData = {
				UserType: "",
				UserFisrtname: "",
				Usertitle: "",
				Username: "",
				Usersurname: "",
				UseridType: "",
				UseridNumber: "",
				UsercellNumber: "",
				Usertelephone: "",
				Useremail: "",
				UserhouseNo: "",
				Userstreet: "",
				Usercity: "",
				UserpostalCode: "",
				UserStatus: "Active",
				users: [],
				totalUsers: 0,
				totalAdmins: 0,
				totalContacts: 0,
				totalAuthorizing: 0,
				selectedUserIndex: -1,
				UserisDeleteEnabled: false,
				UserisEditEnabled: false
			};

			// Set the initial data to the model
			this.usersListModel = new JSONModel(initialData);

			this.oFragment = sap.ui.xmlfragment(this.getView().getId(), "clearance_portal.view.AddUserDialog", this); //this is to be changed to refer to the fragment
			this.oFragment.setModel(this.usersListModel, "userList");

			// Set the model to the view with the name 'usersList'
			this.getView().setModel(this.usersListModel, "usersList");
			this.fetchUsers(); // fetch users

		},

		onAddUser: function() {
			if (!this._oDialog) {
				this._oDialog = this.oFragment;
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},

		onCancel: function() {
			this._oDialog.close();
		},
		
		logout:function(){
			this.getOwnerComponent().logout();
		},

		fetchUsers: function() {

			//var path = "/PersonSet('" + adminUser.userCompany + "')";

			var Filter = new sap.ui.model.Filter('Company', 'EQ', adminUser.userCompany);
			// Read data from the OData service
			oDataModel.read("/PersonSet", {
				filters: [Filter],
				success: function(oData) {

					if (oData && oData.results && oData.results.length > 0) {
						var usersListModel = this.getView().getModel("usersList");
						var users = [];
						var Idtype;
						var Role;

						oData.results.forEach(function(userData) {
							if (userData.Type === "FS0001") {
								Idtype = "ID Number";
							} else if (userData.Type === "FS0002") {
								Idtype = "Passport Number";
							}
							if (userData.Bpkind === "ZADM") {
								Role = "Admin";
							} else if (userData.Bpkind === "ZRAT") {
								Role = "Conveyancer";
							}

							users.push({
								UserNameFirst: userData.NameFirst,
								UserNameLast: userData.NameLast,
								UserType: Idtype,
								UserIdnumber: userData.Idnumber,
								UserCountry: "South Africa",
								UserSmtpAddr: userData.SmtpAddr,
								BpType: Role,
								UserUsername: userData.UserUsername,
								UserStatus: "Active"
							});
						});

						usersListModel.setProperty("/users", users);
					} else {
						sap.m.MessageToast.show("No user is currently assigned ");
					}
				}.bind(this),
				error: function() {
					// Handle error
					sap.m.MessageToast.show("Error fetching data");
				}
			});

		},

		onSubmit: function() {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var oModel = this.getView().getModel("usersList");
			var oData = oModel.getData();
			var newUser = {}; //Object to store all new user details
			newUser.Bpkind = oData.UserType;
			newUser.Title = oData.Usertitle;
			newUser.Initials = oData.UserInitials;
			newUser.Gender = oData.UserGender;
			newUser.NameFirst = oData.UserFirstname;
			newUser.UserUsername = oData.Username;
			newUser.NameLast = oData.Usersurname;
			newUser.Type = oData.UseridType;
			newUser.Idnumber = oData.UseridNumber;
			newUser.TelNumber = oData.UsercellNumber;
			newUser.SmtpAddr = oData.Useremail;
			newUser.HouseNum1 = oData.UserhouseNo;
			newUser.Addrnumber = oData.UserhouseNo;
			newUser.Street = oData.Userstreet;
			newUser.City1 = oData.Usercity;
			newUser.City2 = oData.Usercity;
			newUser.PostCode1 = oData.UserpostalCode;
			newUser.PostCode2 = oData.UserpostalCode;
			newUser.PoBox = oData.UserpostalCode;
			newUser.Company = adminUser.userCompany;
			newUser.Country = "ZA";
			//UserStatus: "Active" // Assuming new users are always active
			oDataModel.create('/PersonSet', newUser, {
				success: function() {
					sap.m.MessageToast.show("New User created");

					that._oDialog.close();
					that.fetchUsers(); // fetch users
					oModel.refresh();
					sap.ui.core.BusyIndicator.hide();
				},
				error: function() {
					// Handle error
					sap.m.MessageToast.show("Error Adding New User");
					that._oDialog.close();
					sap.ui.core.BusyIndicator.hide();
				}
			});

			//oModel.setProperty("/users", oData.users);

			oModel.setProperty("/UserType", "");
			oModel.setProperty("/UserGender", "");
			oModel.setProperty("/Usertitle", "");
			oModel.setProperty("/UserFirstname", "");
			oModel.setProperty("/Username", "");
			oModel.setProperty("/Usersurname", "");
			oModel.setProperty("/UseridType", "");
			oModel.setProperty("/UseridNumber", "");
			oModel.setProperty("/UsercellNumber", "");
			oModel.setProperty("/UserInitials", "");
			oModel.setProperty("/Useremail", "");
			oModel.setProperty("/UserhouseNo", "");
			oModel.setProperty("/Userstreet", "");
			oModel.setProperty("/Usercity", "");
			oModel.setProperty("/UserpostalCode", "");
			this.oFragment.setModel(oModel, "userList");

		},

		onActivate: function() {
			this._changeUserStatus("Active");
		},

		onDeactivate: function() {
			this._changeUserStatus("Inactive");
		},

		_changeUserStatus: function(newStatus) {
			var oModel = this.getView().getModel("usersList");
			var oData = oModel.getData();
			var aSelectedItems = this.byId("userTable").getSelectedItems();

			if (aSelectedItems.length === 0) {
				return;
			}

			for (var i = 0; i < aSelectedItems.length; i++) {
				var iIndex = this.byId("userTable").indexOfItem(aSelectedItems[i]);
				var selectedUser = oData.users[iIndex];

				selectedUser.UserStatus = newStatus;
			}

			oModel.setProperty("/users", oData.users);
			this.byId("userTable").removeSelections();
		},

		onSelectionChange: function(oEvent) {
			var oTable = oEvent.getSource();
			var aSelectedItems = oTable.getSelectedItems();
			var bIsDeleteEnabled = aSelectedItems.length > 0;
			var bIsEditEnabled = aSelectedItems.length === 1;

			var oModel = this.getView().getModel();
			oModel.setProperty("/selectedUserIndex", bIsEditEnabled ? oTable.indexOfItem(aSelectedItems[0]) : -1);
			oModel.setProperty("/UserisDeleteEnabled", bIsDeleteEnabled);
			oModel.setProperty("/UserisEditEnabled", bIsEditEnabled);
		},

		handleSortButtonPressed: function() {

			var oTable = this.byId("userTable");
			var oBinding = oTable.getBinding("items");

			// Toggle sorting order (ascending or descending)
			var bDescending = !oBinding.aSorters[0] || !oBinding.aSorters[0].bDescending;

			// Apply sorting to the "UserFirstname" column (you can modify this based on your requirements)
			oBinding.sort(new sap.ui.model.Sorter("UserNameFirst", bDescending));

		},

		handleFilterButtonPressed: function() {
			var oTable = this.byId("userTable");
			var oBinding = oTable.getBinding("items");

			// Open a filter dialog
			var sUniqueId = new Date().getTime(); // Generate a unique ID using timestamp
			var sStatusFilterId = "statusFilter_" + sUniqueId;
			var sRoleFilterId = "roleFilter_" + sUniqueId;

			var oFilterDialog = new Dialog({
				title: "Filter Users",
				content: [
					new Label({
						text: "Status"
					}),
					new Select({
						id: sStatusFilterId,
						items: [
							new sap.ui.core.Item({
								key: "",
								text: "All"
							}),
							new sap.ui.core.Item({
								key: "Active",
								text: "Active"
							}),
							new sap.ui.core.Item({
								key: "Inactive",
								text: "Inactive"
							})
						]
					}),
					new Label({
						text: "Role"
					}),
					new Select({
						id: sRoleFilterId,
						items: [
							new sap.ui.core.Item({
								key: "",
								text: "All"
							}),
							new sap.ui.core.Item({
								key: "Admin",
								text: "Admin"
							}),
							new sap.ui.core.Item({
								key: "Conveyancer",
								text: "Conveyancer"
							})
						]
					})
				],
				beginButton: new Button({
					text: "Apply",
					press: function() {
						var sStatusKey = sap.ui.getCore().byId(sStatusFilterId).getSelectedKey();
						var sRoleKey = sap.ui.getCore().byId(sRoleFilterId).getSelectedKey();

						var aFilters = [];

						// Add status filter if selected
						if (sStatusKey) {
							aFilters.push(new sap.ui.model.Filter("UserStatus", sap.ui.model.FilterOperator.EQ, sStatusKey));
						}

						// Add role filter if selected
						if (sRoleKey) {
							aFilters.push(new sap.ui.model.Filter("BpType", sap.ui.model.FilterOperator.EQ, sRoleKey));
						}

						// Apply filters
						oBinding.filter(aFilters.length > 0 ? aFilters : null);

						oFilterDialog.close();
					}
				}),
				endButton: new Button({
					text: "Reset",
					press: function() {
						// Clear all filters
						oBinding.filter([]);

						// Reset the filter dropdowns to their initial state
						sap.ui.getCore().byId(sStatusFilterId).setSelectedKey("");
						sap.ui.getCore().byId(sRoleFilterId).setSelectedKey("");
						oFilterDialog.close();
					}
				})
			});

			oFilterDialog.open();
		},

		onSearch: function(oEvent) {
			var oTable = this.byId("userTable");
			var oBinding = oTable.getBinding("items");

			// Get the search value directly from the event
			var sSearchValue = oEvent.getParameter("newValue").toLowerCase(); // Convert to lowercase for case-insensitive search

			if (sSearchValue) {
				var aFilters = [
					new sap.ui.model.Filter("UserNameFirst", sap.ui.model.FilterOperator.Contains, sSearchValue),
					new sap.ui.model.Filter("UserUsername", sap.ui.model.FilterOperator.Contains, sSearchValue),
					new sap.ui.model.Filter("UserNameLast", sap.ui.model.FilterOperator.Contains, sSearchValue),
					new sap.ui.model.Filter("UserIdnumber", sap.ui.model.FilterOperator.Contains, sSearchValue),
					new sap.ui.model.Filter("UserSmtpAddr", sap.ui.model.FilterOperator.Contains, sSearchValue)

				];
				oBinding.filter(new sap.ui.model.Filter(aFilters, false)); // Combine filters with OR condition
			} else {
				oBinding.filter([]);
			}
		}
	});
});