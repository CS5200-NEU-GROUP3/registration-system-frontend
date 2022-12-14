import axios from 'axios';
import { message } from 'antd';
export const registerUser = (values) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });

  try {
    await axios.post('/api/users/register', values);
    message.success('User Registered Successfully');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    message.error('Username existed');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const deleteRegistered = (values) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    await axios.post('/api/users/dropcourse', values);
    message.success('Registered Course Dropped Successfully');
    setTimeout(() => {
      window.location.href = '/registeredcourses';
    }, 1000);
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    message.error('Drop Course Failed!');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const deleteWaitlisted = (values) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    await axios.post('/api/users/dropwaitlist', values);
    message.success('Waitlisted Course Dropped Successfully');
    setTimeout(() => {
      window.location.href = '/waitlistedcourses';
    }, 1000);
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    message.error('Drop Waitlisted Course Failed!');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const loginUser = (values) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });

  try {
    const user = await axios.post('/api/users/login', values);
    message.success('Login success');
    localStorage.setItem('user', JSON.stringify(user.data));
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    message.error('invalid credentials');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const updateUser = (values) => async (dispatch) => {
  const curUserInfo = JSON.parse(localStorage.getItem('user'));
  if (curUserInfo.role !== 'admin') {
    const userid = curUserInfo._id;
    values._id = userid;
  }

  dispatch({ type: 'LOADING', payload: true });
  try {
    await axios.post('/api/users/updateprofile', values);
    message.success('User updated successfully');
    dispatch(getAllUsers());
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    message.error('something went wrong , please try later');
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const response = await axios.get('/api/users/getallusers');
    const curUserInfo = JSON.parse(localStorage.getItem('user'));
    for (const userInfo of response.data) {
      const studentId = userInfo._id;
      const responseRegisteredCourses = await axios.post(
        '/api/users/getregisteredcourses',
        { userId: studentId },
      );
      const responseWaitlistedCourses = await axios.post(
        '/api/users/getwaitlistedcourses',
        { userId: studentId },
      );
      const responseCourseComments = await axios.post(
        '/api/users/getusercomments',
        { userId: studentId },
      );
      const registeredCourses = responseRegisteredCourses.data;
      const waitlistedCourses = responseWaitlistedCourses.data;
      const comments = responseCourseComments.data;
      userInfo.registeredCourses = registeredCourses;
      userInfo.waitlistedCourses = waitlistedCourses;
      userInfo.comments = comments;

      if (userInfo._id === curUserInfo._id) {
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
    }
    dispatch({ type: 'GET_ALL_USERS', payload: response.data });
    dispatch({ type: 'LOADING', payload: false });
    localStorage.setItem('users', JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const searchSkills = (values) => async (dispatch) => {
  console.log('in actions');
  console.log(values);
  dispatch({ type: 'LOADING', payload: true });
  try {
    const response = await axios.post('/api/users/searchskills', values);
    localStorage.setItem('skills', JSON.stringify(response.data));
    dispatch({ type: 'SEARCH_SKILLS', payload: response.data });
    message.success('Skills fetched successfully');
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};
