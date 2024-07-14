import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './admin.css';
import ReportsTab from './reports-tab.jsx';
import UsersTab from './users-tab.jsx';
import LessonsTab from './lessons-tab.jsx';

const Admin = () => {
  return (
    <div className="admin-container min-h-[calc(100vh-144px)]">
      <Tabs className="admin-tabs">
        <TabList>
          <Tab>משתמשים</Tab>
          <Tab>מערכים</Tab>
          <Tab>דוחות</Tab>
        </TabList>

        <TabPanel>
          <UsersTab />
        </TabPanel>

        <TabPanel>
          <LessonsTab />
        </TabPanel>

        <TabPanel>
          <ReportsTab />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Admin;
