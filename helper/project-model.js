const db = require('../dbConnecton.js')
const mapper = require('./mappers.js')


module.exports = {
    find,
    findById,
    findTask,
    findResource,
    update,
    remove,
    add,
    addTask,
    addResource,
    getProjectTask,
    getProjectResource,

}
function find (){
    return db('projects')
}
function findById(id){
    let query = db('projects')
    if(id){
        return query
            .where({id})
            .first();
    }
}

// get tasks by project id display task and project name project description 
function findTask(id){
    let query = db('tasks');
    if(id) {
        query
        .join('projects')
        .where('projects.id', id)
        .first();
        const promise = [query, getProjectTask(id), getProjectResource(id)];
        return Promise.all(promise)
            .then( results => {
                const [projects, tasks, resources] = results;
                if (projects){
                    projects.tasks = tasks;
                    projects.resource = resources;
                    return mapper.projectToBody(projects);
                }else{
                    return null;
                }
            });
        
    }else{
        return query.then(project=> {
            return project.map(pro => mapper.projectToBody(pro));
        })
    }
    
}
// find the resource by project id return both project data and resource data
function findResource(id){
    let query = db('resources');
    if(id) {
        query
        .join('projects')
        .where('projects.id', id)
        .first();
        const promise = [query, getProjectResource(id)];
        return Promise.all(promise)
            .then( results => {
                const [projects,  resources] = results;
                if (projects){
                    projects.resource = resources;
                    return mapper.projectToBody(projects);
                }else{
                    return null;
                }
            });
        
    }else{
        return query.then(project=> {
            return project.map(pro => mapper.projectToBody(pro));
        })
    }
    
}
function add(project){
    return db('projects')
        .insert(project, 'id')
        .then(([id]) => findById(id))
}
function addTask(task){
    return db('tasks')
        .insert(task, 'id')
        // .then(([id]) => findById(id))
}
function addResource(resource){
    return db('resources')
        .insert(resource, 'id')
}
function update(change, id){
    return db('projects')
        .where({id})
        .update(change)
        .then(count => count > 0 ? findById(id) : null)
}
function remove(id){
    return db('projects')
        .where('id', id)
        .del();
}

function getProjectTask(projectId){
    return db('projects')
        .join('tasks')
        .where('project_id', projectId)
        .then(tasks => tasks.map(task => mapper.tasksToBody(task)));
}
//to get te resources pass in to findresource
function getProjectResource(projectId ){
    return db('resources')
        .where('project_id',projectId)
        .then(resources => resources.map(resource => mapper.resourcesTobody(resource)));
}
