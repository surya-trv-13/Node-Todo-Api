const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {Users} = require('./../model/user');

beforeEach((done) => {
  //Todo.remove({}).then(() => done());
  Todo.deleteMany({}).then(() => done());
});

describe('/POST /todo',() => {
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
          Todo.find().then((results) => {
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
          expect(r.length).toBe(0); // Checking no data is uploaded in mongoDB
          done();
        }).catch((e) => done(e));
      });//Finish od .end
  });//end of Assertion 2
});
