const { Attendance } = require('../models/attendance/attendanceModel');
const { School } = require('../models/schools/schoolsModel');
const { UserImageHistory } = require('../models/userImageHistory/userImageHistoryModel');
const { User } = require('../models/users/usersModel');

const initialData = async () => {
  try {
    // Initial data for Attendance
    await Attendance.bulkCreate([
      { date: '2023-01-01', status: 'Present', user_id: 1, school_id: 1 },
      { date: '2023-01-02', status: 'Absent', user_id: 2, school_id: 1 },
    ]);
    console.log('Data telah ditambahkan untuk Attendance.');

    // Initial data for School
    await School.bulkCreate([
      { name: 'School A' },
      { name: 'School B' },
    ]);
    console.log('Data telah ditambahkan untuk School.');

    // Initial data for UserImageHistory
    await UserImageHistory.bulkCreate([
      { date: '2023-01-01', photo: 'photo1.jpg', status: 'Checked In', time: '08:00', location: 'Location A', user_id: 1 },
      { date: '2023-01-02', photo: 'photo2.jpg', status: 'Checked Out', time: '17:00', location: 'Location B', user_id: 2 },
    ]);
    console.log('Data telah ditambahkan untuk UserImageHistory.');

    // Initial data for User
    await User.bulkCreate([
      { username: 'user1', password: 'password1', email: 'user1@example.com', school_id: 1 },
      { username: 'user2', password: 'password2', email: 'user2@example.com', school_id: 2 },
    ]);
    console.log('Data telah ditambahkan untuk User.');

    console.log('Initial data has been inserted successfully.');
  } catch (error) {
    console.error('Error inserting initial data:', error);
  }
};

initialData();