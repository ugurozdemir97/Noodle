// ------ BEFORE LOGGED IN ------ //

// Swap between login and sign up pages via buttons
function changeLogin() {
    if ($(".signUpForm").hasClass("hidden")) {
        $(".signUpForm").removeClass("hidden")
        $(".loginForm").addClass("hidden")
        $(".warning").css("display", "none");
    } else {
        $(".loginForm").removeClass("hidden")
        $(".signUpForm").addClass("hidden")
        $(".warning").css("display", "none");
    }
}

// Bind buttons and enter key
$(document).on('keypress', (e) => {
    if (e.which == 13) {
        if ($(".loginForm").is(":visible")) {
            login()
        } else if ($(".signUpForm").is(":visible")) {
            signUp()
        }
    }
});

// SignUp
function signUp() {

    let firstName = $(".firstNameSignup").val()
    let lastName = $(".lastNameSignup").val()
    let email = $(".emailSignup").val()
    let password = $(".passwordSignup").val()
    let confirm = $(".passwordSignupConfirm").val()

    if (email == "" || password == "" || firstName == "" || lastName == "" || confirm == "") {
        $(".warning").html(`You can't leave a field empty <i class="fa-solid fa-triangle-exclamation fa-lg"></i>`);
        $(".warning").fadeIn(100).delay(3000).fadeOut(500);
        return
    }

    if (password != confirm) {
        $(".warning").html(`Passwords are not matching <i class="fa-solid fa-triangle-exclamation fa-lg"></i>`);
        $(".warning").fadeIn(100).delay(3000).fadeOut(500);
        return
    }

    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }

    $.ajax({
        type: "POST",
        url: "/new-user",
        dataType: "json",
        success: (message) => {
            if (message.message == "Success") {
                location.reload();
            } else {
                $(".warning").html(`${message.message} <i class="fa-solid fa-triangle-exclamation fa-lg"></i>`);
                $(".warning").fadeIn(100).delay(3000).fadeOut(500);
            }
        },
        data: data
    });
}

// Login
function login() {

    let email = $(".emailLogin").val();
    let password = $(".passwordLogin").val();

    if (email == "" || password == "") {
        $(".warning").html(`You can't leave a field empty <i class="fa-solid fa-triangle-exclamation fa-lg"></i>`);
        $(".warning").fadeIn(100).delay(3000).fadeOut(500);
        return
    }

    let data = {
        email: email,
        password: password
    }

    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        success: (message) => {
            if (message.message == "Success") {
                location.reload();
            } else {
                $(".warning").html(`${message.message} <i class="fa-solid fa-triangle-exclamation fa-lg"></i>`);
                $(".warning").fadeIn(100).delay(3000).fadeOut(500);
            }
        },
        data: data
    });
}

function passwordChecker () {

    let password = $(".passwordSignup").val();
    let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;  // To check if password has symbols

    let securityLevel = "Very Weak!";
    let validations = 0;
    let color;
    let percentage; // Very Weak, Weak, Medium.. All of them can have 20% and in total there will be 100%. 

    if (password.length >= 8) {validations++;}  // Pasword has more than 8 characters
    if (password !== password.toLowerCase()) {validations++;}  // Password has upper case characters
    if (password !== password.toUpperCase()) {validations++;}  // Password has lower case characters
    if (/\d/.test(password)) {validations++;}  // Password has numbers
    if (specialChars.test(password)) {validations++;}  // Password has symbols
    if (password.length < 6) {validations -= 2;}  // Less than 6 characters is really bad

    // Check how much we validated the password
    switch (validations) {
        case 1: securityLevel = "Very Weak!"; color = "red"; break;
        case 2: securityLevel = "Weak!"; color = "orange"; break;
        case 3: securityLevel = "Medium"; color = "yellow"; break;
        case 4: securityLevel = "Strong"; color = "yellowgreen"; break;
        case 5: securityLevel = "Very Strong!"; color = "green"; break;
    }

    // Let's determine the percentage with the length of the password
    percentage = Math.floor((password.length * 100) / 15);

    // Don't let percentage pass a certain number if the password is not validated enough
    if (percentage > 20 && securityLevel == "Very Weak!") {
        percentage = 20
    } else if (percentage > 40 && securityLevel == "Weak!") {
        percentage = 40
    } else if (percentage > 60 && securityLevel == "Medium") {
        percentage = 60
    } else if (percentage > 80 && securityLevel == "Strong") {
        percentage = 80
    } else if (percentage > 100) {
        percentage = 100
    }

    $(".securityNumber").text(`${securityLevel} / ${percentage}`);
    $(".securityLevel").css("width", `${percentage}%`);
    $(".securityLevel").css("backgroundColor", color)

    if (percentage == 100) {$(".securityLevel").css("borderRadius", "10px")}
    else {$(".securityLevel").css("borderRadius", "10px 0 0 10px")}

}

