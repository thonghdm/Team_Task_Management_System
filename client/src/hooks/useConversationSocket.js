import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import { useChat } from '~/Context/ChatProvider';

const useConversationSocket = (conversationsLocal, setConversationsLocal) => {
    const { userData } = useSelector((state) => state.auth);
    const { currentConversation, setCurrentConversation } = useChat();

    // Handle conversation updated even
    const handleConversationUpdated = useCallback((updatedConversation) => {
        console.log('Conversation updated received:', updatedConversation);
        
        if (!updatedConversation || !updatedConversation._id) {
            console.error('Invalid conversation update data:', updatedConversation);
            return;
        }

        setConversationsLocal(prev => {
            const exists = prev.some(conv => conv._id.toString() === updatedConversation._id.toString());
            if (exists) {
                const updated = prev.map(conv =>
                    conv._id.toString() === updatedConversation._id.toString()
                        ? { 
                            ...conv, 
                            ...updatedConversation,
                            participants: updatedConversation.participants || conv.participants,
                            groupInfo: updatedConversation.isGroup ? 
                                { ...conv.groupInfo, ...updatedConversation.groupInfo } : conv.groupInfo,
                            lastMessage: updatedConversation.lastMessage || conv.lastMessage
                        }
                        : conv
                );
                return updated;
            } else {
                return [updatedConversation, ...prev];
            }
        });

        if (currentConversation && currentConversation._id.toString() === updatedConversation._id.toString()) {
            setCurrentConversation(prev => ({
                ...prev,
                ...updatedConversation,
                participants: updatedConversation.participants || prev.participants,
                groupInfo: updatedConversation.isGroup ? 
                    { ...prev.groupInfo, ...updatedConversation.groupInfo } : prev.groupInfo
            }));
        }
    }, [setConversationsLocal, currentConversation, setCurrentConversation]);

    const handleRemovedFromGroup = useCallback((data) => {
        const { conversationId } = data;
        console.log('Removing conversation from sidebar:', conversationId);
        
        setConversationsLocal(prev => 
            prev.filter(conv => conv._id.toString() !== conversationId.toString())
        );
    }, [setConversationsLocal]);

    const handleLeftGroup = useCallback((data) => {
        const { conversationId } = data;
        console.log('Removing conversation from sidebar (left group):', conversationId);
        
        setConversationsLocal(prev => 
            prev.filter(conv => conv._id.toString() !== conversationId.toString())
        );
    }, [setConversationsLocal]);

    const handleAddedToGroup = useCallback((data) => {
        const { conversation } = data;
        console.log('Adding new conversation to sidebar:', conversation);
        
        if (conversation) {
            setConversationsLocal(prev => {
                const exists = prev.some(conv => conv._id.toString() === conversation._id.toString());             
                if (!exists) {
                    const newConversations = [conversation, ...prev];
                    return newConversations;
                }
                console.log('Conversation already exists, not adding');
                return prev;
            });
        } else {
            console.error('No conversation object in added_to_group event');
        }
    }, [setConversationsLocal]);

    useEffect(() => {
        if (!userData?._id || !setConversationsLocal) return;

        console.log('Setting up conversation socket listeners');

        socket.on('conversation updated', handleConversationUpdated);
        socket.on('removed_from_group', handleRemovedFromGroup);
        socket.on('left_group', handleLeftGroup);
        socket.on('added_to_group', handleAddedToGroup);

        return () => {
            console.log('Cleaning up conversation socket listeners');
            socket.off('conversation updated', handleConversationUpdated);
            socket.off('removed_from_group', handleRemovedFromGroup);
            socket.off('left_group', handleLeftGroup);
            socket.off('added_to_group', handleAddedToGroup);
        };
    }, [
        userData,
        setConversationsLocal,
        handleConversationUpdated,
        handleRemovedFromGroup,
        handleLeftGroup,
        handleAddedToGroup
    ]);

    return {
        isListening: !!userData?._id
    };
};

export default useConversationSocket; 