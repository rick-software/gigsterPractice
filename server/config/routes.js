let path = require('path');
let bcrypt = require('bcrypt');

let User = require('../db/userdb');
let Expense = require('../db/expensedb');
let helpers = require('./helpers');

module.exports = (app, express, rootPath) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(rootPath, 'index.html'));
  });

  app.get('/api/expense', (req, res) => {
    Expense.find({user: req.query.username})
      .exec((err, expenses) => helpers.sendbackQueryResults(err, expenses, res));
  });

  app.get('/api/allexpense', (req, res) => {
    Expense.find({}).exec((err, expenses) => helpers.sendbackQueryResults(err, expenses, res));
  });

  app.post('/api/login', (req, res) => {
    User.findOne({username: req.body.username}).exec((err, user) => {
      if(!user) {
        res.status(209).send('This username doesn\'t exist.');
      } else {
        bcrypt.compare(req.body.password, user.password, (err, match) => {
          if (match) {
            res.status(200).send({
              username: req.body.username,
              isAdmin: user.isAdmin
            });
          } else {
            res.status(210).send('Password doesn\'t match with record.');
          }
        });
      }
    });
  });

  app.post('/api/signup', (req, res) => {
    User.findOne({username: req.body.username}).exec((err, user) => {
      if (user) {
        res.status(211).send('This username already exist.');
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          let newUser = new User({
            username: req.body.username,
            password: hash,
            isAdmin: false
          });
          newUser.save((err, user) => {
            if (err) {
              res.status(212).send('Internal Database Error. Please try again later.');
            } else {
              res.status(200).send({
                username: req.body.username,
                isAdmin: false
              });
            }
          });
        });
      }
    });
  });

  app.post('/api/logout', (req, res) => {
    res.status(200).send('Successfully log out');
  })

  app.post('/api/addadmin', (req, res) =>{
    User.update({username: req.body.newAdmin}, {
      isAdmin: true
    }, (err, count) => {
      if (err) {
        console.log(err);
        res.status(509).send('Internal Database Error');
      } else {
        if (count.nModified === 1) {
          res.status(200).send(`Successfully add ${req.body.newAdmin} as Admin.`);
        } else if (count.nModified === 0 && count.n === 0) {
          res.status(217).send(`Can't find user( ${req.body.newAdmin} ) in the database`);
        } else if (count.nModified === 0 && count.n === 1) {
          res.status(220).send(`User ${req.body.newAdmin} was an Admin.`);
        }
      }
    });
  });

  app.post('/api/saveexpense', (req, res) => {
    let newExpense = new Expense({
      datetime: req.body.datetime,
      amount: req.body.cost,
      description: req.body.description,
      user: req.body.username
    });
    newExpense.save((err, savedExpense) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send('New expense has been successfully saved');
      }
    });
  });

  app.post('/api/deleteexpense', (req, res) => {
    Expense.remove({_id: req.body.id}, err => {
      if (err) {
        res.status(509).send('Internal Database Error');
      } else {
        res.status(200).send('successfully deleted item');
      }
    });
  });

  app.post('/api/updateexpense', (req, res) => {
    Expense.update({_id: req.body.id}, {
      amount: req.body.amount,
      description: req.body.description,
      datetime: req.body.datetime
    }, err => {
      if (err) {
        res.status(509).send('Internal Database Error');
      } else {
        res.status(200).send('successfully updated item');
      }
    });
  });
};