
import './App.css';
import axios from 'axios'
import React, {useState,useEffect} from 'react'
import Form from './Components/Form'
import Schema from './Validation/Schema'
import User from './Components/User'
import {reach} from 'yup'

const initialFormValues = {
  username:'',
  email:'', 
  password:'',
  terms:'',
}

const initialFormErrors = {
  username:'',
  email:'',
  password:'',
  terms:'',
}

const initialUsers = []
const initialDisabled = true

function App() {

  const [user,setUser] = useState(initialUsers) ;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors) ;
  const [disabled, setDisabled] = useState(initialDisabled);  

  const getUsers = () => {
    axios.get('https://reqres.in/api/users')
    .then(res => {
      setUser(res.data)
      console.log(res.data)
      .catch(err => {
        console.log(err)
      })
    })
  }

  const postNewUser = newUser => {
    axios.post('https://reqres.in/api/users', newUser)
    .then(res => {
      setUser([res.data,...user])
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setFormValues(initialFormValues)
    })
  }

  const validate = (name,value) => {
    reach(Schema,name)
    validate(value)
    .then((valid) => setFormErrors({...formErrors,[name]: ''}))
    .catch(err => setFormErrors({...formErrors,[name]: err.errors[0]}))
  }

  const inputChange = (name, value) => {
    validate(name,value)
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const formSubmit = () => {
    const newUser = {
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    }
    postNewUser(newUser)
  }

  useEffect(() => {
    Schema.isValid(formValues)
    .then(valid => setDisabled(!valid))
  }, [formValues])


  return (
    <div className="App">
      <header><h1>Users</h1></header>
     
     <Form
     values={formValues}
     change={inputChange}
     submit={formSubmit}
     disabled={disabled}
     errors={formErrors}
     />
     {
       user.map(use => {
         return (
           <User key={use.id} details={use} />
         )
       })
     }
    </div>
  );
}

export default App;
