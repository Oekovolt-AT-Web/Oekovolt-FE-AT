// Copyright (c) 2026, Ökovolt Deutschland

frappe.query_reports["Anfragen nach Herkunft"] = {
	filters: [
		{ fieldname: "von", label: __("Von"), fieldtype: "Date", default: frappe.datetime.add_days(frappe.datetime.get_today(), -90), reqd: 1 },
		{ fieldname: "bis", label: __("Bis"), fieldtype: "Date", default: frappe.datetime.get_today(), reqd: 1 },
		{
			fieldname: "gruppierung",
			label: __("Gruppieren nach"),
			fieldtype: "Select",
			options: "Kanal\nQuelle\nKampagne\nMedium\nEinstiegsseite\nAnfrageart",
			default: "Kanal",
			reqd: 1,
		},
		{
			fieldname: "kanal",
			label: __("Nur Kanal"),
			fieldtype: "Select",
			options: "\nAnzeige\nSocial Media\nE-Mail\nOffline/QR\nKampagne\nSuchmaschine\nKI-Assistent\nVerweis\nDirekt",
		},
	],
};