// ------ AFTER LOGGED IN ------ //

// Adjust CSS of elements depends on the screen size 

window.addEventListener('resize', (event) => {
    if ($(window).width() >= 1224) {

        // For friends area to be seen even if it was hidden in tablet size
        $(".friends").css("display", "block")

        // Reset side menu button's look
        $(".sideMenu").css("left", "0")
        $(".sideMenu").css("borderRadius", "10px");
        $("#arrow").removeClass("fa-chevron-left").addClass("fa-chevron-right")

    } else if (1224 > $(window).width() && $(window).width() >= 768) {

        // Hiding this will prevent some problems
        if ($(".sideMenu").css("left") != "400px") {$(".friends").css("display", "none")}
        $(".chat").css("display", "block")
        
    } else {
        if ($(".navFriends").hasClass("navActive")) {
            $(".friends").css("display", "block");
            $(".chat").css("display", "none");
        } else {
            $(".chat").css("display", "block");
            $(".friends").css("display", "none");
        }
    }
});

// Show and hide side menu in tablet size
function showSideMenu() {

    $(".friends").animate({width:'toggle'}, 200);

    if ($(".sideMenu").css("left") != "400px") {
        $(".sideMenu").animate({left: "400px"}, 200);
        $(".sideMenu").css("borderRadius", "0 10px 10px 0");
        $("#arrow").removeClass("fa-chevron-right").addClass("fa-chevron-left")
    } else {
        $(".sideMenu").animate({left: "0"}, 200);
        $(".sideMenu").css("borderRadius", "10px");
        $("#arrow").removeClass("fa-chevron-left").addClass("fa-chevron-right")
    }
}

// Show and hide friends / chat area in mobile size
function showFriends() {
    $(".chat").css("display", "none")
    $(".friends").css("display", "block")
    $(".navChat").removeClass("navActive")
    $(".navFriends").addClass("navActive")
}

function showChatArea() {
    $(".friends").css("display", "none")
    $(".chat").css("display", "block")
    $(".navChat").addClass("navActive")
    $(".navFriends").removeClass("navActive")
}

// Detect any click on page and if it's outside of the popup windows, close them
$(document).on('click', (e) => {
    if(!(($(e.target).closest(".popup").length > 0 ) || ($(e.target).closest(".popupButton").length > 0 ))){
    $(".popup").addClass("hidden")
    if ($(".usernamePen i").hasClass("fa-check")) {
        $(".usernameEdit").text($(".usernameEdit").data("username"))
        $(".usernameEdit").attr('contenteditable','false');
        $(".usernameEdit").blur();
        $(".usernamePen i").removeClass("fa-check");
        $(".usernamePen i").addClass("fa-pen");
    }
   }
});

