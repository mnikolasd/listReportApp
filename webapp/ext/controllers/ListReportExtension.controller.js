sap.ui.controller("listReportApp.ext.controllers.ListReportExtension", {
	onBeforeRebindTableExtension: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			var oCustomControl = oSmartFilterBar.getControlByKey("NetAmountRangeFilter");
			if (oCustomControl instanceof sap.m.ComboBox) {
				var vPriceRange = oCustomControl.getSelectedKey();
				switch (vPriceRange) {
				case "0":
					oBindingParams.filters.push(new sap.ui.model.Filter('NetAmount', null));
					break;
				case "1":
					oBindingParams.filters.push(new sap.ui.model.Filter('NetAmount', 'LE', "1000"));
					break;
				case "2":
					oBindingParams.filters.push(new sap.ui.model.Filter('NetAmount', 'BT', "1000", "5000"));
					break;
				case "3":
					oBindingParams.filters.push(new sap.ui.model.Filter('NetAmount', 'BT', "5000", "10000"));
					break;
				case "4":
					oBindingParams.filters.push(new sap.ui.model.Filter('NetAmount', 'GT', "10000"));
					break;
				default:
					break;
				}
			}
		}
	},
	onChangeNetAmount: function (oEvent) {
		var oSmartTable = oEvent.getSource().getParent().getParent();
		var item = oSmartTable.getSelectedItem();
		if (item) {
			var oContext = item._getBindingContext();
			this._showChangeNetPopup(oContext);
		} else {
			sap.m.MessageBox.error("You must first select a row!", {});
		}
	},
	_showChangeNetPopup: function(oContext) {
          var that = this;
          var oModel = this.getView().getModel();

          var oField = new sap.ui.comp.smartfield.SmartField({
               value: "{NetAmount}"
          });

          var oParameterDialog = new sap.m.Dialog({
               title: "Change Net Amount",
               content: [new sap.m.Text({
                    text: 'New Net Amount '
               }), oField],
               beginButton: new sap.m.Button({
                    text: "OK",
                    press: function() {
                         that.getView().getModel().submitChanges();
                         oParameterDialog.close();
                    }
               }),
               endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function() {
                         that.getView().getModel().resetChanges();
                         oParameterDialog.close();
                    }
               }),
               afterClose: function() {
                    oParameterDialog.destroy();
               }
          });

          oParameterDialog.setModel(oModel);
          oParameterDialog.setBindingContext(oContext);
          oParameterDialog.open();
     }
});