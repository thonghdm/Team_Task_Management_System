import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import TextEditor from '~/Components/TextEditor';

const ProjectDescription = ({ initialContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [tempContent, setTempContent] = useState(initialContent); // temporary content for editing
  const editorRef = useRef(null);

  const handleClickOutside = (event) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleSave = () => {
    setContent(tempContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContent(content); // Revert changes
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div ref={editorRef}>
          <TextEditor value={tempContent} onChange={setTempContent} />
          <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </div>
      ) : (
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default ProjectDescription;
