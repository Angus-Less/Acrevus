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


async function log_website(site, rating, description) {
    /**
     * Logs the website to the firestore database.
     * 
     * Param:
     *      - site:
     *      - rating:
     *      - description:
     * Return:
     *      - 0 if successful, -1 if an error occurred (as well as error dump to console).
     */

    // Shortened macro for the entire website.
    var site = '';
    const websiteReference = db.collection('Blacklisted_sites').description(`${site}`).get();
    console.log(websiteReference);
    return 0;

}

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

function check_website_gpt(site) {
    /**
     * Checks against the database to get GPT summary.
     * 
     * Param:
     *      - site: string comprising the article itself. 

     * Return:
     *      GPT-3 Summary 
     */


    var docRef = db.collection("Sites").doc(site);

    return docRef.get().then(
        (doc) => {
            console.log(doc)
            if (doc.exists) {
                console.log("Document data:", doc.data());
                
                data = doc.data();
                //console.log(data.rating);
                return data.desc;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
}


function log_user_entry(site, rating) {
    /**
     * Logs the user's rating (out of a CURRENTLY ARBITRARY NUMBER).
     * 
     * Param:
     *      - site: the article being rated.
     *      - rating: the user rating.
     * Return:
     *      - -1    if error occurred.
     *      - 0     if successful.
     */

    return 0;
}



function log_website(URL, site, rating, description) {
    /**
     * Logs the website to the firestore database.
     * 
     * Param:
     *      - URL: string
     *      - site: string w/ name
     *      - rating: int
     *      - description: words
     *      
     * Return:
     *      - 0 if successful, -1 if an error occurred (as well as error dump to console).
     */



    // Add a new document in collection "cities"
    db.collection("Sites").doc(URL).set({
        name: site,
        rating: rating,
        desc: description
    })
    .then(() => {
        console.log("Document successfully written!");
        return 0;
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        return -1;
    });

    return 0;
}

function get_site_user_rating(site) {
    /**
     * Gets the site's user rating and returns an array containing the rating.
     * Both elements will be -666 if there is no user rating.
     * 
     * Edge cases:
     *      - Possibly could have very high user rating and verified as misleading.
     *        Also very serious problem with sandbagging and user 
     * Param:
     *      - site: the article page being referenced.
     * Return:
     *      - array of the base site and specific article.
     *          - 0:    whole site
     *          - 1:    specific article.
     */
    
  return 0;
}
