import {
  IconDatabase,
  IconDeviceDesktopCode,
  IconDeviceMobileCode,
  IconLayersDifference,
  IconLayersIntersect,
  IconStack,
  IconStack2,
  IconStack3,
  IconStackMiddle,
  IconUxCircle,
} from "@tabler/icons-react";
import React from "react";

export const Services = () => {
  return (
    <>
      <div
        id="our-services"
        className="t-[var(--navigation-height)] md:pt-[90px] md:pb-[120px] pt-[80px] pb-[90px] bg-secondary max-w-[120rem] mx-auto"
      >
        <div className="flex flex-col">
          <div className="w-fit mx-auto text-center">
            <div className="w-fit mx-auto border border-gray-100 py-[1px] px-[12px] rounded-xl font-medium text-2xl bg-black shadow-lg">
              Services
            </div>
            <h2 className="md:text-[5rem] text-[4rem] leading-[1.2] font-semibold mt-5 px-8">
              What I Can Do For You:
            </h2>
            <p className="text-pText text-3xl mt-2">{`Skills I bring to the table.`}</p>
          </div>
          <div className="md:px-0 mt-32 flex flex-col w-full gap-20 md:justify-center md:gap-80 md:flex-row px-8">
            {/* 1st Column */}
            <div className="flex flex-col w-full md:gap-40 gap-20 h-full">
              {/* 1st Section */}
              <div className="flex flex-col w-full items-center h-1/2">
                <div className="flex items-center justify-center w-28 h-28 rounded-3xl mb-8 bg-web-dev-icon">
                  <IconDeviceDesktopCode
                    size={40}
                    className="text-web-dev-text"
                  />
                </div>
                <span className="text-[3rem] mb-3 font-normal text-gray-200 text-center px-8">
                  Custom Web Development
                </span>
                <span className="text-2xl text-center font-light text-gray-400 px-8">
                  I build responsive, high-performance web applications using
                  NextJS, React, and Tailwind. My focus is on creating apps that
                  not only look great but also deliver a seamless user
                  experience that aligns with the project’s goals.
                </span>
              </div>
              {/* 2nd Section */}
              <div className="flex flex-col w-full items-center h-1/2">
                <div className="flex items-center justify-center w-28 h-28 rounded-3xl mb-8 bg-full-stack-icon">
                  <IconDatabase size={40} className="text-full-stack-text" />
                </div>
                <span className="text-[3rem] mb-3 text-gray-200 text-center">
                  Full Stack Solutions
                </span>
                <span className="text-2xl text-center font-light text-gray-400">
                  {`With a foundation in both front-end and back-end development,
                  I handle the full stack to deliver solutions. I've leveraged
                  .NET and SQL for building back-end applications while using
                  React and Typescript for dynamic and responsive front-end applications.`}
                </span>
              </div>
            </div>
            {/* 2nd Column */}
            <div className="flex flex-col w-full md:gap-40 gap-20">
              {/* 3rd Section */}
              <div className="flex flex-col w-full items-center">
                <div className="flex items-center justify-center w-28 h-28 rounded-3xl mb-8 bg-mobile-dev-icon">
                  <IconDeviceMobileCode
                    size={40}
                    className="text-mobile-dev-tezt"
                  />
                </div>
                <span className="text-[3rem] mb-3 text-gray-200 text-center">
                  Mobile App Development
                </span>
                <span className="text-2xl text-center font-light text-gray-400">
                  By using React Native, I create mobile applications that are
                  intuitive, engaging, and tailored to the needs of the
                  end-users. My focus is on delivering a consistent and
                  high-quality user experience across all devices.
                </span>
              </div>
              {/* 4th Section */}
              <div className="flex flex-col w-full items-center">
                <div className="flex items-center justify-center w-28 h-28 rounded-3xl mb-8 bg-ui-ux-icon">
                  <IconStack2 size={40} className="text-ui-ux-text" />
                </div>
                <span className="text-[3rem] mb-3 text-gray-200 text-center">
                  Platform Engineering
                </span>
                <span className="text-2xl text-center font-light text-gray-400">
I design and maintain scalable platforms in JavaScript/TypeScript environments, enhancing component libraries and automating accessibility testing with tools like Storybook and Playwright. I optimize CI pipelines and enforce coding standards using custom scripts and linters such as Stylelint and ESLint. I also build data-driven dashboards with Redash and Snowplow to improve team workflows.                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
