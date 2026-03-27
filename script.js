document.getElementById("submit-button").addEventListener("click", function(e) {
     e.preventDefault();
    checkEmail(document.getElementById("emailInput").value);
});

document.getElementById("emailInput").addEventListener("input", function(e) {
    resetBox();
});

document.getElementById("emailInput").focus();

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
            message.textContent = `Error: ${status}`
            form.style.backgroundColor = "gray";

            break;
    }
}

async function apiCall(email){
    try {
      const res = await fetch(`https://connect.mailerlite.com/api/subscribers/${email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chrome.runtime.getManifest().env.MAILERLITE_API_KEY}`,
        },
      });
      return res.status;

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(`Error returned: ${data.error}`);
        err.code = res.status;
        throw err;
      }
      
      //in list

    } catch (error) {
      if(error.code == '404'){
        //not in list
      }else{
        //other error
      }
    }
}

function resetBox(){
    let message = document.getElementById("emailInputLabel");
    let form = document.getElementById("form");

    message.textContent = "Email:";
    form.style.backgroundColor = "#ffffff";
}