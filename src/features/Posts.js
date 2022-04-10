import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import config from '../config'
const initialState = {
    posts: { value: [] },
    loading: false,
}
export const apiPosts = createAsyncThunk('posts/apiPosts', async () => {
    const response = await fetch(`${config.SERVER_URL}/posts`, {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            // 'x-access-token': `${token}`,
        },
    }).then((data) => data.json())

    return response
})

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.value.push(action.payload)
        },
    },
    extraReducers(builder) {
        builder
            .addCase(apiPosts.pending, (state, action) => {
                state.status = 'loading'
                state.loading = true
            })
            .addCase(apiPosts.fulfilled, (state, { payload }) => {
                state.status = 'succeeded'
                state.loading = false
                state.posts.value = payload
            })
            .addCase(apiPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { addPost } = postsSlice.actions
export default postsSlice.reducer
