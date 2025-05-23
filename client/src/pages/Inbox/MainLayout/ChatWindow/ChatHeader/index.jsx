import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, IconButton, AvatarGroup } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import MissedVideoCallIcon from "@mui/icons-material/MissedVideoCall";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import videoCallService from "~/apis/inbox/videoCallService";
import { useCallContext } from "~/Context/CallProvider";
import { useChat } from '~/Context/ChatProvider';

// Hàm tạo avatar tự động từ tên nhóm (dự phòng)
const generateAvatarColor = (name) => {
  // Tạo màu ngẫu nhiên dựa trên tên nhóm
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

const ChatHeader = ({ toggleSidebar }) => {
  const { chatId } = useParams();
  const [isStartingCall, setIsStartingCall] = useState(false);
  const { accesstoken, userData } = useSelector((state) => state.auth);
  const { startCall } = useCallContext();
  const { currentConversation } = useChat();
  const [avatarError, setAvatarError] = useState(false);

  const theme = useTheme();

  // Kiểm tra xem đây có phải là cuộc trò chuyện nhóm không
  const isGroup = currentConversation?.isGroup;

  // Lấy thông tin user đối thoại hoặc thông tin nhóm
  let otherUser = null;
  let groupInfo = null;
  
  if (currentConversation) {
    if (isGroup) {
      groupInfo = currentConversation.groupInfo;
      console.log("Group info:", groupInfo); // Để debug
    } else if (currentConversation.participants) {
      otherUser = currentConversation.participants.find(u => u._id !== userData?._id);
    }
  }

  // Reset avatar error khi conversation thay đổi
  useEffect(() => {
    setAvatarError(false);
  }, [currentConversation]);

  const handleVideoCall = async () => {
    try {
      setIsStartingCall(true);

      // Lấy danh sách người tham gia (loại trừ người dùng hiện tại)
      let participantIds = [];
      
      if (isGroup) {
        participantIds = currentConversation.participants
          .filter(participant => participant._id !== userData?._id)
          .map(participant => participant._id);
      } else if (otherUser) {
        participantIds = [otherUser._id];
      }

      if (participantIds.length === 0) {
        throw new Error("No participants to call");
      }

      // Call API to create a new call
      const response = await videoCallService.startCall(
        accesstoken, 
        participantIds, 
        isGroup ? currentConversation._id : null
      );

      if (response.success && response.videoCall) {
        // Use the context function to emit socket event
        startCall(response.videoCall._id, participantIds, isGroup ? currentConversation._id : null);

        console.log("Start call response:", response);
        // Navigate to video call page
        const url = `/call-video/${response.videoCall._id}`;
        window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");
      } else {
        throw new Error("Cannot start call");
      }
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Cannot start call. Please try again later.");
    } finally {
      setIsStartingCall(false);
    }
  };

  // Tạo URL avatar dựa trên tên nhóm (dự phòng)
  const generateFallbackAvatarUrl = (name) => {
    const initials = name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${encodeURIComponent(generateAvatarColor(name).replace('#', ''))}&chars=${initials}`;
  };

  // Xử lý lỗi khi ảnh không tải được
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Render avatar dựa vào loại cuộc trò chuyện
  const renderAvatar = () => {
    if (isGroup) {
      // Hiển thị avatar nhóm
      const groupName = groupInfo?.name || 'Group Chat';
      const avatarSrc = avatarError || !groupInfo?.avatar 
        ? generateFallbackAvatarUrl(groupName)
        : groupInfo.avatar;

      return (
        <Avatar 
          sx={{ 
            mr: 2,
            bgcolor: generateAvatarColor(groupName)
          }} 
          src={avatarSrc}
          alt={groupName}
          onError={handleAvatarError}
        >
          {groupName[0].toUpperCase()}
        </Avatar>
      );
    } else {
      // Hiển thị avatar người dùng
      return (
        <Avatar sx={{ mr: 2 }} src={otherUser?.image}>
          {otherUser?.displayName ? otherUser.displayName[0].toUpperCase() : 'U'}
        </Avatar>
      );
    }
  };

  // Render tên cuộc trò chuyện
  const renderName = () => {
    if (isGroup) {
      return groupInfo?.name || 'Group Chat';
    } else {
      return otherUser?.displayName || 'Chat';
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box display="flex" alignItems="center">
        {renderAvatar()}
        <Box>
          <Typography variant="h6">
            {renderName()}
          </Typography>
          {isGroup && (
            <Typography variant="caption" color="text.secondary">
              {currentConversation?.participants?.length || 0} members
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <IconButton
          sx={{ mr: 1 }}
          onClick={handleVideoCall}
          disabled={isStartingCall}
        >
          <CallIcon />
        </IconButton>
        <IconButton>
          <MissedVideoCallIcon />
        </IconButton>
        <IconButton onClick={toggleSidebar} title="Show conversation details">
          <InfoIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;



// import React, { useState, useEffect } from "react";
// import { Box, Avatar, Typography, IconButton } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import MissedVideoCallIcon from "@mui/icons-material/MissedVideoCall";
// import ReportIcon from "@mui/icons-material/Report";
// import { useTheme } from "@mui/material/styles";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import videoCallService from "~/apis/inbox/videoCallService";
// import socket from '~/utils/socket'; // Import instance Socket.IO
// import CallNotification from "~/pages/Inbox/Call-video/CallNotification";

// const ChatHeader = ({ toggleSidebar }) => {
//   const { chatId } = useParams();
//   const [isStartingCall, setIsStartingCall] = useState(false);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [isProcessingCallResponse, setIsProcessingCallResponse] = useState(false);
//   const { accesstoken, userData } = useSelector((state) => state.auth);

//   const group = {
//     _id: "67d59fac2c71b42fb0197ff7",
//     name: "Phát triển Frontend",
//     members: ["67c2100f78bae2b07a234ade", "67c20f9c78bae2b07a234a8f", "67cd375fcc908037fa1c6e28"],
//   };

//   const theme = useTheme();

//   // Update the incomingCall handling in the useEffect:

//   useEffect(() => {
//     // Kết nối Socket.IO khi component được mount
//     socket.connect();
//     // Xác thực người dùng
//     socket.emit("authenticate", { userId: userData?._id });

//     // Lắng nghe sự kiện cuộc gọi đến
//     socket.on("incoming_call", (data) => {
//       console.log("Incoming call:", data);
//       if (data && data.call) {
//         setIncomingCall({
//           callId: data.call._id,
//           caller: data.caller || {
//             username: "Unknown",
//             avatar: null
//           }
//         });
//       }
//     });

//     // Ngắt kết nối khi component unmount
//     return () => {
//       socket.off("incoming_call");
//       socket.disconnect();
//     };
//   }, [userData]);



//   const handleVideoCall = async () => {
//     try {
//       setIsStartingCall(true);

//       // Lấy danh sách thành viên của nhóm ngoại trừ người dùng hiện tại
//       const participantIds = group.members.filter((memberId) => memberId !== userData._id);

//       // Gọi API để tạo cuộc gọi mới
//       const response = await videoCallService.startCall(accesstoken, participantIds, group._id);

//       if (response.success && response.videoCall) {
//         // Gửi sự kiện initiate_call đến BE
//         socket.emit("initiate_call", {
//           callId: response.videoCall._id,
//           caller: {
//             userId: userData._id,
//             username: userData.username,
//             image: userData.image,
//           },
//           recipientIds: participantIds,
//         });

//         // Chuyển đến trang cuộc gọi video
//         const url = `/call-video/${group._id}`;
//         window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");
//       } else {
//         throw new Error("Không thể bắt đầu cuộc gọi");
//       }
//     } catch (error) {
//       console.error("Lỗi khi bắt đầu cuộc gọi:", error);
//       alert("Không thể bắt đầu cuộc gọi. Vui lòng thử lại sau.");
//     } finally {
//       setIsStartingCall(false);
//     }
//   };

//   const handleAcceptCall = async () => {
//     if (!incomingCall) return;

//     try {
//       setIsProcessingCallResponse(true);

//       // Gửi sự kiện accept_call đến BE
//       socket.emit("accept_call", {
//         callId: incomingCall.callId
//       });

//       // Mở cửa sổ video call
//       const url = `/call-video/${group._id}`;
//       window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");

//       // Đóng thông báo
//       setIncomingCall(null);
//     } catch (error) {
//       console.error("Lỗi khi chấp nhận cuộc gọi:", error);
//       alert("Không thể chấp nhận cuộc gọi. Vui lòng thử lại sau.");
//     } finally {
//       setIsProcessingCallResponse(false);
//     }
//   };

//   const handleDeclineCall = () => {
//     if (!incomingCall) return;

//     try {
//       setIsProcessingCallResponse(true);

//       // Gửi sự kiện decline_call đến BE
//       socket.emit("decline_call", {
//         callId: incomingCall.callId
//       });

//       // Đóng thông báo
//       setIncomingCall(null);
//     } catch (error) {
//       console.error("Lỗi khi từ chối cuộc gọi:", error);
//     } finally {
//       setIsProcessingCallResponse(false);
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: "1px solid #ddd",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           backgroundColor: theme.palette.background.default,
//         }}
//       >
//         <Box display="flex" alignItems="center">
//           <Avatar sx={{ mr: 2 }}>D</Avatar>
//           <Typography variant="h6">{chatId}</Typography>
//         </Box>
//         <Box>
//           <IconButton
//             sx={{ mr: 1 }}
//             onClick={handleVideoCall}
//             disabled={isStartingCall}
//           >
//             <CallIcon />
//           </IconButton>
//           <IconButton>
//             <MissedVideoCallIcon />
//           </IconButton>
//           <IconButton onClick={toggleSidebar}>
//             <ReportIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       <CallNotification
//         open={incomingCall !== null}
//         caller={incomingCall?.caller}
//         onAccept={handleAcceptCall}
//         onDecline={handleDeclineCall}
//         isProcessing={isProcessingCallResponse}
//       />
//     </>
//   );
// };

// export default ChatHeader;






