import { useSyncrosse } from '@syncrosse/client'
import { useEffect, useState } from 'react';
import TicTacToe from './tic-tac-toe/tic-tac-toe.js'

function App() {
    const [userRole, setUserRole] = useState(null);
    const [playerMove, setPlayerMove] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const {syncrosse, messages} = useSyncrosse();

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
        <TicTacToe 
            role={userRole}
            // requestObj has player field & squareNum field
            onBoardClick={(requestObj) => syncrosse.performAction("playerTurn", requestObj)}
            playerMove={playerMove}
        />
    );
}

export default App;