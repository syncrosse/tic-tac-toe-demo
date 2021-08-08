import { useSyncrosse } from '@syncrosse/client'
import { useEffect, useState, useRef } from 'react';
import TicTacToe from './tic-tac-toe/tic-tac-toe.js'
import "./App.scss"

function App() {
    const [userRole, setUserRole] = useState(null);
    const [playerMove, setPlayerMove] = useState(null);
    const inputRef = useRef(null);

    // eslint-disable-next-line no-unused-vars
    const { syncrosse, messages } = useSyncrosse();

    // All syncrosse.onEvent must go in this hook
    useEffect(() => {
        if (!syncrosse) {
            return;
        }
        syncrosse.onEvent("assignRole", (data) => {
            setUserRole(data);
        });

        syncrosse.onEvent("playerMoved", (data) => {
            if (data.player !== userRole) {
                setPlayerMove(data);
            }
        });
    }, [syncrosse, userRole]);

    return (
        <div class="app-container">
            <TicTacToe
                role={userRole}
                // requestObj has player field & squareNum field
                onBoardClick={(requestObj) => syncrosse.performAction("playerTurn", requestObj)}
                playerMove={playerMove}
            />

            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        {msg.author} {msg.content}
                    </p>
                ))}
                <input ref={inputRef}></input>
                <button onClick={() => syncrosse.sendMessage(inputRef.current.value)}>Send</button>
            </div>
        </div>
    );
}

export default App;