// Open and close popup windows by clicking profile pictures or message icon
function showProfileCard(i) {
    $(".popup").not($(i).children(".popup")).addClass("hidden");
    $(i).children(".popup").toggleClass("hidden");

    // If the popup was notifications, remove all of them
    if ($(i).hasClass("bell")) {
        $(".notification").addClass("hidden");
        $(".notification").text("")
        // Remove all notifications when you close them, notification.length must be greater than 0
        // Because the user can close and open the notifications and mess up data-show otherwise
        if ($(i).data("show") == 1 && $(".notifications").length > 0) {$(i).data("show", "2")} 
        else if ($(i).data("show") == 2) {$(".notifications").remove(); $(i).data("show", "1")}
    }

    if ($(".usernamePen i").hasClass("fa-check")) {
        $(".usernameEdit").text($(".usernameEdit").data("username"))
        $(".usernameEdit").attr('contenteditable','false');
        $(".usernameEdit").blur();
        $(".usernamePen i").removeClass("fa-check");
        $(".usernamePen i").addClass("fa-pen");
    }
}

// When you click on popup window it closes because it thinks you have clicked the parent element as well.
// This prevents the child popup to affect the parent. So it won't close when you click on it.
$(".popup").click((e) => {e.stopPropagation()});

// Emoji picker also need it, I guess there is a "popup" class somewhere in this package
$("emoji-picker").click((e) => {e.stopPropagation()});  

// Send change username data to server
function changeUsername(i) {

    // If you click the pen button change icon, make div editable, focus on it
    if ($(i).children("i").hasClass("fa-pen")) {
        
        if ($(".dontHaveUsername").text() != "") {$(".usernameEdit").text("")}
        $(".usernameEdit").attr('contenteditable','true');
        $(".usernameEdit").focus();
        $(i).children("i").removeClass("fa-pen");
        $(i).children("i").addClass("fa-check");
        
    // If you click again turn everything back and also send data to the server
    } else {

        $(".usernameEdit").attr('contenteditable','false');
        $(".usernameEdit").blur();
        $(i).children("i").removeClass("fa-check");
        $(i).children("i").addClass("fa-pen");

        // If you remove the username, send delete username request
        if ($(".usernameEdit").text() == "") {

            let name = $(".usernameEdit").data("name");
            $(".usernameEdit").text(name);
            $(".usernameEdit").data("username", name)
            $(".dontHaveUsername").text("You don't have a username. Please create one for people to find you!")

            $.ajax({
                type: "POST",
                url: "/deleteUsername",
                dataType: "json"
            });

        // Else, check if the username can be taken or not
        // If it's the same as the old one, do nothing, if it's already taken, warn the user, else: change username
        } else {

            // Check username and control if it's a valid username here
            if ($(".usernameEdit").text().length > 16) {
                $(".dontHaveUsername").text("This username is too long!")
                return
            }


            $(".dontHaveUsername").text("")

            $.ajax({
                type: "POST",
                url: "/changeUsername",
                dataType: "json",
                success: (message) => {
                    if (message.error == "400") {
                        if (message.username) {
                            $(".usernameEdit").text(message.username);
                        } else {
                            $(".dontHaveUsername").text("This username is already taken!")
                            $(".usernameEdit").text($(".usernameEdit").data("name"));
                        }
                    } 
                    $(".usernameEdit").attr("data-username", $(".usernameEdit").text())
                },
                data: {username: $(".usernameEdit").text()}
            });
        }
    }
}

// Prevent break lines and copy paste when changing usernames
$(".usernameEdit")
.on('paste', (e) => {
    e.preventDefault();  // Prevent copy paste so that people can't paste a text with line breaks
}).on('keypress', (e) => {
    // Don't allow usernames longer than 16 characters - Ignore If enter or space is pressed
    return e.which != 13 && e.which != 32 && $(".usernameEdit").text().length < 16;
});


// This code can change, I've copy pasted it. This is for sorting the friends area.
// First the people added you, then your friends, then the people you have added.

function sortFriends() {  // Run the code above when there is a change
    $(".friendsArea .lastMessages").sort((a,b) => $(a).data("order") - $(b).data("order")).appendTo(".friendsArea");
}

