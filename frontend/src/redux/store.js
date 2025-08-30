import { configureStore } from "@reduxjs/toolkit";

import slice from "./slices";

const store = configureStore({
    reducer : {
        sliceState: slice.reducer
    }
})

export default store