const socket = io() // Socket io object

// Detect connection after logging in with socket io. 
if ($("main").data("user")) {

    // This is unrelated here but I didn't want to check if I am logged in twice. So after logging in, initialize emoji picker
    document.querySelector('emoji-picker').addEventListener('emoji-click', (e) => {
        $(".textEditor").append(`<span>${e.detail.unicode}</span>`)  // Append text area with selected emoji
    });

    let userId = $("main").data("user");

    // When the user is logged in and is connected
    // This will detect any user that visits the page and assign them some socket ids
    socket.on("connect", () => {

        socket.emit("connectedUser", { // Send the user Id and the socket Id that is assigned to that user
            userId: userId,
            socketId: socket.id
        })

        // Server will filter this array and return online users
        function checkOnline () {
            let friends = [] // All my friends' ids
            $(".myFriends").each((i, k) => {friends.push($(k).data("friendid"))})
            socket.emit("onlineFriends", friends)
        }
        checkOnline () // Run once
        setInterval(checkOnline, 10000);  // Check your friends' online status every 10 seconds
        
        socket.on("onlineFriends", (friends) => {  // friends only have online friends' ids right now. Use it to show online status

            $(".myFriends").each((i, k) => {
                if (friends.includes($(k).data("friendid"))) {
                    $(k).children(".profilePic").css("backgroundColor", "#00ff00")
                } else {
                    $(k).children(".profilePic").css("backgroundColor", "rgb(57, 57, 57)")           
                }
            })

            // If your friend gets online when you are looking at a chat
            if (friends.includes($(".chatHeader").data("friendid"))) {
                $(".chatHeader .profilePic").css("backgroundColor", "#00ff00")
                $(".chatHeader .lastSeen").text("Online")
            
            // If your friend goes offline when you are looking at a chat
            } else {
                if ($(".chatHeader .lastSeen").text() == "Online") {
                    $(".chatHeader .lastSeen").text(timeManagement(new Date()))
                    $(".chatHeader .profilePic").css("backgroundColor", "rgb(57, 57, 57)")
                }
            }
        })

        // Get the message sent from server and display it on friends area and chat as a blue left messagebox.
        socket.on("sendMessage", (message) => {
            placeMessages(message, "leftBox");  // Place the messages
        })

        // Get the message sent from server and display it on friends area and chat as a blue left messagebox.
        socket.on("sendFriendRequest", (request) => {
            placeRequest(request);  // Place the request
        })

        socket.on("cancelFriendRequest", (request) => {
            removeRequest(request);  // Remove the request
        })

        socket.on("acceptFriendRequest", (request) => {
            placeFriendship(request);  // Add the friendship
        })
        

    });
}

// Send messages via socket io, this function is called from index.js just before the ajax call and clearing the text editor
function sendMessage(data) {

    // Place the messages
    placeMessages(data, "rightBox");

    // Send the user Id and the socket Id that is assigned to that user
    socket.emit("sendMessage", data)
    
}

function placeMessages(message, where) {

    let messageOrigin;
    let messageText;

    if (where == "leftBox") {messageOrigin = message.from} // If you are recieving message
    else {messageOrigin = message.to}  // If you sent the message

    // If you are the one who recieved the message, check all friends and place the message into the sender's box
    // If you are the one who sent the message, then find the user that you sent the message and place it
    $(".myFriends").each((i, k) => {
        if ($(k).data("friendid") == messageOrigin) {

            if (message.message.includes("<i></i>")) {
                messageText = message.message.split('<i></i>')[1]
                messageText = messageText.split('<br>')[0]
            } else {
                messageText = message.message.split('<br>')[0]
            }

            $(k).children(".friendDetail").children().children(".lastMessage").html(messageText)
            $(k).children(".friendDetail").children().children(".lastMessageTime").text(messageTimes(message.date))
            $(k).children(".friendDetail").children().children(".lastMessageTime").attr("data-date", message.date)

            // If we are recieving messages but not looking at the chat, show how many message are there that we didn't see
            if (where == "leftBox" && $(".chatHeader").data("friendid") != message.from) {
                let num = $(k).children(".chatNotification").text();
                $(k).children(".chatNotification").removeClass("hidden");
                $(k).children(".chatNotification").text((Number(num) + 1))  // Increase unseen message count
            }

            // If we are recieving messages an looking at the chat, update the last seen message
            if (where == "leftBox" && $(".chatHeader").data("friendid") == message.from) {
                // Send data to the server via Ajax call
                $.ajax({
                    type: "POST",
                    url: "/lastSeenMessage",
                    dataType: "json",
                    success: (message) => {
                        // Update last seen message so that refreshing is not necessary
                        $(k).data("lastseenmessage", message.message);

                    },
                    data: {friendshipId: $(".chatHeader").data("friendship")}
                })
            }
        }
    })

    let looksAtChat;  // This will be used in scrolling

    // If you are the receiver, check if you are looking at the right chat, if you are the sender than there is no reason to check
    if (where == "leftBox" && $(".chatHeader").data("friendid") == message.from || where == "rightBox") {

        if (Math.abs($('.chatArea').get(0).scrollHeight - $('.chatArea').get(0).scrollTop - $('.chatArea').get(0).clientHeight) < 1) {
            looksAtChat = true;
        }

        let username = where == "leftBox" ? $(".chatHeader .bigUsername").text().trim() : $(".usernameEdit").text().trim()
        $(".chatArea").append(`
            <div class="messageBox ${where == "leftBox" ? "leftMessageBox" : "rightMessageBox"}">
                <div class="${where} context" data-index="${Number($(".chatArea .messageBox:last-child .context").data("index")) + 1}">
                    <div class="messageContext" data-username="${username}">${message.message}</div>
                    <div class="lastMessageTime thin">${messageTimes(message.date)}</div> 
                    <div class="quoteButton" onclick="placeQuote(this)"><i class="fa-solid fa-share fa-lg"></i></div>
                </div>
            </div>
        `)
    } 

    // Sort last messages
    setTimeout(sortLastMessages, 50)

    // If you are looking at the old chat and a new message arrives, nothing will happen. Otherwise it will scroll to the bottom
    if (looksAtChat) {
        $(".chatArea").scrollTop($('.chatArea').get(0).scrollHeight);  // Scroll to the bottom
    }
}