function sortNotifications() {  // Same but for the notifications
    $(".notificationScroll .notifications").sort((a,b) => $(a).data("order") - $(b).data("order")).appendTo(".notificationScroll");
}

function sortLastMessages() {  // Same, run after sending messages
    $(".myFriends").sort((a,b) => {
        return new Date($(b).children().children().children(".lastMessageTime").attr("data-date")) - new Date($(a).children().children().children(".lastMessageTime").attr("data-date"))
    }).appendTo(".friendsArea");
    sortFriends()
}

// Sort friends and last messages after 50 milisecond of page load
setTimeout(sortLastMessages, 50)

// If you have chat with a friend, add the last message date to the friend's area
// In ejs you put last message date as data-date to the lastMessageTime class
$(".lastMessageTime").each((i, k) => {
    if ($(k).data("date")) {$(k).text(timeManagement($(k).data("date")))}
}) 

// Delete found users those added (if any) / So that added elements are not going to stack
function deleteUserSearch() {
    $('.lastMessages').removeClass("hidden")
    $(".searchedUser").remove()  // Delete searched items
}

// Show and hide search bars when you click on search buttons
function toggleSearch(i) {
    $(i).siblings(':first-child').children("input").slideToggle("fast");
    $(i).siblings(':first-child').children("input").val("");  // Remove searched

    // When you hide search bar, it should delete the found users if that search bar is used
    if ($(i).siblings(':first-child').children("input").hasClass("searchUser")) {  
        deleteUserSearch()
    }

    // If you searched messages
    if ($(i).siblings(':first-child').children("input").hasClass("searchMessages")) {  
        $(".foundMessagesButtons").addClass("hidden")
    }

}

// Debounce, if you type fast enough you will send multiple requests to the database. So If you search
// the user "King01" fast enough, you will see multiple "King01"
// Preventing this is called "Debauncing"
var timeout;

// Search for users by their username => onchange requires you to press enter, oninput works everytime there is a change
function searchUsers() {

    // If this function runs more than once faster than 500 ms, cancel the previous one
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    // Delete everything added (if any) / So that added elements are not going to stack
    deleteUserSearch()

    // Add this code because otherwise when you delete the search, the last letter is still searched after you delete everything
    if ($(".searchUser").val().length == 0) {return}  

    // If the searched user is already in the friends list, continue showing it. But if the searched input is not matching with
    // the existing friends, then hide them.
    let usernames = [];
    let search = $(".searchUser").val().toLowerCase() // Case insensitive input
    let foundFriends = $('.lastMessages').filter((i, k) => {  // Filter friends
        if ($(k).data('friends').toLowerCase().indexOf(search) > -1) {usernames.push($(k).data('friends'))}  // This is to check users sent from serverside
        return $(k).data('friends').toLowerCase().indexOf(search) == -1;  // If it's not matching
    });

    $(foundFriends).addClass("hidden")  // Hide not matching friends

    // Run this function 500 ms later
    timeout = setTimeout(() => {

        $.ajax({
            type: "POST",
            url: "/searchUsers",
            dataType: "json",
            success: (users) => {
                if (users.length != 0) {
                    // Add found users to the search
                    users.forEach((i) => {

                        // If sent user is not in friends list already and not us
                        if (!usernames.includes(i.username) && i._id != $("main").data("user")) {  
                            $(".friendsArea").append(`
                                <div class="lastMessages searchedUser" data-friends="${i.username}" data-id="${i._id}">
                                    <div class="profilePic">
                                        <img class="roundImage" src="/images/${i.picture}" alt="profilePic" width="40" height="40">
                                    </div>
                                    <div class="addedFriend">
                                        <div class="usernames bold">${i.username}</div>
                                        <div class="iconHolder" style="background-color: rgb(13, 0, 84)" data-id="${i._id}" onclick="addFriend(this)">
                                            <i class="fa-solid fa-user-plus"></i>
                                        </div>                                          
                                    </div>
                                </div>
                            `)
                        }

                    });
                }
            },
            data: {username: $(".searchUser").val()}
        })
    }, 500)  // 500 miliseconds
}

