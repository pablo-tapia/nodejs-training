const pdf = require('./pdf');
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

	let cover = main.coverText;
    let survey = main.survey;

    if (!survey.hasOwnProperty('org')) {
        throw { 'code': 400, 'message': 'Bad request, an organization object is expected.' };
    } // end if

    for (let required of ['contactName', 'contactEmail', 'contactFax', 'notes']) {
        if (!survey.hasOwnProperty(required)) {
            throw { 'code': 400, 'message': `Bad request, missing property ${required}.` };
        } // end if
    } // end if

    try {
		return await pdf.createOrganizationPDF(cover, survey);
	} catch (error) {
		throw { 'code': 500, 'message': `Service error. ${error.message}` };
	}
};

let surveyObject = {
	"coverText": null,
	"survey": {
		"contactName": "Pablo Tapia",
		"contactMethod": "email",
		"contactEmail": "pablo@45rpm.co",
		"contactFax": "(555) 555-5555",
		"notes": "Example notes Example notes Example notes Example notes Example notes Example notes Example notes",
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