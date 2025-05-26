import React from 'react';
import { Box } from '@mui/material';
import ChatHeader from '~/pages/Inbox/MainLayout/ChatWindow/ChatHeader';
import ChatMessages from '~/pages/Inbox/MainLayout/ChatWindow/ChatMessages';
import ChatInput from '~/pages/Inbox/MainLayout/ChatWindow/ChatInput';
import { useChat } from '~/Context/ChatProvider';
import { useSelector } from 'react-redux';

const ChatWindow = ({ toggleSidebar, selectedUserId }) => {
    const { currentConversation } = useChat();
    const { userData } = useSelector(state => state.auth);
    let otherUserId = selectedUserId;
    // Nếu chưa có selectedUserId, lấy otherUserId từ participants
    if (!otherUserId && currentConversation && currentConversation.participants) {
        const other = currentConversation.participants.find(u => u._id !== userData._id);
        if (other) otherUserId = other._id;
    }

    // Check if there's a current conversation to show header and input
    const hasConversation = currentConversation && currentConversation._id;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {hasConversation && <ChatHeader toggleSidebar={toggleSidebar} />}
            <ChatMessages />
            {hasConversation && <ChatInput otherUserId={otherUserId} />}
        </Box>
    );
}

export default ChatWindow;
