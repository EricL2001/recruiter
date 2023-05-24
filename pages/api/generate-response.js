import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const{years, title} = req.body;
  const prompt = generatePrompt(years, title);

  console.log(prompt); // Log the prompt

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });

    return;

  }


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 2048,
    });

    console.log("Response:", completion.data); // Log the response


    res.status(200).json({ result: completion.data.choices[0].text });
    
  } catch(error) {
    // Log the error
    console.error("Error:", error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(years, title) {
  
 return `You are a helpful recruiting assistant.  Generate some screening questions for a ${title} with ${years} years of experience. Please provide 10 questions for the candidate to answer to determine their competency.  Return the questions in a numbered list.`;
}
