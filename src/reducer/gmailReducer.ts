import { GMAIL_REDUCER_TYPE } from '../enum/gmail/GmailReducer';
import { GmailReducerInterface } from '../interfaces/gmail/GmailReducer';

export const GmailReducer = (
  state: GmailReducerInterface,
  action: { type: GMAIL_REDUCER_TYPE; payload: Partial<GmailReducerInterface> }
) => {
  switch (action.type) {
    case GMAIL_REDUCER_TYPE.SET_CURRENT_LABEL: {
      if (typeof action.payload.currentLabel === 'string') {
        return { ...state, currentLabel: action.payload.currentLabel };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_LABELS: {
      if (typeof action.payload.labels === 'object' && Array.isArray(action.payload.labels)) {
        return { ...state, labels: action.payload.labels };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_CONTACTS: {
      if (typeof action.payload.contacts === 'object' && Array.isArray(action.payload.contacts)) {
        return { ...state, contacts: action.payload.contacts };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_CURRENT_CONTACT: {
      if (typeof action.payload.currentContact === 'string') {
        return { ...state, currentContact: action.payload.currentContact };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_SELECT: {
      return { ...state, selectedContact: action.payload.selectedContact! };
    }

    case GMAIL_REDUCER_TYPE.SET_MESSAGE_MODEL_SHOW: {
      if (typeof action.payload.messageShowModel === 'string') {
        return { ...state, messageShowModel: action.payload.messageShowModel };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_USER_EMAIL: {
      if (typeof action.payload.userEmail === 'string') {
        return { ...state, userEmail: action.payload.userEmail };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_EDITOR_TYPE: {
      if (typeof action.payload.editor === 'string') {
        return { ...state, editor: action.payload.editor };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_EDITOR_TYPE: {
      if (typeof action.payload.messageThread === 'string') {
        return { ...state, messageThread: action.payload.messageThread };
      }
      break;
    }

    case GMAIL_REDUCER_TYPE.SET_MESSAGES: {
      const { cache: Messages } = action.payload;
      if (typeof Messages === 'object' && Array.isArray(Messages) && Messages.length === 1) {
        // Search for collection who stores those emails
        const found = state.cache.find((collection) => {
          const state = collection.email.reduce(function (prev, cur) {
            return prev && Messages[0].email.includes(cur);
          }, true);
          return state;
        });

        if (found) {
          // The collection exists
          found.messages = [...Messages[0].messages, ...found.messages];
          found.nextPageToken = Messages[0].nextPageToken;
          return { ...state };
        } else {
          return { ...state, cache: [...state.cache, Messages[0]] };
        }
      }
      break;
    }
  }
  return state;
};
