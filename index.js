document.getElementById("descButton").addEventListener("click", get_description);
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



