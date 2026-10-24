import React, { useEffect, useState } from "react";
import HomeLayout from "../../layouts/home";
import { useRouter } from "next/router";
import carList from "../../data/carList.json";
import Link from "next/link";

export default function Category() {
  const router = useRouter();
  const { category } = router.query;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (category) {
      const filteredCars = carList.filter((car) => car.categoryID == category);
      setData(filteredCars);
    }
  }, [category]);

  return (
    <div>
      <div className="lg:flex justify-center items-center lg:mt-10 m-10">
        <h1 className="lg:text-6xl font-extrabold text-4xl">CHOOSE A CAR</h1>
      </div>
      <div className="grid lg:grid-cols-3 px-4">
        {data.map((car) => (
          <div
            className=" p-4 transition transform hover:-translate-y-4 motion-reduce:transition-none motion-reduce:hover:transform-none "
            key={car.id}
          >
            <div className="shadow-2xl">
              <div className="bg-gray-100 p-6 rounded-lg">
                <img
                  className="lg:h-96 md:h-36 w-full object-cover object-center mb-6"
                  src={car.img}
                  alt="content"
                />
                <h2 className="text-2xl text-gray-900 font-bold title-font mb-4">
                  {car.name}
                </h2>
                <p className="leading-relaxed text-xl mb-2">
                  Fare: ${car.fare}/hr
                </p>
                <Link
                  href={`/car/${car.id}`}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Category.layout = HomeLayout;
