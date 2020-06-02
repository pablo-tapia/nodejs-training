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
		let fontColor = rgb(0, 0, 0);

		page.drawText('Organization Name: ', {
			x: textPositionLeft,
			y: height = height - standardBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		page.drawText(json.org.organization_name, {
			x: 170,
			y: height,
			size: fontRegularSize,
			font: font,
			color: fontColor
		});

		page.drawText('Directory Contact:', {
			x: textPositionLeft,
			y: height = height - standardBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		page.drawText('Note to Directory Editors:', {
			x: textPositionRight,
			y: height,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		let heightForNotes = height;

		for (let contact of ['contactName', 'contactEmail', 'contactFax', 'notes']) {
			if (json.hasOwnProperty(contact)) {

				// Make sure to add a label when the field is empty
				let placeholderForContact = (json[contact] !== null)
					? json[contact]
					: (contact !== 'notes') ? `Contact ${contact.replace('contact', '').toLowerCase()}:` : '';

				if (contact === 'notes') {
                    // Notes can be paragraphs so let's use a smaller font size
                    // and set a width so it displays in several lines
					page.drawText(placeholderForContact, {
						x: textPositionRight,
						y: heightForNotes -propertiesBreakline,
						size: 11,
						font: font,
                        color: fontColor,
                        maxWidth: 267,
                        lineHeight: 15
					});
					continue;
				} // end if

				page.drawText(placeholderForContact, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end if
		} // end for

		page.drawLine({
			start: { x: textPositionLeft, y: height = height - propertiesBreakline },
			end: { x: width - textPositionLeft, y: height },
			thickness: 1,
			color: fontColor,
		});

		page.drawText('Organization Contact Information', {
			x: textPositionLeft,
			y: height = height - sectionBreakline,
			size: fontSectionSize,
			font: fontBold,
			color: fontColor
		});

		page.drawText('Addresses:', {
			x: textPositionLeft,
			y: height = height - subSectionBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		if (Object.keys(json.org.addresses).length > 0) {
			for (let address of json.org.addresses) {
				let singleLine = '';
				for (let addressAttr in address) {
					if (addressAttr === 'atts') {
						continue;
					} // end if

					if (address[addressAttr] === null) {
						let placeholder = addressAttr === 'ta_street' ? 'Address: ' : `${capitalize(addressAttr.replace('ta_', ''))}: `;
						page.drawText(placeholder, {
							x: textPositionLeft,
							y: height = height - propertiesBreakline,
							size: fontRegularSize,
							font: font,
							color: fontColor
						});
						continue;
					} // end if

					let singleLineAttributes = ['ta_city', 'ta_province', 'ta_state', 'ta_postalCode'];
					if (singleLineAttributes.includes(addressAttr)) {
						if (addressAttr === 'ta_city') {
							singleLine = `${address['ta_city']},`;
						} else if (addressAttr === 'ta_postalCode') {
							page.drawText(`${singleLine} ${address['ta_postalCode']}`, {
								x: textPositionLeft,
								y: height = height - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: fontColor
							});
						} else {
							singleLine = singleLine.concat(' ', address[addressAttr]);
						} // end if - else if - else
						continue;
					} // end if

					let placeholderForAddress = addressAttr === 'ta_street' ? address['ta_street'][0] : address[addressAttr];
					page.drawText(placeholderForAddress, {
						x: textPositionLeft,
						y: height = height - propertiesBreakline,
						size: fontRegularSize,
						font: font,
						color: fontColor
					});
				} // end for
			} // end for
		} else {
			for (let placeholderForAddress of ['Address', 'City', 'State/Province', 'Postal Code', 'Country']) {
				page.drawText(`${placeholderForAddress}:`, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} // end if - else

		page.drawText('Phone and Fax Numbers', {
			x: textPositionLeft,
			y: height = height - subSectionBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		if (Object.keys(json.org.phones).length > 0) {
			for (let phone of json.org.phones) {
				let phoneLabel = phone.atts.hasOwnProperty('label') ? phone.atts.label : phone.atts.type;
				let phoneText = phoneLabel !== undefined ? `${phoneLabel}: ${phone.value}` : `Phone: ${phone.value}`;
				page.drawText(phoneText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} else {
			page.drawText('Phone number:', {
				x: textPositionLeft,
				y: height = height - propertiesBreakline,
				size: fontRegularSize,
				font: font,
				color: fontColor
			});
		} // end if - else

		if (Object.keys(json.org.faxes).length > 0) {
			for (let fax of json.org.faxes) {
				let faxText = fax.atts.hasOwnProperty('label') ? `${fax.atts.label}: ${fax.value}` : `Fax: ${fax.value}`;
				page.drawText(faxText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} else {
			page.drawText('Fax number:', {
				x: textPositionLeft,
				y: height = height - propertiesBreakline,
				size: fontRegularSize,
				font: font,
				color: fontColor
			});
		} // end if

		page.drawText('Websites', {
			x: textPositionLeft,
			y: height = height - subSectionBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		if (Object.keys(json.org.websites).length > 0) {
			for (let website of json.org.websites) {
				let websiteText = website.atts.hasOwnProperty('label') ? `${website.atts.label}: ${website.value}` : `Site: ${website.value}`;
				page.drawText(websiteText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} else {
			page.drawText('Site:', {
				x: textPositionLeft,
				y: height = height - propertiesBreakline,
				size: fontRegularSize,
				font: font,
				color: fontColor
			});
		} // end if

		page.drawText('Emails', {
			x: textPositionLeft,
			y: height = height - subSectionBreakline,
			size: fontRegularSize,
			font: fontBold,
			color: fontColor
		});

		if (Object.keys(json.org.emails).length > 0) {
			for (let email of json.org.emails) {
				let emailText = email.atts.hasOwnProperty('label') ? `${email.atts.label}: ${email.value}` : `Email: ${email.value}`;
				page.drawText(emailText, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} else {
			page.drawText('Email address:', {
				x: textPositionLeft,
				y: height = height - propertiesBreakline,
				size: fontRegularSize,
				font: font,
				color: fontColor
			});
		} // end if

		if (Object.keys(json.org.other_information).length > 0) {
			page.drawText('Other information', {
				x: textPositionLeft,
				y: height = height - subSectionBreakline,
				size: fontRegularSize,
				font: fontBold,
				color: fontColor
			});

			for (let information in json.org.other_information) {
				page.drawText(`${capitalize(information)}:`, {
					x: textPositionLeft,
					y: height = height - propertiesBreakline,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});

				let text = (information === 'organization_description' || information === 'organization_background')
					? json.org.other_information[information].replace(/(<([^>]+)>)/ig, '') 
					: json.org.other_information[information];

				page.drawText(text, {
					x: 190,
					y: height,
					size: fontRegularSize,
					font: font,
					color: fontColor
				});
			} // end for
		} // end if

		page.drawLine({
			start: { x: textPositionLeft, y: height = height - propertiesBreakline },
			end: { x: width - textPositionLeft, y: height },
			thickness: 1,
			color: fontColor,
		});

		if (Object.keys(json.org.organization_personnel).length > 0) {
			page.drawText('Organization Personnel ', {
				x: textPositionLeft,
				y: height = height - sectionBreakline,
				size: fontSectionSize,
				font: fontBold,
				color: fontColor
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
						y: index > 0 ? heightForName : heightForPersonnel = heightForPersonnel - standardBreakline,
						size: fontRegularSize,
						font: font,
						color: fontColor
					});

					heightForName = heightForPersonnel;

					pageForPersonnel.drawText(staff.td_positionTitleAbbrev, {
						x: index > 0 ? textPositionRight : textPositionLeft,
						y: index > 0 ? heightForPosition : heightForPersonnel = heightForPersonnel - propertiesBreakline,
						size: fontRegularSize,
						font: font,
						color: fontColor
					});

					heightForPosition = heightForPersonnel;

					if (staff.hasOwnProperty('ta_phones')) {
						for (phone of staff.ta_phones) {
							pageForPersonnel.drawText(`Phone: ${phone.value}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForPhones : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: fontColor
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
								color: fontColor
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
								color: fontColor
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
								color: fontColor
							});

							heightForAddress[0] = heightForPersonnel;

							let stateOrProvince = address.hasOwnProperty('ta_province') 
								? address.ta_province 
								: address.hasOwnProperty('ta_state') ? address.ta_state : '';

							pageForPersonnel.drawText(`${address.ta_city}, ${stateOrProvince} ${address.ta_postalCode}`, {
								x: index > 0 ? textPositionRight : textPositionLeft,
								y: index > 0 ? heightForAddress[1] : heightForPersonnel = heightForPersonnel - propertiesBreakline,
								size: fontRegularSize,
								font: font,
								color: fontColor
							});

							if (address.hasOwnProperty('ta_country')) {
								pageForPersonnel.drawText(address.ta_country, {
									x: index > 0 ? textPositionRight : textPositionLeft,
									y: index > 0 ? heightForAddress[1] : heightForPersonnel = heightForPersonnel - propertiesBreakline,
									size: fontRegularSize,
									font: font,
									color: fontColor
								});
							} // end if

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