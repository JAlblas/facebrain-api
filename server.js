const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'smart-brain'
    },
});

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sallry@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()

    }).then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
    
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id:  id
    }).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Not found!');
        }     
    })
    .catch(err => res.status(400).json('Error getting user!'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('Not Found!');
    }
})

app.listen(3001, () => {
    console.log('app is running on port 3001');
});