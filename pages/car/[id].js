import React, { useEffect, useState } from 'react';
import HomeLayout from "../../layouts/home";
import { useRouter } from 'next/router';
import carList from '../../data/carList.json';
import Link from 'next/link';


export default function id() {
    const router = useRouter()
    const {id} = router.query;
    const [data, setData] = useState([]);

    useEffect(() => {
        if (id) {
            const filteredCar = carList.filter((car) => car.id == id);
            setData(filteredCar);
        }
    }, [id]);
    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 shadow-xl rounded-lg">
                        <img className="object-cover object-center rounded" alt="hero" src={data[0]?.img}/>
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{data[0]?.name}</h1>
                        <div className='text-lg font-semibold'>
                        <p className="mb-8 leading-relaxed">Engine Type: {data[0]?.engine}</p>
                        <p className="mb-8 leading-relaxed">Top Speed: {data[0]?.topspeed}</p>
                        <p className="mb-8 leading-relaxed">Fuel Type: {data[0]?.fueltype}</p>
                        <p className="mb-8 leading-relaxed">Model Year: {data[0]?.year}</p>
                        </div>
                        
                        <div className="flex justify-center">
                            <Link href={`/${data[0]?.name}`}><button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Rent</button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

id.layout = HomeLayout
