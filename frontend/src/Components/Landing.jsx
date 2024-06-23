import Navigation from "./Navigation";

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff] h-screen p-8">
      <Navigation user="Register or Login" />;
      <div className="flex flex-col text-white text-[100px] gap-13 text-center items-center ">
        <h1>Plan your Day</h1>
        <h1>Plan your Tasks</h1>
        <h1>Plan your Sucess</h1>
      </div>
    </div>
  );
}
