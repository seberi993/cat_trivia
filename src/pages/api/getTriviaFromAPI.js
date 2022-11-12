const getTriviaFromAPI = async () => {
  const response = await fetch("https://api.api-ninjas.com/v1/trivia?category=general", {
    method:'GET',
    headers:{'x-api-key':"zDRm1wASzX724oxcUZtUj90nJpvLI4C7gnVae3FQ",}
  }).then((response) => response.json());
  JSON.stringify(response);
  return response;
};

export default getTriviaFromAPI;
