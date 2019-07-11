const expect = require('expect');
const request = require('supertest');
const{ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {Users} = require('./../model/user');
const {todos,populateTodos,users,populateUsers} =require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',() => {
  // Assertion 1
  it('Should be added to MongoDb',(done) => {
      var text = 'To test the app POST route';

      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
          if(err){
            return done(err);
          }
          //This is made to check in the database the update is made or not.
          Todo.find({text}).then((results) => {
            expect(results.length).toBe(1); // checking 1 item added
            expect(results[0].text).toBe(text); // checking item added is match with the text requested
            done();
          }).catch((err) => done(err));
        }); //finish of .end
  });//finish of Assertion 1

  //Assertion 2
  it('should not store invalid body',(done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) return done(err);
        //This is made to check in the database the update is made or not.
        Todo.find().then((r) =>{
          expect(r.length).toBe(2); // Checking no data is uploaded in mongoDB
          done();
        }).catch((e) => done(e));
      });//Finish od .end
  });//end of Assertion 2
});

describe('GET /todos',() => {
  //Assertion 3
  it('should show all the content',(done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.result.length).toBe(2);
        //This is res.body.result.length because when supertest is called
        //it calls to get route of todos and the response we get in GET route
        //as in this case res.send({result}) hence it takes res.body which gives
        // the object of response body whic contain the response there result is the parameter
        //which we are intrested in....which contain the array of data
      })
      .end(done);
  });//emd od Assertion 3
});

//This is the testing for the individual Todo in URL.
describe('GET /todos/:id',() => {
  // Assertion 4
  it('Should be valid ID',(done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // we can take toHexString or can omit it it will work fine
      .expect(200)                                 // toHexString is to convert ID to string format the function
      .expect((res) =>{                            // belongs to MongoDb
        expect(res.body.result.text).toBe(todos[0].text);
      })
      .end(done);
  });

  // Assertion 5
  it('Should return 404 for Not found',(done) => {
    var id_temp = new ObjectID(); // created a new ID which not present in the MongoDB database previously
                                  // leads to case of document not found
    request(app)
      .get(`/todos/${id_temp}`)
      .expect(404)
      .end(done);
  });

  // Assertion 6
  it('Should return 404 for invalid ID',(done) => {
    request(app)
      .get('/todos/12345')    // just an invalid URL because of Invalid ID
      .expect(404)
      .end(done);
  });
});

//This is for testing for deleting specifing documnent from the collection
// Same test cases as finding a document through ID in URL - GET /todos/:id
describe('DELETE /todos/:id',() => {
  // Assertion 7
  it('Should be valid ID',(done) => {
    request(app)
      .delete(`/todos/${todos[1]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.results.text).toBe(todos[1].text);
      })
      .end((err,res) => {
        if(err) return done(err);

        Todo.findById(todos[1]._id).then((todo) => {
          expect(todo).toBeNull();    // Check for toNotExist function is Deprecated hence use toBeNull
          done();
        }).catch((e) => done(e));
      });
    });

    // Assertion 8
    it('Should return 404 for ID not found',(done) => {
      var id_temp = new ObjectID();
      request(app)
        .delete(`/todos/${id_temp}`)
        .expect(404)
        .end(done);
    });
    // Assertion 9
    it('Should return 404 for invalid ID',(done) => {
      request(app)
        .delete('/todos/123456')
        .expect(404)
        .end(done)
    });
});

describe('PATCH /todos/:id', () => {
  it('should update the document',(done) => {
    var text = 'Updated Value';
    request(app)
      .patch(`/todos/${todos[1]._id}`)
      .send({
        status : true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.result.text).not.toBe(todos[1].text);
        expect(res.body.result.status).toBe(true);
        expect(typeof res.body.result.statusAt).toBe('number');
      })
      .end((err,res) => {
        if(err){ done(err);}
        Todo.findById(todos[1]._id).then((res) => {
          // expect(res.text).not.toBe(todos[1].text);
          expect(res.text).toBe(text);
          expect(res.status).toBe(true);
          expect(typeof res.statusAt).toBe('number');
          done();
        }).catch((err) => done(err));
      });
  });

  it('Should not update the value',(done) => {
    var text = 'Surya is my name'
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .send({
        status : false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.result.text).toBe('Surya is my name');
        expect(res.body.result.statusAt).toBe(null);
      })
      .end((err,res) => {
        if(err) {done(err);}

        Todo.findById(todos[0]._id).then((res) => {
          expect(res.text).toBe('Surya is my name');
          expect(res.statusAt).toBeNull();
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /users/me',() => {
  it('should return 200 for the authenticated user',(done) => {
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id);
        expect(res.body.email).toBe(users[0]._id);
      })
      .end(done);
  });

  it('should return 401 for un-authenticate users',(done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users',() => {
  it('should signup a user to the database',(done) => {
    var email = 'snr@gmail.com';
    var password = '123asdf';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();    // headers could not use '.' dot operator for assigning 'x-auth' as it contain '-' so it took [] for assigning...
        expect(res.body.email).toBe(users[0].email);
      })
      .end((err) => {
        if(err){
        return done(err);
        }

        Users.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation error for invalid data',(done) => {
    var email = 'anr.ham.com';
    var password = 'is';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
    });

    it('should not create user if still is database',(done) => {
      var email = users[0].email;
      var password = users[0].password;

      request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login',() => {
  it('should log in user',(done) => {
    request(app)
      .post('/users/login')
      .send({
        email : users[1].email,
        password : users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        Users.findById(users[1]._id).then((users) => {
          expect(user.tokens[0]).toInclude({
            access : 'auth',
            token : user.headers['x-auth'];
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('invalid credential',(done) => {
    request(app)
      .post('/users/login')
      .send({
        email : users[1].email,
        password : users[1].password + 'sbj'
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeNull();
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        Users.findById(users[1]._id).then((users) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
