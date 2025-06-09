import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import { toast } from 'react-toastify';
import { useChat } from '~/Context/ChatProvider';
import { useNavigate } from 'react-router-dom';

const useGroupSocket = () => {
    const { userData } = useSelector((state) => state.auth);
    const { setCurrentConversation, currentConversation } = useChat();
    const navigate = useNavigate();


    const handleAddedToGroup = useCallback((data) => {
        const { conversationId, groupName, addedBy, conversation } = data;
        console.log('Added to group:', data);
        
        toast.success(`You have been added to "${groupName}"`);
        

        if (conversation) {
            setCurrentConversation(conversation);
            navigate(`/board/inbox/1/${conversationId}`);
        }
    }, [setCurrentConversation, navigate]);


    const handleMemberAddedToGroup = useCallback((data) => {
        const { conversationId, newMemberId, addedBy, conversation } = data;
        console.log('Member added to group:', data);
        
        if (conversation) {
            toast.info(`A new member has been added to "${conversation.groupInfo.name}"`);
            

            if (currentConversation && currentConversation._id === conversationId) {
                setCurrentConversation(conversation);
            }
        }
    }, [currentConversation, setCurrentConversation]);


    const handleRemovedFromGroup = useCallback((data) => {
        const { conversationId, groupName, removedBy } = data;
        console.log('Removed from group:', data);
        
        toast.error(`You have been removed from "${groupName}"`);
        

        if (currentConversation && currentConversation._id === conversationId) {
            setCurrentConversation(null);
            navigate('/board/inbox/1');
        }
    }, [currentConversation, setCurrentConversation, navigate]);


    const handleMemberRemovedFromGroup = useCallback((data) => {
        const { conversationId, removedMemberId, removedBy, conversation } = data;
        console.log('Member removed from group:', data);
        
        if (conversation) {
            toast.info(`A member has been removed from "${conversation.groupInfo.name}"`);
            

            if (currentConversation && currentConversation._id === conversationId) {
                setCurrentConversation(conversation);
            }
        }
    }, [currentConversation, setCurrentConversation]);


    const handleMadeAdmin = useCallback((data) => {
        const { conversationId, groupName, madeBy } = data;
        console.log('Made admin:', data);
        
        toast.success(`You are now an admin of "${groupName}"`);
    }, []);


    const handleNewAdminInGroup = useCallback((data) => {
        const { conversationId, newAdminId, madeBy, conversation } = data;
        console.log('New admin in group:', data);
        
        if (conversation) {
            toast.info(`A new admin has been appointed in "${conversation.groupInfo.name}"`);
            

            if (currentConversation && currentConversation._id === conversationId) {
                setCurrentConversation(conversation);
            }
        }
    }, [currentConversation, setCurrentConversation]);


    const handleAdminRemoved = useCallback((data) => {
        const { conversationId, groupName, removedBy } = data;
        console.log('Admin removed:', data);
        
        toast.warning(`Your admin rights have been removed from "${groupName}"`);
    }, []);


    const handleAdminRemovedFromGroup = useCallback((data) => {
        const { conversationId, removedAdminId, removedBy, conversation } = data;
        console.log('Admin removed from group:', data);
        
        if (conversation) {
            toast.info(`An admin has been removed from "${conversation.groupInfo.name}"`);
            

            if (currentConversation && currentConversation._id === conversationId) {
                setCurrentConversation(conversation);
            }
        }
    }, [currentConversation, setCurrentConversation]);


    const handleLeftGroup = useCallback((data) => {
        const { conversationId, groupName } = data;
        console.log('Left group:', data);
        
        toast.info(`You have left "${groupName}"`);
        

        if (currentConversation && currentConversation._id === conversationId) {
            setCurrentConversation(null);
            navigate('/board/inbox/1');
        }
    }, [currentConversation, setCurrentConversation, navigate]);


    const handleMemberLeftGroup = useCallback((data) => {
        const { conversationId, leftMemberId, conversation } = data;
        console.log('Member left group:', data);
        
        if (conversation) {
            toast.info(`A member has left "${conversation.groupInfo.name}"`);
            

            if (currentConversation && currentConversation._id === conversationId) {
                setCurrentConversation(conversation);
            }
        }
    }, [currentConversation, setCurrentConversation]);


    useEffect(() => {
        if (!userData?._id) return;

        const setupListeners = () => {
            console.log('Setting up group socket listeners for user:', userData._id);

            socket.on('added_to_group', handleAddedToGroup);
            socket.on('member_added_to_group', handleMemberAddedToGroup);
            socket.on('removed_from_group', handleRemovedFromGroup);
            socket.on('member_removed_from_group', handleMemberRemovedFromGroup);
            socket.on('made_admin', handleMadeAdmin);
            socket.on('new_admin_in_group', handleNewAdminInGroup);
            socket.on('admin_removed', handleAdminRemoved);
            socket.on('admin_removed_from_group', handleAdminRemovedFromGroup);
            socket.on('left_group', handleLeftGroup);
            socket.on('member_left_group', handleMemberLeftGroup);
        };

        if (socket.connected) {

            socket.emit('authenticate', { userId: userData._id });
            setupListeners();
        } else {

            socket.on('connect', () => {
                console.log('Socket connected, authenticating user:', userData._id);
                socket.emit('authenticate', { userId: userData._id });
                setupListeners();
            });

            if (!socket.connecting) {
                socket.connect();
            }
        }

        return () => {
            console.log('Cleaning up group socket listeners');
            socket.off('added_to_group', handleAddedToGroup);
            socket.off('member_added_to_group', handleMemberAddedToGroup);
            socket.off('removed_from_group', handleRemovedFromGroup);
            socket.off('member_removed_from_group', handleMemberRemovedFromGroup);
            socket.off('made_admin', handleMadeAdmin);
            socket.off('new_admin_in_group', handleNewAdminInGroup);
            socket.off('admin_removed', handleAdminRemoved);
            socket.off('admin_removed_from_group', handleAdminRemovedFromGroup);
            socket.off('left_group', handleLeftGroup);
            socket.off('member_left_group', handleMemberLeftGroup);
            socket.off('connect');
        };
    }, [
        userData,
        handleAddedToGroup,
        handleMemberAddedToGroup,
        handleRemovedFromGroup,
        handleMemberRemovedFromGroup,
        handleMadeAdmin,
        handleNewAdminInGroup,
        handleAdminRemoved,
        handleAdminRemovedFromGroup,
        handleLeftGroup,
        handleMemberLeftGroup
    ]);

    return {

        isListening: !!userData?._id
    };
};

export default useGroupSocket; 