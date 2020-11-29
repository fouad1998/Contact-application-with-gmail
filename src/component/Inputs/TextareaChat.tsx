import React, { useCallback, useState } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface TextAreaInterface {
  to: string;
  onSubmit: (content: string) => any;
}

export const TextAreaChat: React.FC<TextAreaInterface> = ({ onSubmit, to }) => {
  const [content, setContent] = useState<string>('');

  const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const {
      target: { value },
    } = event;
    setContent(value);
  }, []);

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      event.stopPropagation();
      const { altKey, shiftKey, code, keyCode } = event;

      if ((altKey || shiftKey) && (code === '\n' || keyCode === 13)) {
        return void 0;
      } else if (code === '\n' || keyCode === 13) {
        setContent('');
        onSubmit && onSubmit(content);
      }
    },
    [content]
  );

  return (
    <TextArea
      onKeyDown={onKeyDownHandler}
      onChange={onChangeHandler}
      placeholder={`Message to ${to}`}
      value={content}
      autoSize={{ maxRows: 5, minRows: 1 }}
      className="textarea-chat"
    />
  );
};