// Send a friendship request
function addFriend(i) {

    $(i).children().removeClass("fa-user-plus").addClass("fa-user-minus");  // Change button icon
    $(i).css("backgroundColor", "rgb(109, 109, 109)")  // Change button color
    $(i).closest(".lastMessages").removeClass("searchedUser");  // So that this new added element will not be deleted
    $(i).attr("onclick", "cancelFriend(this)");  // Change onclick event from add friend to cancel friendship
    if ($(".noFriends")) {$(".noFriends").addClass("hidden")}  // If there were no friends before, remove "there is no friend" text
    setTimeout(sortFriends, 100);  // Sort friends list again

    sendAddFriend({to: $(i).data("id")})  // Send data to the requester

}

// Cancel a friendship request
function cancelFriend(i) {

    $(i).children().removeClass("fa-user-minus").addClass("fa-user-plus");  // Change button icon
    $(i).css("backgroundColor", "rgb(13, 0, 84)")  // Change button color
    $(i).closest(".lastMessages").addClass("searchedUser")  // So that this new added element will be deleted 
    $(i).attr("onclick","addFriend(this)");  // Change onclick event from cancel friendship request to add friend

    sendCancelFriend({to: $(i).data("id")})  // Send data to the request receiver

}

// Deny friendship request
function denyFriend(i) {

    $(i).closest(".lastMessages").remove()
    sendDenyFriend({to: $(i).data("id")})  // Remove the request of sender via socket.io

}

// Accept friendship request 
function acceptFriend(i) {

    // Add new friend to the friend list
    $(".friendsArea").append(`
        <div class="lastMessages myFriends" 
            data-friends="${$(i).data("username")}" 
            data-friendship="${$(i).data("friendship")}" 
            data-friendid="${$(i).data("friendid")}"
            data-picture="${$(i).data("picture")}"
            data-order="2"
            onclick="showChat(this)">
            <div class="profilePic">
                <img class="roundImage" src="${$(i).data("picture")}" alt="profilePic" width="40" height="40">
            </div>
            <div class="friendDetail">
                <div class="usernames bold">${$(i).data("username")}</div>
                <div style="position: relative;">
                    <div class="lastMessage regular"></div>
                    <div class="lastMessageTime thin"></div>
                </div>
            </div>
            <div class="chatNotification hidden"></div>
        </div>
    `)

    if ($(".noFriends")) {$(".noFriends").addClass("hidden")}
    $(i).closest(".lastMessages").remove() // Remove existing request chart

    setTimeout(sortFriends, 100);  // Sort friends list again

    let data = {
        friendship: $(i).data("friendship"),
        to: $(i).data("friendid")
    }

    sendAcceptFriend(data);  // Send that you accept the friendship via socket.io

}

