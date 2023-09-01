import {Button} from "@mui/material";
import {useSignOut} from "react-auth-kit";
import {useSocket} from "use-socket-io-react";

export default function LogoutButton() {
    const logout = useSignOut();
    const {socket} = useSocket();
    function onLogoutClick() {
        logout();
        socket.disconnect();
    }

    return <Button variant="contained" onClick={onLogoutClick}>Logout</Button>
}