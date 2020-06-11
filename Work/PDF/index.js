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

    try {
		let asBase64 = await pdf.createOrganizationPDF(cover, survey);
		return { pdf: asBase64 };
	} catch (error) {
		// Make sure to get the original error with trace and everything
		console.log(error);
		throw { 'code': 500, 'message': `Service error. ${error.message}.` };
	} // end try - catch
};

let surveyObject = {
	"coverText": "<p>Hello</p>",
	"survey": {
		"contactName": null,
		"contactEmail": "scott@avengers.com",
		"contactFax": "2029031222",
		"notes": null,
		"org": {
			"rid": "29fc7",
			"organization_name": "Bank of France",
			"addresses": [],
			"other_information": {},
			"phones": {},
			"faxes": {},
			"emails": {},
			"websites": {},
			"organization_personnel": [{
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/3e88fe1b-6f7d-47c6-86f9-a7283d294df2"
					},
					"value": "de Galhau, François Villeroy"
				},
				"ta_positionTitle": "Governor",
				"td_positionTitleAbbrev": "Governor",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/622fca6c-962f-44e2-87be-0814d8d22a98"
					},
					"value": "(33-1) 42-92-39-08"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/603fb84e-300a-4925-8a23-6ccceedd667a"
					},
					"ta_street": ["31 rue Croix des Petits Champs"],
					"ta_city": "Paris",
					"ta_postalCode": "75001",
					"ta_country": "France"
				}],
				"ta_showOnWebInfoTab": "true"
			}]
		}
	}
}

let jsonString = JSON.stringify(surveyObject);

createPdfFrom(jsonString).then(response => {
    // Save to file
    let base64File = response.pdf.split(';base64,').pop();
    fs.writeFile('organization.pdf', base64File, { encoding: 'base64'}, err => console.log('File created'));
}).catch(error => {
	console.error(error);
});