// Show conversation after clicking on a friend
function showChat(i) {

    // If you clicked the same user, return
    if ($(".chatHeader").data("friendship") == $(i).data("friendship")) {
        if (768 > $(window).width()) {showChatArea()} // Show chat area if in mobile size
        return
    }

    // Remove unseen message count
    $(i).children(".chatNotification").addClass("hidden");
    $(i).children(".chatNotification").text("0")

    // Add information to chatHeader. So if you click the same user twice we can check and return
    $(".chatHeader").data("friendship", $(i).data("friendship"))
    $(".chatHeader").data("friendid", $(i).data("friendid"))

    $(".chatArea").empty(); // Remove all existing chat before adding new conversation

    $.ajax({
        type: "POST",
        url: "/loadMessages",
        dataType: "json",
        success: (chat) => {

            // Add the messages to the chat area
            chat.messages.forEach((m, k) => {

                // If messages sent by the user
                if (m.from._id == $("main").data("user")) {
                    $(".chatArea").append(`
                        <div class="messageBox rightMessageBox">
                            <div class="rightBox context" data-id="${m._id}" data-index="${m.index}">
                                <div class="messageContext" data-username="${m.from.username}" data-name="${`${m.from.firstName} ${m.from.lastName}`}">${m.message}</div>
                                <div class="lastMessageTime thin">${messageTimes(m.date)}</div> 
                                <div class="quoteButton" onclick="placeQuote(this)"><i class="fa-solid fa-share fa-lg"></i></div>
                            </div>
                        </div>
                    `)
                // If messages sent by the friend
                } else {
                    $(".chatArea").append(`
                        <div class="messageBox leftMessageBox">
                            <div class="leftBox context" data-id="${m._id}" data-index="${m.index}">           
                                <div class="messageContext" data-username="${m.from.username}" data-name="${`${m.from.firstName} ${m.from.lastName}`}">${m.message}</div>
                                <div class="lastMessageTime thin">${messageTimes(m.date)}</div> 
                                <div class="quoteButton" onclick="placeQuote(this)"><i class="fa-solid fa-share fa-lg"></i></div>
                            </div>
                        </div>
                    `)
                }
            })

            // Start showing these
            $(".chatHeader").removeClass("hidden");
            $(".chatArea").removeClass("hidden");
            $(".chatFooter").removeClass("hidden");

            // Add friend details to the popup
            $(".chatHeader img").attr("src", $(i).data("picture"))
            $(".fullSizeImage").attr("src", $(i).data("picture"))
            $(".chatHeader .bigUsername").text($(i).data("friends"))
            $(".chatHeader .headerUsername").text($(i).data("friends"))
            $(".chatHeader .profilePic").css("backgroundColor", $(i).children(".profilePic").css("backgroundColor"))

            if ($(".chatHeader .profilePic").css("backgroundColor") == "rgb(0, 255, 0)") {
                $(".chatHeader .lastSeen").text("Online")
            } else {
                $(".chatHeader .lastSeen").text(timeManagement($(i).data("lastseen")))
            }

            if (768 > $(window).width()) {showChatArea()}  // If the screen is mobile sized, show chat and hide friends area

            // When you open the chat area, look for the last seen message data, if the last message is recieved and it's
            // not the same last seen message, then update the last seen message
            if (($(".chatArea .messageBox:last-child .leftBox").length == 1) && 
                $(i).data("lastseenmessage") != $(".chatArea .messageBox:last-child .leftBox").data("id")) { // 

                    // Here you should scroll to the unseen message
                    if ($(i).data("lastseenmessage")) {
                        $(`[data-id=${$(i).data("lastseenmessage")}]`).get(0).scrollIntoView();
                    }
                    
                    // The last seen message
                    let updateLastSeen = {
                        message: $(".chatArea .messageBox:last-child .leftBox").data("id"),
                        friendshipId: $(i).data("friendship")
                    }

                    // Update it so that refreshing is not necessary
                    $(i).data("lastseenmessage", $(".chatArea .messageBox:last-child .leftBox").data("id"));

                    // Send data to the server via Ajax call
                    $.ajax({
                        type: "POST",
                        url: "/lastSeenMessage",
                        dataType: "json",
                        data: updateLastSeen
                    })

            } else {
                // Scroll to the bottom
                $(".chatArea").scrollTop($('.chatArea').get(0).scrollHeight);
            }
        },
        data: {friendshipId: $(i).data("friendship")}
    })
}

