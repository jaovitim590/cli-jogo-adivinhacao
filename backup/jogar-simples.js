import { number, input } from "@inquirer/prompts"
import chalk from "chalk"
import fs from "fs/promises"

const caminho = './historico.json'

async function salvarSeForRecorde(nome, tentativas) {
    let historico = []

    try {
        const conteudo = await fs.readFile(caminho, 'utf8')
        historico = JSON.parse(conteudo)
    } catch {

    }

    const recordeAtual = historico.find((jogador) => jogador.nome === nome)

    if (!recordeAtual || tentativas < recordeAtual.tentativas) {
        const novoRegistro = {
            nome: nome,
            data: new Date().toISOString(),
            tentativas: tentativas
        }


        const novoHistorico = historico.filter((j) => j.nome !== nome)
        novoHistorico.push(novoRegistro)

        await fs.writeFile(caminho, JSON.stringify(novoHistorico, null, 2))
        console.log(chalk.green("🏆 Novo recorde registrado!"))
    } else {
        console.log(chalk.yellow("Você acertou, mas não bateu seu recorde."))
    }
}

export async function jogar() {
    try {
        const nome = await input({ message: chalk.cyan("Digite seu nome:") })
        const numeroAleatorio = Math.floor(Math.random() * 101)
        let numeroTentativas = 7
        let tentativasFeitas = 0

        while (numeroTentativas > 0) {
            let palpite = await number({ message: chalk.yellow("Digite um número de 0 a 100") })  
            tentativasFeitas++

            if (palpite === numeroAleatorio) {
                console.log(chalk.green("Parabéns, você acertou!"))
                await salvarSeForRecorde(nome, tentativasFeitas)
                break
            } else if (palpite > numeroAleatorio) {
                console.log(chalk.blue("Muito alto,") + chalk.magenta(" tente um número") + chalk.cyan(" menor"))
            } else {
                console.log(chalk.blue("Muito baixo,") + chalk.magenta(" tente um número") + chalk.cyan(" maior"))
            }

            numeroTentativas--
        }

        if (numeroTentativas === 0) {
            console.log(`Tentativas acabaram, o número era ${numeroAleatorio}`)
        }

    } catch {
        console.log('Programa encerrado pelo usuário.')
    }
}

jogar()