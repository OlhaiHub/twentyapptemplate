Application Steps
Objetivo
Este documento descreve os passos completos que foram realizados para configurar o repositório twentyapptemplate e integrar o código do twenty como uma cópia independente. Também inclui detalhes sobre comandos específicos utilizados e explica as etapas futuras que precisam ser realizadas para completar a configuração.

Passos Realizados
1. Criação do Repositório Base twentyapptemplate
Passo Inicial:

Criamos o repositório twentyapptemplate a partir de um template (hubgenial-app-repo-template), que servirá como base para a aplicação.
Objetivo do Repositório:

O twentyapptemplate será a aplicação principal, que inclui o código do twenty como um componente independente. Esse repositório permite modificar o twenty de forma isolada.
2. Fork do Repositório twenty
Fork do Repositório Original:

Realizamos um fork do repositório twenty original para a conta OlhaiHub no GitHub. Isso permite que tenhamos uma cópia do twenty na nossa conta, que será integrada ao twentyapptemplate.
Objetivo do Fork:

Ter uma cópia completa do código para personalizações específicas do twentyapptemplate.
3. Clonagem do Repositório twentyapptemplate e Criação da Estrutura forks/twenty
Clone do Repositório Base:

Na máquina Linux, clonamos o repositório twentyapptemplate usando o comando:
bash
Copiar código
git clone git@github.com:OlhaiHub/twentyapptemplate.git
cd twentyapptemplate
Criação da Estrutura de Diretórios:

Criamos a pasta forks/twenty dentro do twentyapptemplate para receber o código do twenty:
bash
Copiar código
mkdir -p forks/twenty
4. Adição do twenty como Submódulo
Adicionando o Submódulo:

Inicialmente, configuramos o repositório twenty como submódulo para que ele fosse clonado automaticamente dentro de forks/twenty:
bash
Copiar código
git submodule add https://github.com/OlhaiHub/twenty.git forks/twenty
Problema Identificado:

O submódulo foi adicionado, mas foi decidido que o twenty deveria ser uma cópia independente para permitir modificações sem sincronizar com o repositório original.
5. Convertendo o twenty para uma Cópia Independente
Remover o Submódulo:

Para desvincular o submódulo e transformar o twenty em uma cópia independente, removemos o submódulo e mantivemos os arquivos locais:
bash
Copiar código
git rm -r --cached forks/twenty
rm -rf .git/modules/forks/twenty
Adicionar os Arquivos ao Controle de Versão:

Com o submódulo removido, os arquivos do twenty agora fazem parte do repositório principal. Adicionamos esses arquivos ao controle de versão:
bash
Copiar código
git add forks/twenty
git commit -m "Converte submódulo `twenty` em uma cópia independente"
git push origin main
Resultado Final:

O twenty agora é uma cópia independente dentro de twentyapptemplate, permitindo que alterações sejam feitas diretamente no código sem afetar o repositório original.
Comandos Utilizados e Suas Funções
git clone: Clona um repositório remoto para o diretório local.
mkdir -p <diretório>: Cria uma estrutura de diretórios.
git submodule add: Adiciona um submódulo de outro repositório Git em um subdiretório específico.
git rm -r --cached <diretório>: Remove um diretório do controle de versão do Git, mas mantém os arquivos locais.
rm -rf: Comando para remover diretórios e arquivos de forma recursiva.
git add .: Adiciona todas as mudanças ao controle de versão para serem commitadas.
git commit -m "<mensagem>": Salva as mudanças no histórico do Git com uma mensagem descritiva.
git push origin <branch>: Envia as mudanças para o repositório remoto na branch especificada.
Próximos Passos
Configuração de Variáveis de Ambiente:

Revisar e ajustar o arquivo .env.example em docs/architecture para definir variáveis específicas da aplicação.
Implementação de Infraestrutura no AWS:

Criar e configurar o ambiente AWS EKS e PostgreSQL, conforme planejado. A infraestrutura será documentada em outro arquivo (infraestrutura.md).
Personalizações no Código do twenty:

Começar a fazer as personalizações necessárias na pasta forks/twenty para integrar funcionalidades específicas da aplicação.
Documentação Contínua:

Manter este arquivo atualizado com todos os novos passos e alterações realizadas no projeto.
