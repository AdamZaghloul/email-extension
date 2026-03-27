document.getElementById("submit-button").addEventListener("click", function(e) {
     e.preventDefault();
    checkEmail(document.getElementById("emailInput").value);
});

document.getElementById("emailInput").addEventListener("input", function(e) {
    resetBox();
});

document.getElementById("emailInput").focus();

document.getElementById("settings-toggle").addEventListener("click", function() {
    const isSettings = document.getElementById("settings-form").style.display !== "none";

    if (isSettings) {
        const apiKey = document.getElementById("apiKeyInput").value;
        chrome.storage.local.set({ apiKey });

        document.getElementById("settings-form").style.display = "none";
        document.getElementById("form").style.display = "flex";
        document.getElementById("gear-icon").style.display = "";
        document.getElementById("save-icon").style.display = "none";
    } else {
        chrome.storage.local.get("apiKey", function(result) {
            if (result.apiKey) document.getElementById("apiKeyInput").value = result.apiKey;
        });

        document.getElementById("form").style.display = "none";
        document.getElementById("settings-form").style.display = "flex";
        document.getElementById("gear-icon").style.display = "none";
        document.getElementById("save-icon").style.display = "";
    }
});

async function checkEmail(email){

    if(!email){
        return;
    }
    
    let message = document.getElementById("emailInputLabel");
    let button = document.getElementById("submit-button");
    let textBox = document.getElementById("emailInput");
    let form = document.getElementById("form");
    
    button.classList.add("loading");
    textBox.disabled = true;

    const status = await apiCall(email);

    button.classList.remove("loading");
    textBox.disabled = false;
    textBox.select();

    switch(status){
        case 200:
            //in list
            message.textContent = "Email Exists."
            form.style.backgroundColor = "lightgreen";

            break;
        case 404:
            //not in list
            message.textContent = "Email Does Not Exist."
            form.style.backgroundColor = "lightcoral";

            break;
        default:
            //other error
            if(status == 401){
                message.textContent = `Error: ${status}, check API Key in settings.`
            }else{
                message.textContent = `Error: ${status}`
            }
            form.style.backgroundColor = "gray";

            break;
    }
}

async function apiCall(email){

    const result = await new Promise(resolve => chrome.storage.local.get("apiKey", resolve));
    const apiKey = result.apiKey || "";

    console.log(apiKey)

    const res = await fetch(`https://connect.mailerlite.com/api/subscribers/${email}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${apiKey}`,
    },
    });
    return res.status;
}

function resetBox(){
    let message = document.getElementById("emailInputLabel");
    let form = document.getElementById("form");

    message.textContent = "Email:";
    form.style.backgroundColor = "#ffffff";
}