var mandatoryFields = [
	'app_name_input',
	'api_endpoint_input',
	'ext_id_input',
	'logo_input'
];

var platforms = {
	"ottweb": {
		"value": "ottweb",
		"title": "WEB"
	},
	"android": {
		"value": "ottweb",
		"title": "mobile Android"
	},
	"ios": {
		"value": "ottweb",
		"title": "mobile iOS"
	},
	"android_tv": {
		"value": "ottweb",
		"title": "Android TV"
	},
	"fire_tv": {
		"value": "fire tv",
		"title": "Fire TV"
	},
	"tvos": {
		"value": "ottweb",
		"title": "Apple TV"
	},
	"smart_tv_webos": {
		"value": "ottweb",
		"title": "LG TV"
	},
	"smart_tv_tizen": {
		"value": "ottweb",
		"title": "Samsung TV"
	},
	"roku": {
		"value": "ottweb",
		"title": "Roku"
	}
};
var stores = {
	"Google": "google",
	"Apple": "apple",
	"Roku": "roku",
	"Amazon": "amazon",
	"Android": "android_tv",
	"Apple": "apple_tv",
	"LG TV": "lg_tv",
	"Samsung TV": "samsung_tv"
};

var socialNetworks = [
	"Facebook", "Twitter", "Instagram", "TikTok"];
$(document).ready(function () {
	var platformKeys = Object.keys(platforms);
	for (let i = 0; i < platformKeys.length; i++) {
		$("#platforms").append('<div class="form-check">' +
			'<input class="form-check-input" type="checkbox" value="" id="' + platformKeys[i] + '">' +
			'<label class="form-check-label" for="' + platformKeys[i] + '">' +
			platforms[platformKeys[i]].title + '</label></div>');
	}
	var storeKeys = Object.keys(stores);
	for (let i = 0; i < storeKeys.length; i++) {
		$("#stores").append('<div class="form-check">' +
			'<input class="form-check-input" type="checkbox" value="" id="' + stores[storeKeys[i]] + '_store_chkbox">' +
			'<label class="form-check-label" for="' + stores[storeKeys[i]] + '_store_chkbox">' +
			storeKeys[i] + '</label>' +
			'<input type="text" id="' + stores[storeKeys[i]] + '_store_input"' +
			' class="form-control" aria-label="Text input with checkbox"> </div>');
	}
	for (let i = 0; i < socialNetworks.length; i++) {
		$("#social_networks").append('<div class="form-check">' +
			'<input class="form-control" type="text" value="" id="' + socialNetworks[i].toLowerCase() + '_sn_input"' +
			' placeholder="Enter url for ' + socialNetworks[i] + '"> ' +
			'</div>');
	}
	$("#add_legal_btn").on("click", handleAddFooterBtn);
	$("#add_helpdesk_btn").on("click", handleAddFooterBtn);
	$("#generateBtn").on("click", handleGenerateBtn);
	$("#resetBtn").on("click", handleResetBtn);

});

