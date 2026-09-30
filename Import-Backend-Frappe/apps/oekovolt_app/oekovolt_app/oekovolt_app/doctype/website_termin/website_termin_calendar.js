// Copyright (c) 2026, Ökovolt Solartechnik GmbH
// Kalenderansicht „Website Termin“ im Desk (/app/website-termin/view/calendar)

frappe.views.calendar["Website Termin"] = {
	field_map: {
		start: "start",
		end: "ende",
		id: "name",
		title: "name_komplett",
		status: "status",
	},
	style_map: {
		Neu: "warning",
		Bestätigt: "success",
		Erledigt: "default",
		Abgesagt: "danger",
	},
	filters: [
		{ fieldtype: "Select", fieldname: "terminart", options: "\nTelefonische Beratung\nVideo-Beratung\nVor-Ort-Termin", label: __("Terminart") },
		{ fieldtype: "Link", fieldname: "berater", options: "User", label: __("Berater") },
	],
	get_events_method: "frappe.desk.calendar.get_events",
};
