// The app's Firebase configuration(change it to fit your database).
var firebaseConfig = {
    apiKey: "AIzaSyDrD-udDqxDehOayG9U95fAeAYlwFwIYME",
    authDomain: "acrevus-4bb74.firebaseapp.com",
    projectId: "acrevus-4bb74",
    storageBucket: "acrevus-4bb74.appspot.com",
    messagingSenderId: "435255014159",
    appId: "1:435255014159:web:6aa1f1b4ea0af1360a447a",
    measurementId: "G-33TKV57R3K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function check_website(site) {
    /**
     * Checks against the database if either this specific article is flagged,
     * or if the website is flagged. 
     *
     * THIS IS ASYNC AND I DON'T KNOW WHAT THAT MEANS
     * 
     * Param:
     *      - site: string comprising the article itself. 

     * Return:
     *      - -1    if website is flagged.
     *      - 0     if site is disputed.
     *      - 1     if website is endorsed.
     *      - null  if website is unknown
     */


    var docRef = db.collection("Sites").doc(site);

    return docRef.get().then(
        (doc) => {
            console.log(doc)
            if (doc.exists) {
                console.log("Document data:", doc.data());
                
                data = doc.data();
                console.log(data.rating);
                return data.rating;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
}

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



