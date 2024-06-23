import { useState } from "react";
import User from "./User";
import Forgot from "./Forgot";

export default function Combination() {
  const [page, setPage] = useState(<User onChecked={handleCheck} />);

  function handleCheck(mail) {
    setPage(<Forgot email={mail} />);
  }

  return <div>{page};</div>;
}
