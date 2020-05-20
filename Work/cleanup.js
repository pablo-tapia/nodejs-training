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
   "rid": "35xwq",
   "entity": {
      "rid": "35xwq",
      "type": "OrganizationType",
      "AlfrescoNodeRef": "workspace://SpacesStore/3e39531d-b1e7-4aeb-9584-7c4b1dc36636",
      "triples": [{
         "subject": "http://ixxus.com/model/source-id#workspace://SpacesStore/3e39531d-b1e7-4aeb-9584-7c4b1dc36636",
         "predicate": "http://taxnotes.com/model/entities/markedForDeletion",
         "object": {
            "datatype": "string",
            "value": "false"
         }
      }],
      "catchAll": "<tdcompany xmlns:taf=\"http://taxnotes.com/files#\" xmlns:ta=\"http://www.ixxus.co.uk/model/ta-cms/1.0\" xmlns:tap=\"http://www.ixxus.co.uk/model/ta-pubpipeline/1.0\" xmlns:tar=\"http://www.ixxus.co.uk/model/ta-resolver/1.0\" xmlns:app=\"http://www.alfresco.org/model/application/1.0\" xmlns:cm=\"http://www.alfresco.org/model/content/1.0\" xmlns:sys=\"http://www.alfresco.org/model/system/1.0\" xmlns:tan=\"http://www.taxnotes.com/model/ta-cms/1.0\" xmlns:td=\"http://www.taxnotes.com/model/tax-directory\">\n  <pub_code>CTM</pub_code>\n  <co_code>378086</co_code>\n  <br_code>0000</br_code>\n  <print_ordr>0</print_ordr>\n  <co_name>Ohio National Financial Services</co_name>\n</tdcompany>",
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
      "properties": {
         "cm_modified": {
            "value": "2020-05-15T13:50:05Z"
         },
         "cm_created": {
            "value": "2018-06-27T00:00:00Z"
         },
         "cm_name": {
            "value": "Ohio National Financial Services"
         },
         "ta_displayName": {
            "value": "Ohio National Financial Services"
         },
         "cm_title": {
            "atts": {
               "rich-text": "true"
            },
            "rich-text-value": "<p>Ohio National Financial Services</p>"
         },
         "cm_modifier": {
            "value": "demianh"
         },
         "cm_description": {
            "value": "OFFICIAL"
         },
         "td_shortName": {
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
         "ta_orgEmployeesLow": {
            "value": "1300"
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
         "ta_orgType": {
            "values": [{
               "value": "Mutual company"
            }, {
               "value": "Fortune 1000"
            }]
         },
         "ta_jurisdictions": {
            "values": [{
               "value": "Unassigned Jurisdiction"
            }]
         },
         "ta_annualRevenue": {
            "value": "2390000"
         },
         "ta_explanatory": {
            "atts": {
               "rich-text": "true"
            },
            "rich-text-value": "<p>This is an example of an explanation</p>"
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
         },
         "ta_productType": {
            "values": [{
               "value": "Tax Directory"
            }]
         },
         "ta_drupalProductSection": {
            "values": [{
               "value": "Businesses"
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