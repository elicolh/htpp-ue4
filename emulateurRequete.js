const fetch = require("node-fetch")
const pseudo = "pseudo";
const password = "password";
const deviceID = "device id";

fetch("http://89.91.153.230:6999", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        pseudo:pseudo,
        password:password,
        Deviceid:deviceID
    })
  })