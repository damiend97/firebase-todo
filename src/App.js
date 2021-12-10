import './App.css';
import { collection, addDoc, doc, deleteDoc, query, onSnapshot, orderBy, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from './firebase-config';
import { useEffect, useState } from 'react';

class Todo {
    constructor (text, completed, timestamp) {
        this.text = text;
        this.completed = completed;
        this.timestamp = timestamp;
    }
}

const todoConverter = {
    toFirestore: (todo) => {
        return {
            text: todo.text,
            completed: todo.completed,
            timestamp: todo.timestamp
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Todo(data.text, data.completed, data.timestamp);
    }
};

function App() {
    const [todoText, setTodoText] = useState('');
    const [localTodos, setLocalTodos] = useState([]);

    useEffect(()=> {
        const q = query(collection(db, "todos"),  orderBy("timestamp"));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // adds the document id to the local todo items
            setLocalTodos(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        });
        
        return () => unsubscribe()
     }, [])

    const addTodo = async (todoText) => {
        const addRef = collection(db, "todos").withConverter(todoConverter);
        await addDoc(addRef, new Todo(todoText, false, + new Date()));
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (todoText) {
            addTodo(todoText);
            setTodoText('');
        } else {
            alert("Must enter some value!");
        }
    }

    return (
        <div className="App">
            <div id="cc" className="content-container">
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
        </div>
    )
}

export default App;
