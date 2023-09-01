import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {AuthProvider, useAuthHeader} from "react-auth-kit";
import {SocketProvider} from "use-socket-io-react";
import {WS_URL} from "./global.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider authType={'cookie'} authName={'_auth'}>
        <App/>
    </AuthProvider>
)
