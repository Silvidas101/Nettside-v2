let username = "";

// Ask for username until they enter something
while(username === "" || username === null){
    username = window.prompt('Enter your username');
}
// Show username in console log
console.log(`Hello ${username}`);

