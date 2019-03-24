let chai = require('chai');
const request = require('supertest');
let server = require('../server');
let should = chai.should();
const expect = chai.expect;
const testData = require('./test.json');


const callRegisterStudentApi = (request_body) => {
  return new Promise((resolve, reject) => {
    request(server)
      .post('/api/register')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(request_body).then(response => {
        resolve();
      })
  });

}

const insertSeedData = async () => {
  return new Promise((resolve, reject) => {
    testData.forEach(async (data, index) => {
      try{
        await callRegisterStudentApi(data);
        if (index === testData.length - 1) resolve();
      } catch (err) {
        console.log(err);
      }
    });
  });
}

describe(`Register students to teacher and find common students`, function () {

  before(() => {
    return db.query('START TRANSACTION');
  });

  after(() => {
    return db.query('ROLLBACK');
  });

  it('should add data into the db', (done) => {
    insertSeedData().then(() => {
      done();
    })
    
  });


  it('should get all common students for teacher ken', (done) => {
    request(server)
      .get('/api/commonstudents?teacher=teacherken%40example.com')
      .then(res => {
        console.log({
          students:
            [
              "commonstudent1@gmail.com",
              "commonstudent2@gmail.com",
              "student_only_under_teacher_ken@gmail.com"
            ]
        });
        console.log(res.body)
        expect(res.status).to.eql(200);
        res.body.should.be.an('object');
        res.body.should.be.eql({
          students:
            [
              "commonstudent1@gmail.com",
              "commonstudent2@gmail.com",
              "student_only_under_teacher_ken@gmail.com"
            ]
        });
        done();
      });
    
  });
});