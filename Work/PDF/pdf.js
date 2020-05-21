const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
/**
 * Quick function that capitalizes the first letter of each word
 * @param {String} word
 */
const capitalize = (word) => {
	word = word.split('_');
	for (let i = 0, x = word.length; i < x; i++) {
		word[i] = word[i][0].toUpperCase() + word[i].substr(1);
	} // end for 
	return word.join(' ');
};

module.exports = {
    /**
     * Creates a PDF file that can be faxed to contacts, the file contains data extracted from a JSON
     * organization object that could include a cover page.
     * @param {String} coverText - An HTML formatted string that can be used to create a cover letter for the PDF file
     * @param {Object} json - The survey object
     */
    async createOrganizationPDF(coverText, json) {
        const pdf = await PDFDocument.create();
        const [ font, fontBold ] = await Promise.all([pdf.embedFont(StandardFonts.TimesRoman), pdf.embedFont(StandardFonts.TimesRomanBold)]);

        if (coverText !== null) {
            const coverLetter = pdf.addPage();
            // Code to add text
        } // end if

		const page = pdf.addPage();
		let { width, height } = page.getSize();
        // Let's set some variables to define spaces and breaklines inside the PDF
		let fontSectionSize = 15;
		let fontRegularSize = 12;
        let textPositionLeft = 50;
        let textPositionRight = 300;
        let standardBreakline = 40;
        let sectionBreakline = 30;
        let subSectionBreakline = 25;
        let propertiesBreakline = 20;

		page.drawText('Organization Name: ', {
			x: textPositionLeft,
			y: height = height - standardBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText(json.org.organization_name, {
			x: 170,
			y: height,
			size: fontRegularSize,
			font: font,
			color: rgb(0, 0, 0)
		});

		page.drawText('Directory Contact: ', {
			x: textPositionLeft,
			y: height = height - standardBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText('Note to Directory Editors: ', {
			x: textPositionRight,
			y: height,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		let heightForNotes = height;

		for (let contact of ['contactName', 'contactEmail', 'contactFax', 'notes']) {
			if (json.hasOwnProperty(contact)) {
				if (contact === 'notes') {
                    // Notes can be paragraphs so let's use a smaller font size
                    // and set a width so it displays in several lines
					page.drawText(json[contact], {
						x: textPositionRight,
						y: heightForNotes -propertiesBreakline,
						size: 11,
						font: font,
                        color: rgb(0, 0, 0),
                        maxWidth: 267,
                        lineHeight: 15
					});
					continue;
				} // end if
				page.drawText(json[contact], {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end if
		} // end for

		page.drawLine({
			start: { x: textPositionLeft, y: height = height - propertiesBreakline },
			end: { x: width - textPositionLeft, y: height },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		page.drawText('Organization Contact Information', {
			x: textPositionLeft,
			y: height = height - sectionBreakline,
			size: fontSectionSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText('Addresses:', {
			x: textPositionLeft,
			y: height = height - subSectionBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		for (let address of json.org.addresses) {
			for (let addressAttr in address) {
				if (addressAttr === 'atts') {
					continue;
				} // end if

				if (addressAttr === 'ta_street') {
					page.drawText(address[addressAttr][0], {
						x: textPositionLeft,
						y: height = height - propertiesBreakline,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});
				} else {
					page.drawText(`${address['ta_city']}, ${address['ta_state']} ${address['ta_postalCode']}`, {
						x: textPositionLeft,
						y: height = height - propertiesBreakline,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});
					break;
				} // end if - else
			} // end for
		} // end for

		if (Object.keys(json.org.other_information).length > 0) {
			page.drawText('Other information', {
				x: textPositionLeft,
				y: height = height - subSectionBreakline,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let information in json.org.other_information) {
				page.drawText(`${capitalize(information)}:`, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});

				let text = (information === 'organization_description' || information === 'organization_background')
					? json.org.other_information[information].replace(/(<([^>]+)>)/ig, '') 
					: json.org.other_information[information];

				page.drawText(text, {
					x: 190,
					y: height,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(json.org.phones).length > 0) {
			page.drawText('Phone and Fax Numbers', {
				x: textPositionLeft,
				y: height = height - subSectionBreakline,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let phone of json.org.phones) {
				let phoneLabel = phone.atts.hasOwnProperty('label') ? phone.atts.label : phone.atts.type;
				let phoneText = phoneLabel !== undefined ? `${phoneLabel}: ${phone.value}` : `Phone: ${phone.value}`;
				page.drawText(phoneText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(json.org.faxes).length > 0) {
			for (let fax of json.org.faxes) {
				let faxText = fax.atts.hasOwnProperty('label') ? `${fax.atts.label}: ${fax.value}` : `Fax: ${fax.value}`;
				page.drawText(faxText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(json.org.websites).length > 0) {
			page.drawText('Websites', {
				x: textPositionLeft,
				y: height = height - subSectionBreakline,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let website of json.org.websites) {
				let websiteText = website.atts.hasOwnProperty('label') ? `${website.atts.label}: ${website.value}` : `Site: ${website.value}`;
				page.drawText(websiteText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(json.org.emails).length > 0) {
			page.drawText('Emails', {
				x: textPositionLeft,
				y: height = height - subSectionBreakline,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let email of json.org.emails) {
				let emailText = email.atts.hasOwnProperty('label') ? `${email.atts.label}: ${email.value}` : `Email: ${email.value}`;
				page.drawText(emailText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		page.drawLine({
			start: { x: textPositionLeft, y: height = height - propertiesBreakline },
			end: { x: width - textPositionLeft, y: height },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		if (Object.keys(json.org.organization_personnel).length > 0) {
			page.drawText('Organization Personnel ', {
				x: textPositionLeft,
				y: height = height - sectionBreakline,
				size: fontSectionSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			// Let's check we still have enough space to put the staff data
			let pageForPersonnel = height <= 120 ? pdf.addPage() : page;
			let heightForPersonnel = height;

			// Let's divide the staff into chunks we can display side to side
			let staffMembers = [];
			for (let item = 0; item < json.org.organization_personnel.length; item+=2) {
				staffChunk = json.org.organization_personnel.slice(item, item + 2);
				staffMembers.push(staffChunk);
			} // end for

			for (let [staffIndex, staffChunks] of staffMembers.entries()) {
                // If there's more than 2 staff members, it's safe to assume we need a new page
                // We're also assuming we only need to do this one time, since most examples have
                // 2 -5 staff members, if the number is higher we need to update this
				if (staffIndex === 1) {
					pageForPersonnel = pdf.addPage();
					heightForPersonnel = pageForPersonnel.getSize().height;
				} // end if

				let heightForName = 0;
                let heightForPosition = 0;
                // Height define for this elements is based on the assumption that even when they're
                // arrays, it contains only one element.
				let heightForPhones = 0;
				let heightForFaxes = 0;
				let heightForEmails = 0;
				let heightForAddress = [0, 0];

				for (let [index, staff] of staffChunks.entries()) {
					pageForPersonnel.drawText(staff.ta_person.value, {
						x: index > 0 ? textPositionRight : textPositionLeft,
						y: index > 0 ? heightForName : heightForPersonnel = heightForPersonnel - subSectionBreakline,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});

					heightForName = heightForPersonnel;

					pageForPersonnel.drawText(staff.td_positionTitleAbbrev, {
						x: index > 0 ? textPositionRight : textPositionLeft,
						y: index > 0 ? heightForPosition : heightForPersonnel = heightForPersonnel - propertiesBreakline,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});

					heightForPosition = heightForPersonnel;

					if (staff.hasOwnProperty('ta_phones')) {
						for (phone of staff.ta_phones) {
							pageForPersonnel.drawText(`Phone: ${phone.value}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForPhones : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});
						} // end for
					} // end if

					heightForPhones = heightForPersonnel;

					if (staff.hasOwnProperty('ta_faxes')) {
						for (fax of staff.ta_faxes) {
							pageForPersonnel.drawText(`Fax: ${fax.value}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForFaxes : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});
						} // end for
					} // end if

					heightForFaxes = heightForPersonnel;

					if (staff.hasOwnProperty('ta_emails')) {
						for (email of staff.ta_emails) {
							pageForPersonnel.drawText(`Email: ${email.value}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForEmails : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});
						} // end for
					} // end if

					heightForEmails = heightForPersonnel;

					if (staff.hasOwnProperty('ta_address')) {
						for (address of staff.ta_address) {
							pageForPersonnel.drawText(address.ta_street[0], {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForAddress[0] : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});

							heightForAddress[0] = heightForPersonnel;

							pageForPersonnel.drawText(`${address.ta_city}, ${address.ta_state} ${address.ta_postalCode}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForAddress[1] : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});

							heightForAddress[1] = heightForPersonnel;
						} // end for
					} // end if
				} // end for
			} // end for
		} // end if

		const pdfBytes = await pdf.saveAsBase64();
		return pdfBytes;
    }
}