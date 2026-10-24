import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, Info, Book, Phone, LogIn } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const val = JSON.parse(sessionStorage.getItem("usr"));
    if (val) {
      setAuth(true);
    }
  }, [auth]);

  const handleSignOut = () => {
    sessionStorage.clear();
    setAuth(false);
    toast("Log Out Successfully !", { theme: "light", autoClose: 500 });
    router.push("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="text-white body-font bg-black">
      <ToastContainer />
      <div className="container mx-auto flex flex-wrap p-5 flex-col sm:flex-row items-center justify-between">
        <div className="logo flex flex-col items-center sm:flex-row">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-2 md:mb-0">
            <img src="/images/vehicle.png" className=" h-[100px] w-[100px] sm:h-[50px] sm:w-[50px]" alt="Logo" />
          </Link>
          <span className="text-white font-bold text-lg sm:ml-2">Goriber Gari</span>
        </div>
        <nav className="desktop-nav hidden md:flex md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-gray-400 flex items-center">
             HOME
          </Link>
          <Link href="/about" className="mr-5 hover:text-gray-400 flex items-center">
             ABOUT US
          </Link>
          <Link href="/blogs" className="mr-5 hover:text-gray-400 flex items-center">
             BLOGS
          </Link>
          <Link href="/contact" className="mr-5 hover:text-gray-400 flex items-center">
             CONTACT US
          </Link>
        </nav>
        <nav className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-400 flex justify-around p-2 z-10">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center">
            <Home className="mb-1" /> 
          </Link>
          <Link href="/about" className="text-gray-400 hover:text-white flex items-center">
            <Info className="mb-1" /> 
          </Link>
          <Link href="/blogs" className="text-gray-400 hover:text-white flex items-center">
            <Book className="mb-1" /> 
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white flex items-center">
            <Phone className="mb-1" />
          </Link>
        </nav>
        {auth === true ? (
          <div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center bg-yellow-600 text-black font-bold border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            >
              Sign Out
              <LogIn className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <Link href="/sign">
            <button className="inline-flex items-center bg-yellow-600 text-black font-bold border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              Sign In
              <LogIn className="w-4 h-4 ml-1" />
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
