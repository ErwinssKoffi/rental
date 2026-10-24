import React from 'react'
import HomeLayout from "../layouts/home";
import Hero from '../components/about/hero';
import Features from '../components/about/features';
import Testimonials from '../components/about/testimonials';
const About = () => {
  return (
    <div className="bg-cover bg-fixed bg-no-repeat max-[900px]:bg-center" style={{
      backgroundImage: `url('/images/asvj.jpg')`,
  }}>

     <Hero/>
     <Features/>
     <Testimonials/>


    </div>
  )
}
About.layout = HomeLayout
export default About;