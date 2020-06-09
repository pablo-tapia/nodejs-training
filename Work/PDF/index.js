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
		"org": {}
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