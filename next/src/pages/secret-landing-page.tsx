import React from "react";
import NavLayout from "../components/NavLayout";
import Hero from "../components/landing/Hero";

const HomePage = () => {
  return (
    <NavLayout>
      <div
        id="background-gradient"
        className="absolute -z-10 h-screen w-full overflow-hidden"
        style={{
          backgroundColor: "rgb(0, 0, 0)",
          backgroundImage:
            "radial-gradient(at 100% 0%, rgb(49, 46, 129) 0, transparent 69%), radial-gradient(at 0% 0%, rgb(21, 94, 117) 0, transparent 50%)",
        }}
      />
      <div className="flex w-full justify-center">
        <div className="flex max-w-screen-lg flex-col items-center justify-center overflow-x-hidden text-white">
          <div className="flex h-screen max-w-screen-lg flex-col items-center justify-center overflow-x-hidden text-white">
            <Hero />
          </div>
        </div>
      </div>
    </NavLayout>
  );
};

export default HomePage;
