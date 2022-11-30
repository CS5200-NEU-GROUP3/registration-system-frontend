import React from 'react';
import DefaultLayout from '../../components/DefaultLayout';
import { useSelector } from 'react-redux';
import { Table } from 'antd';
import RegisteredList from './RegisteredList';

function WaitlistedCourses() {
  return (
    <div>
      <DefaultLayout>
        <RegisteredList isWaitlist={true} />
      </DefaultLayout>
    </div>
  );
}

export default WaitlistedCourses;
