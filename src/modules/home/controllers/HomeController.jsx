import React from 'react';
import HomeView from '../views/HomeView';
import HomeModel from '../models/HomeModel';

const HomeController = () => {
    const projectData = HomeModel.getProjectData();
    const members = HomeModel.getMembers();

    return <HomeView data={projectData} members={members} />;
};

export default HomeController;
