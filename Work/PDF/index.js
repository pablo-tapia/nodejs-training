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

    const pdf = await PDFDocument.create();
	const [ font, fontBold ] = await Promise.all([pdf.embedFont(StandardFonts.TimesRoman), pdf.embedFont(StandardFonts.TimesRomanBold)]);
	const page = pdf.addPage();
	let { width, height } = page.getSize();

    let fontSectionSize = 15;
    let fontRegularSize = 12;
	let breakline = 40;

	page.drawText(`Organization Name: `, {
		x: 50,
		y: height = height - breakline,
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

	page.drawText('Directory Contact:', {
		x: 50,
		y: height = height - breakline,
		size: fontRegularSize,
		font: fontBold,
		color: rgb(0, 0, 0)
	});

	page.drawText('Note to Directory Editors:', {
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

	page.drawText('Other information:', {
		x: 50,
		y: height = height - 20,
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

		page.drawText(`${survey.org.other_information[information]}`, {
			x: 180,
			y: height,
			size: fontRegularSize,
			font: font,
			color: rgb(0, 0, 0)
		});
	} // end for

	page.drawLine({
		start: { x: 50, y: height = height - 20 },
		end: { x: width - 50, y: height },
		thickness: 1,
		color: rgb(0, 0, 0),
	});

    const pdfBytes = await pdf.saveAsBase64();
    return pdfBytes;
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