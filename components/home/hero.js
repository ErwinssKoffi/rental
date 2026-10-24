import Link from "next/link";
import cars from "../../data/cars.json";
import { TypeAnimation } from "react-type-animation";

const Hero = () => {
  return (
    <>
      <section className="relative h-screen flex flex-col text-left  py-0 px-3">
        <div className="video-docker absolute top-0 left-0 w-full h-screen overflow-hidden hidden sm:block">
          <video
            src={"/bgvideo.mp4"}
            type="video/mp4"
            muted
            autoPlay
            loop
            className="min-w-full min-h-full absolute object-cover"
          />
        </div>

        <div className="video-content space-y-2 ml-16 mt-60 max-[600px]:mt-96 block">
          <TypeAnimation
            sequence={['EXPERIENCE THE NEW', 1000]}
            wrapper="p"
            cursor={false}
            repeat={1}
            className="text-5xl max-[600px]:text-3xl font-bold text-black sm:text-white "
          />
          <TypeAnimation
            sequence={['    AVENTADOR S', 3000]}
            wrapper="p"
            cursor={false}
            repeat={1}
            speed={{ type: 'keyStrokeDelayInMs', value: 200 }}
            className="text-8xl max-[600px]:text-5xl font-bold flex flex-wrap text-black sm:text-white"
          />
        </div>
      </section>

      <div className="lg:flex justify-center text-center lg:mt-10 m-10">
        <h1 className="lg:text-6xl font-extrabold text-4xl text-black">
          SHOP BY CATEGORY
        </h1>
      </div>
      <section className="text-gray-600 body-font grid lg:grid-cols-3 text-center">
        {cars?.map((data) => {
          return (
            <div key={data?.id}>
              <div className="container px-5 py-24 mx-auto">
                <div className="-m-4">
                  <div className="p-4 transition transform hover:-translate-y-4 motion-reduce:transition-none motion-reduce:hover:transform-none">
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-2xl">
                      <img
                        className="h-48 md:h-56 lg:h-64 w-full object-cover object-center"
                        src={data?.image}
                        alt="blog"
                      />
                      <div className="p-6">
                        <h1 className="title-font text-3xl font-bold text-gray-900 mb-3">
                          {data?.title}
                        </h1>
                        <div className="flex items-center flex-wrap justify-center">
                          <Link
                            href={`/category/${data?.id}`}
                            className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0 hover:cursor-pointer hover:bg-black hover:text-yellow-400 hover:rounded-sm"
                          >
                            Explore More
                            <svg
                              className="w-4 h-4 ml-2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Hero;
