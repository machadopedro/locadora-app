import React, { useState, useEffect } from 'react';
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';
import { List, Button, Form, Input, Checkbox} from 'semantic-ui-react';

const backpath = 'https://4wordg1lp0.execute-api.us-east-1.amazonaws.com';
const parkpasspath = 'https://ef41asg6e4.execute-api.us-east-1.amazonaws.com';

function App() {
  const [user, setUser] = useState({'name': 'guest', 'cpf': 123});

  return (
    <div className='app'>
      <h1>Locadora</h1>
      <Navigation user={user}/>
      <Main user={user} setUser={setUser}/>
    </div>
  );
}

function Navigation({user}) {
  console.log(user)
  return (
    <nav>
      <ul>
        <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/about'>About</NavLink></li>
        <li><NavLink exact activeClassName="current" to='/contact'>Contact</NavLink></li>
        <li className='user-item'><p className='user-name'>{user.name}</p></li>
      </ul>
    </nav>
  );
}



/*
function A() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return(
    <div className='home'>
      <h1>Welcome to my portfolio website</h1>
      <p> Feel free to browse around and learn more about me.</p>
      <br/>
      <p>The current time is {currentTime}.</p>
    </div>
  );

}
*/
function Cars({setCar, cars}) {

  
  return (
    <div>
    <List className='car-list'>
      {cars.map(car => {
        return (
            <List.Item key={car.model}>
            
              <div className='car-item'>
                {car.model}
                <NavLink className='button-alugar' to='/loan' car={car} onClick={()=>
                  setCar(car)
                
                }>Alugar</NavLink>
              </div>
            
            </List.Item>
        )
      })}
    </List>

    </div>
  )
}


function Home({setCar}) {
  const [cars, setCars] = useState([]);
  console.log('Backpath is '+backpath);
  useEffect(() => {
    fetch(backpath+'/available_cars').then(res => res.json()).then(data => {
      console.log(data)
      setCars(data.cars);
    });
  }, []);



  return(
    <div>
      <p>Lista de carros</p>
      <br />
      <Cars setCar={setCar} cars={cars}/>
    </div>
  );

}

function LoanConfirmed() {

  return(
    <div>
      <p>Obrigado por alugar conosco!</p>
    </div>
  );

}

function Cadastro() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState(0);

  async function handleSignUp(){
    await fetch(backpath+'/add_client_by_get?name='+name+'&cpf='+cpf)
  }
  return(
    <div>
      <Form>
        <Form.Field>
          <Input
            placeholder='CPF'
            value={cpf}
            onChange={e => setCpf(e.target.value)}
          
          ></Input>
        </Form.Field>
        <Form.Field>
          <Input
            placeholder='Nome'
            value={name}
            onChange={e => setName(e.target.value)}
          ></Input>
        </Form.Field>
        <Form.Field>
          <NavLink className='button-geral' to='/login' onClick={handleSignUp}>
            Sign Up
          </NavLink>
        </Form.Field>
      </Form>
    </div>
  )
}

function Login({setUser}) {
  const [cpf, setCpf] = useState(0);

  function handleLogIn() {
    fetch(backpath+'/clients?cpf='+cpf).then(res => res.json()).then(data => {
      console.log(data);
      if (data.ok){
        setUser({'name': data.name, 'cpf': data.cpf})
      }
    });
  }
  return(
    <div>
      <Form>
        <Form.Field>
          <Input
            placeholder='CPF'
            value={cpf}
            onChange={e => setCpf(e.target.value)}
          
          ></Input>
        </Form.Field>
        <Form.Field>
          <NavLink className='button-geral' to='/' onClick={handleLogIn(cpf)}>
            Log In
          </NavLink>
        </Form.Field>
      </Form>
      <br/>
      <NavLink className='button-geral' to='cadastro'> Sign Up</NavLink>
    </div>
  )
}

function Loan({user, car}) {
  const [numeroDias, setNumeroDias] = useState(0);
  const [parkPass, setParkPass] = useState(0);

  async function handleClick(){

    const loan = {
      'cpf': user.cpf,
      'plate': car.plate,
      'number_of_days': numeroDias,
      'park_pass': parkPass
    };
    if (parkPass === 1) {
      try {
        await fetch(parkpasspath+'/activate_localiza_car?api_key=9gi9phbqxlzzck3ruh9es2w2mwipzd'+
        '&client_cpf='+user.cpf+'&client_name='+user.name+'&car_model='+car.model+'&car_plate='+car.plate)
      }
      catch (e) {
        console.log('Park pass error')
      }
    }
    console.log(loan);
    console.log(JSON.stringify(loan));
    const response = await fetch(backpath+'/add_loan_by_get?cpf='+user.cpf+
    '&plate='+car.plate+'&park_pass='+parkPass+'&number_of_days='+numeroDias,
    {
      method: 'GET',
      mode: 'no-cors'
    });
    console.log(response);
  }
    
  
  return(
    <div>
      <p>Aluguel</p>
      {car.model}
      <br/>
      <Form>
        <Form.Field>
          <Input  
            placeholder="Numero de dias"
            value={numeroDias}
            onChange={e => setNumeroDias(e.target.value)}
          >
          </Input>
        </Form.Field>
        <br/>
        <Form.Field>
          <Checkbox
            label='Deseja incluir o Park-Pass?'
            onChange={() => {
              if (parkPass === 0){
                setParkPass(1);
              }
              else{
                setParkPass(0);
              }
            }
            }
          >
          </Checkbox>
        </Form.Field>
        <Form.Field>
          <NavLink className='button-geral' onClick={handleClick} to='/confirmed_loan' >
            Confirmar
          </NavLink>
        </Form.Field>
      </Form>
      <br />
    </div>
  );

}

function About(){

  return (
    <div className='about'>
      <h1>About Me</h1>
      <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
      <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
    </div>
  );

}

function Contact() {
  return (
    <div className='contact'>
      <h1>Contact Me</h1>
      <p>You can reach me via email: <strong>hello@example.com</strong></p>
    </div>
  );
}

function Main({user, setUser}) {
  const [car, setCar] = useState({'plate': 'ABC12345', 'model': 'Example'});

  return (
    <Switch>
      <Route exact path='/'>
        <Home setCar={setCar}/>
      </Route>
      <Route exact path='/about'>
        <About />
      </Route>
      <Route exact path='/contact'>
        <Contact />
      </Route>
      <Route exact path='/loan'>
        <Loan user={user} car={car}/>
      </Route>
      <Route exact path='/confirmed_loan'>
        <LoanConfirmed/>
      </Route>
      <Route exact path='/login'>
        <Login setUser={setUser}/>
      </Route>
      <Route exact path='/cadastro'>
        <Cadastro setUser={setUser}/>
      </Route>
    </Switch>

    
  );
}

export default App;