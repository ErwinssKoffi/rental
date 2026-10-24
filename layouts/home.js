import Header from "../components/common/header";
import Footer from "../components/common/footer";

const HomeLayout = ({children}) => {
    return (
        <>
            <Header/>
            {children}
            <Footer/>
        </>
    )
}

export default HomeLayout;
