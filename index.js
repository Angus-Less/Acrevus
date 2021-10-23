/**
 * Icon displayed next to each domain on the page that when clicked will display
 *  the modal window with domain specific information.
 */
document.getElementById("descButton").addEventListener("click", get_description);

/**
 * Function run when icon button instantiated above is clicked.
 * 
 */
function get_description() {
    var ratingDict = {
        null : "unknown",
        "-1" : "untrusted",
        "0" : "questionable",
        "1" : "trustworthy"
    }

    check_website(document.getElementById("siteInput").value).then(rating => {
        console.log(rating)


        document.getElementById("description").innerHTML =
            document.getElementById("siteInput").value + " is " +
            ratingDict[rating];
    })
}



