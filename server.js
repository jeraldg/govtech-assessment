const express = require('express');
var bodyParser = require('body-parser');

// import {db} from './db/connection';

require('./db/connection');
const { registerStudentsToTeacher, getOrCreateStudents, getOrCreateTeachers, getStudentsFromTeachers, suspendStudent } = require('./db/queries');

var app = express();
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { students, teacher } = req.body;

  if (!students || !teacher) return;

  // need to handle errors

  await getOrCreateTeachers(teacher);

  students.forEach(async (studentEmail) => {
    await getOrCreateStudents(studentEmail);
    await registerStudentsToTeacher([teacher, studentEmail]);
  })

  res.sendStatus(204);
});

app.get('/api/commonstudents', async (req, res) => {
  let { teacher } = req.query;

  if (!teacher) return;

  if (typeof teacher !== "object") teacher = [teacher];

  let data = await getStudentsFromTeachers(teacher);

  let commonStudents = [];

  data.forEach((row) => {
    commonStudents.push(row.studentEmail);
  })

  res.status(200).json({ students: commonStudents });
});

app.post('/api/suspend', async (req, res) => {
  const { student } = req.body;

  if (!student) return;

  console.log(student);

  // need to handle errors

  await suspendStudent(student);

  res.sendStatus(204);
});


app.listen(process.env.PORT || 3000)

module.exports = app;