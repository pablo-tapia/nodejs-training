const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
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
}; // end capitalize

/**
 * This function allows to create a PDF from a JSON object
 */
let createPdfFrom = async (body) => {

    let main = null;

    try {
        main = JSON.parse(body);
    } catch (error) {
        throw { 'code': 400, 'message': `Malformed request. ${error.message}`};
    } // end try - catch

    let survey = main.survey;

    if (!survey.hasOwnProperty('org')) {
        throw { 'code': 400, 'message': 'Bad request, an organization object is expected.' };
    } // end if

    let contactProperties = ['contactName', 'contactEmail', 'contactFax', 'notes'];
    for (let required of contactProperties ) {
        if (!survey.hasOwnProperty(required)) {
            throw { 'code': 400, 'message': `Bad request, missing property ${required}.` };
        } // end if
    } // end if

    try {
		const pdf = await PDFDocument.create();
		const [ font, fontBold ] = await Promise.all([pdf.embedFont(StandardFonts.TimesRoman), pdf.embedFont(StandardFonts.TimesRomanBold)]);
		const page = pdf.addPage();
		let { width, height } = page.getSize();

		let fontSectionSize = 15;
		let fontRegularSize = 12;

		page.drawText('Organization Name: ', {
			x: 50,
			y: height = height - 40,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText(survey.org.organization_name, {
			x: 170,
			y: height,
			size: fontRegularSize,
			font: font,
			color: rgb(0, 0, 0)
		});

		page.drawText('Directory Contact: ', {
			x: 50,
			y: height = height - 40,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText('Note to Directory Editors: ', {
			x: 300,
			y: height,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		let heightForNotes = height;

		for (let contact of contactProperties) {
			if (survey.hasOwnProperty(contact)) {
				if (contact === 'notes') {
					page.drawText(survey[contact], {
						x: 300,
						y: heightForNotes -25,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});
					continue;
				} // end if
				page.drawText(survey[contact], {
					x: 50,
					y: height = height - 25,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end if
		} // end for

		page.drawLine({
			start: { x: 50, y: height = height - 20 },
			end: { x: width - 50, y: height },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		page.drawText('Organization Contact Information', {
			x: 50,
			y: height = height - 30,
			size: fontSectionSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		page.drawText('Addresses:', {
			x: 50,
			y: height = height - 25,
			size: fontRegularSize,
			font: fontBold,
			color: rgb(0, 0, 0)
		});

		for (let address of survey.org.addresses) {
			for (let addressAttr in address) {
				if (addressAttr === 'atts') {
					continue;
				} // end if

				if (addressAttr === 'ta_street') {
					page.drawText(address[addressAttr][0], {
						x: 50,
						y: height = height - 20,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});
				} else {
					page.drawText(`${address['ta_city']}, ${address['ta_state']} ${address['ta_postalCode']}`, {
						x: 50,
						y: height = height - 20,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});
					break;
				} // end if - else
			} // end for
		} // end for

		if (Object.keys(survey.org.other_information).length > 0) {
			page.drawText('Other information', {
				x: 50,
				y: height = height - 30,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});
		
			for (let information in survey.org.other_information) {
				page.drawText(`${capitalize(information)}:`, {
					x: 50,
					y: height = height - 20,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
		
				let text = (information === 'organization_description' || information === 'organization_background')
					? survey.org.other_information[information].replace(/(<([^>]+)>)/ig, '') 
					: survey.org.other_information[information];
		
				page.drawText(text, {
					x: 190,
					y: height,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(survey.org.phones).length > 0) {
			page.drawText('Phone and Fax Numbers', {
				x: 50,
				y: height = height - 30,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});
		
			for (let phone of survey.org.phones) {
				let phoneLabel = phone.atts.hasOwnProperty('label') ? phone.atts.label : phone.atts.type;
				let phoneText = phoneLabel !== undefined ? `${phoneLabel}: ${phone.value}` : `Phone: ${phone.value}`;
				page.drawText(phoneText, {
					x: 50,
					y: height = height - 20,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(survey.org.faxes).length > 0) {
			for (let fax of survey.org.faxes) {
				let faxText = fax.atts.hasOwnProperty('label') ? `${fax.atts.label}: ${fax.value}` : `Fax: ${fax.value}`;
				page.drawText(faxText, {
					x: 50,
					y: height = height - 20,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(survey.org.websites).length > 0) {
			page.drawText('Websites', {
				x: 50,
				y: height = height - 30,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let website of survey.org.websites) {
				let websiteText = website.atts.hasOwnProperty('label') ? `${website.atts.label}: ${website.value}` : `Site: ${website.value}`;
				page.drawText(websiteText, {
					x: 50,
					y: height = height - 20,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		if (Object.keys(survey.org.emails).length > 0) {
			page.drawText('Emails', {
				x: 50,
				y: height = height - 30,
				size: fontRegularSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			for (let email of survey.org.emails) {
				let emailText = email.atts.hasOwnProperty('label') ? `${email.atts.label}: ${email.value}` : `Email: ${email.value}`;
				page.drawText(emailText, {
					x: 50,
					y: height = height - 20,
					size: fontRegularSize,
					font: font,
					color: rgb(0, 0, 0)
				});
			} // end for
		} // end if

		page.drawLine({
			start: { x: 50, y: height = height - 20 },
			end: { x: width - 50, y: height },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		if (Object.keys(survey.org.organization_personnel).length > 0) {
			page.drawText('Organization Personnel ', {
				x: 50,
				y: height = height - 30,
				size: fontSectionSize,
				font: fontBold,
				color: rgb(0, 0, 0)
			});

			// Let's check we still have enough space to put the staff data
			let pageForPersonnel = height <= 120 ? pdf.addPage() : page;
			let heightForPersonnel = height;

			// Let's divide the staff into chunks we can display side to side
			let staffMembers = [];
			for (let index = 0; index < survey.org.organization_personnel.length; index+=2) {
				staffChunk = survey.org.organization_personnel.slice(index, index + 2);
				staffMembers.push(staffChunk);
			} // end for

			for (let [staffIndex, staffChunks] of staffMembers.entries()) {
				// If there's more than 2 staff members, it's safe to assume we need a new page
				if (staffIndex === 1) {
					pageForPersonnel = pdf.addPage();
					heightForPersonnel = pageForPersonnel.getSize().height - 10;
				} // end if

				let heightForName = 0;
				let heightForPosition = 0;
				// Properties below are arrays with one element, we're assuming this is how
				// all contacts are set with only one phone, fax, email and address
				let heightForPhones = 0;
				let heightForFaxes = 0;
				let heightForEmails = 0;
				let heightForAddress = [0, 0];

				for (let [index, staff] of staffChunks.entries()) {
					pageForPersonnel.drawText(staff.ta_person.value, {
						x: index > 0 ? 300 : 50,
						y: index > 0 ? heightForName : heightForPersonnel = heightForPersonnel - 30,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});

					heightForName = heightForPersonnel;

					pageForPersonnel.drawText(staff.td_positionTitleAbbrev, {
						x: index > 0 ? 300 : 50,
						y: index > 0 ? heightForPosition : heightForPersonnel = heightForPersonnel - 20,
						size: fontRegularSize,
						font: font,
						color: rgb(0, 0, 0)
					});

					heightForPosition = heightForPersonnel;

					if (staff.hasOwnProperty('ta_phones')) {
						for (phone of staff.ta_phones) {
							pageForPersonnel.drawText(`Phone: ${phone.value}`, {
								x: index > 0 ? 300 : 50,
								y: index > 0 ? heightForPhones : heightForPersonnel = heightForPersonnel - 20,
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
								x: index > 0 ? 300 : 50,
								y: index > 0 ? heightForFaxes : heightForPersonnel = heightForPersonnel - 20,
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
								x: index > 0 ? 300 : 50,
								y: index > 0 ? heightForEmails : heightForPersonnel = heightForPersonnel - 20,
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
								x: index > 0 ? 300 : 50,
								y: index > 0 ? heightForAddress[0] : heightForPersonnel = heightForPersonnel - 20,
								size: fontRegularSize,
								font: font,
								color: rgb(0, 0, 0)
							});

							heightForAddress[0] = heightForPersonnel;

							pageForPersonnel.drawText(`${address.ta_city}, ${address.ta_state} ${address.ta_postalCode}`, {
								x: index > 0 ? 300 : 50,
								y: index > 0 ? heightForAddress[1] : heightForPersonnel = heightForPersonnel - 20,
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
	} catch (error) {
		throw { 'code': 500, 'message': `Service error. ${error.message}` };
	}
};

let surveyObject = {
	"coverText": "Cover",
	"survey": {
		"contactName": "Pablo Tapia",
		"contactMethod": "email",
		"contactEmail": "pablo@45rpm.co",
		"contactFax": "(555) 555-5555",
		"notes": "Example notes",
		"org": {
			"rid": "35xwq",
			"organization_name": "Ohio National Financial Services",
			"addresses": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/a246baa5-e4f1-4a31-900c-708805bc08b9"
				},
				"ta_street": ["One Financial Way"],
				"ta_city": "Cincinnati",
				"ta_state": "OH",
				"ta_postalCode": "45242"
			}],
			"other_information": {
				"number_of_employees": "1300",
				"SIC_classification": "(6311) Life Insurance",
				"fiscal_year_end": "12/31/2018",
				"assets": "39180000",
				"annual_revenue": "2390000",
				"organization_description": "<p>This is an example of an org description</p>",
				"organization_background": "<p>This is an example of an org background</p>"
			},
			"phones": [{
				"atts": {
					"type": "Toll-Free",
					"label": "For Quotes (example of a label)",
					"iri": "workspace://SpacesStore/d1e3c17b-8224-42e5-9413-e4e508ec49b1"
				},
				"value": "301-123-4567"
			}],
			"faxes": [{
				"atts": {
					"label": "For requests",
					"iri": "workspace://SpacesStore/4ba2823c-4e9f-4b96-b12d-4ddd4fbcc20a"
				},
				"value": "301-945-1234"
			}],
			"emails": [{
				"atts": {
					"type": "Business (example of a type)",
					"label": "For inquries (example of a label)",
					"iri": "workspace://SpacesStore/e00fd33b-5a0d-4af4-b4c0-2caf8fa8fc40"
				},
				"value": "pablo@45rpm.com"
			}],
			"websites": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/d88f510e-a9ed-417b-8b2c-da0bdc5b0a3e",
					"label": "Main website (this is a label)"
				},
				"value": "https://www.ohionational.com"
			}],
			"organization_personnel": [{
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/bc988b73-8ddc-446b-a57b-ca6398564f80"
					},
					"value": "Coppola, Rocky"
				},
				"ta_positionTitle": "Senior Vice President & Chief Financial Officer",
				"td_positionTitleAbbrev": "SVP & CFO",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/7ced4714-5f28-4c03-9d9b-d16c933e2ce9"
					},
					"value": "(513) 794-6100"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/3af9dc5c-c2d9-4fa5-86fe-f959909b4dbf"
					},
					"ta_street": ["One Financial Way"],
					"ta_city": "Cincinnati",
					"ta_state": "OH",
					"ta_postalCode": "45242"
				}],
				"ta_showOnWebInfoTab": "true"
			}]
		}
	}
}

let jsonString = JSON.stringify(surveyObject);

createPdfFrom(jsonString).then(pdf => {
    // Save to file
    let base64File = pdf.split(';base64,').pop();
    fs.writeFile('organization.pdf', base64File, { encoding: 'base64'}, err => console.log('File created'));
}).catch(error => {
    console.error(error);
});