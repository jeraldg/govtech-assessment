module.exports = {

  registerStudentsToTeacher: (params) => {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO teacher_students (teacherEmail, studentEmail) VALUES (?,?)"; // query database to get all the players

      // execute query
      db.query(query, params, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

  },

  getOrCreateStudents: (email) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `students` WHERE email=?"; // query database to get all the players

      // execute query
      db.query(query, email, (err, result) => {
        if (err) return reject(err);
        if (result.length == 0) {
          query = "INSERT INTO `students` (email) VALUES(?);"
          db.query(query, email, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
        }
        return resolve(result);
      });
    })

  },

  getOrCreateTeachers: (email) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM `teachers` WHERE email=?"; // query database to get all the players

      // execute query
      db.query(query, email, (err, result) => {
        if (err) return reject(err);
        if (result.length == 0) {
          query = "INSERT INTO `teachers` (email) VALUES(?);"
          db.query(query, email, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
        }
        return resolve(result);
      });
    })

  },

  getStudentsFromTeachers: (params) => {
    return new Promise((resolve, reject) => {

      escapeQuery = '?';
      for (i = 1; i < params.length; i++) {
        escapeQuery += ',?';
      }
      params.push(params.length)

      let query = "SELECT studentEmail, COUNT(*) c FROM `teacher_students` WHERE teacherEmail IN (" + escapeQuery + ") GROUP BY studentEmail HAVING c >= ?"; // query database to get all the players

      // execute query
      db.query(query, params, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    })

  },

  suspendStudent: (email) => {
    return new Promise((resolve, reject) => {

      let query = "UPDATE `students` SET `suspended` = true WHERE email = ? ;"; // query database to get all the players

      // execute query
      db.query(query, email, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    })

  },

  getNonSuspendedStudentsFromTeachers: (params) => {
    return new Promise((resolve, reject) => {

      escapeQuery = '?';
      for (i = 1; i < params.length; i++) {
        escapeQuery += ',?';
      }
      params.push(params.length)

      let query = "SELECT studentEmail, COUNT(*) c FROM `students` INNER JOIN `teacher_students` ON students.email = teacher_students.studentEmail WHERE teacherEmail IN (" + escapeQuery + ") AND suspended = False GROUP BY studentEmail HAVING c >= ?"; // query database to get all the players
      // execute query
      db.query(query, params, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    })

  },

  
};