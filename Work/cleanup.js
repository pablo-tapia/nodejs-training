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
    let partialOrganization = fullOrganization.entity;

    for (const nestedProperty in partialOrganization.properties) {
        partialOrganization[nestedProperty] = partialOrganization.properties[nestedProperty];
    } // end for

    // Use this variable as a template for the final object we want to build
    // Single means the property has an object with a value or rich-text-value key
    // Multiple means the property contains an array with attributes and values
    // Parent means the property should go inside another property
    // Key is the name we want to use for the property in the final object
    let template = {
       rid: {
          type: 'single',
          key: 'rid'
       },
       ta_displayName: {
          type: 'single',
          key: 'organization_name'
       },
       addresses: {
          type: 'multiple',
          key: 'addresses'
       },
       td_irsOfficeCode: {
          type: 'single',
          key: 'irs_office_code',
          parent: 'other_information'
       },
       ta_orgEmployeesHigh: {
          type: 'single',
          key: 'number_of_employees',
          parent: 'other_information'
       },
       ta_sicClass: {
          type: 'single',
          key: 'SIC_classification',
          parent: 'other_information'
       },
       ta_annualRevenue: {
          type: 'single',
          key: 'annual_revenue',
          parent: 'other_information'
       },
       ta_assets: {
          type: 'single',
          key: 'assets',
          parent: 'other_information'
       },
       ta_orgFYEnd: {
          type: 'single',
          key: 'fiscal_year_end',
          parent: 'other_information'
       },
       td_background: {
          type: 'single',
          key: 'organization_background',
          parent: 'other_information'
       },
       ta_orgDescription: {
          type: 'single',
          key: 'organization_description',
          parent: 'other_information'
       },
       ta_emails: {
          type: 'multiple',
          key: 'emails'
       },
       ta_phones: {
          type: 'multiple',
          key: 'phones'
       },
       ta_faxes: {
          type: 'multiple',
          key: 'faxes'
       },
       ta_websites: {
          type: 'multiple',
          key: 'websites'
       },
       positions: {
          type: 'multiple',
          'key': 'organization_personnel'
       }
    };

    // Initialize the object with the RID property and define the properties
    // in the order in which we want them to appear
    let surveyOrganization = {
       rid: partialOrganization.rid,
       organization_name: '',
       addresses: [],
       other_information: {},
       phones: {},
       faxes: {},
       emails: {},
       websites: {},
       organization_personnel: []
    };

    // Remove the RID property, we're not gonna need it during the iteration
    delete partialOrganization.rid;

    for (let property in partialOrganization) {
       if (template.hasOwnProperty(property)) {
          switch (template[property].type) {
            case 'single':
               let key = partialOrganization[property].hasOwnProperty('rich-text-value') ? 'rich-text-value' : 'value';
               // If the parent property doesn't exists, let's create it
               if (template[property].hasOwnProperty('parent')) {
                  if (!surveyOrganization.hasOwnProperty(template[property]['parent'])) {
                     surveyOrganization[template[property]['parent']] = {};
                  } // end if
                  surveyOrganization[template[property]['parent']][template[property]['key']] = partialOrganization[property][key];
               } else {
                  surveyOrganization[template[property]['key']] = partialOrganization[property][key];
               } // end if - else
               break;

            case 'multiple':
               let propertyObject = partialOrganization[property].hasOwnProperty('values') ? partialOrganization[property]['values'] : partialOrganization[property];
               if (property !== 'positions') {
                  surveyOrganization[template[property]['key']] = propertyObject;
                  break;
               } // end if

               // Remove the value property inside the positions array to make it easier to read
               surveyOrganization[template[property]['key']] = [];
               for (let item of partialOrganization['positions']) {
                  let temporal = {};
                  for (let attributes in item) {
                     if (item[attributes].hasOwnProperty('atts') || Array.isArray(item[attributes]) || item[attributes].hasOwnProperty('values')) {
                        temporal[attributes] = item[attributes].hasOwnProperty('values') ? item[attributes]['values'] : item[attributes];
                        continue;
                     } // end if
                     temporal[attributes] = item[attributes]['value'];
                  } // end for
                  surveyOrganization[template[property]['key']].push(temporal);
               } // end for
               break;
          } // end switch
       } // end if
    } // end for

    console.log(JSON.stringify(surveyOrganization));
    return surveyOrganization;
}

