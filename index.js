import {OpenAIClient, AzureKeyCredential} from '@azure/openai';
import { resolve } from 'path';
import { intro, outro } from '@clack/prompts';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { resourceLimits } from 'worker_threads';
import { spinner } from '@clack/prompts';
import { select } from '@clack/prompts';
import 'dotenv/config';


const client = new OpenAIClient(
    process.env.gptendpoint,
    new AzureKeyCredential(process.env.gptkey)
)

const getMessageFromAPI = async (message) => {
  try{
    const response = await client.getCompletions(
      process.env.model, message,{
        temperature : 0,
        maxTokens: 50,
      },
    );
      return response.choices[0].text.trim();

  } catch(error){
      console.error(error);
      return 'Desculpe, ocorrreu um erro';
  }
}

(async () =>{
  const s = spinner();
  p.intro(`${(color.blue(" - 👋👋 Bem Vindo ao Chat GPT de Gustavo Vieira! 👋👋 - "))}`);
    
  const inicio = await p.group ({

    begin : () => p.text({
    message : "🤖 Olá Usuário, Qual Seu Nome? ",
    placeholder: " Digite seu Nome",   
  })
})
   
    try{
  while(true){
      const group = await p.group ({

        name: () => p.text({
        message : `🤖 Olá ${inicio.begin}, Qual sua Duvida? `,
        placeholder: " Digite sua Duvida",   
      })
    })

      const userMessage = group.name;

      if (userMessage.toLowerCase() === "sair"){

        p.outro(`${(color.blue("- Até mais, Obrigado por utilizar !!  👋👋 -"))}`);
        break;
       
      } 

      s.start("Analisando Pergunta ...");
      const botResponse =  await getMessageFromAPI(userMessage);
     
      s.stop(`🤖: ${botResponse}`);

      const projectType = await select({
        message: '🤖: Deseja Fazer Mais uma Pergunta? ',
        options: [
          { value: 'y', label: 'Sim' },
          { value: 'n', label: 'Não' },

        ],
      });

      if(projectType.toLowerCase() === "n"){
        p.outro(`${(color.blue("- Até mais, Obrigado por utilizar !! 👋👋 -"))}`);
        break;
      }
      if(projectType.toLowerCase() === "y"){
        console.clear();
      }

    }
      }catch (error){
        console.log(error);
      }


})();




