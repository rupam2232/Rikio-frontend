import { useLocation, Navigate } from "react-router-dom";
import App from "../App.jsx";
import Channel from "../pages/Channel.page.jsx";
import NotFound from "../pages/NotFound.page.jsx";

const ChannelWrapper = () => {
    const location = useLocation();

    if (location.pathname.startsWith("/@")) {
        const username = location.pathname.substring(2); 

        return (
            <App>
                <Channel username={username} />
            </App>
        );
    }

    return <NotFound />;
};

export default ChannelWrapper;
