const router= require('express').Router();

const Users = require('../helper/users-model.js');


router.get("/", (req, res) => {
    Users.find()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error : "Invalid user"}, err)
        })
})
router.get('/:id/projects',(req, res) => {
    const { id } = req.params;
    Users.findProject(id)
    .then(project => {
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Could not find project for given user' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get projects' });
    });
  });
  
  router.post('/', (req, res) => {
    const projectData = req.body;
    Users.add(projectData)
    .then(project => {
      res.status(201).json(project);
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to create new project' });
    });
  });

router.post('/:id/projects', (req, res) => {
    const projectDB = req.body;
    console.log(projectDB)
    const { id } = req.params; 
    projectDB.user_id = Number(id);
    
    Users.findById(id)
    .then(user => {
      console.log(user)
      if (user) {
        Users.addProject(projectDB, id)
        .then(project => {
          res.status(201).json(project);
        })
      } else {
        res.status(404).json({ message: 'Could not find project with given id.' })
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to create new step' });
    });
  });
module.exports = router;