// Bring older messages if scrolled to the top
$(".chatArea").on('scroll', () => {
    if ($(".chatArea")[0].scrollTop == 0) {
        if ($(".chatArea .messageBox:first-child .context").data("index") != 0) {

            let index = $(".chatArea .messageBox:first-child .context").data("index");

            $.ajax({
                type: "POST",
                url: "/loadMessages",
                dataType: "json",
                success: (chat) => {

                    let olderMessages = [];  // Add all messages into this array, then prepend them all
        
                    // Add the messages to the chat area
                    chat.messages.forEach((m, k) => {

                        // If messages sent by the user
                        if (m.from._id == $("main").data("user")) { 
                            olderMessages.push(`
                                <div class="messageBox rightMessageBox">
                                    <div class="rightBox context" data-id="${m._id}" data-index="${m.index}">
                                        <div class="messageContext" data-username="${m.from.username}" data-name="${`${m.from.firstName} ${m.from.lastName}`}">${m.message}</div>
                                        <div class="lastMessageTime thin">${messageTimes(m.date)}</div> 
                                        <div class="quoteButton" onclick="placeQuote(this)"><i class="fa-solid fa-share fa-lg"></i></div>
                                    </div>
                                </div>
                            `)
                        } else {
                            // If messages sent by the friend
                            olderMessages.push(`
                                <div class="messageBox leftMessageBox">
                                    <div class="leftBox context" data-id="${m._id}" data-index="${m.index}">           
                                        <div class="messageContext" data-username="${m.from.username}" data-name="${`${m.from.firstName} ${m.from.lastName}`}">${m.message}</div>
                                        <div class="lastMessageTime thin">${messageTimes(m.date)}</div> 
                                        <div class="quoteButton" onclick="placeQuote(this)"><i class="fa-solid fa-share fa-lg"></i></div>
                                    </div>
                                </div>
                            `)
                        }
                    })

                    $(".chatArea").prepend(olderMessages)  // Add older messages to the chat area

                    // Here you should scroll to the last old message
                    $(`[data-index=${index}]`).get(0).scrollIntoView();
                    

                },
                data: {
                    friendshipId: $(".chatHeader").data("friendship"),
                    messageIndex: index
                }
            })
        }
    }
});

// Place quotes
function placeQuote(i) {
    let username;
    if ($(i).siblings(".messageContext").data("username")) {username = $(i).siblings(".messageContext").data("username")}
    else {username = $(i).siblings(".messageContext").data("name")}
    let messageIndex = $(i).parent(".context").data("index");

    let messageContext = $(i).siblings(".messageContext").html()
    if (messageContext.includes("<i></i>")) {
        messageContext = messageContext.split('<i></i>')[1]
        messageContext = messageContext.split('<br>')[0]
    } else {
        messageContext = messageContext.split('<br>')[0]
    }

    $(".quoteArea").html(`
        <div class="messageQuote" data-messageindex="${messageIndex}" onclick="scrollToQuote(this)">
            <div class="quoteFrom">${username}</div>
            <div class="quoteContext">${messageContext}</div>
        </div>
        <i></i>
    `)
}

// Clear quote area when you click on it
function clearQuote() {$(".quoteArea").html("")}

function scrollToQuote(i) {
    if ($(i).parent(".quoteArea").length > 0) {return}  // If the quote is in quoteArea, just remove the quote
    $(`[data-index=${$(i).data("messageindex")}]`).get(0).scrollIntoView();
}

// In socket.js we send the messages immidiately but in this function we will store the data in the database using Ajax calls
function saveMessages() {

    // Prevent sending empty message
    if ($(".textEditor").html() == "") {return}

    // The data needs to be saved
    data = {
        friendship: $(".chatHeader").data("friendship"),
        to: $(".chatHeader").data("friendid"),
        from: $("main").data("user"),
        message: $(".quoteArea").html() + $(".textEditor").html(),
        date: new Date()
    }

    $(".quoteArea").html("")
    $(".textEditor").text("")  // Clear the message from the text area
    $(".textEditor").focus()  // Focus on text editor again
    sendMessage(data)  // This function is in socket.js, send the message via socket.io
    
}

// Send messages with enter key
$(".textEditor").keypress((e) => {
    // If Enter is pressed end the text editor is focused
    if (e.which == 13 && $(".textEditor").is(":focus")) {
        if (!e.shiftKey) {  // If shift is not pressed send the message. If shift + enter then it adds a new line
            e.preventDefault();  //
            saveMessages()
        }      
    }
});

