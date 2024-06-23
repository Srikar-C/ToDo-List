import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [item, setItem] = useState("");
  const [list, setList] = useState([]);
  const location = useLocation();

  // Destructure userId and userName correctly from location.state
  const { userId, userName } = location.state || {};

  useEffect(() => {
    if (userId) {
      fetch("http://localhost:5000/getList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      })
        .then((response) => response.json()) // Ensure response is converted to JSON
        .then((data) => {
          console.log("Data of respective user is: ", data);
          setList(data); // Update the list state with the fetched data
        })
        .catch((err) => {
          console.log("Error on getting list:", err.message);
        });
    }
  }, [userId]); // Ensure the effect runs when userId changes

  function handleSubmit() {
    if (item !== "") {
      fetch("http://localhost:5000/addList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          item: item,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add list item");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Current list is: ", data);
          setList((prevList) => [...prevList, { id: data.id, text: item }]); // Assuming the response contains the new item's ID
          setItem("");
          alert("Item added successfully");
        })
        .catch((err) => {
          console.log("Error on adding list:", err.message);
          alert("Error on adding list: " + err.message);
        });
    } else {
      alert("Enter some item");
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff] h-screen p-8">
      {/* Pass user prop to Navigation component */}
      <Navigation user={userName} />
      <div className="flex w-[70%] mx-auto mt-32 justify-between">
        <input
          type="text"
          onChange={(e) => setItem(e.target.value)}
          value={item}
          placeholder="Enter items to add to your cart😜"
          className="rounded-xl bg-transparent border-2 border-white outline-none w-[80%] text-white px-20 py-3"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="border-2 border-white text-white bg-black hover:bg-white hover:text-black shadow-lg shadow-white rounded-md p-4 transition-all"
        >
          Submit
        </button>
      </div>
      <div className="list w-[50%] mx-auto text-white pt-16">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <p>User ID: {userId}</p>
        <p>User Name: {userName}</p>
        <ul className="flex flex-col gap-3">
          {list.map((item, index) => (
            <li className="list-disc" key={index}>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
