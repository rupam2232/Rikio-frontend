import { useLocation } from "react-router-dom";
import App from "../App.jsx";
import Channel from "../pages/Channel.page.jsx";
import NotFound from "../pages/NotFound.page.jsx";

const ChannelWrapper = () => {
    const location = useLocation();

    if (location.pathname.startsWith("/@")) {
        const pathName = location.pathname.substring(2);
        const username = pathName.includes("/") ? pathName.split("/")[0] : pathName;
        const pageName = pathName.includes("/") ? pathName.split("/")[1] : null; 

        return (
            <App>
                <Channel username={username} pageName={pageName}/>
            </App>
        );
    }

    return <NotFound />;
};

export default ChannelWrapper;
