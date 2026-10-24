import React, { useState } from 'react'
import HomeLayout from "../layouts/home";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = () => {

    if (!name || !email || !message) {
      (() => toast("Please fill in all fields", { theme: "light", type: "error" }))();
      return;
    }

    const contactData = {
      name,
      email,
      message
    };

    if (!localStorage.getItem('contactData')) {
      const conct = [];
      conct.push(contactData);
      localStorage.setItem('contactData', JSON.stringify(conct));
      setName('');
      setEmail('');
      setMessage('');
      (() => toast("Message Sent!", { theme: "light" }))()
      setTimeout(() => {
        router.push('/');
      }, 1000)
    }
  };

  return (
    <section className="text-gray-600 body-font relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-200">Contact Us</h1>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="name" className="leading-7 text-sm text-gray-300">Name</label>
                <input type="text" id="name" name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-600 focus:bg-white focus:ring-2 focus:ring-yellow-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="email" className="leading-7 text-sm text-gray-300">Email</label>
                <input type="email" id="email" name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-600 focus:bg-white focus:ring-2 focus:ring-yellow-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
            </div>
            <div className="p-2 w-full">
              <div className="relative">
                <label htmlFor="message" className="leading-7 text-sm text-gray-300">Message</label>
                <textarea id="message" name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-600 focus:bg-white focus:ring-2 focus:ring-yellow-600 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                onClick={handleSubmit}
                className="flex mx-auto text-black font-bold bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-700 rounded text-lg">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

contact.layout = HomeLayout
