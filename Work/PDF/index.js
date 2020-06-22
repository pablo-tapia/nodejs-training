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

	let cover = main.coverText || null;
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
	"survey": {
		"contactName": "Lin",
		"contactMethod": "email",
		"contactEmail": "lin.li@taxanalysts.org",
		"contactFax": "123456789",
		"orgRidRef": "3578g",
		"org": {
			"rid": "3578g",
			"organization_name": "Test organization",
			"addresses": [{
				"atts": {
					"iri": "workspace://SpacesStore/b9ab4351-ae53-42b3-b7d8-a629d25e5f18",
					"type": "Mailing"
				},
				"ta_street": ["first 400 South Maple Avenue ", "second line"],
				"ta_city": "Falls Church",
				"ta_state": "VIRGINIA",
				"ta_postalCode": "22046"
			}, {
				"atts": {
					"label": "Address label 2",
					"iri": "workspace://SpacesStore/3a3dd60c-fe23-4f85-8ed8-4b70ca7dca72"
				},
				"ta_street": ["test1 400 South Maple Avenue 2", "test 2 address"],
				"ta_city": "Falls Church",
				"ta_state": "VIRGINIA",
				"ta_postalCode": "22046"
			}, {
				"atts": {
					"iri": "workspace://SpacesStore/f250d265-424f-482b-af16-bd383dd8ed98"
				},
				"ta_street": ["400 South Maple Avenue 3", "street test second line"],
				"ta_city": "Falls Church",
				"ta_state": "VIRGINIA",
				"ta_postalCode": "22046"
			}],
			"other_information": {
				"number_of_employees": "444",
				"SIC_classification": "abc",
				"irs_office_code": "ABC",
				"fiscal_year_end": "0620",
				"assets": "232890000000d",
				"annual_revenue": "232890000000",
				"organization_description": "<p>This is the Description</p>\n<p>for the </p>\n<p>org</p>",
				"organization_background": "<p>This is the background for the org</p>"
			},
			"phones": [{
				"atts": {
					"iri": "workspace://SpacesStore/5ba87980-e537-4267-b346-93a3cbeb658a",
					"type": "Toll-Free"
				},
				"value": "1111111111111"
			}, {
				"atts": {
					"label": "Phone label 1",
					"iri": "workspace://SpacesStore/f34b74bd-50ad-401f-90f2-983519ee7db8"
				},
				"value": "222222222222"
			}],
			"faxes": [{
				"atts": {
					"label": "Fax label 1",
					"iri": "workspace://SpacesStore/e86004c9-3221-437c-8149-2f10944eff7f",
					"type": "1111111111"
				},
				"value": "111111111"
			}, {
				"atts": {
					"iri": "workspace://SpacesStore/8db3693c-974a-4cf0-98e7-7dda0a4038e4",
					"type": "3333333333"
				},
				"value": "333333"
			}],
			"emails": [{
				"atts": {
					"label": "Email label 1",
					"iri": "workspace://SpacesStore/94ed94c3-ca72-40a1-8e58-374e2b0351f4",
					"type": "personal 22222222222"
				},
				"value": "test2@test.org"
			}, {
				"atts": {
					"iri": "workspace://SpacesStore/12c81d0d-6010-477e-9cc4-fb8ad8f0a36c",
					"type": "personal 3333333333"
				},
				"value": "test3@test.org"
			}],
			"websites": [{
				"atts": {
					"iri": "workspace://SpacesStore/f5968322-c5be-4271-9b7f-cba8f811f2c7",
					"type": "33333333333"
				},
				"value": "http://test3.org"
			}, {
				"atts": {
					"type": "4444444444444444",
					"iri": "workspace://SpacesStore/15d280fb-ca69-4aa5-b72a-4de1357948eb"
				},
				"value": ""
			}],
			"organization_personnel": [{
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/3174b10a-4171-4d0a-9814-4ea7603b992e"
					},
					"value": "Lin Li cm:name"
				},
				"ta_positionTitle": "Test",
				"ta_address": [{
					"atts": {
						"iri": "workspace://SpacesStore/c94d21b6-b01b-4bfa-9898-73adca831d60"
					},
					"ta_city": "new york city",
					"ta_state": "fdsa",
					"ta_postalCode": "22046",
					"ta_street": ["400 S str (first line)", "second line"]
				}],
				"td_positionTitleAbbrev": "Test",
				"ta_showOnWebInfoTab": "true",
				"td_positionUnit": "Position Unit test",
				"ta_positionLocation": "position location test",
				"ta_phones": [{
					"atts": {
						"iri": "workspace://SpacesStore/56ad9d62-1b96-478d-9f4b-5cc66a3df664"
					},
					"value": "2222222 position hone"
				}, {
					"atts": {
						"iri": "workspace://SpacesStore/4b5008a8-2481-428e-a3bd-c83ec5db6772"
					},
					"value": "3333333 position hone"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "workspace://SpacesStore/07753ebe-ce2f-4863-86b4-3ed884138088"
					},
					"value": "1111111 position fax"
				}, {
					"atts": {
						"iri": "workspace://SpacesStore/b938cc82-f05e-4c86-a05b-1561724999ac"
					},
					"value": "2222 position fax"
				}],
				"ta_emails": [{
					"atts": {
						"iri": "workspace://SpacesStore/f06320a7-610b-4f83-b598-df05cc884f82"
					},
					"value": "rwdhd@gmail.com"
				}, {
					"atts": {
						"iri": "workspace://SpacesStore/5a111905-1451-4710-bca4-0daf57b9e6be"
					},
					"value": "adhgaj@test.com"
				}]
			}, {
				"ta_showOnWebInfoTab": "true",
				"ta_positionTitle": "Vacant tada",
				"ta_vacant": "Vacant name"
			}, {
				"ta_showOnWebInfoTab": "false",
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/3174b10a-4171-4d0a-9814-4ea7603b992e"
					},
					"value": "Lin Li cm:name"
				},
				"ta_positionTitle": "Test title with abbreviation",
				"td_positionTitleAbbrev": "ttwa"
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