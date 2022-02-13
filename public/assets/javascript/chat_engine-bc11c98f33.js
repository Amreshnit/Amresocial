let selfUser,
  userMail,
  otherUser,
  currentChatRoom,
  chatArea = $(".chat-room-display"),
  roomList = [];
var socket = io.connect("http://3.108.52.176:5000");
function joinRoom() {
  socket.emit("join_room", { user_email: userMail, chatroom: currentChatRoom }),
    socket.on("user_joined", function (e) {
      console.log("New User Joined", e);
    });
}
socket.on("connect", function () {
  console.log("connection established using sockets...!");
});
var sendMessage = () => {
  function e() {
    let e = $(".chat-message-input"),
      s = e.val();
    "" != s &&
      (socket.emit("send_message", {
        message: s,
        user_id: selfUser._id,
        user_email: userMail,
        chatroom: currentChatRoom,
      }),
      e.val(""));
  }
  $("#send-message").click(e),
    $("input").keydown(function (s) {
      "Enter" !== s.key || s.shiftKey || e();
    });
};
function connectRoom() {
  roomList.includes(currentChatRoom) ||
    (joinRoom(), roomList.push(currentChatRoom)),
    sendMessage();
}
function createArea(e, s, a) {
  return `\n  <div class="user-chat-box">\n      <div class="chat-header">\n      <div class="back-button"><i class="far fa-arrow-alt-circle-left"></i></div>\n        <div class="header-avatar">\n        ${
    s.avatar
      ? `<img\n            src="${s.avatar}"\n            alt="image"\n          />`
      : '<img\n            src="/images/codeial-default-avatar2-8bc10ee41e.png"\n            alt="image"\n          />'
  }\n        </div>\n        <div class="header-name">${
    s.name
  }</div>\n      </div>\n      <div class="chat-messages-list-style" id="chat-messages-list-${
    e._id
  }">\n\n      ${e.messages
    .map(
      (e) =>
        "" +
        (e.user === a._id
          ? `<div class="self-message">\n          <div class="self-user">\n            <div class="message-content-self">${e.message}</div>\n          </div>\n        </div>`
          : `<div class="other-message">\n          <div class="other-user">\n            <div class="other-user-image">\n              ${
              s.avatar
                ? `<img\n            src="${s.avatar}"\n            alt="image"\n          />`
                : '<img\n            src="/images/codeial-default-avatar2-8bc10ee41e.png"\n            alt="image"\n          />'
            }\n            </div>\n            <div class="message-content-other">${
              e.message
            }</div>\n          </div>\n        </div>`)
    )
    .join(
      ""
    )}\n      </div>\n      <div class="chat-message-input-container">\n        <input class="chat-message-input" placeholder="Type message here" required/>\n        <button id="send-message">\n          <i class="fas fa-paper-plane"></i>\n        </button>\n      </div>\n    </div>`;
}
function arrow() {
  $(".back-button").click(() => {
    $(".chat-room-display").css("display", "none"),
      $("#chat-room-name").css({ display: "block", width: "100%" });
  });
}
function changeScreen() {
  window.innerWidth <= 430 &&
    ($(".chat-room-display").css({ display: "block", width: "100%" }),
    $("#chat-room-name").css("display", "none"));
}
function scrollBottom() {
  let e = document.getElementsByClassName("chat-messages-list-style")[0];
  e.scrollTop = e.scrollHeight;
}
function tempClass(e) {
  $("#roomlist > div").removeClass("temporary-highlight"),
    $("#friend-" + e).addClass("temporary-highlight");
}
socket.on("receive_message", function (e) {
  let s = $("#chat-messages-list-" + currentChatRoom),
    a = "other";
  e.user_email === userMail && (a = "self"),
    "self" === a
      ? s.append(
          ` <div class="self-message">\n          <div class="self-user">\n            <div class="message-content-self">${e.message}</div>\n          </div>\n        </div>\n      `
        )
      : s.append(
          `\n     <div class="other-message">\n          <div class="other-user">\n            <div class="other-user-image">\n              ${
            otherUser.avatar
              ? `<img\n            src="${otherUser.avatar}"\n            alt="image"\n          />`
              : '<img\n            src="/images/codeial-default-avatar2-8bc10ee41e.png"\n            alt="image"\n          />'
          }\n            </div>\n            <div class="message-content-other">${
            e.message
          }</div>\n          </div>\n        </div>\n    `
        ),
    scrollBottom();
}),
  $(".chat-list").each(function () {
    $(this).click(function () {
      const e = $(this).attr("data-friendId");
      $.ajax({
        type: "GET",
        url: "/messages/chatroom?friend=" + e,
        success: function (s) {
          let { chatRoom: a, friend: n, user: t } = s.data,
            i = createArea(a, n, t);
          chatArea.empty(),
            chatArea.append(i),
            scrollBottom(),
            (selfUser = t),
            (otherUser = n),
            (currentChatRoom = a._id),
            (userMail = t.email),
            connectRoom(),
            changeScreen(),
            arrow(),
            tempClass(e);
        },
        error: function (e) {
          console.log(e.responseText);
        },
      });
    });
  });