// This function is called from index.js after adding a friend
// The user who need to recieve the request will see it without refreshing the page
function sendAddFriend(i) {
    socket.emit("sendFriendRequest", i)  // Send the user Id
}

// Place friendship request
function placeRequest(i) {

    // If you are searching for something, cancel it
    deleteUserSearch()
    $(".searchUser").val("")
    $(".searchUser").blur()

    $(".friendsArea").append(`
        <div class="lastMessages" data-friends="${i.username}" data-id="${i.from}" data-order="1">
            <div class="profilePic">
                <img class="roundImage" src="${i.picture}" alt="profilePic" width="40" height="40">
            </div>
            <div class="newFriend">
                <div class="usernames bold">${i.username}</div>
                <div style="display: flex;">
                    <div class="iconHolder" style="background-color: rgb(0, 168, 39)" 
                        data-username="${i.username}" 
                        data-friendship="${i.friendship}" 
                        data-friendId="${i.from}"
                        data-picture="${i.picture}"
                        onclick="acceptFriend(this)">
                        <i class="fa-solid fa-lg fa-check"></i>
                    </div>
                    <div class="iconHolder" style="padding-left: 8px; background-color: rgb(172, 0, 0)" data-id="${i.from}" data-friendship="${i.friendship}" onclick="denyFriend(this)">
                        <i class="fa-solid fa-lg fa-xmark"></i>
                    </div>        
                </div>                                     
            </div>
        </div>
    `)

    $(".notificationScroll").append(`
        <div class="notifications" data-order="1">
            <div class="profilePic">
                <img class="roundImage" src="${i.picture}" alt="profilePic" width="40" height="40">
            </div>
            <div class="regular"><span class="bold">${i.username}</span> wants to add you as a friend!</div>
        </div>
    `)

    let number = $(".notifications").length;  // Number of notifications
    if (number > 99) {number = "99+"}  // Extremely unlikely unless you are famous
    $(".notification").removeClass("hidden").text(number)

    setTimeout(sortFriends, 100);  // Sort friends list again
    setTimeout(sortNotifications, 100);  // Sort notifications

}

// This function is called from index.js to remove the friendship request from reciever
function sendCancelFriend(i) {
    socket.emit("cancelFriendRequest", i)
}

// This function is called from index.js to remove the friendship request from requester
function sendDenyFriend(i) {
    socket.emit("denyFriendRequest", i)
}

// Remove the request
function removeRequest(i) {

    // If you are searching for something, cancel it
    deleteUserSearch()
    $(".searchUser").val("")
    $(".searchUser").blur()

    $(".lastMessages").each((l, k) => {
        if ($(k).data("id") == i) {
            $(k).remove();
        }
    }) 
}

// This function is called from index.js to send that we accept the friendship
function sendAcceptFriend(i) {
    socket.emit("acceptFriendRequest", i)
}

// Place the friendship
function placeFriendship(i) {

    // If you are searching for something, cancel it
    deleteUserSearch()
    $(".searchUser").val("")
    $(".searchUser").blur()

    // Remove existing request before adding the friend chart
    $(".lastMessages").each((l, k) => {
        if ($(k).data("id") == i.from) {
            $(k).remove();
        }
    }) 

    // Add friend chart
    $(".friendsArea").append(`
        <div class="lastMessages myFriends" 
            data-friends="${i.username}" 
            data-friendship="${i.friendship}" 
            data-friendid="${i.from}"
            data-picture="${i.picture}"
            data-order="2"
            onclick="showChat(this)">
            <div class="profilePic">
                <img class="roundImage" src="${i.picture}" alt="profilePic" width="40" height="40">
            </div>
            <div class="friendDetail">
                <div class="usernames bold">${i.username}</div>
                <div style="position: relative;">
                    <div class="lastMessage regular"></div>
                    <div class="lastMessageTime thin"></div>
                </div>
            </div>
            <div class="chatNotification hidden"></div>
        </div>
    `)

    $(".notificationScroll").append(`
        <div class="notifications" data-order="2">
            <div class="profilePic">
                <img class="roundImage" src="${i.picture}" alt="profilePic" width="40" height="40">
            </div>
            <div class="regular"><span class="bold">${i.username}</span> accepted your friend request!</div>
        </div>
    `)

    let number = $(".notifications").length;  // Number of notifications
    if (number > 99) {number = "99+"}  // Extremely unlikely unless you are famous
    $(".notification").removeClass("hidden").text(number)

    if ($(".noFriends")) {$(".noFriends").addClass("hidden")}

    setTimeout(sortFriends, 100);  // Sort friends list again
    setTimeout(sortNotifications, 100);  // Sort notifications

}