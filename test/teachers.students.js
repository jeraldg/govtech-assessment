let chai = require('chai');
const request = require('supertest');
let server = require('../server');
let should = chai.should();
const expect = chai.expect;
let testData = [require('./test.json')];
testData.push(require('./test2.json'));

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

const insertSeedData = async (number) => {
  return new Promise((resolve, reject) => {
    testData[number - 1].forEach(async (data, index) => {
      try {
        await callRegisterStudentApi(data);
        if (index === testData[number - 1].length - 1) resolve();
      } catch (err) {
        return reject(err);
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

  it('should add seed data into the db', (done) => {
    insertSeedData(1).then(() => {
      done();
    })

  });


  it('should get all common students for teacher ken', (done) => {
    request(server)
      .get('/api/commonstudents?teacher=teacherken%40example.com')
      .then(res => {
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

describe(`Retrieve a list of students who can receive a given notification`, function () {

  before(() => {
    return db.query('START TRANSACTION');
  });

  after(() => {
    return db.query('ROLLBACK');
  });

  it('should add seed data into the db', (done) => {
    insertSeedData(2).then(() => {
      done();
    })

  });


  it('should get all students ("studentbob@example.com","studentagnes@example.com","studentmiche@example.com") that should be notified by Teacher Ken', (done) => {
    request(server)
      .post('/api/retrievefornotifications')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        "teacher": "teacherken@example.com",
        "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
      })
      .then(res => {
        expect(res.status).to.eql(200);
        res.body.should.be.an('object');
        res.body.should.be.eql({
          "recipients":
            [
              "studentbob@example.com",
              "studentagnes@example.com",
              "studentmiche@example.com"
            ]
        });
        done();
      });
  });

  it('should get student ("studentbob@example.com") that should be notified by Teacher Ken', (done) => {
    request(server)
      .post('/api/retrievefornotifications')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        "teacher": "teacherken@example.com",
        "notification": "Hey everybody"
      })
      .then(res => {
        expect(res.status).to.eql(200);
        res.body.should.be.an('object');
        res.body.should.be.eql({
          "recipients":
            [
              "studentbob@example.com",
            ]
        });
        done();
      });
  });

  it('should suspend studentbob@example.com', (done) => {
    request(server)
      .post('/api/suspend')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        "student" : "studentbob@example.com"
      })
      .then(res => {
        expect(res.status).to.eql(204);
        done();
      });
  });

  it('should get not get ("studentbob@example.com") after suspending him', (done) => {
    request(server)
      .post('/api/retrievefornotifications')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        "teacher": "teacherken@example.com",
        "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
      })
      .then(res => {
        expect(res.status).to.eql(200);
        res.body.should.be.an('object');
        res.body.should.be.eql({
          "recipients":
            [
              "studentagnes@example.com",
              "studentmiche@example.com"
            ]
        });
        done();
      });
  });
});