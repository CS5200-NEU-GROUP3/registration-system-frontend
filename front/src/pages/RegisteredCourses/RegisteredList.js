import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import {
  deleteRegistered,
  deleteWaitlisted,
} from '../../redux/actions/userActions';

function RegisteredList(props) {
  const { courses } = useSelector((state) => state.coursesReducer);
  const { users } = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  const getCurUser = () => {
    if (props.userId) {
      return users.find((user) => user._id === props.userId);
    } else return JSON.parse(localStorage.getItem('user'));
  };
  const user = getCurUser();
  const isWaitlist = props.isWaitlist ? true : false;

  const userRegisteredCourses = [];

  function dropRegisteredCourse(crn) {
    dispatch(deleteRegistered({ studentId: user._id, crn: crn }));
  }

  function dropWaitlistedCourse(crn) {
    dispatch(deleteWaitlisted({ studentId: user._id, crn: crn }));
  }

  function cancel(e) {}

  for (const course of courses) {
    const registeredStudents = isWaitlist
      ? course.waitlistedStudents
      : course.registeredStudents;

    const temp = registeredStudents.find(
      (candidate) => candidate.userid === user._id,
    );

    if (temp) {
      const obj = {
        title: course.courseId,
        department: course.department,
        registeredDate: new Date(
          isWaitlist ? temp.waitlistedDate : temp.registeredDate,
        ).toLocaleString(),
        courseId: [
          <>
            <Link to={`/courses/${course._id}`}>
              <Button>Details</Button>
            </Link>
            <Popconfirm
              title="Are you sure to drop this course?"
              onConfirm={(e) => {
                if (isWaitlist) {
                  dropWaitlistedCourse(course._id);
                } else {
                  dropRegisteredCourse(course._id);
                }
              }}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button>Drop</Button>
            </Popconfirm>
          </>,
        ],
      };

      userRegisteredCourses.push(obj);
    }
  }

  const columns = [
    {
      title: 'Course Number',
      dataIndex: 'title',
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Registered Date',
      dataIndex: 'registeredDate',
    },
    {
      title: 'Action',
      dataIndex: 'courseId',
    },
  ];

  return (
    <div>
      <h1>{isWaitlist ? 'Waitlisted Courses' : 'Registered Courses'}</h1>
      <Table columns={columns} dataSource={userRegisteredCourses} />
    </div>
  );
}

export default RegisteredList;
