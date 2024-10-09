import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tela: {
        display: 'flex',
    },
    calendario: {
        height: '100vh',
        width: '100%',
        overflow: 'auto',
    }
}));

export default useStyles;
