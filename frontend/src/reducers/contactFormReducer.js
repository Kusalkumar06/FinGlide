export const contactInitialState = {
  name: "",
  email: "",
  message: "",
  loading: false,
  success: false,
  error: null,
};

export function contactFormReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "SUBMIT_START":
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };

    case "RESET_FORM":
      return contactInitialState;

    default:
      return state;
  }
}
