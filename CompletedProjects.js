const TasksDbId = '34c6376362f14537b4a63acc7953b2e0'
const updatesDbId  = 'df6ae9e608054bc19a6b0aaa9fdbdf2c';
require('dotenv').config({ path: __dirname + '/.env'});

console.log(__dirname);
console.log(process.env);
//console.log(process.env.NOTION_ACCESS_TOKEN);
//import { env } from "process";
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN  });

async function update()
{
	try 
	{
  	const databaseId = TasksDbId;
  	const response = 
    await notion.databases.query({
    database_id: databaseId,
    filter: {
          property: 'Status',
          select: {
            equals: 'Done'
          }
    }});

  let parsedVar = JSON.parse(JSON.stringify(response));
  console.log(parsedVar);
  let test = parsedVar.results;
  // console.log(JSON.stringify(test[0]));
  test.forEach(element => {
   	// let element = test[0]; 
	   
      let id = element.id;
      //element.properties.Task.title[0].text.content
      let area = element.properties.Area.relation;
      console.log(JSON.stringify('ID: \'' + id+ '\''));
      //console.log(JSON.stringify('TITLE: ' + title));
      console.log('Project: ' + JSON.stringify(area));
	  if(element.properties.Name.title[0] == null)
	  {
		
		ArchivePage(id);
	  }
	  else 
	  {
	  	CreateUpdate(id, element.properties.Name.title[0].text.content, area);
	 	 ArchivePage(id);
	  }
   


  	});
	}
  catch (error)
  {
	console.log(error);
  }
}

function CreateUpdate(pageId, pageTitle, projects) {
	let data = {
		parent: {
			database_id: updatesDbId,
		},
		icon: {
			 type: "emoji",
			 emoji: "☑️"
		},
		properties: {
	   		Name:{
		   		title: [{
			   		text: {
				 		content: 'Completed: ' + pageTitle,
			   			},
			 		},
		   		],
		 	},
		 	Type: {
		   		select: {
			 	name: 'Completed Project.'
		   		}
		 	}
			
		 },
		 children: 
		 [
			{
		   "type": "heading_3",
		   //...other keys excluded
		   "heading_3": {
			 "rich_text": [{
			   "type": "text",
			   "text": {
				 "content": "Task:",
				 "link": null
			   }
			 }],
			 "color": "default"
		   }
		   },
		   {
			 object: 'block',
			 "type": "link_to_page",
			 "link_to_page": 
			   {
				 "type": "page_id",
				 "page_id": pageId
			   }
		   },
			{
		   "type": "heading_3",
		   //...other keys excluded
		   "heading_3": {
			 "rich_text": [{
			   "type": "text",
			   "text": {
				 "content": "Project:",
				 "link": null
			   }
			 }],
			 "color": "default"
		   }
		   },
		   /*
		   {
			 object: 'block',
			 "type": "link_to_page",
			 "link_to_page": 
            {
              "type": "page_id",
              "page_id": projects[0]
            }
        	}*/
	]}
	//let parse = JSON.parse(projects);
	//console.log(JSON.stringify(data));
	
	
	if(projects[0] != null)
	{
		data.properties['🏗️ ProjectsDB'] = {};
		data.properties['🏗️ ProjectsDB']['relation'] = projects;
		projects.forEach(element => {
			data.children.push(
				{
					"object": "block",
					"type": "link_to_page",
					"link_to_page": {
						"type": "page_id",
						"page_id": element.id
					}
				},
			)
		});
		
	}

	
	console.log(JSON.stringify(data));
	const response =  notion.pages.create(data);
	
}

function ArchivePage (pageId) {
	notion.pages.update({
		page_id: pageId,
		archived: true	
		});
}	


module.exports.update = update