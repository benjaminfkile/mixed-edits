import { Component } from "react"
import connection from "./Hub/Hub"
import { Button, FormControl, Modal } from "react-bootstrap"
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import axios from "axios";

interface AppTypes {
  editWindow: boolean
  sessionKey: string
  multipleUsers: boolean
  dismiss: boolean
}

class App extends Component<{}, AppTypes> {

  constructor(props: any) {
    super(props)
    this.state = {
      editWindow: false,
      sessionKey: uuidv4(),
      multipleUsers: false,
      dismiss: false
    }
  }

  componentDidMount() {
    connection.on("newMessage", this.signalRIn)
  }

  signalRIn = (input: any) => {
    if (this.state.editWindow && input.key !== this.state.sessionKey) {
      this.setState({ multipleUsers: true })
    }
    console.log("SignalR incoming: " + input.key)
    console.log("My session key: " + this.state.sessionKey)
  }

  handleChange = (event: any) => {
    console.log(event)
  }

  toggleEditWindow = () => {
    if (this.state.editWindow) {
      this.setState({ editWindow: false })
    } else {
      this.setState({ editWindow: true })
      this.signalROut()
    }
  }

  toggleDismiss = () => {
    if (this.state.dismiss) {
      this.setState({ dismiss: false })
    } else {
      this.setState({ dismiss: true, multipleUsers: false })
    }
  }

  signalROut = () => {
    axios.post("https://elmsigr-fn.azurewebsites.net/api/messages", { key: this.state.sessionKey })
      .then((resp: any) => resp.data);
  }

  render() {

    return (
      <div className="App">
        <p> Copy the url and paste it into another browser window, position them so you can see both windows. Click the "Edit Something" button in both windows</p>
        {this.state.editWindow && !this.state.multipleUsers && <Modal
          show={true}
          backdrop="static"
          keyboard={true}
          size="xl"
        >
          <Modal.Header>
            <p>An Important Document</p>
          </Modal.Header>
          <Modal.Body>
            <p>Something to edit</p>
            <FormControl
              as="textarea" rows={4}
            />
          </Modal.Body>
          <Modal.Footer>
            {this.state.editWindow && <Button variant="secondary" id="quit-btn" onClick={this.toggleEditWindow}>Quit</Button>}
          </Modal.Footer>
        </Modal>}
        {this.state.multipleUsers && <Modal
          show={true}
          backdrop="static"
          keyboard={true}
        >
          <Modal.Header>
            <h1>Somebody else is out there!</h1>
          </Modal.Header>
          <Modal.Body>
            <p>Something bad might happen!</p>
            <Button variant="secondary" onClick={this.toggleDismiss}>Dismiss</Button>
          </Modal.Body>
        </Modal>}
        <Button variant="secondary" id="open-btn" onClick={this.toggleEditWindow}>Edit Something</Button>
      </div>
    )
  }
}

export default App;//vercel bump