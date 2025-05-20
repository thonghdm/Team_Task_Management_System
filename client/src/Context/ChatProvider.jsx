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
    const { userData, accessToken } = useSelector((state) => state.auth);
    const refreshToken = useRefreshToken();
    const refreshAccessToken = useRefreshToken();

    // Lấy tin nhắn của cuộc trò chuyện
    const fetchMessages = useCallback(async (conversationId, token = accessToken) => {
        setLoading(true);
        setError(null);
        try {
            const data = await messageApi.getMessages(token, conversationId);
            console.log("data",data);
            setMessages(data);
            setCurrentConversation(conversationId);
        } catch (err) {
            // Nếu lỗi 401 hoặc hết hạn token
            if ((err?.response?.status === 401 || err?.err === 2) && refreshToken) {
                try {
                    const newToken = await refreshAccessToken();
                    // Gọi lại với accessToken mới
                    const data = await messageApi.getMessages(newToken, conversationId);
                    setMessages(data);
                } catch (refreshErr) {
                    setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
                }
            } else {
                setError('Không thể tải tin nhắn!');
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, refreshToken, refreshAccessToken]);

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