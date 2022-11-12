
const getFactFromAPI = async () =>{

    const URL = "https://api.api-ninjas.com/v1/facts?limit=100";
      const res = await fetch(URL, {
        method: "GET",
        headers: {
          "x-api-key":
            "mzDA31bBi83Lg0z7c7uc+A==wyBuAIo4X2ldEzLu",
        },
      });
      const data = await res.json();
      return data;
      console.log(data);
    }
    
    export default getFactFromAPI;