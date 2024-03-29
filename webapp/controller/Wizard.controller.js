sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/Dialog",
	"sap/m/BusyIndicator"
], function(Controller, JSONModel, MessageToast, MessageBox, BusyIndicator) {
	"use strict";
	var oData;
	var oGlobalModel;
	return Controller.extend("clearance_portal.controller.Wizard", {

		onInit: function() {
			oData = this.getOwnerComponent().getModel("MyData"); // connect to oData
			this._wizard = this.byId("CreateRateClearaneceWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");
			this.firstForm = this.getView().byId("firstForm");
			this.secondForm = this.getView().byId("secondForm");

			// Initialize the model
			this.model = new JSONModel();
			this.model.setData({
				firmNameState: "Error",
				firmTypeState: "Error",
				regNumberState: "Error",
				streetNumberState: "Error",
				streetNameState: "Error",
				cityNameState: "Error",
				districtState: "Error",
				surburbNameState: "Error",
				postalCodeState: "Error",
				postalCodeState2: "Error",
				emailAddressState: "Error",
				telephoneState: "Error",
				cellnumberState: "Error",
				userTitleState: "Error",
				userIdTypeState: "Error",
				userNameState: "Error",
				userSurnameState: "Error",
				useridNumberState: "Error",
				userEmailState: "Error",
				userhouseNoState: "Error",
				userpostalCodeState: "Error",
				userstreetState: "Error",
				userdistrictState: "Error",
				usercityState: "Error",
				userCellphoneState: "Error",
				certNoState: "Error",
				certNameState: "Error",
				dateFromState: "Error",
				dateToState: "Error",
				loginusername: ""

			});
			this.getView().setModel(this.model);
			//this.setModel(oGlobalModel, "loginModel");

		},
		submitData: function(oEvent) {
			var registerModel = this.getView().getModel().getData(); // get all data from the model
			registerModel.dateFrom = registerModel.dateFrom + "T00:00:00";
		    registerModel.dateTo = registerModel.dateTo + "T00:00:00";
			var firmDetails = {}; // Object to store all firm details
			firmDetails.Title = "0003";
			firmDetails.LegalEnty = registerModel.firmType;
			firmDetails.Type = "ZCMREG";
			firmDetails.Banks = "ZA";
			firmDetails.Bankl = "051001";
			firmDetails.Country = "ZA";
			firmDetails.NameOrg1 = registerModel.firmName;
			firmDetails.Idnumber = registerModel.regNumber;
			firmDetails.Street = registerModel.Street_Name;
			firmDetails.StrSuppl1 = registerModel.Surburb;
			firmDetails.Building = registerModel.Complex_name;
			firmDetails.Floor = registerModel.Complex_floor;
			firmDetails.HouseNum1 = registerModel.Street_Number;
			firmDetails.City1 = registerModel.City;
			firmDetails.City2 = registerModel.City2;
			firmDetails.Region = registerModel.Province;
			firmDetails.MobNumber = registerModel.Tel_phone;
			firmDetails.PoBox = registerModel.po_box;
			firmDetails.PostCode1 = registerModel.Postal_Code;
			firmDetails.PostCode2 = registerModel.Postal_Code2;
			firmDetails.TelNumber = registerModel.Tel_phone;
			firmDetails.SmtpAddr = registerModel.email;
			firmDetails.Koinh = registerModel.Bank_Account;
			firmDetails.Accname = registerModel.Bank_Name;
			firmDetails.AccountType = registerModel.Account_Type;
			firmDetails.Bankn = registerModel.Account_number;
			firmDetails.UserTitle = registerModel.Usertitle;
			firmDetails.UserNameFirst = registerModel.Username;
			firmDetails.UserNameLast = registerModel.Usersurname;
			firmDetails.UserInitials = registerModel.UserInitial;
			firmDetails.UserGender = registerModel.Usergender;
			firmDetails.UserType = registerModel.UseridType;
			firmDetails.UserIdnumber = registerModel.UseridNumber;
			firmDetails.UserSmtpAddr = registerModel.Useremail;
			firmDetails.UserTelNumber = registerModel.Usertelephone;
			firmDetails.UserUsername = registerModel.UserName;
			firmDetails.ZzFidelityNumber = registerModel.certNumber;
			firmDetails.ZzFidelityName = registerModel.certName;
			firmDetails.ZzFidelityValid = registerModel.dateFrom;
			firmDetails.ZzFidelityExpiry = registerModel.dateTo;
			var thats = this;
			sap.ui.core.BusyIndicator.show();
			oData.create('/FirmSet', firmDetails, {
				success: function() {
					sap.ui.core.BusyIndicator.hide();
					// Entity created/updated successfully
					MessageBox.show("Successfully registered, details have been sent to your email.", {
						icon: MessageBox.Icon.SUCCESS,
						title: "Firm Successfully created",
						actions: [MessageBox.Action.OK],
						onClose: function() {
							// Clear the data from the model
							thats.getView().getModel().setData([]);

							//navigate to the home page
							var oRouter = sap.ui.core.UIComponent.getRouterFor(thats);
							oRouter.navTo("login"); // Replace "home" with your route or view name
						}.bind(this)
					});
				},
				error: function() {
					// Handle error
					sap.ui.core.BusyIndicator.hide();
					// Handle error
					MessageBox.error("Error creating firm", {
						title: "Error",
						actions: [MessageBox.Action.OK]
					});
				}
			});
		},
		// Function triggered when the "Get OTP" button is clicked
		onGetOTP: function() {
			// Hide the first form
			this.firstForm.setVisible(false);

			// Show the second form
			this.secondForm.setVisible(true);
		},
		// Function triggered when the "Login" button is clicked
		onLogin: function() {
			var thats = this;
			// Get the One-Time Pin entered by the user
			var enteredOTP = this.getView().byId("otpInput").getValue(); // match the id to the otp input id
			var sUsername = this.getView().getModel().getProperty("/loginusername"); // change the code to get username input
			var sPath = "/GenerateOTPSet(Zotp='" + enteredOTP + "',UserUsername='" + sUsername + "')";
			// Check if the entered OTP is valid (this is a placeholder, you would validate it against the generated OTP)
			oData.read(sPath, {
				success: function(oData) {
					//navigate to the home page
					//MessageToast.show("Login");
					//var oRouter = sap.ui.core.UIComponent.getRouterFor(thats);
					//oRouter.navTo("adminhomeportal"); // Replace "home" with your route or view name
					thats.onUserRedirect(sUsername);

				},
				error: function() {
					MessageToast.show("Your OTP is incorrect or expired");
				}
			});

		},

		// Function triggered when the "Cancel" button is clicked
		onCancel: function() {
			// Hide the second form
			this.secondForm.setVisible(false);

			// Show the first form
			this.firstForm.setVisible(true);

			// Clear the OTP input field
			this.getView().byId("otpInput").setValue("");
		},

		//function triggered when the "GET OTP" button is clicked
		onGenerateOTP: function() {
			var sUsername = this.getView().getModel().getProperty("/loginusername"); // change the code to get username input

			// Assuming you have an object to send as the payload for creating data
			var oCreateData = {
				UserUsername: sUsername
			};
			oData.create('/GenerateOTPSet', oCreateData, {
				success: function(aData, response) {
					this.onGetOTP();
				}.bind(this),
				error: function(error) {
					MessageToast.show("Sorry, this Username was not found");
				}
			});
		},
		onUserRedirect: function(Username) {
			var loggedUser = "/GetUsersSet('" + Username + "')";
			// Read data from the OData service
			oData.read(loggedUser, {
				success: function(oData) {
					// Set the data to the JSON model
					var user = oData;

					oGlobalModel = this.getOwnerComponent().getModel("loginModel"); // get global model
					oGlobalModel.setProperty("/userDetails", {
						userType: oData.BpType,
						userTitle: oData.UserTitle,
						userFirstname: oData.UserNameFirst,
						username: oData.UserUsername,
						userLastname: oData.UserNameLast,
						userIdtype: oData.UserType,
						userIdnumber: oData.UserIdnumber,
						userCellnumber: oData.UserTelNumber,
						userEmail: oData.UserSmtpAddr,
						userBp : oData.BpPerson,
						userCompany: oData.BpFirm
					});
					oGlobalModel.setProperty("/isLoggedIn", true);
					this.getOwnerComponent().loggedIn(oGlobalModel);
					//user = oGlobalModel.getProperty("/userDetails");

					if (user.BpType === "ZADM") {
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo("adminhomeportal"); // Replace "home" with your route or view name
					} else {
						var oRoute = sap.ui.core.UIComponent.getRouterFor(this);
						oRoute.navTo("homeportal"); // Replace "home" with your route or view name
					}

				}.bind(this),
				error: function() {
					// Handle error
					sap.m.MessageToast.show("Error fetching Login user");
				}
			});

		},
		onLogoutPress: function() {
			// Access the Component instance
			var oComponent = this.getOwnerComponent();

			// Call the logout function of the Component
			if (oComponent && oComponent.logout) {
				oComponent.logout();
			} else {
				// Handle the case where the logout function is not available
				MessageToast.show("Logout function not available in Component.");
			}
		},
		//Firms Details Validations
		additionalInfoValidation: function() {
			var firmName = this.byId("FirmName").getValue();
			var regNo = parseInt(this.byId("regNumber").getValue());
			var firmType = this.byId("firmType").getSelectedKey();

			if (firmName.length < 4) {
				this._wizard.setCurrentStep(this.byId("FirmDetailsSteps"));
				this.model.setProperty("/firmNameState", "Error");
			} else {
				this.model.setProperty("/firmNameState", "None");
			}
			if (isNaN(regNo)) {
				this._wizard.setCurrentStep(this.byId("FirmDetailsSteps"));
				this.model.setProperty("/regNumberState", "Error");
			} else {
				this.model.setProperty("/regNumberState", "None");
			}
			if (firmType === "") {
				this._wizard.setCurrentStep(this.byId("FirmDetailsSteps"));
				this.model.setProperty("/firmTypeState", "Error");
			} else {
				this.model.setProperty("/firmTypeState", "None");
			}
			// Valitating FirmDetailsSteps
			if (firmName.length < 4 || isNaN(regNo) || firmType === "") {
				this._wizard.invalidateStep(this.byId("FirmDetailsSteps"));
			} else {
				this._wizard.validateStep(this.byId("FirmDetailsSteps"));
			}
		},
		/*regNumberStateFormatter: function (val) {
			return isNaN(val) ? "Error" : "None";
		},*/

		// Adress Validation
		checkAddressStepValidation: function() {
			var streetNumber = this.byId("StreetNumber").getValue();
			var streetName = this.byId("StreetName").getValue();
			var city = this.byId("City").getValue();
			var district = this.byId("City2").getValue();
			var surburb = this.byId("Surburb").getValue();
			var postalCode = this.byId("PostalCode").getValue();
			var postalCode2 = this.byId("PostalCode2").getValue();

			if (streetNumber.length < 1) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/streetNumberState", "Error");
			} else {
				this.model.setProperty("/streetNumberState", "None");
			}
			if (streetName.length < 3) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/streetNameState", "Error");
			} else {
				this.model.setProperty("/streetNameState", "None");
			}
			if (city.length < 3) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/cityNameState", "Error");
			} else {
				this.model.setProperty("/cityNameState", "None");
			}
			if (district.length < 3) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/districtState", "Error");
			} else {
				this.model.setProperty("/districtState", "None");
			}
			if (surburb.length < 3) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/surburbNameState", "Error");
			} else {
				this.model.setProperty("/surburbNameState", "None");
			}
			if (postalCode.length < 4) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/postalCodeState", "Error");
			} else {
				this.model.setProperty("/postalCodeState", "None");
			}
			if (postalCode2.length < 4) {
				this._wizard.setCurrentStep(this.byId("FirmAddressSteps"));
				this.model.setProperty("/postalCodeState2", "Error");
			} else {
				this.model.setProperty("/postalCodeState2", "None");
			}
			//Validating FirmAddress Steps
			if (streetNumber.length < 1 || streetName.length < 3 || city.length < 3 || district.length < 3 || surburb.length < 3 || postalCode.length <
				4 ||
				postalCode2.length < 4) {
				this._wizard.invalidateStep(this.byId("FirmAddressSteps"));
			} else {
				this._wizard.validateStep(this.byId("FirmAddressSteps"));
			}
		},
		//FirmContactSteps Validation
		firmContactStepValidation: function() {
			var cellNumber = this.byId("Tel_phone").getValue();

			var email = this.byId("Email").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (cellNumber.length < 11) {
				this._wizard.setCurrentStep(this.byId("FirmContactSteps"));
				this.model.setProperty("/cellnumberState", "Error");
			} else {
				this.model.setProperty("/cellnumberState", "None");
			}
			if (!email.match(mailregex)) {
				this._wizard.setCurrentStep(this.byId("FirmContactSteps"));
				this.model.setProperty("/emailAddressState", "Error");
			} else {
				this.model.setProperty("/emailAddressState", "None");
			}
			//Validating FirmContact Steps
			if (cellNumber.length < 11 || !email.match(mailregex)) {
				this._wizard.invalidateStep(this.byId("FirmContactSteps"));
			} else {
				this._wizard.validateStep(this.byId("FirmContactSteps"));
			}
		},

		checkUserStepValidation: function() {
			var userTitle = this.byId("Usertitle").getSelectedKey();
			var userFname = this.byId("Username").getValue();
			var userLname = this.byId("Usersurname").getValue();
			var userIdType = this.byId("UseridType").getSelectedKey();
			var userIdNo = parseInt(this.byId("UseridNumber").getValue());
			var userCellNo = this.byId("Usertelephone").getValue();
			var userEmail = this.byId("Useremail").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (userTitle === "") {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userTitleState", "Error");
			} else {
				this.model.setProperty("/userTitleState", "None");
			}
			if (userIdType === "") {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userIdTypeState", "Error");
			} else {
				this.model.setProperty("/userIdTypeState", "None");
			}
			if (userFname.length < 3) {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userNameState", "Error");
			} else {
				this.model.setProperty("/userNameState", "None");
			}
			if (userLname.length < 3) {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userSurnameState", "Error");
			} else {
				this.model.setProperty("/userSurnameState", "None");
			}
			if (isNaN(userIdNo)) {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/useridNumberState", "Error");
			} else {
				this.model.setProperty("/useridNumberState", "None");
			}
			if (userCellNo.length < 10) {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userCellphoneState", "Error");
			} else {
				this.model.setProperty("/userCellphoneState", "None");
			}
			if (!userEmail.match(mailregex)) {
				this._wizard.setCurrentStep(this.byId("AddUsersSteps"));
				this.model.setProperty("/userEmailState", "Error");
			} else {
				this.model.setProperty("/userEmailState", "None");
			}
			//Validating User Steps
			if (userFname.length < 3 || userLname.length < 3 || isNaN(userIdNo) || userTitle === "" || userCellNo.length < 10 ||
				userIdType === "" || (!userEmail.match(mailregex))) {
				this._wizard.invalidateStep(this.byId("AddUsersSteps"));
			} else {
				this._wizard.validateStep(this.byId("AddUsersSteps"));
			}
		},
		checkFundCertificateSteps: function() {
			var certNumber = this.byId("fidelityFundNo").getValue();
			var certName = this.byId("fidelityFundName").getValue();
			var dateFrom = this.byId("valid_From").getValue();
			var dateTo = this.byId("valid_to").getValue();

			if (certNumber.length < 10) {
				this._wizard.setCurrentStep(this.byId("FundCertificateSteps"));
				this.model.setProperty("/certNoState", "Error");
			} else {
				this.model.setProperty("/certNoState", "None");
			}
			if (certName === "") {
				this._wizard.setCurrentStep(this.byId("FundCertificateSteps"));
				this.model.setProperty("/certNameState", "Error");
			} else {
				this.model.setProperty("/certNameState", "None");
			}
			if (dateFrom === "") {
				this._wizard.setCurrentStep(this.byId("FundCertificateSteps"));
				this.model.setProperty("/dateFromState", "Error");
			} else {
				this.model.setProperty("/dateFromState", "None");
			}
			if (dateTo === "") {
				this._wizard.setCurrentStep(this.byId("FundCertificateSteps"));
				this.model.setProperty("/dateToState", "Error");
			} else {
				this.model.setProperty("/dateToState", "None");
			}
			
			if (certNumber.length < 10 || certName === "" || dateFrom === "" || dateTo === "") 
			{
				this._wizard.invalidateStep(this.byId("FundCertificateSteps"));
			} else {
				this._wizard.validateStep(this.byId("FundCertificateSteps"));
			}
		},

		scrollFrom4to2: function() {
			this._wizard.goToStep(this.byId("FirmDetailsSteps"));
		},

		goFrom4to3: function() {
			if (this._wizard.getProgressStep() === this.byId("FirmAddressSteps")) {
				this._wizard.previousStep();
			}
		},

		goFrom4to5: function() {
			if (this._wizard.getProgressStep() === this.byId("Add_Users")) {
				this._wizard.nextStep();
			}
		},

		wizardCompletedHandler: function() {
			this._oNavContainer.to(this.byId("wizardReviewPage"));
		},

		backToWizardContent: function() {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

		editStepOne: function() {
			this._handleNavigationToStep(0);
		},

		editStepTwo: function() {
			this._handleNavigationToStep(1);
		},

		editStepThree: function() {
			this._handleNavigationToStep(2);
		},

		editStepFour: function() {
			this._handleNavigationToStep(3);
		},
		editStepFive: function() {
			this._handleNavigationToStep(4);
		},
		editStepSix: function() {
			this._handleNavigationToStep(5);
		},
		editStepSeven: function() {
			this._handleNavigationToStep(6);
		},
		_handleNavigationToStep: function(iStepNumber) {
			var fnAfterNavigate = function() {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},

		_handleMessageBoxOpen: function(sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.YES) {
						this.submitData();
						this._handleNavigationToStep(0);
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
					}
				}.bind(this)
			});
		},
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

		/*onNavToUserPage:function(){
				this.getRouter().navTo("userstartpage");
		},*/
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		_setEmptyValue: function(sPath) {
			this.model.setProperty(sPath, "n/a");
		},

		handleWizardCancel: function() {
			this._handleMessageBoxOpen("Are you sure you want to cancel your registration?", "warning");
		},

		handleWizardSubmit: function() {
			this._handleMessageBoxOpen("Are you sure you want to submit your registration?", "confirm");
		}

	});
});
