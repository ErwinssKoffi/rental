import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomeLayout from "../layouts/home";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);

    const router = useRouter();


    const handleSignIn = () => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        const val = storedUserData.filter(e => e.email === email);
        if (val.length > 0) {
            if (val[0].password === password) {
                sessionStorage.setItem("usr", JSON.stringify({ name: val[0].fullName, email: val[0].email }));
                setEmail('');
                setPassword('');
                (() => toast("Login Successfully !", { theme: "light", autoClose: 500, }))();
                setTimeout(() => {
                    router.back();
                }, 1000);
            }
            else {
                (() => toast("Wrong Credentials !", { theme: "light", autoClose: 500 }))();
                setEmail('');
                setPassword('');
            }
        }
        else {
            (() => toast("User not exists !", { theme: "light", autoClose: 500 }))();
            setEmail('');
            setPassword('');
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
            <section className="text-gray-600 body-font">
                <ToastContainer />
                <div className="bg-cover bg-fixed bg-no-repeat" style={{
                    backgroundImage: `url('/images/bgc.png')`,
                }}>
                    <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                            <h1 className="title-font font-bold text-3xl text-white">Welcome to Lamgorghini!</h1>
                            <p className="leading-relaxed text-2xl font-semibold mt-4 text-white">Sign In to your Account.</p>
                        </div>
                        <div className="lg:w-2/6 md:w-1/2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 drop-shadow-xl">
                            <h2 className="text-gray-300 text-lg font-medium title-font mb-5">Sign In</h2>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-300" >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder='example@mail.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="password" className="leading-7 text-sm text-gray-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <button
                                onClick={handleSignIn}
                                className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            >
                                Sign In
                            </button>
                            <Link href={'/signup'}>
                                <p className="text-xs text-gray-300 mt-3">Not a user?</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
SignIn.layout = HomeLayout;

