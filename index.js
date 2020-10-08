unirest = require('unirest');
fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// if you want to send an attachment
//pathToAttachment = `attachment.docx`;
//attachment = fs.readFileSync(pathToAttachment).toString("base64");

readline.question('Sender Name: ', senderName => {
    readline.question('Sender Email: ', senderEmail => {
        readline.question('Subject: ', subject => {
            fs.readFile('msg.txt', 'utf8', function (err, msg) {
                fs.readFile('emails.csv', 'utf8', function (err, emails) {
                    fs.readFile('names.csv', 'utf8', function (err, names) {
                        fs.readFile('companies.csv', 'utf8', function (err, companies) {

                            emails = emails.split('\n')
                            names = names.split('\n')
                            companies = companies.split('\n')
                            for(let i = 0; i<emails.length; i++) {
                                let newMsg = msg;
                                newMsg = newMsg.replace('{firstName}',names[i])
                                newMsg = newMsg.replace('{company}',companies[i])
                                newMsg = newMsg.replace('{senderName}',senderName)
                                x(emails[i], i, newMsg, senderEmail, senderName, subject)
                            }
                            readline.close();
                        });
                    });
                });
            });
        });
    });
});

const x = (email, i, msg, senderEmail, senderName, subject) => {
    unirest
        .post('https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send')
        .header('X-Mashape-Key', /* your X-Mashape-Key */)
        .header('X-Mashape-Host', 'rapidprod-sendgrid-v1.p.rapidapi.com')
        .header('Content-Type', 'application/json')
        .header('Accept', 'application/json')
        .send({
            personalizations: [
                {
                    to: [
                        {
                            email
                        }
                    ],
                    subject
                }
            ],
            from: {
                name: senderName,
                email: senderEmail
            },
            content: [
                {
                    type: "text/plain",
                    value: msg
                }
            ],
            /*attachments: [
                {
                    content: attachment,
                    filename: "Niv Kaufman CV.docx",
                    type: "application/docx",
                    disposition: "attachment"
                }
            ]*/

        })
        .end(function (result) { console.log('#' + (i + 1) + ' sent to ' + email) });
}