// Show frien's picture or picture uploading modal. Close them when you click outside
function showFriendPic() {$(".friendPic").removeClass("hidden")}
function showChangePic() {$(".changePic").removeClass("hidden")}
function closeOverlay() {$(".overlay").addClass("hidden")}

var cropper;  // Nesessary for configuring cropper js later

function selectFile(i) {
    $(".newImage").attr("src", "")  // Delete previous displayed image

    let reader = new FileReader();  // Helps to read the contents of stored file
    reader.readAsDataURL($(i)[0].files[0]);  // The image uploaded as URL

    reader.onload = () => {

        $(".newImage").attr("src", reader.result); // Uploaded photo will be displayed 
        if (cropper) {cropper.destroy()} // If a cropper js object already exist, destroy it
    
        //Initialize cropper
        cropper = new Cropper(document.getElementById('cropImage'), {
            aspectRatio: 1 / 1,
            viewMode: 1  // Prevent user to crop outside of image
        });

        let fileName = $(i)[0].files[0].name;
        $(".newImage").data("name", fileName)

    };

}

// Upload cropped image to the server
$(".uploadPicForm").submit((e) => {

    e.preventDefault();  // Don't refresh the page
    let name = $(".newImage").data("name")

    // cropper.getCroppedCanvas() returns a canvas object. Convert it to blob and send it to the server as an image
    cropper.getCroppedCanvas().toBlob((blob) => {

        let image = new File([blob], name, {type: "image/jpg"})  // Create new file from canvas
        const data = new FormData();  // Create new form data to send
        data.append("profilePic", image);  // Add image to the form data

        $.ajax({
            url: "/uploadImage",
            method: 'POST',
            async: false,
            processData: false ,
            contentType: false,
            success: (img) => {
                
                if (img.message) {
                    $(".picError").text(img.message)
                } else {
                    $("header .roundImage").attr("src", img);
                    $("header .userImg").attr("src", img);
                    $(".newImage").attr("src", img);
                    cropper.destroy()
                    closeOverlay()
                }

            },
            data: data
        });

    }, 'image/jpg');

})

// Delete profile picture 
function deletePic() {
    $.ajax({
        type: "POST",
        url: "/deleteImage",
        dataType: "json",
        success: (img) => {
            $("header img").attr("src", img.img);
            $(".newImage").attr("src", img.img);
        }
    });
}

// Search for messages
function searchMessages() {

    let context = document.querySelectorAll(".context"); // requires an element with class "context" for Mark.js
    let foundMessages = []  // This is to use for scrolling into the found messages

    // Mark.js object
    let instance = new Mark(context);
    instance.unmark()  // unmark the previous searchs

    // Return if the input field is empty or has less than 3 characters
    if ($(".searchMessages").val().length < 3) {
        $(".foundMessagesButtons").addClass("hidden")  // Hide little arrows
        return
    } 

    $(".foundMessagesButtons").removeClass("hidden")  // Show little arrows

    instance.mark($(".searchMessages").val(), { // Search and mark the searched text
        ignorePunctuation: ":;.,-—_(){}[]!'\"+=".split(""),
        each: (element) => {
            foundMessages.push(element)  // Push all elements found into the array
        },
    })  

    let count = foundMessages.length;
    let index = 0;

    // Scroll to the previous found message
    $(".previousFound").click(() => {
        index--;
        if (index < 0) {index = 0}
        let mark = $("mark").eq(index)
        if (mark) {mark.get(0).scrollIntoView();}
    })

    // Scroll to the next found message
    $(".nextFound").click(() => {
        index++;
        if (index >= count) {index = count - 1}
        let mark = $("mark").eq(index)
        if (mark) {mark.get(0).scrollIntoView();}
    })

}

//Show emoji picker
function showEmojiPicker() {
    $("emoji-picker").toggleClass("hidden")
}
