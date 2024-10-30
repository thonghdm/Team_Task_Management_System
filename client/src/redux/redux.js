import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk' // Có thể không cần thiết vì redux-thunk đã được tích hợp sẵn trong Redux Toolkit
import rootReducer from './reducers/rootReducer'

const reduxStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(thunk), // Nếu muốn thêm thunk một cách rõ ràng
    })

    const persistor = persistStore(store)

    return { store, persistor }
}

export default reduxStore
