const signalR = require("@microsoft/signalr");
const connection = new signalR.HubConnectionBuilder()
.withUrl("https://elmsigr-fn.azurewebsites.net/api")
.withAutomaticReconnect()
.configureLogging(signalR.LogLevel.Information)
.build()
connection.onclose(() => console.log("SignalR disconnected"))
connection.start()
.then(() => console.log("SignalR connected"))
.catch(console.error)
export default connection

//Starts the connection to the SignalR service, this is a serverless function hosted on Azure.