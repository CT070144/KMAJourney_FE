import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: '',
};

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        clearEmail: (state) => {
            state.email = '';
        },
    },
});

export const { setEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
