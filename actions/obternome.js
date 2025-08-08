import { select, input, confirm } from "@inquirer/prompts"
import chalk from "chalk"
import fs from "fs/promises"

const caminho = '../historico.json'

export async function obterNomeDoJogador() {
    let historico = []

    try {
        const conteudo = await fs.readFile(caminho, 'utf8')
        historico = JSON.parse(conteudo)
    } catch (err){
        console.log(chalk.gray("Nenhum histórico encontrado. Um novo será criado."))
    }

    let nome

    if (historico.length > 0) {
        const escolha = await select({
            message: chalk.cyan("Selecione seu nome ou crie um novo:"),
            choices: [
                ...historico.map(j => ({
                    name: `${j.nome} ${chalk.gray(`(recorde: ${j.tentativas} tentativa${j.tentativas > 1 ? 's' : ''})`)}`,
                    value: j.nome
                })),
                { name: chalk.gray("➕ Usar um novo nome"), value: "__novo" }
            ]
        })

        if (escolha === "__novo") {
            nome = await input({ message: chalk.yellow("Digite seu novo nome:") })

            const confirmar = await confirm({
                message: chalk.yellow(`Deseja mesmo criar um novo registro para "${nome}"?`)
            })

            if (!confirmar) {
                console.log(chalk.gray("Registro cancelado."))
                return null
            }
        } else {
            nome = escolha
        }
    } else {
        nome = await input({ message: chalk.yellow("Digite seu nome:") })
    }

    return nome
}