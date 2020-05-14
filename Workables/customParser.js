/**
 * This function converts an object in JSOn format that represents an
 * organization into a lighter version that can be used to create a PDF
 * file.
 *
 * @param {String} json 
 */
let organizationParser = async (json) => {

    let fullOrganization = null;

    try {
         fullOrganization = JSON.parse(json);
    } catch (Error) {
        throw { 'code': 400, 'message': `Malformed request, ${Error.message}` };
    } // end try - catch

    // Let's put all properties at the same level
    let surveyOrganization = fullOrganization.entity;
    for (const nestedProperty in surveyOrganization.properties) {
        organizationEntity[nestedProperty] = surveyOrganization.properties[nestedProperty];
    } // end for

    delete surveyOrganization.properties;

    let allowedProperties = [
        'rid',
        'ta_displayName',
        'addresses',
        'ta_orgEmployeesHigh',
        'ta_sicClass',
        'ta_annualRevenue',
        'ta_assets',
        'ta_orgFYEnd',
        'ta_emails',
        'ta_phones',
        'ta_faxes',
        'ta_websites',
        'positions'
    ];

    for (const property in surveyOrganization) {
        if (!allowedProperties.includes(property)) {
            delete surveyOrganization[property];
        } // end if
    } // end for

    console.log(JSON.stringify(surveyOrganization));
    return surveyOrganization;
}

let jsonObject = {};

let jsonString = JSON.stringify(jsonObject);

organizationParser(jsonString).then(json => {
    console.log('Done');
}).catch(e => {
    console.error(e);
});