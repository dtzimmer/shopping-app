import React, { Component } from 'react';
import './App.css';
import Logo from './Shopping.jpg'
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            location: '',
            things: '',
            notes: '',
            items: [],
            user: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }


    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }
    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({
                    user
                });
            });
    }


    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            locate: this.state.location,
            thing: this.state.things,
            note: this.state.notes
        }
        itemsRef.push(item);
        this.setState({
            location: '',
            things: '',
            notes: ''
        });
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    locate: items[item].locate,
                    thing: items[item].thing,
                    note: items[item].note
                });
            }
            this.setState({
                items: newState
            });
        });
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
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
                        <img className="logo" src={Logo} alt=""/>
                    </div>
                    <h2>Organize your shopping</h2>
                </header>
                {this.state.user ?
                    <div>
                        <div className='user-profile'>
                            <img src={this.state.user.photoURL} alt="profile pic"/>
                        </div>
                    </div>
                    :
                    <div className='wrapper'>
                        <div className='loginmessage'>
                            <p>You must be logged in to see the shopping list and submit to it.</p>
                        </div>
                    </div>
                }
                <div className='container'>
                    <section className="add-item">
                        <h2>Create a Shopping Item</h2>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="things" placeholder="What are you buying?" onChange={this.handleChange} value={this.state.things} />
                            <input type="text" name="location" placeholder="Where is it sold?" onChange={this.handleChange} value={this.state.location} />
                            <input type="text" name="notes" placeholder="Notes" onChange={this.handleChange} value={this.state.notes} />
                            <button>Add to Shopping List</button>
                        </form>
                    </section>
                </div>

                <section className='display-item'>
                    <div className='wrapper'>
                        <ul>
                            {this.state.items.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <h3>{item.locate}</h3>
                                        <p>{item.thing}</p>
                                        <p>{item.note}</p>
                                        <button onClick={() => this.removeItem(item.id)}>Bought?</button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}
export default App;
