import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { useLocation, useNavigate } from "react-router-dom";

export default function Forgot(props) {
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const navigate = useNavigate();

  console.log("Email: ", props.email);

  function handlePass() {
    if (pass === conf) {
      fetch("http://localhost:5000/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          password: pass,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update password");
          }
          return response.json();
        })
        .then((data) => {
          // Assuming your backend returns a success message upon successful password update
          alert("Successfully updated"); // Update this as per your backend response
          navigate("/user");
        })
        .catch((err) => {
          console.error("Error updating password:", err.message);
          alert("Error updating password: " + err.message);
        });
    } else {
      alert("Passwords are not the same");
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff] h-screen p-8">
      <Navigation user={props.email} />
      <div className="flex flex-col gap-5 *:outline-none text-white *:bg-transparent w-[40%] mx-auto *:text-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <input
          type="password"
          placeholder="Enter new Password"
          onChange={(e) => setPass(e.target.value)}
          value={pass}
          className="border-b-2 border-white w-[100%] rounded-md p-3"
        />
        <p className="text-white text-5xl top-10">{props.email}</p>
        <input
          type="password"
          placeholder="Confirm new Password"
          onChange={(e) => setConf(e.target.value)}
          value={conf}
          className="border-b-2 border-white w-[100%] rounded-md p-3"
        />
        <button
          type="button"
          onClick={handlePass}
          className="border-2 border-white !bg-white shadow-lg shadow-white px-4 py-3 rounded-lg !text-black font-semibold"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
