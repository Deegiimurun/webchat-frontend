import {Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {BACKEND_URL} from "../global.ts";
import {useSocketEmit, useSocketEvent} from "use-socket-io-react";
import {useAuthUser} from "react-auth-kit";


export default function Chatbox() {
    const user = useAuthUser();
    const [page, setPage] = useState(1);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    const { emit } = useSocketEmit();

    useSocketEvent('chat', {
        handler: ([message]: [any]) => {
            setMessages(messages => [message, ...messages]);
        }
    });

    useEffect(() => {
        if (user())
            setOnlineUsers(prevState => new Set([...prevState, user()!.username]));
    }, [user]);

    useEffect(() => {
        async function fetchOnlineUsers() {
            const response = await fetch(`${BACKEND_URL}/chat/online`, {method: 'GET'})
            return await response.json();
        }

        fetchOnlineUsers().then(data => {
            const users = data.map((user: any) => user.username);
            setOnlineUsers(new Set(users));
        })

        const timeout = setInterval(() => {
            fetchOnlineUsers().then(data => {
                const users = data.map((user: any) => user.username);
                setOnlineUsers(new Set(users));
            })
        }, 1000);

        return () => {
            clearInterval(timeout);
        }
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            const response = await fetch(`${BACKEND_URL}/chat/list?page=${page}`, {method: 'GET'})
            return await response.json();
        }

        fetchMessages().then((data) => {
            setMessages(messages => [...messages, ...data]);
        })
    }, [page]);

    function sendChat() {
        if (message.length === 0) return;

        emit('chat', [message]);

        setMessage('');
    }

    return (
        <Stack spacing={2}
               style={{
                   height: '50vh',
                   overflow: 'auto',
                   display: 'flex',
               }}>
            <div
                id="scrollableDiv"
                style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <InfiniteScroll
                    dataLength={messages.length}
                    next={() => {
                        setPage(page => page + 1)
                    }}
                    style={{display: 'flex', flexDirection: 'column-reverse'}}
                    inverse={true} //
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                >
                    {(
                        messages.map((message) => {
                            return (
                                <Stack key={`${message.id}`} direction={'row'} spacing={2} alignItems={'center'}>
                                    <Typography
                                        color={onlineUsers.has(message.user.username) ? 'green' : 'red'}>{message.user.username}:</Typography>
                                    <Typography>{message.chat}</Typography>
                                </Stack>
                            )
                        })
                    )}
                </InfiniteScroll>
            </div>
            <TextField
                label="Message"
                multiline
                rows={2}
                value={message}
                onChange={(val) => {
                    setMessage(val.target.value)
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        sendChat()
                    }
                }}
            />
        </Stack>
    )
}