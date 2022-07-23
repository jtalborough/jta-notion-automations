

var projectsProcess = require( './CompletedProjects.js');
projectsProcess.update()
var tasksProcess = require( './CompletedTasks.js');
var tasksDroppedProcess = require( './DroppedTasks.js');
tasksProcess.update()
setInterval(tasksProcess.update, 300000)
setInterval(tasksDroppedProcess.update, 300000)
setInterval(projectsProcess.update, 300000)

  //response.map(({results})=> console.log(response)) 
  
  //console.log(response);


