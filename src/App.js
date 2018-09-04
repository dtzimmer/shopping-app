import React, { Component } from 'react'
import './App.css'
import Logo from './Shopping.jpg'
import firebase, { auth, provider } from './firebase.js'


const updateItem = (db, itemId, item = {}) => { //UPDATE Function
  const itemRef = db.ref(`items/${itemId}`)
  itemRef.set(item)
}

const createItem = (db, item = {}) => {  //POST Function
  const itemsRef = db.ref('items')
  itemsRef.push(item)
}


class App extends Component {
  constructor() {
    super()
    this.state = {
      location: '',
      things: '',
      notes: '',
      items: [],
      user: null,
    }
  }


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  logout = () => {
    auth.signOut()
        .then(() => {
          this.setState({
            user: null
          })
        })
  }


  login = () => {
    auth.signInWithPopup(provider)
        .then((result) => {
          const user = result.user
          this.setState({
            user
          })
        })
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const db = firebase.database()

    const { itemId } = this.state

    const item = {
      locate: this.state.location,
      thing: this.state.things,
      note: this.state.notes
    }

    !itemId ? createItem(db, item) : updateItem(db, itemId, item)

    this.setState({
      location: '',
      things: '',
      notes: '',
      itemId: ''
    })


  }


  async componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      }
    })
    const itemsRef = firebase.database().ref('items')
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val()
      let newState = []
      for (let item in items) {
        newState.push({
          id: item,
          locate: items[item].locate,
          thing: items[item].thing,
          note: items[item].note
        })
      }
      this.setState({
        items: newState
      })
    })
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`)
    itemRef.remove()
  }

  populateFields = (itemId) => {
    const itemsRef = firebase.database().ref(`/items/${itemId}`)
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val()
      this.setState({ location: items.locate, things: items.thing, notes: items.note, itemId })
    })
  }


  render() {

    return (
      <div className='app'>
        <header>
          {this.state.user ?
            <button onClick={this.logout}>Log Out</button>
            :
            <button onClick={this.login}>Log In</button>
          }
          <div>
            <img className="logo" src={Logo} alt="" />
          </div>
          <h2>Organize your shopping</h2>
        </header>
        {this.state.user ?
          <div>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} alt="profile pic" />
            </div>
          </div>
          :
          <div>
            <div className='loginmessage'>
              <p>You must be logged in to see the shopping list and submit to it.</p>
            </div>
          </div>
        }
          <div className="add-item">
            <h3>Create a Shopping Item</h3>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="location" placeholder="Where is it sold?" onChange={this.handleChange}
                     value={this.state.location} />
              <input type="text" name="things" placeholder="What are you buying?" onChange={this.handleChange}
                     value={this.state.things} />
              <input type="text" name="notes" placeholder="Notes" onChange={this.handleChange}
                     value={this.state.notes} />
              <button>Add/Save to Shopping List</button>
            </form>
          </div>

        <section className='display-item'>
          <div>
            <ul>
              {this.state.items.map((item) => {
                return (
                  <li key={item.id}>
                    <h3>{item.locate}</h3>
                    <p>{item.thing}</p>
                    <p>{item.note}</p>
                    <button onClick={() => this.removeItem(item.id)}>Bought?</button>
                    <button onClick={() => this.populateFields(item.id)}>Update?</button>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>
    )
  }
}

export default App
