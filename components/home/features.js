import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Features = () => {
  return (
    <div>
      <div className="flex justify-center mb-10">
        <h1 className="text-5xl font-extrabold">OUR FEATURED</h1>
      </div>
      <div className=" text-white text-[20px] w-auto mb-32">
        <div className="gap-4">
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            height={50}
          >
            <div>
              <div className="relative">
                <img
                  src="/images/af.jpg"
                  className="aspect-[16/10] md:aspect-auto object-cover"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <p className="text-white   text-base sm:text-7xl font-bold">AVENTADOR S</p>
                </div>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-center">
                  <p className="text-white  text-sm  sm:text-3xl font-bold">
                    Experience the powerful V12 Aventador S by Lamborghini.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <img
                  src="/images/arev.jpg"
                  className="aspect-[16/10] md:aspect-auto object-cover"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <p className="text-white text-base sm:text-7xl font-bold">AVENTADOR S</p>
                </div>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-center">
                  <p className="text-white  text-sm  sm:text-3xl font-bold">
                    Experience the powerful V12 Aventador S by Lamborghini.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <img
                  src="/images/ab.jpg"
                  className="aspect-[16/10] md:aspect-auto object-cover"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <p className="text-white text-base sm:text-7xl font-bold">AVENTADOR S</p>
                </div>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-center">
                  <p className="text-white  text-sm  sm:text-3xl font-bold">
                    Experience the powerful V12 Aventador S by Lamborghini.{" "}
                  </p>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Features;
