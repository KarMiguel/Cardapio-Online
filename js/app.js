$(document).ready(function(){

    cardapio.eventos.init();

    

})

let cardapio = {};

let MEU_CARRINHO = [];
let MEU_ENDERECO = null;

let VALOR_CARRINHO = 0;
let VALOR_ENTREGA = 5;
let CELULAR_EMPRESA = '5538999661117'
let Troco = 'Sem Troco'
cardapio.eventos = {

    init:() =>{
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBtnReserva();
        cardapio.metodos.carregaBtnLigar();
    }

}

cardapio.metodos = {

    obterItensCardapio : (categoria = 'burgers' , vermais = false) => {
       
        let filtro = MENU[categoria]
        console.log(filtro);

        if(!vermais){
          $("#itensCardapio").html('');
          $('#btnVerMais').removeClass('hidden');
        }

        $.each(filtro,(i,e)=>{

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img).
            replace(/\${id}/g, e.id).
            replace(/\${name}/g, e.name).
            replace(/\${price}/g, e.price.toFixed(2).replace('.',','))

            if(vermais && i>=8 && i<12){ 
                $("#itensCardapio").append(temp);
            }
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp);
            }
        })
        $(".container-menu a").removeClass('active');
        $('#menu-'+categoria).addClass('active');
    },

    verMais: () =>{
        let ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo,true);

        $('#btnVerMais').addClass('hidden');
    },

    diminuirQtd : (id) =>{
        let qntdAtual = parseInt( $("#qntd-"+id).text() );

        if(qntdAtual>0){
            $("#qntd-"+id).text(qntdAtual-1); 
        }
    },
    aumentarQtd : (id) =>{
        let qntdAtual = parseInt( $("#qntd-"+id).text() );
         $("#qntd-"+id).text(qntdAtual+1);        
     },

    addCarrinho:(id) =>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
       
        if(qntdAtual>0){

            //obeter categoria active
            let categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem lista de itens
            let filtro = MENU[categoria];
            //obtem item
            let item = $.grep(filtro ,(e,i) => {return e.id === id} );

            if(item.length > 0){
                //valdar se existe no carrinho
                let existe = $.grep(MEU_CARRINHO ,(elem,index) => {return elem.id === id} );

                //caso ja existe so altera qtd
                if(existe.length > 0){
                    let ObjIndex = MEU_CARRINHO.findIndex((Obj => Obj.id === id));
                    MEU_CARRINHO[ObjIndex].qntd = MEU_CARRINHO[ObjIndex].qntd + qntdAtual;


                }else{ 
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }
                
                cardapio.metodos.mensagem('Item adicionado ao carrinho','green');
                $("#qntd-"+id).text(0);
               cardapio.metodos.atualizarBadgeTotal();
            }
        }
     },

     atualizarBadgeTotal: () =>{
        let total = 0;
        $.each(MEU_CARRINHO, (i,e) => {
            total += e.qntd;
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

     },

     mensagem : (texto, cor = 'red', tempo = 3500) =>{

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class= "toast animated fadeInDown ${cor}">${texto} </div>`

        $("#container-mensagens").append(msg);

        setTimeout(()=>{
            $("#msg-"+id).removeClass('fadeInDown');
            $("#msg-"+id).addClass('fadeOutUp');
            setTimeout(() =>{
                $("#msg-"+id).remove();
            },8000)
        },tempo)

    },


    abrirCarrinho:(abrir) =>{

        if(abrir){
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();

        }else{
            $("#modalCarrinho").addClass('hidden');            
        }
    },


    carregarEtapa:(etapa)=>{
        if(etapa == 1){
            $("#lblTituloEtapa").text('Seu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $('.etapa1').addClass('active');

            $('#btnEtapaPedido').removeClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnVoltar').addClass('hidden');

        }if(etapa == 2){

            $("#lblTituloEtapa").text('Endereço de Entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').removeClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnVoltar').removeClass('hidden');

        }if(etapa == 3){

            $("#lblTituloEtapa").text('Resumo do Pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');
            $('.etapa3').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').removeClass('hidden');
            $('#btnVoltar').removeClass('hidden');

        }
    },

    voltarEtapa:()=>{
        let etapa =  $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa-1);
    },

    carregarCarrinho : () =>{

        cardapio.metodos.carregarEtapa(1);
        if(MEU_CARRINHO.length > 0){

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i,e) => {  

                let templateCarrinho = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img).
                replace(/\${id}/g, e.id).
                replace(/\${qntd}/g, e.qntd).
                replace(/\${name}/g, e.name).
                replace(/\${price}/g, e.price.toFixed(2).replace('.',','))

                $("#itensCarrinho").append(templateCarrinho);

                if(MEU_CARRINHO.length == (i+1))
                    cardapio.metodos.carregarValores();

            })

        }else{
            $('#itensCarrinho').html('<p  class= "carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu Carrinho está vazio!</p>');
            cardapio.metodos.carregarValores();

        }

    },

    diminuirQtdCarrinho : (id) => {
        let qntdAtual = parseInt( $("#qntd-carrinho-"+id).text() );

        if(qntdAtual>1){
            $("#qntd-carrinho-"+id).text(qntdAtual-1);
            cardapio.metodos.atualizarCarrinho(id,qntdAtual - 1); 
        }else{
            cardapio.metodos.removerItemCarrinho(id);
        }
    },

    aumentarQtdCarrinho : (id) => {
        let qntdAtual = parseInt( $("#qntd-carrinho-"+id).text() );

        if(qntdAtual>0){
            $("#qntd-carrinho-"+id).text(qntdAtual + 1);
            cardapio.metodos.atualizarCarrinho(id,qntdAtual + 1); 
        }


    },

    removerItemCarrinho : (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e,i) => {return e.id != id});
        cardapio.metodos.carregarCarrinho();

        cardapio.metodos.atualizarBadgeTotal();

    },

    atualizarCarrinho : (id,qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id === id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.carregarValores();
    },

    carregarValores : () =>{
        VALOR_CARRINHO=0;

        $("#lblSubTotal").text('R$ 00,00');
        $("#lblValorEntrega").text(' + R$ 00,00');
        $("#lblValorTotal").text('R$ 00,00');
        $("#lblValorTotalTroco").text('R$ 00,00');

        $.each(MEU_CARRINHO, (i,e)=>{


            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i+1) == MEU_CARRINHO.length){
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblValorEntrega").text(`R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
                $("#lblValorTotalTroco").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);

       
            }
        })
        
    },

    carregarEndereco : () => {
        
        if(MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu Carrinho está Vazio!');
            return;
        }

        cardapio.metodos.carregarEtapa(2);
    },

    resumoPedido : ()=>{

        let cep = $("#textCEP").val().trim();
        let endereco =  $("#textEndereco").val().trim();
        let bairro =$("#textBairro").val().trim();
        let cidade= $("#textCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#textNumero").val().trim();
        let complemento = $("#textComplemento").val().trim();
        let pagamento = $("#pagamento").val().trim();


        if(cep.length <=0){
            cardapio.metodos.mensagem('Informe o CEP, Por favor!');
            $("#textCEP").focus();
            return;
        }

        if(endereco.length <=0){
            cardapio.metodos.mensagem('Informe o  Endereço, Por favor!');
            $("#textEndereco").focus();
            return;
        }
        if(bairro.length <=0){
            cardapio.metodos.mensagem('Informe o Bairro, Por favor!');
            $("#textBairro").focus();
            return;
        }
        if(cidade.length <=0){
            cardapio.metodos.mensagem('Informe a Cidade, Por favor!');
            $("#textCidade").focus();
            return;
        }  
        if(numero.length <=0){
            cardapio.metodos.mensagem('Informe o Numero, Por favor!');
            $("#textNumero").focus();
            return;
        } if(uf == "-1"){
            cardapio.metodos.mensagem('Informe a UF, Por favor!');
            $("#ddlUF").focus();
            return;
        }
        if(pagamento == "-1"){
            cardapio.metodos.mensagem('Informe a Forma de Pagamento, Por favor!');
            $("#pagamento").focus();
            return;
        }
  
            
       

        MEU_ENDERECO = {      
            cep : cep,
            endereco : endereco,
            bairro : bairro,
            cidade : cidade,
            uf : uf,
            numero :  numero, 
            complemento : complemento,
            pagamento : pagamento,


        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();  

   },
 
    buscarCEP :() =>{

        
        let cep = $("#textCEP").val().trim().replace(/\D/g,'');

        if(cep != ""){
            let validaCep = /^[0-9]{8}$/;
                if(validaCep.test(cep)){

                    $.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`,function(dados){

                        if(!("erro" in dados)){
                            
                            $("#textEndereco").val(dados.logradouro);
                            $("#textBairro").val(dados.bairro);
             
                            $("#textCidade").val(dados.localidade);
                            $("#ddlUF").val(dados.uf);
                            $("#textNumero").focus();

                        }else{
                            cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente!');
                            $("#textCEP").focus();
                        }
                    })

                }else{
                    cardapio.metodos.mensagem('Formato de CEP invalido');
                    $("#textCEP").focus();
                }

        }else{
            cardapio.metodos.mensagem('Informe o CEP, por favor');
            $("#textCEP").focus();
        }
    },

    carregarResumo : () =>{
        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i,e) => {  

            let templateResumo = cardapio.templates.itemResumo.replace(/\${img}/g, e.img).
            replace(/\${qntd}/g, e.qntd).
            replace(/\${name}/g, e.name).
            replace(/\${price}/g, e.price.toFixed(2).replace('.',','))

            $("#listaItensResumo").append(templateResumo);

        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}/ ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

        cardapio.metodos.finaizarPedido();
    },

    finaizarPedido:() =>{

        //https://wa.me/5538999661117?text=Ola
        if(MEU_CARRINHO.length >0 && MEU_ENDERECO != null){

            let texto = `Olá Gostaria de fazer um pedido:\n`;
            texto += `\n *Itens do Pedido:*\n\n\${itens}`;
            texto += `\n*Endereço de Entrega:*`;
            texto += `\n${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}  ${MEU_ENDERECO.complemento}`;
            texto += `\n\nForma de Pagamento : ${MEU_ENDERECO.pagamento} `
            texto += `\nTempo de entrega: *entre de 40~70min*`
            texto += `\n\n *Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.' , ',')}*`
        
            let itens = ''
            $.each(MEU_CARRINHO, (i,e) =>{
                itens += `*${e.qntd}x - ${e.name}..........R${e.price.toFixed(2).replace('.' , ',')}*\n`

                if((i+1) == MEU_CARRINHO.length){
                    
                    texto = texto.replace(/\${itens}/g,itens)

                    console.log(texto)
                    
                    let encode = encodeURI(texto);

                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode} `

                    $("#btnEtapaResumo").attr('href',URL)
                }
            })
        
        }
    },

    carregarBtnReserva :() =>{

        let texto=  "Olá, gostaria de fazer uma *reserva*.";
        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode} `;

        $("#btnReserva").attr('href',URL)

    },

    carregaBtnLigar : () =>{
        $("#btnLigar").attr('href',`tel:${CELULAR_EMPRESA}`);
    },

    abrirDepoimento : (depoimento) => {
        
        $("#depoimento-1").addClass('hidden')
        $("#depoimento-2").addClass('hidden')
        $("#depoimento-3").addClass('hidden')

        $("#btnDepoimento-1").removeClass('active')
        $("#btnDepoimento-2").removeClass('active')
        $("#btnDepoimento-3").removeClass('active')

        $("#depoimento-"+depoimento).removeClass('hidden')
        $("#btnDepoimento-"+depoimento).addClass('active')


    }

}

cardapio.templates  = {

    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-4 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4" >
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center" >
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQtd('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQtd('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick ="cardapio.metodos.addCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
        `,

    itemCarrinho: `  
        <div class="col-12 item-carrinho ">
            <div class="img-produto">
                <img src="\${img}"/>
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQtdCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQtdCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick ="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
         </div>
    `,
    itemResumo : `
        <div class="item-carrinho resumo col-12">
            <div class="img-produto">
                <img src="\${img}" alt="">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo"><b>
                  \${name}
                </b></p>
                <p class="price-produto-resumo"><b>
                \${price}
                </b></p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>

            </div>
        
    `
}
