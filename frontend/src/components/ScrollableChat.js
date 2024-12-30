import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const isForbiddenUrl = (url) => {
  
  const forbiddenPatterns = [
/:[0-9]+$/,  
  /phishing/i,  
  /\/wp-admin\//i,  
  /\/login\//i,  
  /\/signin\//i,  
  /\/admin\//i,  
  /:\/\/[^\/]+\.dollar/i,  
  /:\/\/[^\/]+\.cn/i,  
  /:\/\/[^\/]+\.xyz/i,  
  /:\/\/[^\/]+\.tk/i,  
  /:\/\/[^\/]+\.top/i,  
  /:\/\/[^\/]+\.info/i,  
  /:\/\/[^\/]+\.pro/i,  
  /:\/\/[^\/]+\.name/i,  
  /:\/\/[^\/]+\.biz/i,  
  /:\/\/[^\/]+\.online/i,  
  /:\/\/[^\/]+\.icu/i,  
  /:\/\/[^\/]+\.app/i,  
  /:\/\/[^\/]+\.es/i,  
  /:\/\/[^\/]+\.site/i,  
  /:\/\/[^\/]+\.tv/i,  
  /:\/\/[^\/]+\.fm/i,  
  /:\/\/[^\/]+\.money/i,  
  /:\/\/[^\/]+\.link/i,  
  /:\/\/[^\/]+\.news/i,  
  /:\/\/[^\/]+\.click/i,  
  /:\/\/[^\/]+\.tech/i,  
  /:\/\/[^\/]+\.lottary/i,
  /\b(xxx|xx|porn|sex|nude|drugs|gun|murder|adult)\b/i, 
  /:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)*(xxx|xx|porn|sex|nude|drugs|gun|murder|adult)\b/i,   
  /:\/\/[^\/]+\.website/i,  
  /:\/\/[^\/]+\.mobi/i,  
  /:\/\/[^\/]+\.tv/i,  
  /:\/\/[^\/]+\.com\.ph/i,  
  ];

  return forbiddenPatterns.some((pattern) => pattern.test(url));
};

const formatMessageContent = (part) => {
  const urlRegex = /([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})([^\s]*)/g;
  if (part.match(urlRegex)) {
    const url =
      part.startsWith("http://") || part.startsWith("https://")
        ? part
        : `https://${part}`;

    if (isForbiddenUrl(url)) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          Forbidden link detected
        </span>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        style={{
          color: "blue", // Set link color
          textDecoration: "underline", // Underline the link
        }}
      >
        {part}
      </a>
    );
  }
  return part;
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {formatMessageContent(m.content)}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
