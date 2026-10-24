import React from "react";
import HomeLayout from "../layouts/home";
import Hero from "../components/blogs/Hero";

export default function blogs() {
  return (
    <div>
      <Hero />
    </div>
  );
}

blogs.layout = HomeLayout;
