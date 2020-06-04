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
		// Make sure to get the original error with trace and everything
		console.log(error);
		throw { 'code': 500, 'message': `Service error. ${error.message}.` };
	} // end try - catch
};

let surveyObject = {
	"coverText": null,
	"survey": {
		"contactName": null,
		"contactEmail": "scott@avengers.com",
		"contactFax": "2029031222",
		"notes": null,
		"org": {
			"rid": "g",
			"organization_name": "Campbell Soup Co.",
			"addresses": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/bb93b1bb-406e-400d-95f8-5f7c1207a2ad"
				},
				"ta_street": ["1 Campbell Pl."],
				"ta_city": null,
				"ta_state": "NJ",
				"ta_postalCode": "08103-1799"
			}],
			"other_information": {
				"number_of_employees": "23000",
				"SIC_classification": "(2032) Canned Specialties",
				"fiscal_year_end": "7/29/2018",
				"assets": "14530000000",
				"annual_revenue": "8690000000"
			},
			"phones": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/5cebbb0c-d688-4a98-89ef-a883d2ce7233",
					"type": "Toll-Free"
				},
				"value": "(800) 257-8443"
			}],
			"faxes": {},
			"emails": {},
			"websites": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/e2987012-e4a6-401a-8891-527d87254ab6"
				},
				"value": "https://www.campbellsoupcompany.com/"
			}],
			"organization_personnel": [{
				"ta_positionTitle": "Senior Vice President & Chief Financial Officer",
				"td_positionTitleAbbrev": "SVP & CFO",
				"ta_emails": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/5eb41303-4963-4129-b9fa-fe3f9ba3b33b"
					},
					"value": "tony_disilvestro@campbellsoupcompany.com"
				}],
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/d726247d-9d53-4593-a8d6-92a0670ab50f"
					},
					"value": "(856) 342-4800"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/d909abb7-ae34-4505-8320-62b8f69ec3b0"
					},
					"value": "(856) 342-3878"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/2e528a15-4f67-4944-a50d-e6a650434093"
					},
					"ta_street": ["1 Campbell Pl."],
					"ta_city": "Camden",
					"ta_state": "NJ",
					"ta_postalCode": "08103-1799"
				}],
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/ab59e88e-6845-4106-8b5d-5df7af2b0768"
					},
					"value": "Mick Beekhuizen"
				},
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/54941f6d-5595-4a15-94ad-d9d605302f52"
					},
					"value": "Richard Landers"
				},
				"ta_positionTitle": "Vice President — Tax and Real Estate",
				"td_positionTitleAbbrev": "Vice President — Tax and Real Estate",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/232a2c31-e30c-4ba4-b035-78d6b9f538be"
					},
					"value": "(856) 342-4800"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/0d96edd8-0a24-4c06-b08d-38d5263f0ef6"
					},
					"value": "(856) 342-3878"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/7f8101f2-0ede-4c66-9690-8763f80cf22f"
					},
					"ta_street": ["1 Campbell Pl."],
					"ta_city": "Camden",
					"ta_state": "NJ",
					"ta_postalCode": "08103-1799"
				}],
				"ta_showOnWebInfoTab": "true"
			}, {
				"ta_person": {
					"atts": {
						"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/ab1a9c34-46fb-43dc-9633-32840a973e79"
					},
					"value": "David Vincoff"
				},
				"ta_positionTitle": "Vice President — Tax",
				"td_positionTitleAbbrev": "Vice President — Tax",
				"ta_phones": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/8652f8ea-9e6f-4ba8-a3bc-17dc47810ca6"
					},
					"value": "(856) 342-4800"
				}],
				"ta_faxes": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/ca6ceca9-c0c7-4033-9160-01c52d8d504b"
					},
					"value": "(856) 342-3878"
				}],
				"ta_address": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/13b22639-1568-4ea2-bf71-d9ac48c22641"
					},
					"ta_street": ["1 Campbell Pl."],
					"ta_city": "Camden",
					"ta_state": "NJ",
					"ta_postalCode": "08103-1799"
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