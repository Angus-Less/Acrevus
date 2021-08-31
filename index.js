
function get_description() {
    var ratingDict = {
        null : "unknown",
        "-1" : "untrusted",
        "0" : "questionable",
        "1" : "trustworthy"
    }
    rating = check_website(document.getElementById("siteInput").value)
    document.getElementById("description").innerHTML =
        document.getElementById("siteInput").value + " is " +
        ratingDict[rating];

}

function get_elaboration() {
    document.getElementById("elaboration").innerHTML =
        document.getElementById("description").innerHTML + " because it's \
              cool";

    const OpenAI = require('openai-api/index.js');

    // Load your key from an environment variable or secret management service
    // (do not include your key directly in your code)

    const openai = new OpenAI("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");
}

document.getElementById('sourcelist').onchange = function(){
    var file = this.files[0];
    console.log(file);

    var reader = new FileReader();
    reader.onload = function(progressEvent){
        var lines = this.result.split(/\n/);
        for(var line = 0; line < lines.length-1; line++){

            split = lines[line].split(/~/)
//            console.log(split[0], split[1], parseInt(split[2]), split[3])
            log_website(split[0], split[1], parseInt(split[2]), split[3])
        }
    };
    reader.readAsText(file);
};
