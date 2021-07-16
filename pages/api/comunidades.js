import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequests(request, response){
   
    if(request.method ==='POST'){
        const TOKEN = 'f4e0d359321f3b4991f23d0b6e536e';

        const client = new SiteClient(TOKEN);
        
        //Validar os dados antes de sair cadastrando
        const registroCriado = await client.items.create({
            ...request.body,
            itemType: "968525", // ID do model da "Communities" criado pelo Dato 
           // title: "Comunidade de Teste",
           // imageUrl: "https://github.com/viniciusramon.png",
           // creatorSlug: "viniciusramon"
        })
    
        console.log(registroCriado);
    
        console.log(TOKEN);
        
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }   
     response.status(404).json({
         message: 'Ainda não temos nada no GET, mas no POST tem!'
     })
}