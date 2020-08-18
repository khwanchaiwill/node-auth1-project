const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const Users = require("../helper/users-model.js");

router.post("/register", (req, res) => {

    const credentials  = req.body;

  
if(credentials){
    const rounds = process.env.HASH_ROUNDS || 8; // 8  is the number of rounds as 2 ^ 8
    const hash = bcrypt.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
    .then(users => {
        console.log(users)
      res.status(200).json({data: "Register succesful"});
    })
    .catch(err => res.send({error: err.message}));
    
}else{
    res.status(400).json({message: " Please provide a name, username, and password"})
}
  
});

router.post("/login", (req,  res) => {
    let { username, password } = req.body
    Users.findBy({username})
    .then((users) => {
        const user = users[0];
        if(user && bcrypt.compareSync(password, user.password)){
            const token = createToken(user);
            
            req.session.loggedIn = true;
            req.session.username = user.username;
            res.status(200).json({token, hello: user.username, session: req.session})
        } else {
            res.status(401).json({ error: " You shall not pass!"})
        }
    })
    .catch(error => {
        res.status(500).json({error: error.message})
    })
})
router.get('/logout', (req, res) => {
    if (req.session){
       req.session.destroy(err => {
           if(err){
                res.status(500).json({error: "could not loggout, please try again"})
           }else {
               res.status(204).end();
           }
       }); 
    }else {
        res.status(200).json({message: "already logged out"})
    }
    
})

router.put('/:id', (req, res) => {

    const credentials  = req.body;

    const rounds = process.env.HASH_ROUNDS || 8; // 8  is the number of rounds as 2 ^ 8
    const hash = bcrypt.hashSync(credentials.password, rounds);

    credentials.password = hash;

    const id = req.params.id;
    // const changes = req.body;

    Users.findById(id)
        .then(user => {
            if(user){
                Users.update(credentials, id)
                .then(updateUser => {
                    res.status(200).json(updateUser, id)
                })
            } else {
                res.status(404).json({message: "Can not update the user"});
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Have some problem while updating user"})
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body
      Users.remove(id)
      .then(deleted => {
        if (deleted) {
          res.status(200).json({ removed: id, body});
        } else {
          res.status(404).json({ message: 'Could not find project with given id' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to delete project' });
      }); 
})

function createToken(user){
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const secret = process.env.JWT_SECRET || "secret";
    const options = {
        expiresIn: "30m",
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router;