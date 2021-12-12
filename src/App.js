import './App.css';
import { collection, addDoc, doc, deleteDoc, query, onSnapshot, orderBy, updateDoc, getDoc, where, getDocs } from "firebase/firestore"; 
import { db } from './firebase-config';
import { useEffect, useState } from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';

class Todo {
    constructor (text, completed, timestamp, user) {
        this.text = text;
        this.completed = completed;
        this.timestamp = timestamp;
        this.user = user;
    }
}

const todoConverter = {
    toFirestore: (todo) => {
        return {
            text: todo.text,
            completed: todo.completed,
            timestamp: todo.timestamp,
            user: todo.user
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Todo(data.text, data.completed, data.timestamp, data.user);
    }
};

function App() {
    const [todoText, setTodoText] = useState('');
    const [localTodos, setLocalTodos] = useState([]);
    const [logged, setLogged] = useState(false);
    const [signup, setSignup] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    useEffect(()=> {
        const q = query(collection(db, "todos"), orderBy("timestamp"), where("user", "==", user));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // adds the document id to the local todo items
            setLocalTodos(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        });
        
        return () => unsubscribe()
     }, [user])

    const addTodo = async (todoText) => {
        const addRef = collection(db, "todos").withConverter(todoConverter);
        await addDoc(addRef, new Todo(todoText, false, + new Date(), user));
        window.scroll(0, document.body.scrollHeight);
    }

    const removeTodo = async (id) => {
        await deleteDoc(doc(db,"todos",id))   
    }

    const updateTodo = async (id) => {
        let newText = prompt("What would you like to update it to?");

        if(newText) {
            await updateDoc(doc(db, "todos", id), {
                text: newText
            })
        } else {
            alert("Must enter some value!");
        }
        
    }

    const completeTodo = async (id) => {
        let todoDoc = await getDoc(doc(db, "todos", id));
        let todoData = todoDoc.data();
        let compVal = todoData.completed;

        await updateDoc(doc(db, "todos", id), {
            completed: !compVal
        })
    }

    const positionTodo = async (id) => {

    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (todoText) {
            addTodo(todoText);
            setTodoText('');
        } else {
            alert("Must enter some value!");
        }
    }

    // ######################################################

    const signIn = async (e) => {
        e.preventDefault();
        let dbUsers = await getDocs(collection(db, "users"));
        let localUsers = []
        dbUsers.forEach((dbUser) => {
            localUsers.push({
                username: dbUser.data().username,
                password: dbUser.data().password
            })
        })
        
        let passed = false;
        for (let i = 0; i < localUsers.length; i++) {
            const localUser = localUsers[i];
            if(localUser.username === user && localUser.password === pass) {
                setLogged(true);
                setPass('');
                passed = true;
                break;
            } else {
                passed = false;
            }
        }

        if(!passed) {
            setUser('');
            setPass('');
            document.getElementById("signin-form").reset();
            alert("Invallid credentials...");
        }
    }

    const signOut = () => {
        setUser('');
        setPass('');
        setLogged(false);
    }

    const signUp = async (e) => {
        e.preventDefault();

        let dbUsers = await getDocs(collection(db, "users"));
        let localUsers = []
        dbUsers.forEach((dbUser) => {
            localUsers.push({
                username: dbUser.data().username,
                password: dbUser.data().password
            })
        })

        let passed = false;

        for (let i = 0; i < localUsers.length; i++) {
            const localUser = localUsers[i];
            if (localUser.username === user) {
                passed = false;
                alert("user already exists");
                break;
            } else {
                passed = true;
            }

        }

        if(passed) {
            let userRef = collection(db, "users");
                await addDoc(userRef, {
                    username: user,
                    password: pass
                });
                setSignup(false);
                setLogged(true);
        }
        
    }

    return (
        <div className="App">
            {
            !logged ?
                !signup ? 
                    <SignIn setSignup={setSignup} signIn={signIn} setUser={setUser} setPass={setPass} />
                :
                    <SignUp setSignup={setSignup} signUp={signUp} setUser={setUser} setPass={setPass} />
            : 
            <div id="cc" className="content-container">
                <div className="signout-but" onClick={() => signOut()}>Logout</div>
                <br />

                {
                localTodos.length > 0 ?
                    
                    <div className='message'>Your todos</div>
                    
                :
                    <div className='message'>All caught up!</div>
                }

                <br />

                {
                localTodos.map((todo, index) => {
                    return (
                        <div className="todo" key={index}>
                            <div className="todo-text" onClick={() => completeTodo(todo.id)} style={{textDecoration : todo.completed ? 'line-through' : 'none', color: todo.completed ? 'rgb(150, 150, 150)' : 'white'}}>{todo.text}</div>
                            <div className="remove-but" onClick={() => removeTodo(todo.id)}>X</div>
                            <div className="update-but" onClick={() => updateTodo(todo.id)}></div>
                        </div>
                    )
                })
                }

                <br />

                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)} /><br /><br />
                    <input className="submit-but" type="submit" value="ADD TODO" />
                </form>
                <br />
            </div>
            }
        </div>
    )
}

export default App;
