require('dotenv').config({ path: __dirname + '/.env'});

const transactionsDbId = 'ebd30cb3769041bc87618a7f3c2ce145';
const investmentsDbId  = '2e898d3c7f2b4f2da0aeb466c39c8bc3';
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN  });
const debug = true

if(debug)
{
	update();
}

async function update()
{
	try 
	{
  	const databaseId = transactionsDbId;
  	const response = 
    await notion.databases.query({
    database_id: databaseId,
    filter: {
		 and: 
		 [
			{
         		property: 'Investments',
         		relation: 
				{
					is_empty: true
          		}
			},
			
		]
    }});

	let parsedVar = JSON.parse(JSON.stringify(response));

	let test = parsedVar.results;
	console.log(test)
	for (let element of test)
	{
  	// test.forEach(element => {
   	//	let element = test[0]; 

	console.log(JSON.stringify(element))

	let tansactionPageId = element.id
	let symbol = element.properties.SymbolCalculated.formula.string

	if(debug)
	{
		console.log(tansactionPageId)
		console.log("SYMBOL: " + symbol)
	}
	if(symbol == "")
	{
		//return;
	}

	// Serch investments DB for symbol 
	let symbolSearch = await notion.databases.query({
		database_id: investmentsDbId,
		filter: {
			  property: 'Symbol',
			  "rich_text": {
				"equals": symbol
				}
		}});
	


	let symbolSearchResults = JSON.parse(JSON.stringify(symbolSearch));
	let symbolSearchResult = symbolSearchResults.results[0];
	var investmentPageId = "";
	if(symbolSearchResult == null)
	{
		if(debug)
		{
			console.log("NULL")
		}
		let newPageResponse = await notion.pages.create(
			{
				"parent": {
					"type": "database_id",
					"database_id": investmentsDbId
				},
				"properties": {
					"Symbol": {
						"title": 
						[
							{
								"text": 
								{
									"content": symbol
								}
							}
						]
						
					}
				}
			});
		
		let newPageResponseParsed = JSON.parse(JSON.stringify(newPageResponse));
		var investmentPageId = newPageResponseParsed.id
		console.log(newPageResponseParsed)
			  
	}
	else
	{
		var investmentPageId = symbolSearchResult.id
		if(debug)
		{
			console.log(symbolSearchResult)
			console.log(investmentPageId)
		}
	}

	
	
	
		// Link transaction record to invesment 
		
		let update = await notion.pages.update({
			page_id: tansactionPageId,
			properties: {
			  'Investments': {
				relation: [
					{
						id: investmentPageId
					}
				]
			  }
			},
		  });
	
		  console.log(update);
	


	  
	}
}
  catch (error)
  {
	console.log(error);
  }
}

function CreateUpdate(pageId, pageTitle, projects) {

	
}

function ArchivePage (pageId) {
	notion.pages.update({
		page_id: pageId,
		archived: true	
		});
}	


module.exports.update = update