function handleGenerateBtn() {
	let canBeDownloaded = true;
	for (let i = 0; i < mandatoryFields.length; i++) {
		if ($("#" + mandatoryFields[i]).val().length == 0) {
			canBeDownloaded = false;
			$("#" + mandatoryFields[i]).addClass('border-danger')
		}
	}
	if (canBeDownloaded) {
		outputFileStr = {
			"app_name": $("#app_name_input").val(),
			"core": {
				"api_endpoint": $("#api_endpoint_input").val()
			}
		}
		platformChckBoxes = $("#platforms").find("input")
		extId = $("#ext_id_input").val()
		for (let i = 0; i < platformChckBoxes.length; i++) {
			if (platformChckBoxes[i].type == "checkbox" && platformChckBoxes[i].checked == true) {
				outputFileStr.core["client_id_" + platformChckBoxes[i].id] = "cloud:" + extId + "_" +
					platforms[platformChckBoxes[i].id].value + "_device"

			}
		}

		outputFileStr["login"] = {
			"show_stub_stopper": $("#show_stub_stopper_chckbox")[0].checked
		}
		outputFileStr["signup"] = {
			"email_validation_required": $("#email_validation_required_chckbox")[0].checked
		}

		outputFileStr["design"] = {
			"logo": $("#logo_input").val(),
			"colors": {
				"primary": $("#primary_color_input").val(),
				"primary_btn": $("#primary_btn_color_input").val(),
				"text": $("#text_color_input").val(),
				"text_focused": $("#focused_text_color_input").val()
			}
		}
		if ($("#stub_stopper_background_input").val().length > 0) {
			outputFileStr.design["stub_stopper_background"] = $("#stub_stopper_background_input").val();
		}
		outputFileStr["footer"] = {
			"app_stores": {

			},
			"social_media": {},
			"helpdesk": [],
			"legal_section": []
		}
		storesChckBoxes = $("#stores").find("input[type = checkbox]")

		for (let i = 0; i < storesChckBoxes.length; i++) {
			if (storesChckBoxes[i].checked == true) {
				storeId = storesChckBoxes[i].id.substr(0, storesChckBoxes[i].id.length - 7)
				storeInput = $("#stores").find("#" + storeId + "_input")[0]
				outputFileStr.footer["app_stores"][storeId] = $("#" + storeId + "_input").val()

			}
		}
		for (let i = 0; i < socialNetworks.length; i++) {
			if ($("#" + socialNetworks[i].toLowerCase() + "_sn_input").val().length > 0) {
				outputFileStr["footer"]["social_media"][socialNetworks[i].toLowerCase()] = $("#" + socialNetworks[i].toLowerCase() + "_sn_input").val()
			}
		}
		outputFileStr["footer"]["helpdesk"].push({
			"type": "email",
			"value": $("#email_input").val()
		})
		helpdeskChildren = $("#helpdesk_section").find("div")
		for (let i = 1; i < helpdeskChildren.length; i++) {
			typeInput = helpdeskChildren[i].querySelector("helpdesk_input_type")
			valueInput = helpdeskChildren[i].querySelector("helpdesk_input_value")
			if (typeInput.val().length > 0 && valueInput.val().length > 0) {
				outputFileStr["footer"]["helpdesk"].push({
					"type": typeInput.val(),
					"value": valueInput.val()
				})
			}
		}
		legalChildren = $("#legal_section").find("div")
		for (let i = 1; i < legalChildren.length; i++) {
			titleInput = helpdeskChildren[i].querySelector("legal_input_title")
			typeInput = helpdeskChildren[i].querySelector("legal_input_type")
			valueInput = helpdeskChildren[i].querySelector("legal_input_value")
			if (titleInput.val() && typeInput.val().length > 0 && valueInput.val().length > 0) {
				outputFileStr["footer"]["legal_section"].push({
					"title": titleInput.val(),
					"type": typeInput.val(),
					"value": valueInput.val()
				})
			}
		}
		if ($("#copyright_input").val().length > 0) {
			outputFileStr["footer"]["copyright"] = $("#copyright_input").val()
		}
		download(JSON.stringify(outputFile));
	}
}
function handleResetBtn() {

	$("#app_name_input").val('');
	$("#api_endpoint_input").val('');
	$("#ext_id_input").val('');
	platformChckBoxes = $("#platforms").find("input[type = checkbox]")
		for (let i = 0; i < platformChckBoxes.length; i++) {
			if (platformChckBoxes[i].checked == true) {
						platformChckBoxes[i].checked = false;
			}
		}
		$("#show_stub_stopper_chckbox")[0].checked = false;
		$("#email_validation_required_chckbox")[0].checked = false;
		$("#logo_input").val('');

		$("#primary_color_input").val('#000000');
		$("#primary_btn_color_input").val('#000000');
		$("#text_color_input").val('#000000');
		$("#focused_text_color_input").val('#000000');
		$("#stub_stopper_background_input").val('');

		storesChckBoxes = $("#stores").find("input[type = checkbox]")
		for (let i = 0; i < storesChckBoxes.length; i++) {
			if (storesChckBoxes[i].checked == true) {
				storesChckBoxes[i].checked = false;
			}
			storeId = storesChckBoxes[i].id.substr(0, storesChckBoxes[i].id.length - 7);
			$("#stores").find("#" + storeId + "_input")[0].value = '';
		}
		for (let i = 0; i < socialNetworks.length; i++) {
			if ($("#" + socialNetworks[i].toLowerCase() + "_sn_input").val().length > 0) {
				$("#" + socialNetworks[i].toLowerCase() + "_sn_input").val('')
			}
		}
		$("#email_input").val('')
		helpdeskChildren = $("#helpdesk_section").children()
		for (let i = helpdeskChildren.length - 1; i >= 0; i--) {
			if (helpdeskChildren[i] != undefined && helpdeskChildren[i].className == 'form-row' && helpdeskChildren[i].id != '')
			{
				$("#" + helpdeskChildren[i].id).remove();
			}
		}
		legalChildren = $("#legal_section").children()
		for (let i = legalChildren.length - 1; i >= 0; i--) {
			if (legalChildren[i] != undefined && legalChildren[i].className == 'form-row' && legalChildren[i].id != '')
			{
				$("#" + legalChildren[i].id).remove();
			}
		}
		$("#copyright_input").val('')
}

function handleMandatoryFields(e) {
	$("#" + e.target.id).removeClass('form-control-warning border-danger')
}

function handleAddFooterBtn(e) {
	var clickedBtnId = e.target.id;
	var sectionId = "";

	if (clickedBtnId == "add_legal_btn") {
		sectionId = "legal"
	}
	else if (clickedBtnId == "add_helpdesk_btn") {
		sectionId = "helpdesk"
	}
	var btnId = 'remove_footer_btn_' + uuidv4();

	var helpdeskRow = '<input type="text" id="helpdesk_input_type" placeholder="Enter helpdesk type(phone, website)...">' +
		'<input type="text" id="helpdesk_input_value" placeholder="Enter helpdesk value...">'

	var legalRow = '<input type="text" id="legal_input_title" placeholder="Enter legal section title">' +
		'<input type="text" id="legal_input_type" placeholder="Enter legal section type(html, external...).">' +
		'<input type="text" id="legal_input_value" placeholder="Enter legal section value">'

	$("#" + sectionId + "_section").append('<div class="form-row" id="' + uuidv4() + '_' + sectionId + '_p">' +

		(sectionId == "helpdesk" ? helpdeskRow : legalRow) +
		'<button id="' + btnId + '"class="btn btn-primary"><i class="bi bi-dash-circle" ></i> Remove</button>' +
		'</div>');
	$("#" + btnId).on("click", handleRemoveFooterBtn);
}
function handleRemoveFooterBtn(e) {
	var nodeToRemove = $("#" + e.target.id).parent().get(0).id;
	$("#" + nodeToRemove).remove()
}
function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
		(+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
	);
}

function download(source) {
	var tempLink = document.createElement("a");
	var taBlob = new Blob([source], { type: 'application/json' });
	tempLink.setAttribute('href', URL.createObjectURL(taBlob));
	tempLink.setAttribute('download', `config.json`);
	tempLink.click();
	URL.revokeObjectURL(tempLink.href);
}
