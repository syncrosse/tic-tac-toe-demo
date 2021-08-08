import { useSyncrosse } from '@syncrosse/client'
import { useEffect, useState } from 'react';
import TicTacToe from './tic-tac-toe/tic-tac-toe.js'

function App() {
    const [userRole, setUserRole] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const {syncrosse, messages} = useSyncrosse(); 

    // All syncrosse.onEvent must go in this hook
    useEffect(() => {
        syncrosse.onEvent("assignRole", (data) => {
            setUserRole(data);
        });

        syncrosse.onEvent("playerMoved", (data) => {
            if (data.player !== userRole) {
                console.log("playerMoved: ");
                console.log(data);
                // update somehow
            }
        });
    }, [syncrosse, userRole]);
    
    return (
        <TicTacToe 
            role={userRole}
            // requestObj has player field & squareNum field
            onBoardClick={(requestObj) => syncrosse.performAction("playerTurn", requestObj)}
        />
    );
}

export default App;