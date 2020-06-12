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
	"rid": "2b2jt",
	"entity": {
	   "rid": "2b2jt",
	   "type": "OrganizationType",
	   "AlfrescoNodeRef": "workspace://SpacesStore/a589dd7e-1b82-4d61-ab4f-b18993156b33",
	   "triples": [{
		  "subject": "http://ixxus.com/model/source-id#workspace://SpacesStore/a589dd7e-1b82-4d61-ab4f-b18993156b33",
		  "predicate": "http://taxnotes.com/model/entities/markedForDeletion",
		  "object": {
			 "datatype": "string",
			 "value": "false"
		  }
	   }],
	   "catchAll": "\n                    \n<tdcompany xmlns:cm=\"http://www.alfresco.org/model/content/1.0\" xmlns:sys=\"http://www.alfresco.org/model/system/1.0\" xmlns:ta=\"http://www.ixxus.co.uk/model/ta-cms/1.0\" xmlns:tap=\"http://www.ixxus.co.uk/model/ta-pubpipeline/1.0\" xmlns:taf=\"http://taxnotes.com/files#\" xmlns:tar=\"http://www.ixxus.co.uk/model/ta-resolver/1.0\" xmlns:app=\"http://www.alfresco.org/model/application/1.0\" xmlns:td=\"http://www.taxnotes.com/model/tax-directory\">\n  <pub_code>CTM</pub_code>\n  <co_code>370730</co_code>\n  <br_code>0000</br_code>\n  <print_ordr>0</print_ordr>\n  <co_name>Masco Corp.</co_name>\n</tdcompany>\n\n                ",
	   "addresses": [{
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/9584b035-fd2e-46b6-aa2f-63de57180598"
		  },
		  "ta_street": ["17450 College Pkwy."],
		  "ta_city": "Livonia",
		  "ta_state": "MI",
		  "ta_postalCode": "48152"
	   }],
	   "positions": [{
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/a278f04c-93dc-496e-bead-c7c4cee6f086"
		  },
		  "ta_person": {
			 "atts": {
				"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/0cf96d6d-e185-479b-b38e-78ee8b2680b7"
			 },
			 "value": "Sznewajs, John"
		  },
		  "ta_positionTitle": {
			 "value": "Vice President & Chief Financial Officer"
		  },
		  "td_positionTitleAbbrev": {
			 "value": "VP & CFO"
		  },
		  "ta_emails": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/e1fd704d-b3dc-45d4-a08a-93c8191db452"
				},
				"value": "john.sznewajs@masco.com"
			 }]
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/14937fa0-b922-4084-a02e-52d6831b6dd8"
				},
				"value": "(313) 274-7400"
			 }]
		  },
		  "ta_faxes": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/f7cfef46-ea1f-46eb-a97c-04627dcf684a"
				},
				"value": "(313) 792-4177"
			 }]
		  },
		  "ta_address": [{
			 "atts": {
				"iri": "http://taxnotes.com/property/iri/08b59c73-9fc8-4a34-9d9e-411a784f3870"
			 },
			 "ta_street": ["17450 College Pkwy."],
			 "ta_city": "Livonia",
			 "ta_state": "MI",
			 "ta_postalCode": "48152"
		  }],
		  "ta_showOnWebInfoTab": {
			 "value": "true"
		  }
	   }, {
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/2e40f6d2-10ee-4e7e-b606-9724aa80963f"
		  },
		  "ta_person": {
			 "atts": {
				"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/227e8e00-f211-4c46-8c07-3c455f2f4b15"
			 },
			 "value": "Leaman, Larry"
		  },
		  "ta_positionTitle": {
			 "value": "Vice President--Global Taxes"
		  },
		  "td_positionTitleAbbrev": {
			 "value": "Vice President--Global Taxes"
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/647d83d9-a431-40b7-b58a-7f19fa8f732c"
				},
				"value": "(313) 274-7400"
			 }]
		  },
		  "ta_faxes": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/97c037b3-b799-4d86-b7db-27d3c22e58fa"
				},
				"value": "(313) 792-4177"
			 }]
		  },
		  "ta_address": [{
			 "atts": {
				"iri": "http://taxnotes.com/property/iri/43f4a63f-68a4-43ab-87fb-c51805d5c017"
			 },
			 "ta_street": ["17450 College Pkwy."],
			 "ta_city": "Livonia",
			 "ta_state": "MI",
			 "ta_postalCode": "48152"
		  }],
		  "ta_showOnWebInfoTab": {
			 "value": "true"
		  }
	   }, {
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/8569129f-93e0-42ca-8181-b68e265e7b29"
		  },
		  "ta_person": {
			 "atts": {
				"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/d65188fa-fee0-4032-8044-b883f4f946b6"
			 },
			 "value": "Deschamps, David"
		  },
		  "ta_positionTitle": {
			 "value": "Director--International Taxes"
		  },
		  "td_positionTitleAbbrev": {
			 "value": "Director--International Taxes"
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/7105d7d2-f880-4207-8a4f-f9fb428e4906"
				},
				"value": "(313) 274-7400"
			 }]
		  },
		  "ta_faxes": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/e0155021-5ad1-4f7a-9b24-e1bd351b8794"
				},
				"value": "(313) 792-4177"
			 }]
		  },
		  "ta_address": [{
			 "atts": {
				"iri": "http://taxnotes.com/property/iri/812aa92a-3e3c-44a3-87ed-d9c01f521cdc"
			 },
			 "ta_street": ["17450 College Pkwy."],
			 "ta_city": "Livonia",
			 "ta_state": "MI",
			 "ta_postalCode": "48152"
		  }],
		  "ta_showOnWebInfoTab": {
			 "value": "true"
		  }
	   }, {
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/77017077-bac6-4a63-8621-37cc0d46fa08"
		  },
		  "ta_person": {
			 "atts": {
				"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/051de777-34c6-48be-9b5f-dfe5e2faad7e"
			 },
			 "value": "Molesky, Diane"
		  },
		  "ta_positionTitle": {
			 "value": "Director--Tax Planning & Administration"
		  },
		  "td_positionTitleAbbrev": {
			 "value": "Director--Tax Plan & Admin"
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/f32fe58a-44dd-4257-aeda-b6493f13425b"
				},
				"value": "(313) 274-7400"
			 }]
		  },
		  "ta_faxes": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/e72dea4f-1a1f-40e5-bc11-96128fb55c30"
				},
				"value": "(313) 792-4177"
			 }]
		  },
		  "ta_address": [{
			 "atts": {
				"iri": "http://taxnotes.com/property/iri/ca7bdee9-0d5b-4197-a5e5-17b7d4d3880e"
			 },
			 "ta_street": ["17450 College Pkwy."],
			 "ta_city": "Livonia",
			 "ta_state": "MI",
			 "ta_postalCode": "48152"
		  }],
		  "ta_showOnWebInfoTab": {
			 "value": "true"
		  }
	   }, {
		  "atts": {
			 "iri": "http://taxnotes.com/property/iri/f4cc9619-2219-49b4-8a8c-47dc288766c6"
		  },
		  "ta_person": {
			 "atts": {
				"iri-ref": "http://ixxus.com/model/source-id#workspace://SpacesStore/54250d70-cf5d-475b-a7db-e90f8fe50883"
			 },
			 "value": "Thornton, Jared"
		  },
		  "ta_positionTitle": {
			 "value": "Manager--Tax Accounting & Federal Tax Compliance"
		  },
		  "td_positionTitleAbbrev": {
			 "value": "Manager--Tax Acctg & Federal T"
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/db880bf4-c6b3-4885-942e-ee68da0cf521"
				},
				"value": "(313) 274-7400"
			 }]
		  },
		  "ta_faxes": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/7a504166-d630-4f1b-b4db-120320a4c48e"
				},
				"value": "(313) 792-4177"
			 }]
		  },
		  "ta_address": [{
			 "atts": {
				"iri": "http://taxnotes.com/property/iri/a7a96064-989f-4e7a-9779-c0b4e32db49e"
			 },
			 "ta_street": ["17450 College Pkwy."],
			 "ta_city": "Livonia",
			 "ta_state": "MI",
			 "ta_postalCode": "48152"
		  }],
		  "ta_showOnWebInfoTab": {
			 "value": "true"
		  }
	   }],
	   "properties": {
		  "cm_created": {
			 "value": "2019-10-28T17:26:27Z"
		  },
		  "cm_modified": {
			 "value": "2019-10-28T17:26:27Z"
		  },
		  "cm_name": {
			 "value": "Masco Corp."
		  },
		  "cm_description": {
			 "value": "OFFICIAL"
		  },
		  "cm_title": {
			 "atts": {
				"rich-text": "true"
			 },
			 "rich-text-value": "\n                    \n<p>Masco Corp.</p>\n\n                "
		  },
		  "cm_creator": {
			 "value": "zacharya"
		  },
		  "cm_modifier": {
			 "value": "zacharya"
		  },
		  "ta_displayName": {
			 "value": "Masco Corp."
		  },
		  "ta_suppressOnWeb": {
			 "value": "false"
		  },
		  "td_shortName": {
			 "value": "Masco Corp."
		  },
		  "ta_websites": {
			 "values": [{
				"atts": {
				   "iri": "http://taxnotes.com/property/iri/4f7afcf0-e6e2-4095-af8d-31208ddb7007"
				},
				"value": "http://www.masco.com"
			 }, {
				"atts": {
				   "iri": "workspace://SpacesStore/df9048dd-1cc8-4e48-bd44-8639b7d78f43"
				},
				"value": "http://masco.com/"
			 }]
		  },
		  "ta_phones": {
			 "values": [{
				"atts": {
				   "type": "Toll-Free",
				   "iri": "http://taxnotes.com/property/iri/d29903fd-65be-4183-a110-b8af311e6f48"
				},
				"value": "(888) 627-6397"
			 }]
		  },
		  "ta_assets": {
			 "value": "5390000000"
		  },
		  "ta_annualRevenue": {
			 "value": "8360000000"
		  },
		  "ta_orgFYEnd": {
			 "value": "12/31/2018"
		  },
		  "ta_orgEmployeesHigh": {
			 "value": "26000"
		  },
		  "ta_orgEmployeesLow": {
			 "value": "26000"
		  },
		  "ta_sicClass": {
			 "value": "(2434) Wood Kitchen Cabinets"
		  },
		  "ta_jurisdictions": {
			 "values": [{
				"value": "United States"
			 }]
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
		  "ta_orgType": {
			 "values": [{
				"value": "Corporation"
			 }, {
				"value": "Public"
			 }, {
				"value": "Fortune 500"
			 }]
		  },
		  "ta_nameVariants": {
			 "values": [{
				"value": "Masco"
			 }, {
				"value": "Masco Corporation"
			 }]
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