import { useSyncrosse } from '@syncrosse/client'
import TicTacToe from './tic-tac-toe/tic-tac-toe.js'

function handleBoardClick(requestObj, syncrosse) {
    const playerTurn = requestObj.xIsNext ? "X" : "O";
    if (requestObj.player === playerTurn) {
        syncrosse.performAction("playerTurn", { 
            player: requestObj.player,
            squareNum: requestObj.squareNum
        })
    }
}

function App() {
    // eslint-disable-next-line no-unused-vars
    const {syncrosse, messages} = useSyncrosse(); 

    return (
        <TicTacToe 
            onBoardClick={(requestObj) => handleBoardClick(requestObj, syncrosse)}
        />
    );
}

export default App;