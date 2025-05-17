import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import messageApi from '~/apis/chat/messageApi';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const { userData, accessToken } = useSelector((state) => state.auth);

    // Lấy tin nhắn của cuộc trò chuyện
    const fetchMessages = useCallback(async (conversationId) => {
        try {
            setLoading(true);
            const data = await messageApi.getMessages(accessToken, conversationId);
            setMessages(data);
            setCurrentConversation(conversationId);
        } catch (err) {
            setError('Failed to fetch messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    // Gửi tin nhắn mới
    const sendMessage = useCallback((conversationId, messageData) => {
        if (!userData?._id) return;
        
        socket.emit('send message', {
            senderId: userData._id,
            conversationId,
            messageData
        });
    }, [userData]);

    // Đánh dấu tin nhắn đã xem
    const markMessageAsSeen = useCallback((messageId) => {
        if (!userData?._id) return;

        socket.emit('mark message as seen', {
            messageId,
            userId: userData._id
        });
    }, [userData]);

    // Xử lý tin nhắn mới
    const handleNewMessage = useCallback((message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    // Xử lý tin nhắn đã xem
    const handleMessageSeen = useCallback((data) => {
        setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
                ? { ...msg, seenBy: [...msg.seenBy, { user: data.userId }] }
                : msg
        ));
    }, []);

    // Thiết lập socket listeners
    useEffect(() => {
        if (!userData?._id) return;

        // Xử lý tin nhắn mới
        socket.on('new message', handleNewMessage);
        
        // Xử lý tin nhắn đã xem
        socket.on('message seen', handleMessageSeen);

        // Cleanup
        return () => {
            socket.off('new message', handleNewMessage);
            socket.off('message seen', handleMessageSeen);
        };
    }, [userData, handleNewMessage, handleMessageSeen]);

    // Tham gia vào cuộc trò chuyện khi thay đổi
    useEffect(() => {
        if (currentConversation) {
            socket.emit('join conversation', currentConversation);
        }

        return () => {
            if (currentConversation) {
                socket.emit('leave conversation', currentConversation);
            }
        };
    }, [currentConversation]);

    const value = {
        messages,
        loading,
        error,
        currentConversation,
        sendMessage,
        markMessageAsSeen,
        fetchMessages,
        setCurrentConversation
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider; 