// Copyright (c) 2026, Ökovolt Solartechnik GmbH

const heatmapMonat = (tage) => frappe.datetime.add_days(frappe.datetime.get_today(), tage).slice(0, 7);

frappe.query_reports["Heatmap Auswertung"] = {
	filters: [
		{ fieldname: "pfad", label: __("Pfad"), fieldtype: "Data", default: "/", reqd: 1, description: __("z. B. /gewerbe") },
		{ fieldname: "geraet", label: __("Gerät"), fieldtype: "Select", options: "\nmobil\ntablet\ndesktop", default: "desktop", description: __("leer = alle Geräte") },
		{ fieldname: "von_monat", label: __("Von Monat (JJJJ-MM)"), fieldtype: "Data", default: heatmapMonat(-30) },
		{ fieldname: "bis_monat", label: __("Bis Monat (JJJJ-MM)"), fieldtype: "Data", default: heatmapMonat(0) },
	],

	onload(report) {
		// Nur System Manager / Marketing – die Methode prüft die Rolle zusätzlich serverseitig.
		if (!(frappe.user.has_role("System Manager") || frappe.user.has_role("Marketing"))) return;
		report.page.add_inner_button(__("Visuelle Ansicht auf der Website"), () => {
			const f = report.get_filter_values() || {};
			frappe.call({
				method: "oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.ansicht_link",
				args: { pfad: f.pfad, geraet: f.geraet || "desktop" },
				callback: (r) => r.message && r.message.url && window.open(r.message.url, "_blank", "noopener"),
			});
		});
	},
};
