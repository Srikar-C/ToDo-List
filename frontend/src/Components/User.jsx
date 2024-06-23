import { useState } from "react";
import * as Components from "./UserCom";
import { Link, useNavigate } from "react-router-dom";
import Forgot from "./Forgot";

export default function User(props) {
  const [signIn, toggle] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();
    fetch("http://localhost:5000/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: pass,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error("Email already exists");
        }
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("User Details(Register) is ", data);
        alert("User registered successfully");
        navigate("/dashboard", {
          state: { userId: data.id, userName: data.users },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
        alert("Error: " + err.message);
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    fetch("http://localhost:5000/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("User not Exist");
        } else {
          throw new Error("Failed to login");
        }
      })
      .then((data) => {
        console.log("User Details(Login) is ", data);
        navigate("/dashboard", {
          state: { userId: data.userId, userName: data.userName },
        });
      })
      .catch((err) => {
        console.log("Error: " + err.message);
        alert("Error: " + err.message);
      });
  }

  return (
    <Components.MainUser>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Components.Button onClick={handleRegister}>
              Register
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleLogin}>
            <Components.Title>Login</Components.Title>
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Components.Anchor
              onClick={() => {
                props.onChecked(email);
              }}
            >
              Forgot your password?
            </Components.Anchor>
            <Components.Button>Login</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Existing User
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter Your personal details and start journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                New User
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.MainUser>
  );
}
