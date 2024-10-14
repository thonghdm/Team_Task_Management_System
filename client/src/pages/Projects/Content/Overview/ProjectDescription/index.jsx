import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import TextEditor from '~/Components/TextEditor';

const ProjectDescription = ({ initialContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
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

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Project description
      </Typography>
      {isEditing ? (
        <div ref={editorRef}>
          <TextEditor value={content} onChange={setContent} />
        </div>
      ) : (
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={() => setIsEditing(true)}
        />
      )}
    </>
  );
};

export default ProjectDescription;