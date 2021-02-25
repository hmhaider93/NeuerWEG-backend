const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const apiKeys = require('./apiKeys');
const app = express();
const port = 3000;

//setting mail chimp configurations
mailchimp.setConfig({
    apiKey: apiKeys.mailChimpApiKey(),
    server: "us1"
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/', function(req,res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    console.log("First Name : " + firstName);
    console.log("Last Name: " +lastName );
    console.log("email : " +email );

    const listId = apiKeys.mailChimpUniqueId();

    async function run(){
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName,
            }
        });
        res.sendFile(__dirname + "/success.html");
        console.log("Successfully added contact as an audience member. The contact's id is: " + response.id)
    }

    run().catch(function(error){
        res.sendFile(__dirname + "/failure.html");
        console.log("Failure, Run Function has failed: " + error);
    });
        
});




app.listen(process.env.PORT, () => console.log(`Example app listening on port port!`))