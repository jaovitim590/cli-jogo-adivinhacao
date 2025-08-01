import {number} from "@inquirer/prompts"

console.log("Boas vindas ao jogo de adivinhação!")

const numeroAleatorio = Math.floor(Math.random() * 101)
let numeroTentativas = 7

while (numeroTentativas > 0) {
    try{
        let palpite = await number({message:"Digite um número de 0 a 100"})

        if (palpite === numeroAleatorio) {
            console.log(`Parabéns, voce acertou! com ${numeroTentativas} chances restantes`)
            numeroTentativas = 0
            break
        } else if (palpite > numeroAleatorio) {
            console.log("Muito alto, tente um número menor")
            numeroTentativas--
        } else if (palpite < numeroAleatorio) {
            console.log("Muito baixo, tente um número maior")
            numeroTentativas--
        } else {
            console.log("Entrada não é um número válido")
        }
        if (numeroTentativas === 0) {
                console.log(`Tentativas acabaram, o número era ${numeroAleatorio}`)
                break
            }
    }catch (error){
          if (error.name === "ExitPromptError") {
      console.log("\nJogo encerrado pelo usuário (Ctrl+C).");
      process.exit(0);
    } else {
      console.error("Erro inesperado:", error);
      process.exit(1);
    }
    
    }
}

