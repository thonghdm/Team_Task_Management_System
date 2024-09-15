import ModeSelect from '~/components/ModeSelect'

function BoardBar({ board }) {
    console.log('Received board in BoardBar:', board)

    return (
        <div>
            <h1>{board?._id || 'Loading...'}</h1>
            <ModeSelect />
        </div>
    );
}

export default BoardBar
