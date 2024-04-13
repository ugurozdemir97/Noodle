# Noodle - A chat app
This is a simple chat application like WhatsApp that I wrote as a basic project. The only reason I wrote this program is to remember what I knew about programming and maybe learn new things. I wrote the codes as clean and decriptive as possible. So amateur programmers and I can look at it in the future and understand. There might be some bugs and some of the important features are missing. There might be security issues! I would be glad if you find the issues and fix them.

For now, you can search for users, add friends, chat with them if they accept, quote messages, search for messages, change username, profile pictures, see your friends' online status, last seen dates....

# What can be added in the future?

1-) Sending voice messages, images and videos

2-) Admin panel

3-) Remove friends - Delete and edit messages

4-) Change password or email - Remember password

5-) Playing simple games with the person you are chatting

6-) Group chat - Though, this one was not my idea at the beginning so the database structure may need to change entirely (eg: friends, users, messages)

# Installation
Type "npm install" in terminal.

Create a ".env" file in the main folder that consist:

MONGOOSE=yourDataBaseConnection

SECRET=aSecretKey (a long string)

PORT=yourPortNumber

Then to run the application type "npm run devStart" in the terminal.

# These are some functionalities

It has a password checker that tells you how secure your password is.

![PasswordChecker](https://github.com/ugurozdemir97/myprojects/assets/64408736/12a30b88-0ec1-4d82-886d-c45c076a9811)

It is responsive

![Responsive](https://github.com/ugurozdemir97/myprojects/assets/64408736/c798b285-1d1c-4233-9703-19b3e57c01a5)

You can crop and upload images

![UploadImage](https://github.com/ugurozdemir97/myprojects/assets/64408736/7ce9d680-762a-4bdb-9339-aac0c00aaf82)

There is a notification system that notifies the users when someone add them as friends. Adding a friend looks like this. You can also see your friends' online status and last seen dates. 

![AddingFriends](https://github.com/ugurozdemir97/myprojects/assets/64408736/c2425625-d2b3-4b46-b088-a4407fd336c4)

It has emoji and message quoting system. And it will automatically scroll you to the last message you saw when you open a chat.

![Chatting](https://github.com/ugurozdemir97/myprojects/assets/64408736/cc29c59e-cfff-456c-9508-76766aeab881)

And you can search for messages

![Search](https://github.com/ugurozdemir97/myprojects/assets/64408736/4891cb1e-afba-40c3-b1c7-ca7e3492a501)
