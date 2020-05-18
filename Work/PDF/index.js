const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

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

    let contactProperties = ['contactName', 'contactMethod', 'contactEmail', 'contactFax', 'notes'];
    for (let required of contactProperties ) {
        if (!survey.hasOwnProperty(required)) {
            throw { 'code': 400, 'message': `Bad request, missing property ${required}.` };
        } // end if
    } // end if

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.TimesRoman);
    const page = pdf.addPage();
    let fontSectionSize = 20;
    let fontRegularSize = 12;

    page.drawText(`Organization Name: ${survey.org.ta_displayName.value}`, {
        x: 40,
        y: 650,
        size: fontRegularSize,
        font: font,
        color: rgb(0, 0, 0)
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
			"addresses": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/a246baa5-e4f1-4a31-900c-708805bc08b9"
				},
				"ta_street": ["One Financial Way"],
				"ta_city": "Cincinnati",
				"ta_state": "OH",
				"ta_postalCode": "45242"
			}],
			"positions": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/7069a4c8-2586-48df-9016-535f74f7b1af"
				},
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/bc988b73-8ddc-446b-a57b-ca6398564f80"
					},
					"value": "Coppola, Rocky"
				},
				"ta_positionTitle": {
					"value": "Senior Vice President & Chief Financial Officer"
				},
				"td_positionTitleAbbrev": {
					"value": "SVP & CFO"
				},
				"ta_phones": {
					"values": [{
						"atts": {
							"iri": "http://taxnotes.com/property/iri/7ced4714-5f28-4c03-9d9b-d16c933e2ce9"
						},
						"value": "(513) 794-6100"
					}]
				},
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/3af9dc5c-c2d9-4fa5-86fe-f959909b4dbf"
					},
					"ta_street": ["One Financial Way"],
					"ta_city": "Cincinnati",
					"ta_state": "OH",
					"ta_postalCode": "45242"
				}],
				"ta_showOnWebInfoTab": {
					"value": "true"
				}
			}],
			"ta_displayName": {
				"value": "Ohio National Financial Services"
			},
			"ta_websites": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/d88f510e-a9ed-417b-8b2c-da0bdc5b0a3e",
						"label": "Main website (this is a label)"
					},
					"value": "https://www.ohionational.com"
				}]
			},
			"ta_phones": {
				"values": [{
					"atts": {
						"type": "Toll-Free",
						"label": "For Quotes (example of a label)",
						"iri": "workspace://SpacesStore/d1e3c17b-8224-42e5-9413-e4e508ec49b1"
					},
					"value": "301-123-4567"
				}]
			},
			"ta_emails": {
				"values": [{
					"atts": {
						"type": "Business (example of a type)",
						"label": "For inquries (example of a label)",
						"iri": "workspace://SpacesStore/e00fd33b-5a0d-4af4-b4c0-2caf8fa8fc40"
					},
					"value": "pablo@45rpm.com"
				}]
			},
			"ta_faxes": {
				"values": [{
					"atts": {
						"label": "For requests",
						"iri": "workspace://SpacesStore/4ba2823c-4e9f-4b96-b12d-4ddd4fbcc20a"
					},
					"value": "301-945-1234"
				}]
			},
			"ta_orgEmployeesHigh": {
				"value": "1300"
			},
			"ta_sicClass": {
				"value": "(6311) Life Insurance"
			},
			"ta_orgFYEnd": {
				"value": "12/31/2018"
			},
			"ta_assets": {
				"value": "39180000"
			},
			"ta_annualRevenue": {
				"value": "2390000"
			},
			"ta_orgDescription": {
				"atts": {
					"rich-text": "true"
				},
				"rich-text-value": "<p>This is an example of an org description</p>"
			},
			"td_background": {
				"atts": {
					"rich-text": "true"
				},
				"rich-text-value": "<p>This is an example of an org background</p>"
			}
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