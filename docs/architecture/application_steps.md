cat docs/architecture/application_steps.md
cat docs/architecture/application_steps.md
# Template TwentyCRM - Documentação de Progresso e Próximos Passos

## Objetivo

O objetivo deste projeto é criar um template para a aplicação TwentyCRM, que servirá como base para futuras implementações e personalizações. O template permitirá que a aplicação seja replicada de forma estruturada e configurada com facilidade, além de permitir integrações e modificações específicas dentro de uma arquitetura baseada no TwentyCRM.

## Progresso Até o Momento

### 1. Criação do Repositório Base

Iniciamos o processo criando um repositório chamado `twentyapptemplate` no GitHub. Esse repositório foi gerado a partir de um template (`hubgenial-app-repo-template`) pré-configurado, fornecendo uma estrutura inicial para a aplicação.

**Comando Utilizado:**
```bash
gh repo create OlhaiHub/twentyapptemplate --template "OlhaiHub/hubgenial-app-repo-template" --public
```

### 2. Fork do Repositório Twenty

Para incorporar o código do Twenty ao nosso template, realizamos um fork do repositório Twenty original para a conta OlhaiHub no GitHub.

**Comando Utilizado:**
```bash
gh repo fork twentyhq/twenty --clone=false
```

### 3. Clonagem do Repositório e Estrutura de Diretórios

Após a criação do repositório, estabelecemos a estrutura básica:

**Comandos de Configuração:**
```bash
# Clonar o repositório
git clone git@github.com:OlhaiHub/twentyapptemplate.git
cd twentyapptemplate

# Criar estrutura de diretórios
mkdir -p forks/twenty
```

### 4. Adição do Twenty como Submódulo

Inicialmente, implementamos o Twenty como um submódulo no repositório.

**Comando Utilizado:**
```bash
git submodule add https://github.com/OlhaiHub/twenty.git forks/twenty
```

**Desafios e Mudança de Estratégia:**
Identificamos que a abordagem de submódulo não atenderia às necessidades do projeto, pois precisávamos de uma cópia independente para permitir personalizações.

### 5. Conversão para Cópia Independente

Transformamos o conteúdo do Twenty em uma cópia independente dentro do repositório.

**Comandos de Conversão:**
```bash
# Remover submódulo
git rm -r --cached forks/twenty
rm -rf .git/modules/forks/twenty

# Adicionar como cópia independente
git add forks/twenty
git commit -m "Converte submódulo 'twenty' em uma cópia independente"
git push origin main
```
// ... todo conteúdo anterior permanece igual até a seção "Conversão para Cópia Independente" ...

### 6. Instalação e Configuração do AWS CLI

Para preparar o ambiente para uso dos serviços AWS, instalamos o AWS CLI seguindo estes passos:

**Download e Instalação Inicial:**
```bash
cd ~
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

**Resolução de Dependências:**
Encontramos que o `unzip` não estava instalado e resolvemos com:
```bash
sudo apt update
sudo apt install unzip -y
```

**Extração e Instalação do AWS CLI:**
```bash
unzip awscliv2.zip
sudo ./aws/install
```

**Verificação da Instalação:**
```bash
aws --version
```
**Confirmação da Instalação:**
Após a instalação, o sistema confirmará com a mensagem:
```
You can now run: /usr/local/bin/aws --version
```

**Versão Instalada:**
```bash
aws-cli/2.19.2 Python/3.12.6 Linux/6.8.0-1017-aws exe/x86_64.ubuntu.24
```

### 7. Configuração das Credenciais AWS CLI

Após a instalação do AWS CLI, configuramos as credenciais de acesso:

```bash
aws configure
```

**Configurações fornecidas:**
- AWS Access Key ID: [CHAVE_CONFIGURADA]
- AWS Secret Access Key: [CHAVE_SECRETA]
- Default region name: sa-east-1
- Default output format: json

### 8. Verificação e Configuração do Docker

Verificamos a instalação do Docker no sistema:

```bash
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

**Resultado:**
- Docker já estava instalado na versão 24.0.7-0ubuntu4.1
- Serviço Docker foi iniciado e habilitado para iniciar com o sistema
- Usuário 'ubuntu' foi adicionado ao grupo 'docker' para executar comandos sem sudo

**Observações Importantes:**
- A versão do Docker instalada é compatível com os requisitos do projeto
- Não foi necessária uma nova instalação, apenas a configuração do serviço


**Observações Importantes:**
- As credenciais são armazenadas em `~/.aws/credentials`
- A configuração regional em `~/.aws/config`
- Nunca compartilhe ou exponha suas chaves de acesso

**Observações Importantes:**
- O AWS CLI pode ser instalado em qualquer diretório, pois o instalador configura automaticamente o PATH do sistema
- É recomendado realizar a instalação no diretório home (~) para facilitar a limpeza posterior
- O executável do AWS CLI fica acessível globalmente após a instalação


### 9. Criação e Configuração do Cluster EKS

**Criação do Cluster:**
```bash
aws eks create-cluster \
    --name twentycrm-cluster \
    --region sa-east-1 \
    --kubernetes-version 1.28 \
    --role-arn arn:aws:iam::329599648557:role/olhAI-hubGenial-eks-cluster-role \
    --resources-vpc-config "subnetIds=subnet-068eaefc740f64d7b,subnet-008663bb78c888cdf,securityGroupIds=sg-00adc9dea6db2f654"
```

**Verificação do Status:**
```bash
aws eks describe-cluster --name twentycrm-cluster --query "cluster.status"
```

**Resultado:**
```json
"ACTIVE"
```
### 10. Instalação e Configuração do kubectl

**Download e Instalação do kubectl:**
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**Configuração do kubectl para o Cluster EKS:**
```bash
aws eks --region sa-east-1 update-kubeconfig --name twentycrm-cluster
```

**Resultado:**
```
Added new context arn:aws:eks:sa-east-1:329599648557:cluster/twentycrm-cluster to /home/ubuntu/.kube/config
```

**Verificação do Acesso ao Cluster:**
```bash
kubectl get svc
```

**Resultado:**
```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   172.20.0.1   <none>        443/TCP   5m39s
```

**Observações Importantes:**
- O kubectl foi instalado com sucesso
- A configuração do cluster foi adicionada ao arquivo kubeconfig
- O teste de conectividade com o cluster foi bem-sucedido
## Próximos Passos

### 1. Configuração de Variáveis de Ambiente
- Revisar e ajustar arquivo `.env.example` no diretório `docs/architecture`
- Definir variáveis essenciais:
  - Configurações de banco de dados
  - URLs de serviços
  - Chaves de API

### 2. Implementação da Infraestrutura AWS
- Provisionar cluster EKS
- Configurar instância EC2 para PostgreSQL
- Implementar automação com Terraform/AWS CLI

### 3. Integração com Kubernetes
- Configurar URL do PostgreSQL nos manifestos
- Estabelecer conexão segura com banco de dados
- Aplicar configurações ao cluster EKS

### 4. Personalização do Código
- Realizar modificações no diretório `forks/twenty`
- Adaptar funcionalidades para contexto CRM
- Ajustar interfaces conforme necessidade

### 5. Documentação e Manutenção
- Manter registros de alterações
- Documentar configurações de infraestrutura
- Criar guias de implementação

## Conclusão

O projeto estabeleceu uma estrutura sólida para o template TwentyCRM, com repositório base e código incorporado de forma independente. A conclusão dos próximos passos preparará o TwentyCRM para implementações em diferentes ambientes, fornecendo uma base confiável e bem estruturada para futuras customizações e integrações.
