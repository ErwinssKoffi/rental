import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeLayout from "../layouts/home";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);

   
    const router = useRouter();

   
    const handleSignUp = () => {

        const userData = {
            fullName,
            email,
            password,
        };

        if (!localStorage.getItem('userData')) {
            const usr = [];
            usr.push(userData);
            localStorage.setItem('userData', JSON.stringify(usr));
            setFullName('');
            setEmail('');
            setPassword('');
            (() => toast("Signup Successfully !", { theme: "light" }))()
            setTimeout(() => {
                router.push('/sign');
            }, 1000)
        }
        else {
            let users = JSON.parse(localStorage.getItem("userData"));
            const exists = users.filter(e => e.email === userData.email)
            if (exists.length > 0) {
                setFullName('');
                setEmail('');
                setPassword('');
                (() => toast("User already exist", { theme: "light", autoClose: 500 }))();
            }
            else {
                users.push(userData);
                localStorage.setItem('userData', JSON.stringify(users));
                setFullName('');
                setEmail('');
                setPassword('');
                (() => toast("Signup Successfully !", { theme: "light", autoClose: 500 }))();
                setTimeout(() => {
                    router.back();
                }, 1000)
            }
        }

    };

    useEffect(() => {
        const val = JSON.parse(sessionStorage.getItem('usr'))
        if (val) {
            setAuth(true)
        }
    }, [auth])


    if (auth) {
        router.push('/');
        return null;
    }
    else {
        return (
            <section className="text-gray-600 body-font bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                <ToastContainer />
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <h1 className="title-font font-bold text-3xl text-white">Don't have an accout?</h1>
                        <p className="leading-relaxed text-2xl font-semibold mt-4 text-white">Create a new one Instantly!.</p>
                    </div>
                    <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 drop-shadow-2xl ">
                        <h2 className="text-gray-200 text-lg font-medium title-font mb-5">Sign Up</h2>
                        <div className="relative mb-4">
                            <label htmlFor="full-name" className="leading-7 text-sm text-gray-200">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="full-name"
                                name="full-name"
                                value={fullName}
                                placeholder='Fardeen'
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-200">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='example@mail.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-200">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                        <button
                            onClick={handleSignUp}
                            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                        >
                            Sign Up
                        </button>
                        <Link href={'/sign'}>
                            <p className="text-xs text-gray-500 mt-3">Already a User?</p>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
}

Signup.layout = HomeLayout;
