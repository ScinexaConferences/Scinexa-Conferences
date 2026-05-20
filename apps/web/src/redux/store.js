import { configureStore } from "@reduxjs/toolkit";
import { authReducer, persistAuthState } from "./authSlice";
import { persistUiState, uiReducer } from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer
  }
});

store.subscribe(() => {
  const state = store.getState();
  persistAuthState(state.auth);
  persistUiState(state.ui);
});
