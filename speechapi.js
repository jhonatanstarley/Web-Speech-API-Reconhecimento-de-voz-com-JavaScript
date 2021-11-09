// Fazemos que o código só funcione apos o carregamento completo da pagina
window.addEventListener('DOMContentLoaded', function(){
  // Instanciamos o nosso botão
  var btn_gravacao = document.querySelector('#btn_gravar_audio');
  // Crio a variavel que armazenará a transcrição do audio
  var transcricao_audio =  '';
  // Seto o valor false para a variavel esta_gravando para fazermos a validação se iniciou a gravação
  var esta_gravando = false;
  // Verificamos se o navegador tem suporte ao Speech API
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    // Como não sabemos qual biblioteca usada pelo navegador 
    // Atribuimos a api retornada pelo navegador
    var speech_api = window.SpeechRecognition || window.webkitSpeechRecognition;
    // Criamos um novo objeto com a API Speech
    const recebe_audio = new speech_api();
    // Defino se a gravação sera continua ou não
    // Caso deixamos ela definida como false a gravação tera um tempo estimado 
    // de 4 a 5 segundos
    recebe_audio.continuous = true;
	
	// Frase para iniciar o processamento principal
	//recebe_audio.startphrase = 'Ei web';
	
    // Especifico se o resultado final pode ser alterado ou não pela compreenção da api
    recebe_audio.interimResults = true;
    // Especifico o idioma utilizado pelo usuario
    recebe_audio.lang = "pt-BR";
	qtStart = 0;
	//recebe_audio.start();
	
    // Uso o metodo onstart para setar a minha variavel esta_gravando como true
    // e modificar o texto do botão
    recebe_audio.onstart = function(){
		qtStart = qtStart + 1;
		console.log(qtStart);
	  if(document.querySelector('p#error') == null){
		esta_gravando = true;
		// alert('Atenção!\n\nPara cada nova transcrição de um cliente diferente, atualize a página!')
		btn_gravacao.innerHTML = 'Parar Transcrição!';
		document.getElementById('btn_gravar_audio').className = "btn btn-lg btn-danger btn-lg pull-right"; 
	  }else{
		esta_gravando = true;
		// alert('Atenção!\n\nPara cada nova transcrição de um cliente diferente, atualize a página!')
		btn_gravacao.innerHTML = 'Parar Transcrição!';
		document.getElementById('btn_gravar_audio').className = "btn btn-lg btn-danger btn-lg pull-right"; 
		document.querySelector('p#error').remove();
	  }
    };
    // Uso o metodo onend para setar a minha variavel esta_gravando como false
    // e modificar o texto do botão
    recebe_audio.onend = function(){
	    esta_gravando = false;
		btn_gravacao.innerHTML = 'Iniciar Transcrição';
		document.getElementById('btn_gravar_audio').className = "btn btn-lg btn-success btn-lg pull-right";
    };

    recebe_audio.onerror = function(event){
	  //alert(event.error + '\n\nTenha certeza que está recebendo o áudio.\nClique em "Inciar Transcrição!" Novamente!');
      console.log(event.error);
	  var dsErro = event.error ;
	  var dsAlert = dsErro == "aborted" ? 'A entrada de fala foi abortada de alguma forma, talvez por algum comportamento específico do usuário-agente, como a INTERFACE DO USUÁRIO, que permite que o usuário cancele a entrada da fala.' : dsErro == "audio-capture" ? 'Falha na captura de áudio.' : dsErro == "network" ? 'Alguma comunicação de rede necessária para completar o reconhecimento falhou.' : dsErro == "not-allowed" ? 'O agente do usuário não está permitindo que qualquer entrada de fala ocorra por razões de segurança, privacidade ou preferência do usuário.' : dsErro == "service-not-allowed" ? 'O agente do usuário não está permitindo que o serviço de fala solicitado pelo aplicativo web, mas permitiria que algum serviço de fala, fosse usado ou porque o agente do usuário não suporta o selecionado ou por razões de segurança, privacidade ou preferência do usuário.' : dsErro == "bad-grammar" ? 'Houve um erro na gramática de reconhecimento de fala ou tags semânticas, ou o formato de gramática ou formato de tag semântica não é suportado.' : dsErro == "language-not-supported" ? 'A linguagem não  suportada.' : ""; //(A tratativa desse erro está sendo clicar no botão novamente para iniciar automáticamente a captura do áudio)dsErro == "no-speech" ? 'O usuário não está permitindo que qualquer entrada de fala ocorra por razões de segurança, privacidade ou preferência do usuário.\nPara continuar conceda a permissão!' : 
	  if(dsAlert != ""){
		  alert(dsAlert);
	  }else{
		  console.log(dsAlert);
	  }
	  if(event.error == 'not-allowed'){
		if(document.querySelector('p#error') == null){
			$('label#meu_campo').append('<p id="error" style="color:red;text-align:center"><b>Você deve permitir o áudio!</b></p>')
		}else{
			console.log(event.error);
		}
	  }else{
		  setTimeout(function() {
		  //A API tem tempo limite de 18 segundos para receber o áudio antes que dê erro de no-speech que é
		  //sem recebimento de áudio para transcrição. Essa função de setTimeout faz com que ela clique 
		  //reduzindo o tempo de re-clique  no botão.
		  document.querySelector('button').click();
		  }, 0500)
	  }
	};
    
    // Com o metodo onresult posso capturar a transcrição do resultado 
    recebe_audio.onresult = function(event){
      // Defino a minha variavel interim_transcript como vazia
		var interim_transcript = '';
		// Utilizo o for para contatenar os resultados da transcrição 
		for(var i = event.resultIndex; i < event.results.length; i++){
			// verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
			if(event.results[i].isFinal){
				// Contateno o resultado final da transcrição
				transcricao_audio += event.results[i][0].transcript;
			}else{
				// caso ainda não seja o resultado final vou contatenado os resultados obtidos
				interim_transcript += event.results[i][0].transcript;
			}
			// Verifico qual das variaveis não esta vazia e atribuo ela no variavel resultado
			var resultado = transcricao_audio || interim_transcript;
			// Escrevo o resultado no campo da textarea
			document.getElementById('campo_texto').innerHTML = resultado;
			document.querySelector('#meu_campo').innerHTML = ""
			document.querySelector('#meu_campo').innerHTML = "TRANSCRIÇÃO DO AUDIO" + " - " + resultado.length + " caracteres."
		}	
    };
    // Capturamos a ação do click no botão e iniciamos a gravação ou a paramos
    // dependendo da variavel de controle esta_gravando
    btn_gravacao.addEventListener('click', function(e){
      // Verifico se esta gravando ou não
      if(esta_gravando){
        // Se estiver gravando mando parar a gravação
        recebe_audio.stop();
        // Dou um retun para sair da função
        return;
      }
      // Caso não esteja capturando o audio inicio a transcrição
      recebe_audio.start();
    }, false);

  }else{
    // Caso não o navegador não apresente suporte ao Speech API apresentamos a seguinte mensagem
    console.log('navegador não apresenta suporte a web speech api');
    alert('Este navegador não apresenta suporte ao Web Speech API ainda');
  }

}, false);



