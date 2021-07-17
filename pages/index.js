import React from "react";
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from "../src/components/MainGrid"
import Box from "../src/components/Box"
import{AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propriedades){
  return (
    <Box as="aside">
    <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}/>
    <hr/>

    <p>
      <a className="boxlink" href={`https://github.com/${propriedades.githubUser}`}>
      @{propriedades.githubUser}
      </a>
    </p>
    <hr/>

    <AlurakutProfileSidebarMenuDefault/>
  </Box>
  )
}
function ProfileRelationsBox(propriedades){
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle" >{propriedades.title} ({propriedades.itens.length}) 
              </h2>
          <ul>
              {/*{seguidores.map((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                        <a href={`https://github.com/${itemAtual}.png`}>
                      <img src={itemAtual.image}/>
                      <span>{itemAtual.title}</span> 
                      </a>
                    </li>
                    
                  )
                  })}*/}
              </ul>
          </ProfileRelationsBoxWrapper>
  )
}
export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
 
  //const comunidades = comunidades[0];
  
  //const alteradorDeComunidades/setComunidades = comunidades[1];
  
  //console.log('Nosso Teste', comunidades);
  const usuarioAleatorio = props.githubUser;
  
  // const comunidades = ['Alurakut'];
  
  const pessoasFavoritas = ['juunegreiros', 'omariosouto',
  'peas', 
  'rafaballerini',
  'marcobrunodev',
  'felipefialho'
]

const [seguidores, setSeguidores] = React.useState([]);
/* 0 - Pegar o array de dados do GitHub */
  React.useEffect(function(){
    /* GET */  
    fetch('https://api.github.com/users/viniciusramon/followers')
    .then(function (respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
     setSeguidores(respostaCompleta);
    })

    /* API GrapgQL */
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization':'bef360f1db7d1fef6d5009557032f1',
        'Content-Type':'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities{
          title
          id
          imageUrl
          creatorSlug
        }
      }`})
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      
      console.log(comunidadesVindasDoDato)

      setComunidades(comunidadesVindasDoDato)

    })
   /* .then(function (response){
      return response.json()
    })*/
  }, [])

  console.log('seguidores antes do return', seguidores);


/* 1 - Criar um box que vai ter um map, baseado nos itens do array que pegamos do GitHub */

  return( 
    <>
       <AlurakutMenu/>
      <MainGrid> 
          {/*<Box style="grid-area: profileArea;">*/}
          <div className="profileArea" style={{gridArea: 'profileArea'}}>
            <ProfileSidebar githubUser={usuarioAleatorio}/>
          </div>
          <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <Box>
              <h1 className='title'>
                Bem Vindo(a) Vinicius Ramon
                </h1>
                <OrkutNostalgicIconSet/>
                </Box>

                <Box>
                  <h2 className="subTitle">O que você deseja fazer?</h2>
                  <form onSubmit={function handleCriaComunidade(e){
                   e.preventDefault();
                   const dadosDoForm = new FormData(e.target);
                   console.log('Campo: ', dadosDoForm.get('title'));
                   console.log('Campo: ', dadosDoForm.get('image'));


                   //comunidades.push('Alura Stars');
                   const comunidade = {
                     title: dadosDoForm.get('title'),
                     imageUrl: dadosDoForm.get('image'),
                     creatorSlug: usuarioAleatorio,
                   }

                   fetch('/api/comunidades', {
                     method: 'POST',
                     headers: {
                       'Content-Type':'application/json',
                     },
                     body: JSON.stringify(comunidade)
                   })
                   .then(async (response) => {
                      const dados = await response.json();
                      console.log(dados.registroCriado);
                      const comunidade = dados.registroCriado;
                      const comunidadesAtualizadas = [...comunidades, comunidade];
                      setComunidades(comunidadesAtualizadas)
                   })            
                  }}>
                    <div>
                      <input placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?"
                      type="text"/>
                      </div>
                      <div>
                      <input placeholder="Coloque uma URL para usar-mos de capa" name="image" aria-label="Coloque uma URL para usar-mos de capa"/>
                      </div>

                      <button>
                        Criar comunidade
                      </button>
                  </form>
            </Box>
          </div>
          <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBox title="Seguidores" itens={seguidores}/>

          <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle" >Comunidades ({comunidades.length}) 
              </h2>
          <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                        <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl}/>
                      <span>{itemAtual.title}</span> 
                      </a>
                    </li>
                    
                  )
                  })}
              </ul>
          </ProfileRelationsBoxWrapper>

            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle" > Pessoas da Comunidades ({pessoasFavoritas.length}) 
              </h2>
              <ul>
                {pessoasFavoritas.map((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                        <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`}/>
                      <span>{itemAtual}</span> 
                      </a>
                    </li>
                    
                  )
                  })}
              </ul>
            </ProfileRelationsBoxWrapper>
          {/*  <Box>
              Comunidades
          </Box>*/}
          </div>
      </MainGrid> 
    </>
    )
  }

 /* export async function getServerSideProps(context) {
    const cookies = nookies.get(context)
    const token = cookies.USER_TOKEN;
    
   const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
      headers: {
        Authorization: token
      }
    })
    .then((resposta) => resposta.json())

   // console.log('isAuthenticated', isAuthenticated);

    if(!isAuthenticated){
      return{
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
    }

    const { githubUser } = jwt.decode(token);


    return {
      props: {
        githubUser
      }, // will be passed to the page component as props
    }
  }*/

  export async function getServerSideProps(context) {
    const cookies = nookies.get(context)
    const token = cookies.USER_TOKEN;
    const { githubUser } = jwt.decode(token);

    const isTrueUser = await fetch(`https://github.com/${githubUser}`)
    .then(async function(resposta) {
      if(resposta.status === 404) {
        return false
      }
      else {
        return true
      }
    })
    
    console.log(isTrueUser);

    if(!isTrueUser) {
      return {
        redirect: {
          destination: 'login',
          permanent: false,
        }
      }
    }
    /*const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
      headers: {
          Authorization: token
        }
    })*/
    /*.then((resposta) => resposta.json())
  
    if(!isAuthenticated) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
    }
  */

    return {
      props: {
        githubUser: githubUser,
        isAuthenticated: isTrueUser
      }, // will be passed to the page component as props
    }
  } 