var numeros = [];

var executando = false;
var pausado = false;
var cancelar = false;

var input = document.getElementById("numeros");
var grafico = document.getElementById("grafico");
var passo = document.getElementById("passo");
var resultado = document.getElementById("resultado");

var btnComecar = document.getElementById("btnComecar");
var btnGerar = document.getElementById("btnGerar");
var btnParar = document.getElementById("btnParar");
var btnLimpar = document.getElementById("btnLimpar");


// Mostra as barras no gráfico
function mostrarGrafico(pos1, pos2, quantidadeOrdenada) {

    grafico.innerHTML = "";

    for (var i = 0; i < numeros.length; i++) {

        var barra = document.createElement("div");

        barra.className = "barra";

        barra.style.height = (numeros[i] * 2 + 30) + "px";

        barra.innerHTML = numeros[i];


        // Mostra quais números estão sendo comparados
        if (i == pos1 || i == pos2) {
            barra.classList.add("comparando");
        }


        // Mostra os números que já estão no lugar
        if (i >= numeros.length - quantidadeOrdenada) {
            barra.classList.remove("comparando");
            barra.classList.add("ordenado");
        }


        grafico.appendChild(barra);
    }
}


// Espera alguns milissegundos
function esperar(tempo) {

    return new Promise(function(resolve) {

        setTimeout(resolve, tempo);

    });
}


// Espera enquanto estiver pausado
async function verificarPausa() {

    while (pausado && !cancelar) {

        await esperar(100);

    }

}


// Bubble Sort
async function bubbleSort() {

    if (executando) {
        return;
    }

    if (numeros.length < 2) {

        alert("Digite pelo menos 2 números!");

        return;
    }


    executando = true;
    cancelar = false;
    pausado = false;

    btnComecar.disabled = true;
    btnGerar.disabled = true;

    btnParar.innerHTML = "Pausar";


    for (var i = 0; i < numeros.length - 1; i++) {

        for (var j = 0; j < numeros.length - 1 - i; j++) {

            // Verifica se o usuário cancelou
            if (cancelar) {

                executando = false;

                return;
            }


            // Verifica se está pausado
            await verificarPausa();


            if (cancelar) {

                executando = false;

                return;
            }


            // Mostra a comparação
            mostrarGrafico(j, j + 1, i);

            passo.innerHTML =
                "Comparando " +
                numeros[j] +
                " com " +
                numeros[j + 1];

            await esperar(600);


            // Verifica novamente
            await verificarPausa();

            if (cancelar) {

                executando = false;

                return;
            }


            // Se o primeiro for maior, troca
            if (numeros[j] > numeros[j + 1]) {

                passo.innerHTML =
                    numeros[j] +
                    " é maior que " +
                    numeros[j + 1] +
                    " → trocando";

                await esperar(500);


                var aux = numeros[j];

                numeros[j] = numeros[j + 1];

                numeros[j + 1] = aux;


                // Mostra o resultado da troca
                mostrarGrafico(-1, -1, i);

                await esperar(500);

            } else {

                passo.innerHTML =
                    numeros[j] +
                    " é menor que " +
                    numeros[j + 1] +
                    " → não troca";

                await esperar(500);
            }
        }
    }


    // Mostra tudo verde no final
    mostrarGrafico(-1, -1, numeros.length);

    passo.innerHTML = "Ordenação terminada!";

    resultado.innerHTML = numeros.join(", ");


    executando = false;

    btnComecar.disabled = false;
    btnGerar.disabled = false;

    btnParar.innerHTML = "Pausar";
}


// Botão começar
btnComecar.onclick = function() {

    if (executando) {
        return;
    }


    if (input.value.trim() == "") {

        alert("Digite os números!");

        return;
    }


    var valores = input.value.split(",");

    numeros = [];


    for (var i = 0; i < valores.length; i++) {

        var numero = Number(valores[i].trim());


        if (isNaN(numero)) {

            alert("Digite apenas números separados por vírgula!");

            return;
        }


        numeros.push(numero);
    }


    if (numeros.length < 2) {

        alert("Digite pelo menos 2 números!");

        return;
    }


    resultado.innerHTML = "-";

    passo.innerHTML = "Começando a ordenação...";

    mostrarGrafico(-1, -1, 0);

    bubbleSort();
};


// Gerar números aleatórios
btnGerar.onclick = function() {

    if (executando) {
        return;
    }


    numeros = [];


    for (var i = 0; i < 10; i++) {

        var numero = Math.floor(Math.random() * 100) + 1;

        numeros.push(numero);
    }


    input.value = numeros.join(", ");

    resultado.innerHTML = "-";

    passo.innerHTML =
        "Números gerados. Clique em começar.";


    mostrarGrafico(-1, -1, 0);
};


// Pausar
btnParar.onclick = function() {

    if (!executando) {
        return;
    }


    pausado = !pausado;


    if (pausado) {

        btnParar.innerHTML = "Continuar";

        passo.innerHTML = "Ordenação pausada.";

    } else {

        btnParar.innerHTML = "Pausar";

        passo.innerHTML = "Continuando...";

    }
};


// Limpar
btnLimpar.onclick = function() {

    // Cancela completamente a ordenação
    cancelar = true;

    executando = false;
    pausado = false;

    numeros = [];


    input.value = "";

    grafico.innerHTML = "";

    resultado.innerHTML = "-";

    passo.innerHTML =
        "Digite os números e clique em começar.";


    btnComecar.disabled = false;
    btnGerar.disabled = false;

    btnParar.innerHTML = "Pausar";
};