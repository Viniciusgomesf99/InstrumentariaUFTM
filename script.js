document.addEventListener('DOMContentLoaded', function() {
    const instrumentos = [
        "Cabo de bisturi n-3",
        "Cabo de bisturi n-4",
        "Tesoura de Metzenbaum",
        "Tesoura de Mayo",
        "Porta-agulhas de Mathieu",
        "Porta-agulhas de Hegar",
        "Pinca anatomica",
        "Pinca anatomica dente de rato",
        "Pinca de Adson",
        "Pinca de injecao",
        "Afastador dinamico de Doyen",
        "Afastador dinamico de Farabeuf",
        "Afastador auto-estatico de Finochietto",
        "Afastador auto-estatico de Gosset",
        "Afastador auto-estatico de Weitlaner",
        "Pinca de Allis",
        "Pinca de Babacock",
        "Pinca de Abadie",
        "Clamp intestinal",
        "Pinca de Duval",
        "Pinca de Collins",
        "Pinca de Backhaus",
        "Pinca de Cheron",
        "Pinca de Pean Murphy",
        "Tentacanula",
        "Cuba rim",
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

    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const errorMessage = document.getElementById('error-message');
    const correctAnswerInfo = document.getElementById('correct-answer-info');
    const infoTitle = document.getElementById('info-title');
    const nextQuestionButton = document.getElementById('next-question');
    const confirmButton = document.getElementById('confirm-answer');
    const restartQuizButton = document.getElementById('restart-quiz');
    const scoreDisplay = document.getElementById('score');

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
                li.onclick = () => selectOption(option, currentQuestion.correctAnswer);
                optionsList.appendChild(li);
            });
            // Garante que o botão de confirmar e a mensagem de erro sejam escondidos ao carregar uma nova pergunta
            confirmButton.style.display = 'none';
            errorMessage.style.display = 'none';
        } else {
            showFinalScore();
        }
    }

    function selectOption(selectedOption, correctAnswer) {
        // Reativa o botão de confirmar para a nova seleção
        confirmButton.style.display = 'inline-block';
        errorMessage.style.display = 'none'; // Esconde a mensagem de erro sempre que uma nova opção é selecionada
    
        confirmButton.onclick = () => {
            // Impede múltiplos cliques no botão de confirmar
            confirmButton.style.display = 'none';
            confirmAnswer(selectedOption, correctAnswer);
        };
    }

    function confirmAnswer(selectedOption, correctAnswer) {
        if (selectedOption === correctAnswer) {
            // Incrementa o contador de tentativas antes de calcular os pontos
            attemptCount++;
            
            // Calcula os pontos com base no número de tentativas
            let pointsEarned = Math.max(5 - attemptCount, 1);
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
    
            // Exibe informações sobre a resposta correta
            infoTitle.textContent = selectedOption; 
            correctAnswerInfo.style.display = 'block';
    
            // Prepara a UI para a próxima questão
            nextQuestionButton.style.display = 'inline-block';
            nextQuestionButton.onclick = () => {
                correctAnswerInfo.style.display = 'none';
                nextQuestionButton.style.display = 'none';
                // Reseta o estilo e ação dos elementos 'li' para a próxima questão
                resetOptionsStyleAndAction();
                loadQuestion(); // Carrega a próxima questão
            };
        } else {
            attemptCount++;
            errorMessage.textContent = "Errado! Tente novamente.";
            errorMessage.style.display = 'block';
    
            // Destaca a opção incorreta selecionada em vermelho
            optionsList.querySelectorAll('li').forEach(li => {
                if (li.textContent === selectedOption) {
                    li.style.backgroundColor = "#f44336"; // Vermelho para resposta incorreta
                    li.style.color = "white";
                }
            });
    
            // Reativa a seleção de opções para permitir outra tentativa
            // Mas remove a interação da opção já selecionada
            optionsList.querySelectorAll('li').forEach(li => {
                if (li.textContent !== selectedOption) {
                    li.onclick = () => selectOption(li.textContent, correctAnswer);
                } else {
                    li.onclick = null; // Remove a ação da opção incorreta selecionada
                }
            });
        }
    }

    function resetOptionsStyleAndAction() {
        optionsList.querySelectorAll('li').forEach(li => {
            // Reseta o estilo das opções para o estado original
            li.style.backgroundColor = "";
            li.style.color = "";
            // Reativa a seleção de opções
            li.onclick = () => selectOption(li.textContent, questions[currentQuestionIndex].correctAnswer);
        });
        // Reseta o contador de tentativas para a próxima pergunta
        attemptCount = 0;
    }

    function showFinalScore() {
        correctAnswerInfo.style.display = 'none';
        optionsList.innerHTML = ''; // Limpa as opções
        questionText.textContent = "Quiz finalizado! Sua pontuação final é: " + totalScore + ".";
        nextQuestionButton.style.display = 'none'; // Esconde o botão de próxima pergunta
        confirmButton.style.display = 'none'; // Esconde o botão de confirmar
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