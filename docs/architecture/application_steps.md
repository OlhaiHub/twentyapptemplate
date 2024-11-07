Application Steps
Objetivo
Descrever os passos completos realizados para configurar o repositório twentyapptemplate e integrar o código do twenty como uma cópia independente. Também incluir detalhes sobre os comandos específicos utilizados e explicar as etapas futuras a serem realizadas para completar a configuração.

Passos Realizados
1. Criar o Repositório Base twentyapptemplate
Passo Inicial:

Criar o repositório twentyapptemplate a partir de um template (hubgenial-app-repo-template), que servirá como base para a aplicação.
Objetivo do Repositório:

Utilizar twentyapptemplate como a aplicação principal, que inclui o código do twenty como um componente independente. Permitir modificar o twenty de forma isolada.
2. Fazer Fork do Repositório twenty
Realizar Fork do Repositório Original:

Fazer um fork do repositório twenty original para a conta OlhaiHub no GitHub. Isso permite ter uma cópia do twenty na conta, que será integrada ao twentyapptemplate.
Objetivo do Fork:

Manter uma cópia completa do código para personalizações específicas do twentyapptemplate.
3. Clonar o Repositório twentyapptemplate e Criar a Estrutura forks/twenty
Clonar o Repositório Base:

Na máquina Linux, clonar o repositório twentyapptemplate usando o comando:
bash
Copiar código
git clone git@github.com:OlhaiHub/twentyapptemplate.git
cd twentyapptemplate
Criar a Estrutura de Diretórios:

Criar a pasta forks/twenty dentro do twentyapptemplate para receber o código do twenty:
bash
Copiar código
mkdir -p forks/twenty
4. Adicionar o twenty como Submódulo
Adicionar o Submódulo:

Inicialmente, configurar o repositório twenty como submódulo para que ele seja clonado automaticamente dentro de forks/twenty:
bash
Copiar código
git submodule add https://github.com/OlhaiHub/twenty.git forks/twenty
Identificar Problema:

Verificar que o submódulo foi adicionado, mas decidir que o twenty deve ser uma cópia independente para permitir modificações sem sincronizar com o repositório original.
5. Converter o twenty em uma Cópia Independente
Remover o Submódulo:

Desvincular o submódulo e transformar o twenty em uma cópia independente, removendo o submódulo e mantendo os arquivos locais:
bash
Copiar código
git rm -r --cached forks/twenty
rm -rf .git/modules/forks/twenty
Adicionar os Arquivos ao Controle de Versão:

Com o submódulo removido, adicionar os arquivos do twenty diretamente ao repositório principal:
bash
Copiar código
git add forks/twenty
git commit -m "Converte submódulo `twenty` em uma cópia independente"
git push origin main
Resultado Final:

Tornar o twenty uma cópia independente dentro de twentyapptemplate, permitindo que alterações sejam feitas diretamente no código sem afetar o repositório original.
Comandos Utilizados e Suas Funções
git clone: Clonar um repositório remoto para o diretório local.
mkdir -p <diretório>: Criar uma estrutura de diretórios.
git submodule add: Adicionar um submódulo de outro repositório Git em um subdiretório específico.
git rm -r --cached <diretório>: Remover um diretório do controle de versão do Git, mas manter os arquivos locais.
rm -rf: Remover diretórios e arquivos de forma recursiva.
git add .: Adicionar todas as mudanças ao controle de versão para serem commitadas.
git commit -m "<mensagem>": Salvar as mudanças no histórico do Git com uma mensagem descritiva.
git push origin <branch>: Enviar as mudanças para o repositório remoto na branch especificada.
Próximos Passos
Configurar Variáveis de Ambiente:

Revisar e ajustar o arquivo .env.example em docs/architecture para definir variáveis específicas da aplicação.
Implementar Infraestrutura no AWS:

Criar e configurar o ambiente AWS EKS e PostgreSQL, conforme planejado. Documentar a infraestrutura em outro arquivo (infraestrutura.md).
Personalizar o Código do twenty:

Iniciar personalizações na pasta forks/twenty para integrar funcionalidades específicas da aplicação.
Manter Documentação Contínua:

Atualizar este arquivo com todos os novos passos e alterações realizadas no projeto.
Este documento serve como uma referência detalhada dos passos realizados e facilita a compreensão do histórico e da configuração inicial do projeto para qualquer desenvolvedor ou colaborador.
