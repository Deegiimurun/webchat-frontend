import {Button, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import LoginForm from "./components/login-form.tsx";
import SignupForm from "./components/signup-form.tsx";
import Chatbox from "./components/chatbox.tsx";
import {useAuthHeader, useAuthUser} from "react-auth-kit";
import {WS_URL} from "./global.ts";
import {SocketProvider} from "use-socket-io-react";
import LogoutButton from "./components/logout-button.tsx";

function App() {
    const user = useAuthUser()
    const token = useAuthHeader()
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);

    const isAuthenticated = false;

    useEffect(() => {
    }, [isAuthenticated]);

    if (showLoginForm) {
        return <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)}/>;
    }

    if (showSignupForm) {
        return <SignupForm open={showSignupForm} onClose={() => setShowSignupForm(false)}/>;
    }

    return (
        <Stack spacing={2} p={20} width={'30vw'} mx={'auto'}>
            {user() ?
                <Stack>
                    <SocketProvider uri={WS_URL} config={{
                        extraHeaders: {
                            Authorization: token().split(' ')[1]
                        }
                    }}>
                        <Chatbox/>
                        <LogoutButton />
                    </SocketProvider>
                </Stack> :
                <Stack>
                    <Button variant="contained" onClick={() => setShowSignupForm(true)}>Signup</Button>
                    <Button variant="contained" onClick={() => setShowLoginForm(true)}>Login</Button>
                </Stack>
            }
        </Stack>
    )
}

export default App
