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
        <div className="app-container">
            <div className="header">
                <div className="vertical-alignment-div">
                    ULTIMATE TIC-TAC-TOE
                </div>
            </div>

            <div className="components-container">
                <div className="info-panel">
                </div>

                <TicTacToe
                    role={userRole}
                    // requestObj has player field & squareNum field
                    onBoardClick={(requestObj) => syncrosse.performAction("playerTurn", requestObj)}
                    playerMove={playerMove}
                />

                <div className="chat-box">
                    <div className="chat-button-container">
                        <button 
                            className="send-button" 
                            onClick={() => {
                                syncrosse.sendMessage(inputRef.current.value)
                                inputRef.current.value = null;
                            }}
                        >
                            Send
                        </button>
                    </div>
                    <div className="chat-text">
                        <div className="input-div">
                            <input ref={inputRef}></input>
                        </div>
                        <div className="chat-history">
                            {messages.map((msg, index) => (
                                <p key={index}>
                                    {msg.author} {msg.content}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;