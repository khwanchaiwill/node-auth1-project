const db = require("../dbConnecton.js");
const mapper = require('./mapper');

module.exports = {
    find,
    findBy,
    findById,
    findProject,
    add, 
    addProject,
    update,
    remove,
    getUserProject,
}

function find() {
    return db('users')
}
function findBy(user) {
    return db("users").where(user).orderBy("id");
  }
function findById(id) {
    let query = db('users')
    
    if(id){
        return query
            .where({id})
            .first();
    }else {
        return null;
    }
}

function add(user) {
    return db('users')
        .insert(user, 'id')
        
}

function addProject(project){
    return db('projects')
        .insert(project, 'id')
        // .then(([id]) => findById(id))
}

function update(change, id) {
    return db('users')
        .where({id})
        .update(change)
        .then(count => count > 0 ? findById(id) : null)
}
function remove(id) {
    return db('users')
        .where('id', id)
        .del();
}


function findProject(id){
    let query = db('users');
    if(id) {
        query
        // .join('projects')
        .where('users.id', id)
        .first();
        const promise = [query, getUserProject(id)];
        return Promise.all(promise)
            .then( results => {
                const [users, projects] = results;
                if (users){
                    users.projects = projects;
                    return mapper.userTobody(users);
                }else{
                    return null;
                }
            });
        
    }else{
        return query.then(user=> {
            return user.map(use => mapper.userToBody(use));
        })
    }
    
}
function getUserProject(userId){
    return db('projects')
        .where('user_id', userId)
        .then(projects => projects.map(project => mapper.projectToBody(project)));
}