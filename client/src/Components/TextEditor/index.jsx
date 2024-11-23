import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditorToolbar, { modules, formats } from '~/Components/TextEditor/EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './styles.css';

const StyledToolbar = styled('div')(({ theme }) => ({
  '& .ql-toolbar': {
    '& .ql-fill': {
      fill: `${theme.palette.text.primary} !important`,
      stroke: 'none',
    },
    '& .ql-picker': {
      color: theme.palette.text.primary,
    },
    '& .ql-stroke': {
      fill: 'none',
      stroke: theme.palette.text.primary,
    },
  },
  '& button:hover .ql-stroke, & .ql-picker-label:hover .ql-stroke': {
    fill: 'none',
    stroke: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-active .ql-stroke': {
    fill: 'none',
    stroke: `${theme.palette.primary.main}!important`,
  },
  '& button:hover .ql-fill, & .ql-picker-label:hover .ql-fill': {
    fill: `${theme.palette.secondary.main}!important`,
    stroke: 'none',
  },
  '& .ql-active .ql-fill': {
    fill: `${theme.palette.primary.main}!important`,
    stroke: 'none',
  },
  '& .ql-snow.ql-toolbar .ql-picker-label.ql-active': {
    color: `${theme.palette.primary.main}!important`,
  },
  '& .ql-picker-options': {
    backgroundColor: `${theme.palette.background.default} !important`,
  },
  '& .ql-snow.ql-toolbar .ql-picker-item.ql-selected': {
    color: `${theme.palette.primary.main}!important`,
  },
  '& .ql-snow.ql-toolbar .ql-picker-label:hover': {
    color: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-snow.ql-toolbar .ql-picker-item:hover': {
    color: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-snow .ql-icon-picker .ql-picker-label:hover': {
    color: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-snow .ql-icon-picker .ql-picker-options:hover': {
    color: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-snow.ql-icon-picker .ql-picker-item:hover': {
    color: `${theme.palette.secondary.main}!important`,
  },
  '& .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, & .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, & .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke': {
    stroke: `${theme.palette.secondary.main}!important`,
  }
}));


function TextEditor({ value, onChange }) {
  const [content, setContent] = useState(value);

  const handleContentChange = (value) => {
    setContent(value);
    onChange(value);
  };

  return (
    <Box className="text-editor" sx={{ mt: 1}}>
      <StyledToolbar>
        <EditorToolbar toolbarId="t1" />
      </StyledToolbar>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleContentChange}
        placeholder="Write something awesome..."
        modules={modules('t1')}
        formats={formats}
      />
    </Box>
  );
}

export default TextEditor;

// vaof file nafy