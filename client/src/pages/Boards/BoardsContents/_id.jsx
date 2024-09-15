import BoardBar from '../BoardBars'
import { useState, useEffect } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
import { mockData } from '~/apis/mock-data'


function Board() {
    const [board, setBoard] = useState(null)

    useEffect(() => {
        const boardId = '66cf0dbf513a7a848588f7d3';
        fetchBoardDetailsAPI(boardId).then(board => setBoard(board));
    }, []); // The empty dependency array ensures this effect runs only once on mount
    

    
    console.log('mockData in Board:', mockData)
    return (
        <BoardBar board={board} />
    );
}

export default Board
