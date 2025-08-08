import {number } from "@inquirer/prompts"
import chalk from "chalk"
import {obterNomeDoJogador} from './actions/obternome.js'
import {salvarSeForRecorde} from './actions/salvar.js'

export async function jogar() {
    try {
        const nome = await obterNomeDoJogador()
        if (!nome) return

        const numeroAleatorio = Math.floor(Math.random() * 101)
        let numeroTentativas = 7
        let tentativasFeitas = 0

        while (numeroTentativas > 0) {
            let palpite = await number({ message: chalk.bold.yellow("Digite um número de 0 a 100:") })  
            tentativasFeitas++

            if (palpite === numeroAleatorio) {
                console.log(chalk.bold.green(`\n🎉 Parabéns, você acertou! com ${tentativasFeitas} tentativas`))
                await salvarSeForRecorde(nome, tentativasFeitas)
                break
            } else if (palpite > numeroAleatorio) {
                console.log(chalk.bold.red("Muito alto!") + " " + chalk.italic.dim("Tente um número menor."))
            } else {
                console.log(chalk.bold.red("Muito baixo!") + " " + chalk.italic.dim("Tente um número maior."))
            }

            numeroTentativas--
        }

        if (numeroTentativas === 0) {
            console.log(chalk.bold.redBright(`\n💥 Tentativas acabaram! O número era ${numeroAleatorio}.`))
        }

    } catch {
        console.log(chalk.gray('Programa encerrado pelo usuário.'))
    }
}