//Função para habilitar a gravação do áudio
//E ter o áudio como retorno num arquivo
//Para habilitar remova a marcação de comentário!

//$(function(){
//			
//	//var check_yes = document.getElementById('yes');
//	//			
//	//		check = check_yes.onchange = function(){
//	//			var check
//	//			if(check_yes.checked){
//	//				check = "Sim";
//	//			}else{
//	//				check = "Não";
//	//			}
//	//		}		
//	//if (check = "Sim"){	
//	let mediaRecorder
//
//	navigator
//		.mediaDevices
//		.getUserMedia({ audio: true})
//		.then( stream => {
//			mediaRecorder = new MediaRecorder(stream)
//			let chunks = []
//			mediaRecorder.ondataavailable = data =>{
//				chunks.push(data.data)
//			}
//			//A função abaixo quando habilitada grava um áudio novo toda vez que clicar em Iniciar Gravação.
//			//Se comentar ela, o sistema irá gerar um arquivo como se você estivesse pausando e continuando a gravação
//			//Como se fosse uma continuidade da gravação anterior. O Buffer aumentará gradualmente com as gravações.
//			mediaRecorder.onstart = () => {
//					    chunks = []
//					    console.log(chunks, stream)
//					}
//			
//			mediaRecorder.onstop = () => {
//				const blob = new Blob(chunks, { type: 'audio/ogg; code=opus' })
//				const reader = new window.FileReader()
//				reader.readAsDataURL(blob)
//				reader.onloadend = () => {
//					const audio = document.createElement('audio')
//					console.log(reader.result)
//					audio.src = reader.result
//					audio.controls = true
//					document.querySelector('#audio').innerHTML = ""
//					$('#audio').append(audio)
//					document.querySelector('#campo_base64').value = ""
//					document.querySelector('#campo_base').innerHTML = document.querySelector('#campo_base').innerHTML + " - " + reader.result.length + " caracteres."
//					document.querySelector('#campo_base64').value = reader.result
//				}
//			}
//		}, err => {
//			$('label#meu_campo').append('<p style="color:red;text-align:center"><b>Você deve permitir o áudio!</b></p>')
//		})
//		$('#btn_gravar_audio').click(function(){
//			if($(this).text() === 'Iniciar Transcrição') {
//				mediaRecorder.start()
//				$(this).text('Parar Transcrição!')
//			}else{
//				mediaRecorder.stop()
//				$(this).text('Iniciar Transcrição')
//			}
//		})
//	//}else{
//	//Alert('Caso deseje obter a gravação/nAtualize a págine e marque "Sim"!')
//	//}
//})

