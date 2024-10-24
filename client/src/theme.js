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
                    contrastText: '#00c1c1',
                },
                background: {
                    default: '#f2f2f2',
                    paper: '#fff',
                },
                grey: {
                    50: '#f5f5f5',
                    100: '#fff',
                    200: '#fff',
                },
                text: {
                    primary: '#000',   // Primary text color
                    secondary: '#4d4d4d', // Secondary text color
                    disabled: '#e5e5e5',    // Disabled text color
                },
            },
        },
        dark: {
            palette: {
                primary: cyan,
                secondary: {
                    main: '#80deea',
                    contrastText: '#ace9f1',
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
                    secondary: '#8c8c8c', // Secondary text color
                    disabled: '#373737',    // Disabled text color
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
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.text.primary,
                    },
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.secondary.contrastText,
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