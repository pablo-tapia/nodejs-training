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
			"rid": "2b2jt",
			"organization_name": "Masco Corp.",
			"addresses": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/9584b035-fd2e-46b6-aa2f-63de57180598"
				},
				"ta_street": ["17450 College Pkwy."],
				"ta_city": "Livonia",
				"ta_state": "MI",
				"ta_postalCode": "48152"
			}],
			"other_information": {
				"assets": "5390000000",
				"annual_revenue": "8360000000",
				"fiscal_year_end": "12/31/2018",
				"number_of_employees": "26000",
				"SIC_classification": "(2434) Wood Kitchen Cabinets"
			},
			"phones": [{
				"atts": {
					"type": "Toll-Free",
					"iri": "http://taxnotes.com/property/iri/d29903fd-65be-4183-a110-b8af311e6f48"
				},
				"value": "(888) 627-6397"
			}],
			"faxes": {},
			"emails": {},
			"websites": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/4f7afcf0-e6e2-4095-af8d-31208ddb7007"
				},
				"value": "http://www.masco.com"
			}, {
				"atts": {
					"iri": "workspace://SpacesStore/df9048dd-1cc8-4e48-bd44-8639b7d78f43"
				},
				"value": "http://masco.com/"
			}],
			"organization_personnel": [{
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/0cf96d6d-e185-479b-b38e-78ee8b2680b7"
					},
					"value": "Sznewajs, John"
				},
				"ta_positionTitle": "Vice President & Chief Financial Officer",
				"td_positionTitleAbbrev": "VP & CFO",
				"ta_emails": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/e1fd704d-b3dc-45d4-a08a-93c8191db452"
					},
					"value": "john.sznewajs@masco.com"
				}],
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/14937fa0-b922-4084-a02e-52d6831b6dd8"
					},
					"value": "(313) 274-7400"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/f7cfef46-ea1f-46eb-a97c-04627dcf684a"
					},
					"value": "(313) 792-4177"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/08b59c73-9fc8-4a34-9d9e-411a784f3870"
					},
					"ta_street": ["17450 College Pkwy."],
					"ta_city": "Livonia",
					"ta_state": "MI",
					"ta_postalCode": "48152"
				}],
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/227e8e00-f211-4c46-8c07-3c455f2f4b15"
					},
					"value": "Leaman, Larry"
				},
				"ta_positionTitle": "Vice President--Global Taxes",
				"td_positionTitleAbbrev": "Vice President--Global Taxes",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/647d83d9-a431-40b7-b58a-7f19fa8f732c"
					},
					"value": "(313) 274-7400"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/97c037b3-b799-4d86-b7db-27d3c22e58fa"
					},
					"value": "(313) 792-4177"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/43f4a63f-68a4-43ab-87fb-c51805d5c017"
					},
					"ta_street": ["17450 College Pkwy."],
					"ta_city": "Livonia",
					"ta_state": "MI",
					"ta_postalCode": "48152"
				}],
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/d65188fa-fee0-4032-8044-b883f4f946b6"
					},
					"value": "Deschamps, David"
				},
				"ta_positionTitle": "Director--International Taxes",
				"td_positionTitleAbbrev": "Director--International Taxes",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/7105d7d2-f880-4207-8a4f-f9fb428e4906"
					},
					"value": "(313) 274-7400"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/e0155021-5ad1-4f7a-9b24-e1bd351b8794"
					},
					"value": "(313) 792-4177"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/812aa92a-3e3c-44a3-87ed-d9c01f521cdc"
					},
					"ta_street": ["17450 College Pkwy."],
					"ta_city": "Livonia",
					"ta_state": "MI",
					"ta_postalCode": "48152"
				}],
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/051de777-34c6-48be-9b5f-dfe5e2faad7e"
					},
					"value": "Molesky, Diane"
				},
				"ta_positionTitle": "Director--Tax Planning & Administration",
				"td_positionTitleAbbrev": "Director--Tax Plan & Admin",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/f32fe58a-44dd-4257-aeda-b6493f13425b"
					},
					"value": "(313) 274-7400"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/e72dea4f-1a1f-40e5-bc11-96128fb55c30"
					},
					"value": "(313) 792-4177"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/ca7bdee9-0d5b-4197-a5e5-17b7d4d3880e"
					},
					"ta_street": ["17450 College Pkwy."],
					"ta_city": "Livonia",
					"ta_state": "MI",
					"ta_postalCode": "48152"
				}],
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/54250d70-cf5d-475b-a7db-e90f8fe50883"
					},
					"value": "Thornton, Jared"
				},
				"ta_positionTitle": "Manager--Tax Accounting & Federal Tax Compliance",
				"td_positionTitleAbbrev": "Manager--Tax Acctg & Federal T",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/db880bf4-c6b3-4885-942e-ee68da0cf521"
					},
					"value": "(313) 274-7400"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/7a504166-d630-4f1b-b4db-120320a4c48e"
					},
					"value": "(313) 792-4177"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/a7a96064-989f-4e7a-9779-c0b4e32db49e"
					},
					"ta_street": ["17450 College Pkwy."],
					"ta_city": "Livonia",
					"ta_state": "MI",
					"ta_postalCode": "48152"
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