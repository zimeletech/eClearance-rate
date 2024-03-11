sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "clearance_portal/model/LoginModel"
], function (Controller, LoginModel) {
    "use strict";

    return Controller.extend("clearance_portal.controller.Login", {

        onInit: function () {
            var oLoginModel = LoginModel.createLoginModel();
            this.getView().setModel(oLoginModel);
        },

        onLoginPress: function () {
            var oLoginModel = this.getView().getModel();
            var sUsername = oLoginModel.getProperty("/username");
            var sPIN = oLoginModel.getProperty("/pin");

            // Add your login logic here, for example, sending a request to the server for validation.
            // If login is successful, navigate to the next view.
            // if (successfulLogin) {
            //     this.getOwnerComponent().getRouter().navTo("nextView");
            // }
        }
    });
});