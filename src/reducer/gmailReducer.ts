export enum GMAIL_REDUCER_TYPE {
  SET_MESSAGES_ID,
  SET_MESSAGES_CONTENT,
  SET_MESSAGES,
  SET_CURRENT_LABEL,
  SET_LABELS,
  SET_CURRENT_CONTACT,
  SET_MESSAGE_MODEL_SHOW,
  SET_USER_EMAIL,
  SET_EDITOR_TYPE,
  SET_MESSAGE_THREAD,
}

export interface GmailReducerInterface {
  cache: Array<{ email: string; nextPageToken: string; messages: Array<string> }>;
  nextPageToken: string;
  currentLabel: string;
  labels: string[];
  currentContact: string;
  userEmail: string;
  messageShowModel: 'snippet' | 'complete';
  editor: 'simple' | 'complete';
  messageThread: 'new thread' | 'last thread';
}

export const GmailReducer = (state: GmailReducerInterface, action: { type: GMAIL_REDUCER_TYPE; payload: Partial<GmailReducerInterface> }) => {
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

    case GMAIL_REDUCER_TYPE.SET_CURRENT_CONTACT: {
      if (typeof action.payload.currentContact === 'string') {
        return { ...state, currentContact: action.payload.currentContact };
      }
      break;
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
  }
  return state;
};
