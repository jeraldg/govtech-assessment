const express = require('express');
const bodyParser = require('body-parser');

// import {db} from './db/connection';

require('./db/connection');
const { registerStudentsToTeacher, getOrCreateStudents, getOrCreateTeachers, getStudentsFromTeachers, suspendStudent, getNonSuspendedStudentsFromTeachers } = require('./db/queries');

const app = express();
app.use(bodyParser.json());

/*
POST endpoint allows a teacher to register multiple students 
Example endpoint: /api/register
Status code: 204
Example request body:
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@example.com",
      "studenthon@example.com"
    ]
}
*/

app.post('/api/register', async (req, res) => {
  const { students, teacher } = req.body;

  if (!students || !teacher) return;

  try {
    await getOrCreateTeachers(teacher);

    students.forEach(async (studentEmail) => {
      await getOrCreateStudents(studentEmail);
      await registerStudentsToTeacher([teacher, studentEmail]);
    })
  } catch (err) {
    return res.status(400).json({message:err});
  }

  return res.sendStatus(204);
});

/*
GET endpoint which allows you to retrieve common students given a list of teachers. 
Example endpoint: /api/commonstudents?teacher=teacherken%40example.com
Status code: 200
Example response below:
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
*/

app.get('/api/commonstudents', async (req, res) => {
  let { teacher } = req.query;

  if (!teacher) return;

  if (typeof teacher !== "object") teacher = [teacher];

  let commonStudents= [], data = undefined;

  try {
    data = await getStudentsFromTeachers(teacher);
  } catch (err) {
    return res.status(400).json({message:err});
  }


  data.forEach((row) => {
    commonStudents.push(row.studentEmail);
  })

  return res.status(200).json({ students: commonStudents });
});

/*
POST endpoint allows a teacher to suspend a specified student 
Example endpoint: /api/suspend
Status code: 204
Example request body:
{
  "student" : "studentmary@gmail.com"
}
*/

app.post('/api/suspend', async (req, res) => {
  const { student } = req.body;

  if (!student) return;

  try {
    await suspendStudent(student);
  } catch (err) {
    return res.status(400).json({message:err});
  }


  return res.sendStatus(204);
});

/*
POST endpoint allows a teacher to suspend a specified student 
Example endpoint: /api/retrievefornotifications
Status code: 200
Example request body:
{
  "teacher":  "teacherken@example.com",
  "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
}
Example response:
{
  "recipients":
    [
      "studentbob@example.com",
      "studentagnes@example.com", 
      "studentmiche@example.com"
    ]   
}
*/

app.post('/api/retrievefornotifications', async (req, res) => {
  const { teacher, notification } = req.body;

  if (!notification || !teacher) return;

  let regex = /[@a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  let found = false, notificationFindEmails =  notification
  let studentsToNotify = new Set()
  let data = undefined

  try {
    data = await getNonSuspendedStudentsFromTeachers([teacher]);
  } catch (err) {
    return res.status(400).json({message:err});
  }

  data.forEach((row) => {
    studentsToNotify.add(row.studentEmail);
  })

  while (!found) {
    const emails = regex.exec(notificationFindEmails);
    if (emails == null) {
      found = true
    } else {
      emails.forEach((email) => {
        notificationFindEmails = notificationFindEmails.replace(email, "")
        email = email.substring(1)
        studentsToNotify.add(email)
      })
    }

  }

  

  return res.status(200).json({ recipients: [...studentsToNotify] });
});


app.listen(process.env.PORT || 3000)

module.exports = app;