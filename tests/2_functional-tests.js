const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

chai.use(chaiHttp);

let testId;

suite('Functional Tests', function() {
  suite('POST requests', () => {
    test('POST issue with all fields', (done) => { // #1
      const testObj = {
        issue_title: 'fcctestallfieldsek',
        issue_text: 'f-yeah',
        created_by: 'zenlex',
        assigned_to: 'me',
        status_text: 'rockin'
      }
      chai.request(server)
        .post('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send(testObj)
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.body.project, 'apitest');
          assert.equal(res.body.issue_title, testObj.issue_title);
          assert.equal(res.body.issue_text, testObj.issue_text);
          assert.equal(res.body.created_by, testObj.created_by);
          assert.equal(res.body.assigned_to, testObj.assigned_to);
          assert.equal(res.body.status_text, testObj.status_text);
          assert.equal(res.body.open, true);
          testId = res.body._id;
          done();
        })
    })
    test('POST issue with only required fields', (done) => { // #2
      const testObj = {
        issue_title: 'reqfieldssek',
        issue_text: 'foo bar baz',
        created_by: 'zenlex'
      }
      chai.request(server)
        .post('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send(testObj)
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.body.project, 'apitest');
          assert.equal(res.body.issue_title, testObj.issue_title);
          assert.equal(res.body.issue_text, testObj.issue_text);
          assert.equal(res.body.created_by, testObj.created_by);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.open, true);
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          done();
        })
    })
    test('missing required field', (done) => { //#3
      const testObj = {
        issue_text: 'foo bar baz',
        created_by: 'zenlex'
      }
      chai.request(server)
        .post('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send(testObj)
        .end((err, res) => {
          if (err) console.log({ err })
          assert.equal(res.body.error, 'required field(s) missing')
          done();
        })
    })
  })

  suite('GET requests', () => {
    test('View issues on a project', (done) => { //#4
      chai.request(server)
        .get('/api/issues/apitest')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'open')
          done();
        })
    })
    test('View issues with one filter', (done) => { //#5
      chai.request(server)
        .get('/api/issues/apitest?created_by=zenlex')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'created_by')
          assert.equal(res.body[0].created_by, 'zenlex')
          done();
        })
    })
    test('View issues with multiple filters', (done) => { //#6
      chai.request(server)
        .get('/api/issues/apitest?created_by=zenlex&open=true&assigned_to=me')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'created_by')
          assert.equal(res.body[0].created_by, 'zenlex')
          assert.property(res.body[0], 'open')
          assert.equal(res.body[0].open, true)
          assert.property(res.body[0], 'assigned_to')
          assert.equal(res.body[0].assigned_to, 'me')
          done();
        })
    })

    suite('PUT requests', () => {
      test('Update one field on an issue', (done) => { //#7
        const testObj = {
          _id: testId,
          issue_title: 'PUT successful!'
        }
        chai.request(server)
          .put('/api/issues/apitest')
          .send(testObj)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, testObj._id)
            done()
          })
      })
      test('Update multiple fields', (done) => { // #8
        const testObj = {
          _id: testId,
          issue_title: 'PUT multiple successful!',
          assigned_to: 'erich',
          status_text: 'in testing'
        }
        chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/json')
          .send(testObj)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.result, 'successfully updated')
            assert.equal(res.body._id, testObj._id)
            done()
          })
      })
      test('Missing ID', (done) => { // #9
        const testObj = {};
        chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/json')
          .send(testObj)
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id')
            done();
          })
      })
      test('no fields to update', (done) => { // #10
        const testObj = { _id:testId };
        chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/json')
          .send(testObj)
          .end((err, res) => {
            assert.equal(res.body.error, 'no update field(s) sent')
            done();
          })
      })
      test('invalid id', (done) => { // #11
        const testObj = {
           _id:new mongoose.Types.ObjectId(),
          issue_title: 'PUT needs a valid ID!',
         };
        chai.request(server)
          .put('/api/issues/apitest')
          .set('content-type', 'application/json')
          .send(testObj)
          .end((err, res) => {
            assert.equal(res.body.error, 'could not update')
            done();
          })
      })
    })
  suite('DELETE requests', () => {
    test('DELETE an issue', (done) => { // #12
      chai.request(server)
        .delete('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send({_id: testId})
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200)
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, testId)
          done()
        })
    })
    test('DELETE with invalid id', (done) => { // #13
        let garbageId = mongoose.Types.ObjectId();
      chai.request(server)
        .delete('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send({_id: garbageId})
        .end((err, res) => {
          if (err) console.log('DELETE ERROR:', err);
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'could not delete')
          done()
        })
    })
    test('DELETE with missing id', (done) => { // #12
      chai.request(server)
        .delete('/api/issues/apitest')
        .set('content-type', 'application/json')
        .send({})
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })
  })
  })
})