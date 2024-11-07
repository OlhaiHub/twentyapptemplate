Application twentycrm Template - Progresso e Próximos Passos
Objetivo
O objetivo deste projeto é criar um template para a aplicação twentycrm, que servirá como base para futuras implementações e personalizações. O template permitirá que a aplicação seja replicada de forma estruturada e configurada com facilidade, além de permitir integrações e modificações específicas dentro de uma arquitetura baseada no twentycrm.

Progresso Até o Momento
1️⃣ Criação do Repositório Base
Começamos o processo criando um repositório chamado twentyapptemplate no GitHub. Esse repositório foi gerado a partir de um template (hubgenial-app-repo-template) pré-configurado, fornecendo uma estrutura inicial para a aplicação.

Comando Utilizado:

Para criar o repositório base no GitHub a partir de um template, usamos a GitHub CLI (GH CLI):

bash
gh repo create OlhaiHub/twentyapptemplate --template "OlhaiHub/hubgenial-app-repo-template" --public
Esse comando cria um novo repositório twentyapptemplate na conta OlhaiHub, baseado no template especificado.

2️⃣ Fork do Repositório twenty
Para incorporar o código do twenty ao nosso template, realizamos um fork do repositório twenty original para a conta OlhaiHub no GitHub.

Comando Utilizado:

Para fazer o fork usando a GH CLI, utilizamos o seguinte comando:

bash
Copiar código
gh repo fork twentyhq/twenty --clone=false
Esse comando cria um fork do repositório twenty na nossa conta GitHub (OlhaiHub), que pode ser modificado de forma independente.

3️⃣ Clonagem do Repositório twentyapptemplate e Estrutura de Diretórios
Após a criação do repositório twentyapptemplate, clonamos o repositório em um ambiente de desenvolvimento e criamos a estrutura de diretórios para organizar o fork do twenty.

Comandos Utilizados:

Primeiro, clonamos o repositório twentyapptemplate:

bash
git clone git@github.com:OlhaiHub/twentyapptemplate.git
cd twentyapptemplate
Em seguida, criamos a pasta forks/twenty para isolar o código do twenty e permitir que ele seja tratado como um módulo independente:

bash
mkdir -p forks/twenty
4️⃣ Adição do twenty como Submódulo
Inicialmente, adicionamos o twenty como um submódulo no repositório twentyapptemplate. Essa abordagem foi adotada para incluir o código do twenty sem copiá-lo diretamente, mantendo uma referência ao repositório original.

Comando Utilizado:

Para adicionar o repositório twenty como submódulo, utilizamos o seguinte comando:

bash
git submodule add https://github.com/OlhaiHub/twenty.git forks/twenty
Esse comando cria um submódulo forks/twenty vinculado ao repositório twenty, permitindo sincronizações com o repositório original.

Desafios e Mudança de Estratégia:
Após adicionar o twenty como submódulo, identificamos que essa abordagem não atenderia às necessidades do projeto, pois precisávamos de uma cópia independente para permitir personalizações. Decidimos, então, transformar o twenty em uma cópia direta.

5️⃣ Conversão do twenty em uma Cópia Independente
Para permitir personalizações independentes, removemos o submódulo e transformamos o conteúdo do twenty em uma cópia independente dentro do repositório twentyapptemplate.

Comandos Utilizados:

Primeiro, removemos o submódulo sem apagar os arquivos locais:

bash
git rm -r --cached forks/twenty
rm -rf .git/modules/forks/twenty
Em seguida, adicionamos os arquivos do twenty diretamente ao repositório twentyapptemplate:

bash
git add forks/twenty
git commit -m "Converte submódulo `twenty` em uma cópia independente"
git push origin main
Esses comandos removem a referência ao submódulo e transformam o twenty em uma parte integral do twentyapptemplate, permitindo personalizações sem vínculos com o repositório original.

Próximos Passos
Com a base configurada e o twenty incorporado de forma independente, os próximos passos para completar o template do twentycrm incluem:

1. Configurar Variáveis de Ambiente
Revisar e ajustar o arquivo de variáveis de ambiente (.env.example) dentro do diretório docs/architecture. Esse arquivo definirá as variáveis de ambiente necessárias para a aplicação twentycrm, incluindo configurações de banco de dados, URLs de serviços e chaves de API.

2. Implementar Infraestrutura no AWS
Provisionar a infraestrutura necessária no AWS para suportar o twentycrm. Isso inclui a criação de um cluster EKS (Elastic Kubernetes Service) para gerenciar contêineres e a configuração de uma instância EC2 para o banco de dados PostgreSQL. Ferramentas como Terraform ou AWS CLI podem ser utilizadas para automatizar o processo de criação dessa infraestrutura.

3. Integrar Banco de Dados com Kubernetes
Configurar a URL do PostgreSQL em um manifesto do Kubernetes para que o twentycrm possa acessar o banco de dados de forma segura. Essa etapa envolve ajustar o arquivo de manifesto do Kubernetes para definir a URL de conexão com o banco de dados e aplicar as configurações ao cluster EKS.

4. Personalizar o Código do twenty
Com a infraestrutura configurada, o próximo passo é realizar personalizações no código do twenty dentro do diretório forks/twenty. Essas personalizações devem atender às necessidades específicas da aplicação twentycrm, como ajustes nas funcionalidades e interfaces para adaptá-las ao contexto do CRM.

5. Documentação Contínua e Atualizações
Durante o desenvolvimento, manter a documentação atualizada é essencial. Isso inclui registrar qualquer alteração ou configuração adicional que seja feita na infraestrutura, no código ou nas variáveis de ambiente. A documentação deve ser clara para que outros desenvolvedores possam entender e replicar o processo.

Conclusão
Até o momento, estabelecemos uma estrutura sólida para o twentycrm template, com um repositório base e o código do twenty incorporado de forma independente. Com a conclusão dos próximos passos, o twentycrm estará preparado para implementação em diferentes ambientes com a infraestrutura de suporte adequada. Esse template será essencial para futuras implementações e customizações da aplicação, proporcionando uma base confiável e bem estruturada.
