import { createSlice } from "@reduxjs/toolkit";

const UI_STORAGE_KEY = "scinexa-ui";

const defaultUiState = {
  theme: "light",
  savedConferenceIds: ["oncology-frontiers", "ai-health-summit"]
};

function loadPersistedUiState() {
  if (typeof window === "undefined") {
    return defaultUiState;
  }

  try {
    const raw = window.localStorage.getItem(UI_STORAGE_KEY);

    if (!raw) {
      return defaultUiState;
    }

    const parsed = JSON.parse(raw);

    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      savedConferenceIds: Array.isArray(parsed.savedConferenceIds)
        ? parsed.savedConferenceIds
        : defaultUiState.savedConferenceIds
    };
  } catch {
    return defaultUiState;
  }
}

export function persistUiState(uiState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    UI_STORAGE_KEY,
    JSON.stringify({
      theme: uiState.theme,
      savedConferenceIds: uiState.savedConferenceIds
    })
  );
}

const uiSlice = createSlice({
  name: "ui",
  initialState: loadPersistedUiState(),
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      state.theme = action.payload === "dark" ? "dark" : "light";
    },
    toggleSavedConference(state, action) {
      const id = action.payload;
      state.savedConferenceIds = state.savedConferenceIds.includes(id)
        ? state.savedConferenceIds.filter((conferenceId) => conferenceId !== id)
        : [...state.savedConferenceIds, id];
    }
  }
});

export const uiReducer = uiSlice.reducer;
export const { toggleTheme, setTheme, toggleSavedConference } = uiSlice.actions;
