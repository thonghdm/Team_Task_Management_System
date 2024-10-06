import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { cyan, deepOrange, teal, orange } from '@mui/material/colors';

const theme = extendTheme({
    app: {
        appBarHeight: '100px',
        boardBarHeight: '100px',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: teal,
                secondary: {
                    main: '#4db6ac',
                },
                background: {
                    default: '#f5f5f5',
                    paper: '#fff',
                },
                grey: {
                    50: '#f5f5f5',
                    100: '#fff',
                    200: '#fff',
                },
                text: {
                    primary: '#000',   // Primary text color
                    secondary: '#666', // Secondary text color
                },
            },
        },
        dark: {
            palette: {
                primary: cyan,
                secondary: {
                    main: '#80deea',
                },
                background: {
                    default: '#333',
                    paper: '#444',
                },
                grey: {
                    50: '#4a4a4a',
                    100: '#aaa',
                    200: '#212121',
                },
                text: {
                    primary: '#fff',   // Primary text color
                    secondary: '#666', // Secondary text color
                },
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.primary.main,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.primary.main,
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.light,
                    },
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                        },
                    },
                    '& fieldset': {
                        borderWidth: '1px !important',
                    },
                }),
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                }),
            },
        },
    },
});

export default theme;