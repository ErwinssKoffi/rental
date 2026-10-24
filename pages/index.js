import HomeLayout from "../layouts/home";
import Hero from "../components/home/hero";
import Features from "../components/home/features";
import Members from "../components/home/members";



const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <Members />
        </>
    )
}

Home.layout = HomeLayout
export default Home