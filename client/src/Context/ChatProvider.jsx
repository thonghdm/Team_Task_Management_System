import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import messageApi from '~/apis/chat/messageApi';
import { useRefreshToken } from '~/utils/useRefreshToken'

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const { userData, accesstoken } = useSelector((state) => state.auth);
    const refreshToken = useRefreshToken();
    const refreshAccessToken = useRefreshToken();
    // Lấy tin nhắn của cuộc trò chuyện
    const fetchMessages = useCallback(async (conversationId, token = accesstoken) => {
        if (!conversationId) {
            console.error('No conversation ID provided');
            return;
        }

        if (!userData?._id) {
            console.error('User not authenticated');
            return;
        }

        if (!token) {
            console.error('No access token available');
            return;
        }
        console.log('fetchMessages', conversationId, token);
        setLoading(true);
        setError(null);
        try {
            const data = await messageApi.getMessages(token, conversationId);
            setMessages(data);
        } catch (err) {
            // Nếu lỗi 401 hoặc hết hạn token
            if ((err?.response?.status === 401 || err?.err === 2) && refreshToken) {
                try {
                    const newToken = await refreshAccessToken();
                    // Gọi lại với accessToken mới
                    const data = await messageApi.getMessages(newToken, conversationId);
                    setMessages(data);
                } catch (refreshErr) {
                    setError('Your session has expired, please log in again!');
                }
            } else {
                setError('Unable to load message!');
            }
        } finally {
            setLoading(false);
        }
    }, [accesstoken, refreshToken, refreshAccessToken]);

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

    // Xử lý cập nhật conversation
    const handleConversationUpdated = useCallback((updatedConversation) => {
        if (currentConversation?._id === updatedConversation._id) {
            setCurrentConversation(prev => ({
                ...prev,
                ...updatedConversation,
            }));
        }
    }, [currentConversation]);

    // Cập nhật thông tin conversation hiện tại
    const updateCurrentConversation = useCallback((updatedConversation) => {
        if (!updatedConversation) {
            setCurrentConversation(null);
            setMessages([]);
            return;
        }

        if (typeof updatedConversation === 'string') {
            console.error('Invalid conversation object provided');
            return;
        }

        if (!updatedConversation._id || !updatedConversation.participants) {
            console.error('Invalid conversation object: missing required fields');
            return;
        }
        setCurrentConversation(updatedConversation);

    }, []);

    // Fetch messages khi conversationId thay đổi thực sự
    useEffect(() => {
        if (currentConversation?._id) {
            setMessages([]); // clear cũ
            fetchMessages(currentConversation._id);
        }
    }, [currentConversation?._id]);

    // Authentication và thiết lập socket listeners
    useEffect(() => {
        if (!userData?._id) return;

        // Authenticate với socket
        socket.emit('authenticate', { userId: userData._id });

        // Xử lý tin nhắn mới
        socket.on('new message', handleNewMessage);
        
        // Xử lý tin nhắn đã xem
        socket.on('message seen', handleMessageSeen);

        // Xử lý cập nhật conversation
        socket.on('conversation updated', handleConversationUpdated);

        // Cleanup
        return () => {
            socket.off('new message', handleNewMessage);
            socket.off('message seen', handleMessageSeen);
            socket.off('conversation updated', handleConversationUpdated);
        };
    }, [userData, handleNewMessage, handleMessageSeen, handleConversationUpdated]);

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

    // Clear current conversation
    const clearCurrentConversation = useCallback(() => {
        setCurrentConversation(null);
        setMessages([]);
    }, []);

    const value = {
        messages,
        loading,
        error,
        currentConversation,
        sendMessage,
        markMessageAsSeen,
        fetchMessages,
        setCurrentConversation: updateCurrentConversation, 
        updateCurrentConversation,
        clearCurrentConversation
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider; 