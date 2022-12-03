import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';

export const SideNavData = [
    {
        title: "Home" ,
        icon: <HomeIcon />,
        link:"/",
    },
    {
        title: "Brands" ,
        icon: <AddCircleIcon />,
        link: "/brands",
    },
    {
        title: "Products" ,
        icon: <RateReviewIcon />,
        link: "/viewproduct",
    }



];