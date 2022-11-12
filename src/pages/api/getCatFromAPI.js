
const getCatFromAPI = async () =>{

const URL = "https://api.thecatapi.com/v1/images/search?limit=3";
  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "x-api-key":
        "live_bxdQ6zEA5WmUumJLYlbI2llLvZvEJigCZPNWpdWz6DAOqdxy5tf5F9Q66Yt6vyz9",
    },
  });
  const data = await res.json();
  return data;
}

export default getCatFromAPI;