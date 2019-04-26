
// Initialize materialize css && menu responsive
$(document).ready(function(){
    $('.sidenav').sidenav();
});

$(document).ready(function(){
    $('.scrollspy').scrollSpy();
});


//Get total de pesonagens da marvel
const publicKey = '9dd6620dbac417d4b44acb4c86c13e6b';
const privateKey = 'd3c431c9986abeba4d52e5243ddeafbed1344a4e';
const ts = Math.random();
let hash = md5(ts+privateKey+publicKey); 


let totalHeroes = 0;
let dados = [];
let offsetHeroes = 0;

let principais = $("#barPrincipais");

function GetTotalCharactersMarvel()
{

    $.ajax({
        url:'https://gateway.marvel.com:443/v1/public/characters',
        type: 'GET',
        data:{
            "apikey": publicKey,
            "hash" : hash, // Hash do timeStamp + privatekey + pulicKey
            "ts": ts, //TimeStamp definido como um numero aleatório
            "limit": 100,
        },
        dataType: 'json',
        success: function(response){
            
            //Get dos 100 primerios dados.
            for(data of response.data.results){
                dados.push(data);
            }
            
            offsetHeroes = response.data.limit;
            totalHeroes = response.data.total;
            $("#total").text(totalHeroes);
            PrincipalHeroes();
        }
    });
    
}


function PrincipalHeroes(){
    $.ajax({
        url:'https://gateway.marvel.com:443/v1/public/characters',
        type: 'GET',
        data:{
            "apikey": publicKey,
            "hash" : hash, // Hash do timeStamp + privatekey + pulicKey
            "ts": ts, //TimeStamp definido como um numero aleatório
            "offset": offsetHeroes, //Faz o request no ultimo + 1 de onde parou
            "limit": 100,
        },
        dataType: 'json',
        success: function(response){
            
            for(data of response.data.results){
                dados.push(data);
            }
            
            offsetHeroes = offsetHeroes + response.data.limit;
            if(offsetHeroes < totalHeroes){
                PrincipalHeroes();
            } else {
                montaGrafico();
            }
            
        }
    });
}

function montaGrafico(){
    $('#load').hide();
    principais.removeAttr('style');

    //Calcula os mais
    console.log(dados);
    dados = dados.sort(function(a, b){
        if(a.comics.available > b.comics.available){
            return 1;
        }
        if(a.comics.available < b.comics.available){
            return -1;
        }

        return 0;
    }); 
    dados = dados.reverse();
    console.log(dados);

    let processaDados = [];

    let tbody = $("#table").find("tbody");
    let td = '';
    
    for(data of dados){
        td += '<tr>' + 
        '<td>'+data.name+'</td>' + 
        '<td>'+data.comics.available+'</td>' + 
        '<td>'+data.stories.available+'</td>' + 
        '<td>'+data.events.available+'</td>'
        '</tr>'; 
    }

    //Monta Table
    tbody.html(td);
    $('#table').DataTable();

    let heros = [];
    let comics = [];
    for(let i =0; i<3;i++){
        heros[i] = dados[i].name;
        comics[i] = dados[i].comics.available;
    }
    
    //Monta o gráfico
    var grafico = new Chart(principais, {
        type: 'pie',
        data:{
            labels: heros,
            datasets: [{
                data: comics,
                backgroundColor:['#ee6e73', '#3498db', '#8e44ad'],
                label: "Herói:Comics"
            }]
        }
        
    })
}

GetTotalCharactersMarvel();
//PrincipalHeroes();