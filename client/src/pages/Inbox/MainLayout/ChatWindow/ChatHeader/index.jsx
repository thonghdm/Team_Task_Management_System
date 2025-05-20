import React, { useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import MissedVideoCallIcon from "@mui/icons-material/MissedVideoCall";
import ReportIcon from "@mui/icons-material/Report";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import videoCallService from "~/apis/inbox/videoCallService";
import { useCallContext } from "~/Context/CallProvider";
import { useChat } from '~/Context/ChatProvider';

const ChatHeader = ({ toggleSidebar }) => {
  const { chatId } = useParams();
  const [isStartingCall, setIsStartingCall] = useState(false);
  const { accesstoken, userData } = useSelector((state) => state.auth);
  const { startCall } = useCallContext();
  const { currentConversation } = useChat();

  const group = {
    _id: "67d59fac2c71b42fb0197ff7",
    name: "Phát triển Frontend",
    members: ["67c2100f78bae2b07a234ade", "67c20f9c78bae2b07a234a8f", "67cd375fcc908037fa1c6e28"],
  };

  const theme = useTheme();

  // Lấy thông tin user đối thoại
  let otherUser = null;
  if (currentConversation && currentConversation.participants) {
    otherUser = currentConversation.participants.find(u => u._id !== userData._id);
  }

  const handleVideoCall = async () => {
    try {
      setIsStartingCall(true);

      // Get group members excluding current user
      const participantIds = group.members.filter((memberId) => memberId !== userData._id);

      // Call API to create a new call
      const response = await videoCallService.startCall(accesstoken, participantIds, group._id);

      if (response.success && response.videoCall) {
        // Use the context function to emit socket event
        startCall(response.videoCall._id, participantIds, group._id);

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
        <Avatar sx={{ mr: 2 }} src={otherUser?.image}>
          {otherUser?.displayName ? otherUser.displayName[0] : 'D'}
        </Avatar>
        <Typography variant="h6">
          {otherUser?.displayName || chatId}
        </Typography>
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
        <IconButton onClick={toggleSidebar}>
          <ReportIcon />
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






