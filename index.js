const readline  = require ('readline-sync');
const {OpenAIClient, AzureKeyCredential} = require('@azure/openai');
const { resolve } = require('path');


const client = new OpenAIClient(
    'https://br-openai-demo-dev001.openai.azure.com',
    new AzureKeyCredential('0fcb19768e96449c88995487ccad4675')
)

const getMessageFromAPI = async (message) => {
  try{
    const response = await client.getCompletions(
      "CAMP2024", message,{
        temperature : 0,
        maxTokens: 244,
      },
    );
      return response.choices[0].text.trim();

  } catch(error){
      console.error(error);
      return 'Desculpe, ocorrreu um erro linha 22';
  }
}


(async () =>{

  console.log('Bem vindo ao Chat GPT');
  
  try{
  const userMessage = await readline.question('Qual sua duvida:  ');
  const botResponse =  await getMessageFromAPI(userMessage);
  console.log(`Resposta : ${botResponse}`);
  
  }catch (error){
    console.log(error);
  }

})();






