const getTriviaFromAPI = async () => {
  const response = await fetch("https://api.api-ninjas.com/v1/trivia?category=", {
    method:'GET',
    headers:{'X-Api-Key':"mzDA31bBi83Lg0z7c7uc+A==wyBuAIo4X2ldEzLu"}
  }).then((response) => response.json());
  JSON.stringify(response);
  return response;
};

export default getTriviaFromAPI;
