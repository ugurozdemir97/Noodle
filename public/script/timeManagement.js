function timeManagement(i) {

    if (!i) {return ""} // If it's a new friend, you won't know their last seen date until refreshing

    // Date sent back from server is in string format. But client always send Date() object
    // It causes problems so first convert the parameter into a date.
    let date = Date.parse(i)
    let time = new Date(date)

    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    switch (time.toDateString()) {  // Check date

        case today.toDateString(): // If it's today, send the hour and minutes

            // padStart() makes string 2 digits, for example: 01 instead of 1
            let hours = String(time.getHours()).padStart(2, '0');
            let minutes = String(time.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`

        case yesterday.toDateString():  // If it's yesterday just send "Yesterday"
            return "Yesterday"

        default:  // Else send the date in this format 25/07/1997

            let day = String(time.getDate()).padStart(2, '0');
            let month = String(time.getMonth() + 1).padStart(2, '0');
            let year = time.getFullYear();

            return `${day}/${month}/${year}`
    }   
}

// This is a very similar function just for the messages

function messageTimes(i) {

    let date = Date.parse(i)
    let time = new Date(date)

    let today = new Date();
    let yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    let hours = String(time.getHours()).padStart(2, '0');
    let minutes = String(time.getMinutes()).padStart(2, '0');

    switch (time.toDateString()) {  // Check date
        
        case today.toDateString(): // If it's today, send the hour and minutes
            return `${hours}:${minutes}`

        case yesterday.toDateString():  // If it's yesterday just send "Yesterday at 12:11"
            return `Yesterday at ${hours}:${minutes}`

        default:  // Else send the date in this format 25/07/1997 - 04:32
            let day = String(time.getDate()).padStart(2, '0');
            let month = String(time.getMonth() + 1).padStart(2, '0');
            let year = time.getFullYear();
            return `${day}/${month}/${year} - ${hours}:${minutes}`
    }   
}