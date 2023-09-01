import {forwardRef, ReactElement, useState} from "react";
import {TransitionProps} from "@mui/material/transitions";
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Stack,
    TextField, Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useSignIn} from "react-auth-kit";
import {BACKEND_URL} from "../global.ts";

interface Props {
    open: boolean,
    onClose: () => void,
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function SignupForm({open, onClose}: Props) {
    const signIn = useSignIn()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function signup() {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/auth/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const data = await response.json()
        if (data.error) {
            setError(data.message)
        } else {
            signIn({
                expiresIn: 60 * 24 * 30,
                token: data.access_token,
                tokenType: "Bearer",
                authState: data.user
            })
            onClose();
        }
        setLoading(false)
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>Sign Up</DialogTitle>
            <DialogContent>
                <Stack spacing={2} py={2}>
                    <TextField label="Username" variant="outlined"
                               value={username}
                               error={error.length !== 0}
                               onChange={(val) => {
                                   setUsername(val.target.value)
                               }}/>
                    <TextField label="Password" variant="outlined"
                               type={'password'}
                               value={password}
                               error={error.length !== 0}
                               onChange={(val) => {
                                   setPassword(val.target.value)
                               }}/>
                    {error.length !== 0 && <Typography color='red'>{error}</Typography>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} onClick={signup}>Sign Up</LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )

}
