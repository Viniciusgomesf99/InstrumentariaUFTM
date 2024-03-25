document.addEventListener('DOMContentLoaded', function() {
    const instrumentos = [
        "Cabo de bisturi n-3",
        "Cabo de bisturi n-4",
        "Tesoura de Metzenbaum",
        "Tesoura de Mayo",
        "Porta Agulhas de Mathieu",
        "Porta Agulhas de Hegar",
        "Pinca Anatomica",
        "Pinca Anatomica Dente de Rato",
        "Pinca de Adson",
        "Pinca de Injecao",
        "Afastador dinamico de Doyen",
        "Afastador dinamico de Farabeuf",
        "Afastador auto-estatico de Finochietto",
        "Afastador auto-estatico de Gosset",
        "Afastador auto-estatico de Weitlaner",
        "Pinca de Allis",
        "Pinca de Babacock",
        "Pinca de Abadie",
        "Clamp Intestinal",
        "Pinca de Duval",
        "Pinca de Collins",
        "Pinca de Backhaus",
        "Pinca de Cheron",
        "Pinca de Pean Murphy",
        "Tentacanula",
        "Cuba Rim",
        "Cupula",
        "Pinca Mixter",
        "Pinca Crile",
        "Pinca Halstead ou Mosquito",
        "Pinca Kocher Reto",
        "Pinca Kelly",
        "Pinca Rochester",
        "Pinca Buldogue",
        "Pinca Satinsky"
    ];

    let instrumentosRestantes = [...instrumentos];
    let totalScore = 0;
    let attemptCount = 0;
    let nextQuestionTimer; // Variável para armazenar o timer

    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const errorMessage = document.getElementById('error-message');
    const correctAnswerInfo = document.getElementById('correct-answer-info');
    const nextQuestionButton = document.getElementById('next-question');
    const restartQuizButton = document.getElementById('restart-quiz');
    const scoreDisplay = document.getElementById('score');
    const nextQuestionTimerDisplay = document.getElementById('next-question-timer'); // Elemento para exibir o contador

    function gerarQuestao() {
        if (instrumentosRestantes.length === 0) {
            showFinalScore();
            return null;
        }

        // Escolhendo a resposta correta aleatoriamente
        const indexCorreto = Math.floor(Math.random() * instrumentosRestantes.length);
        const respostaCorreta = instrumentosRestantes.splice(indexCorreto, 1)[0];
        
        // Recriando o array de instrumentosRestantes sem a resposta correta para esta pergunta
        let opcoesTemporarias = [...instrumentos].filter(item => item !== respostaCorreta);
        
        // Escolhendo 3 opções incorretas
        let opcoesIncorretas = [];
        for (let i = 0; i < 3; i++) {
            const indexIncorreto = Math.floor(Math.random() * opcoesTemporarias.length);
            opcoesIncorretas.push(opcoesTemporarias.splice(indexIncorreto, 1)[0]);
        }
        
        // Criando a questão
        return {
            question: "Qual é o instrumento cirúrgico mostrado na imagem?",
            options: [...opcoesIncorretas, respostaCorreta].sort(() => Math.random() - 0.5),
            correctAnswer: respostaCorreta,
            image: `https://raw.githubusercontent.com/Viniciusgomesf99/InstrumentariaUFTM/master/assets/${respostaCorreta.replace(/[\sº]/g, '-').replace(/[^a-z0-9\-]/gi, '')}.png`
        };
    }
    
    function loadQuestion() {
        if (instrumentosRestantes.length > 0) {
            let currentQuestion = gerarQuestao();
            questionText.textContent = currentQuestion.question;
            optionsList.innerHTML = '';
    
            // Define o caminho da imagem correspondente à resposta correta
            const correctAnswerImageSrc = currentQuestion.image;
            document.getElementById('question-image').src = correctAnswerImageSrc;
    
            currentQuestion.options.forEach(option => {
                const li = document.createElement('li');
                li.textContent = option;
                li.onclick = () => selectOption(li, currentQuestion.correctAnswer);
                optionsList.appendChild(li);
            });
            // Garante que o botão de confirmar e a mensagem de erro sejam escondidos ao carregar uma nova pergunta
            errorMessage.style.visibility = 'hidden';
        } else {
            showFinalScore();
        }
    }

    function loadNextQuestion() {
        correctAnswerInfo.style.display = 'none';
        // Reseta o estilo e ação dos elementos 'li' para a próxima questão
        resetOptionsStyleAndAction();
        loadQuestion(); // Carrega a próxima questão
        nextQuestionTimerDisplay.textContent = '';
        clearTimeout(nextQuestionTimer); // Limpa o timer anterior
    }

    function selectOption(selectedOption, correctAnswer) {
        // Impede múltiplos cliques na mesma opção
        // Reativa a seleção de opções
        selectedOption.style.pointerEvents = 'auto';
        // Incrementa o contador de tentativas
        attemptCount++;
        // Chama a função para confirmar a resposta
        confirmAnswer(selectedOption, correctAnswer);
    }

    function confirmAnswer(selectedOption, correctAnswer) {
        if (selectedOption.textContent === correctAnswer) {
            // Calcula os pontos com base no número de tentativas
            let pointsEarned = 5 - attemptCount;
            if (pointsEarned < 1) {
                pointsEarned = 1; // Pontuação mínima é 1 ponto
            }
            totalScore += pointsEarned;
            document.getElementById('score').textContent = `${totalScore}`;

            // Configura a exibição das informações da resposta correta
            optionsList.querySelectorAll('li').forEach(li => {
                if (li.textContent === correctAnswer) {
                    li.style.backgroundColor = "#4CAF50"; // Verde para a resposta correta
                    li.style.color = "white";
                } else {
                    // Garante que as opções incorretas não sejam destacadas
                    li.style.backgroundColor = ""; 
                    li.style.color = "";
                }
            });

            let count = 2; // Inicia o contador em 2 segundos
            nextQuestionTimerDisplay.textContent = `Próxima pergunta em ${count} segundos`;
            nextQuestionTimer = setInterval(() => {
            count--; // Decrementa o contador a cada segundo
            nextQuestionTimerDisplay.textContent = `Próxima pergunta em ${count} segundos`;
            if (count === 0) {
                clearInterval(nextQuestionTimer); // Para o contador quando atingir 0
                loadNextQuestion(); // Carrega a próxima pergunta
            }
        }, 1000); // Atualiza o contador a cada 1000 milissegundos (1 segundo)

            // Aguarda 2 segundos antes de carregar a próxima pergunta
            setTimeout(function() {
                loadNextQuestion();
            }, 2000);
        } else {
            // Destaca a opção incorreta selecionada em vermelho
            selectedOption.style.backgroundColor = "#f44336"; // Vermelho para resposta incorreta
            selectedOption.style.color = "white";
        }
    }

    function resetOptionsStyleAndAction() {
        // Reseta o estilo das opções para o estado original
        optionsList.querySelectorAll('li').forEach(li => {
            li.style.backgroundColor = "";
            li.style.color = "";
            // Reativa a seleção de opções
            li.style.pointerEvents = 'auto';
        });
        // Reseta o contador de tentativas
        attemptCount = 0;
    }
    
    function     showFinalScore() {
        correctAnswerInfo.style.display = 'none';
        optionsList.innerHTML = ''; // Limpa as opções
        questionText.textContent = "Quiz finalizado! Sua pontuação final é: " + totalScore + ".";
        nextQuestionButton.style.display = 'none'; // Esconde o botão de próxima pergunta
        restartQuizButton.style.display = 'inline-block'; // Mostra o botão de refazer
    }
    
    restartQuizButton.addEventListener('click', function() {
        instrumentosRestantes = [...instrumentos]; // Restaura a lista de instrumentos para o estado inicial
        totalScore = 0; // Reseta a pontuação
        scoreDisplay.textContent = 'Pontuação: 0'; // Reseta a exibição da pontuação
        loadQuestion(); // Carrega a primeira questão novamente
        restartQuizButton.style.display = 'none'; // Esconde o botão de refazer
        correctAnswerInfo.style.display = 'none'; // Garante que a tela de informação esteja escondida
    });
        
    // Carrega a primeira pergunta ao iniciar
    loadQuestion();
});

    // window.addEventListener('beforeunload', function (e) {
    //     // Cancela o evento de fechar a janela
    //     e.preventDefault();
    //     // Define a mensagem que será exibida ao usuário
    //     e.returnValue = '';
    // });
    