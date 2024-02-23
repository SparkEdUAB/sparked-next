"use client";

import React from "react";
import { Button, Card,Carousel } from "flowbite-react";
import GuestLayout from "../layouts/guestLayout";
import { CourseBasedSvgImage, EducationSvgImage, UniversitySvgImage } from "@components/svgs";
import styled from "styled-components";
import { HomePageSlider } from "@components/molecue/slider";


const StyledMainContentCard = styled(Card)`
height: 250px;
/* background-color: red; */
`

const StyledSubContentCard = styled(Card)`
  max-height: 300px;
`;

const  WelcomePage:React.FC = ()=> {

  return (
    <GuestLayout>
      <div className="landing-page-container">
        <HomePageSlider />

        <div className="flex justify-between landing-page-main-card-container">
          <StyledMainContentCard className="max-w-sm bg-blue-200  " href="#">
            <CourseBasedSvgImage />
            <StyledSubContentCard className="max-w-sm" href="#">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>Course Based</p>
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>Organize Contents for Colleges with Different Courses</p>
              </p>
              <Button>
                <p>Read more</p>
              </Button>
            </StyledSubContentCard>
          </StyledMainContentCard>

          <StyledMainContentCard
            className="max-w-sm landing-page-plain-card bg-orange-100"
            href="#"
          >
            <UniversitySvgImage />

            <StyledSubContentCard className="max-w-sm" href="#">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p className="text-center">University Based</p>
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                  Ability to organize contents following the University
                  structure
                </p>
              </p>
              <Button>
                <p>Read more</p>
              </Button>
            </StyledSubContentCard>
          </StyledMainContentCard>

          <StyledMainContentCard
            className="max-w-sm bg-green-400 "
            href="#"
          >
            <EducationSvgImage />
            <StyledSubContentCard>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>High School</p>
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <p>
                  Contents can also be arranged as High Schools to help small
                  schools manage their contents
                </p>
              </p>
              <Button>
                <p>Read more</p>
              </Button>
            </StyledSubContentCard>
          </StyledMainContentCard>
        </div>
      </div>
    </GuestLayout>
  );
}


export default WelcomePage;