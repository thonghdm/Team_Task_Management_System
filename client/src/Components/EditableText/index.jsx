import React, { useState, useRef, useEffect } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';

function EditableText({ initialText, onSave, maxWidth, titleColor }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);
    const [inputWidth, setInputWidth] = useState('auto');
    const spanRef = useRef();

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    useEffect(() => {
        if (spanRef.current) {
            setInputWidth(`${spanRef.current.offsetWidth + 16}px`); // Thêm khoảng padding
        }
    }, [text]);

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        if (text !== initialText) {
            onSave(text);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setText(initialText); // Trả về giá trị ban đầu
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <>
            {/* Thẻ span ẩn để tính toán độ rộng */}
            <span
                ref={spanRef}
                style={{
                    visibility: 'hidden',
                    whiteSpace: 'pre',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    position: 'absolute',
                }}
            >
                {text || 'Click to edit'}
            </span>

            {isEditing ? (
                <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        variant="outlined"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        sx={{
                            width: inputWidth,
                            maxWidth: maxWidth,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#555',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#777',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#aaa',
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '1.25rem', // Kích thước chữ tương ứng h6
                                lineHeight: '1.6',
                                fontWeight: '500',
                                color: titleColor,
                                padding: '7.5px 4px', // Padding nội dung
                            },
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <IconButton
                            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from being triggered
                            onClick={handleCancel}
                            sx={{ width: '23px', height: '23px' }}
                        >
                            <Close sx={{ color: '#f44336', fontSize: '20px'}} />
                        </IconButton>
                        <IconButton
                            onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from being triggered
                            onClick={handleSave}
                            sx={{ width: '23px', height: '23px' }}
                        >
                            <CheckCircle sx={{ color: '#4caf50', fontSize: '20px'}} />
                        </IconButton>

                    </div>
                </div>
            ) : (
                <TextField
                    onClick={handleTextClick}
                    value={text}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{
                        width: inputWidth,
                        maxWidth: maxWidth,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent', // Không viền mặc định
                            },
                            '&:hover fieldset': {
                                borderColor: 'red', // Viền khi hover
                            },
                        },
                        '& .MuiInputBase-input': {
                            fontSize: '1.25rem', // Kích thước chữ tương ứng h6
                            lineHeight: '1.6',
                            fontWeight: '500',
                            color: titleColor,
                            padding: '7.5px 4px', // Padding nội dung
                        },
                        cursor: 'pointer',
                        borderRadius: 8,
                    }}
                />
            )}
        </>
    );
}

export default EditableText;