let jsonObject = {
	"rid": "29fc7",
	"entity": {
		"rid": "29fc7",
		"type": "OrganizationType",
		"AlfrescoNodeRef": "workspace://SpacesStore/0a2405b5-de98-43b0-9d68-efbd7cd2b9ad",
		"triples": [{
			"subject": "http://ixxus.com/model/source-id#workspace://SpacesStore/0a2405b5-de98-43b0-9d68-efbd7cd2b9ad",
			"predicate": "http://taxnotes.com/model/entities/markedForDeletion",
			"object": {
				"datatype": "string",
				"value": "false"
			}
		}],
		"catchAll": "<tdcompany xmlns:taf=\"http://taxnotes.com/files#\" xmlns:ta=\"http://www.ixxus.co.uk/model/ta-cms/1.0\" xmlns:tap=\"http://www.ixxus.co.uk/model/ta-pubpipeline/1.0\" xmlns:tar=\"http://www.ixxus.co.uk/model/ta-resolver/1.0\" xmlns:app=\"http://www.alfresco.org/model/application/1.0\" xmlns:cm=\"http://www.alfresco.org/model/content/1.0\" xmlns:sys=\"http://www.alfresco.org/model/system/1.0\" xmlns:tan=\"http://www.taxnotes.com/model/ta-cms/1.0\" xmlns:td=\"http://www.taxnotes.com/model/tax-directory\">\n  <opt_num_01>8180E</opt_num_01>\n  <pub_code>GOV</pub_code>\n  <co_code>365905</co_code>\n  <br_code>0000</br_code>\n  <print_ordr>0</print_ordr>\n  <sect_fathr>8180</sect_fathr>\n  <co_name>Bank of France</co_name>\n</tdcompany>",
		"addresses": [{
			"atts": {
				"iri": "http://taxnotes.com/property/iri/d1e0aba8-23a0-4733-9a4a-5974a70f196e"
			},
			"ta_street": ["31 rue Croix des Petits Champs"],
			"ta_city": "Paris",
			"ta_postalCode": "75001",
			"ta_country": "France"
		}],
		"positions": [{
			"atts": {
				"iri": "http://taxnotes.com/property/iri/17f368c0-8cb2-4c52-abaa-13831ce6a581"
			},
			"ta_person": {
				"atts": {
					"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/3e88fe1b-6f7d-47c6-86f9-a7283d294df2"
				},
				"value": "de Galhau, François Villeroy"
			},
			"ta_positionTitle": {
				"value": "Governor"
			},
			"td_positionTitleAbbrev": {
				"value": "Governor"
			},
			"ta_phones": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/622fca6c-962f-44e2-87be-0814d8d22a98"
					},
					"value": "(33-1) 42-92-39-08"
				}]
			},
			"ta_address": [{
				"atts": {
					"iri": "http://taxnotes.com/property/iri/603fb84e-300a-4925-8a23-6ccceedd667a"
				},
				"ta_street": ["31 rue Croix des Petits Champs"],
				"ta_city": "Paris",
				"ta_postalCode": "75001",
				"ta_country": "France"
			}],
			"ta_showOnWebInfoTab": {
				"value": "true"
			}
		}],
		"properties": {
			"cm_modified": {
				"value": "2020-01-30T22:02:22Z"
			},
			"cm_created": {
				"value": "2019-04-29T16:20:55Z"
			},
			"cm_name": {
				"value": "France, Bank of France"
			},
			"ta_displayName": {
				"value": "Bank of France"
			},
			"cm_title": {
				"atts": {
					"rich-text": "true"
				},
				"rich-text-value": "<p>Bank of France</p>"
			},
			"cm_creator": {
				"value": "jaugst"
			},
			"cm_modifier": {
				"value": "zacharya"
			},
			"cm_description": {
				"value": "Official for Banque de France"
			},
			"td_shortName": {
				"value": "Bank of France"
			},
			"ta_websites": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/47d3c119-9c39-4971-afa3-8c4184a27451"
					},
					"value": "https://www.banque-france.fr/"
				}]
			},
			"ta_phones": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/e2fee372-fe66-4469-892c-0d18f08e6993"
					},
					"value": "(33-1) 42-92-42-92"
				}]
			},
			"ta_emails": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/83a294bf-93b7-47fd-8532-c9f19a711e8f"
					},
					"value": "infos@banque-france.fr"
				}]
			},
			"ta_faxes": {
				"values": [{
					"atts": {
						"iri": "http://taxnotes.com/property/iri/e2490e34-3618-4659-a0ad-717c3178e1c7"
					},
					"value": "(33-1) 42-92-39-40"
				}]
			},
			"ta_orgType": {
				"values": [{
					"value": "Government agency"
				}, {
					"value": "Financial institution"
				}]
			},
			"ta_jurisdictions": {
				"values": [{
					"value": "France"
				}]
			},
			"ta_nameVariants": {
				"values": [{
					"value": "Banque de France"
				}, {
					"value": "Bank of France"
				}]
			},
			"ta_otherIris": {
				"values": [{
					"value": "https://en.wikipedia.org/wiki/Bank_of_France"
				}]
			},
			"ta_productType": {
				"values": [{
					"value": "Tax Directory"
				}]
			},
			"ta_drupalProductSection": {
				"values": [{
					"value": "Government"
				}]
			},
			"ta_suppressOnWeb": {
				"value": "false"
			}
		}
	}
}

let jsonString = JSON.stringify(jsonObject);

organizationParser(jsonString).then(json => {
    console.log('Done');
}).catch(e => {
    console.error(e);
});