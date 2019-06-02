const expect = require('expect');
const request = require('supertest');
const{ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {Users} = require('./../model/user');

var todos = [{
  _id : new ObjectID(),
  text : 'First todo'
},{
  _id: new ObjectID(),
  text : 'Second Todo'
}];

beforeEach((done) => {
  //Todo.remove({}).then(() => done()); --> Deprecated version
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

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
  it('Should return a valid data',(done) => {
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
