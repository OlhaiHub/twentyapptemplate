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
### 11. Criação e Configuração do Nodegroup EKS

**Criação do Nodegroup:**
```bash
aws eks create-nodegroup \
    --cluster-name twentycrm-cluster \
    --nodegroup-name twentycrm-nodes \
    --subnets subnet-068eaefc740f64d7b subnet-008663bb78c888cdf \
    --instance-types t3.medium \
    --scaling-config minSize=1,maxSize=3,desiredSize=2 \
    --node-role arn:aws:iam::329599648557:role/olhAI-hubGenial-eks-node-role \
    --region sa-east-1
```

**Verificação do Status:**
```bash
aws eks describe-nodegroup \
    --cluster-name twentycrm-cluster \
    --nodegroup-name twentycrm-nodes \
    --region sa-east-1 \
    --query 'nodegroup.status'
```

**Resultado:**
```json
"ACTIVE"
```

**Configurações do Nodegroup:**
- Tipo de instância: t3.medium
- Escalabilidade: mínimo 1, máximo 3, desejado 2 nodes
- Subnets: Mesmas do cluster EKS
- Role IAM: olhAI-hubGenial-eks-node-role
// ... (após a seção do nodegroup)

**Verificação dos Nodes:**
```bash
kubectl get nodes
```

**Resultado:**
```
NAME                                       STATUS   ROLES    AGE     VERSION
ip-10-0-1-241.sa-east-1.compute.internal   Ready    <none>   2m12s   v1.28.13-eks-a737599
ip-10-0-2-55.sa-east-1.compute.internal    Ready    <none>   2m14s   v1.28.13-eks-a737599
```

**Observações:**
- Dois nodes foram criados conforme a configuração desiredSize=2
- Ambos os nodes estão com status Ready
- Versão do Kubernetes: v1.28.13-eks-a737599

### 12. Instalação e Configuração do PostgreSQL

**Instalação:**
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```
### 13. Configuração do Ambiente de Desenvolvimento Frontend

**Instalação de Dependências:**
```bash
cd ~/twentyapptemplate/forks/twenty
yarn install
```

**Build do Frontend:**
```bash
# Primeiro fazer o build
yarn nx build twenty-front

# Depois iniciar com a porta correta
PORT=3001 yarn nx serve twenty-front
```

**Resultados do Build:**
- Tempo de build: ~1m 14s
- Assets gerados com sucesso
- Servidor acessível em http://10.0.1.237:3001

**Configuração do SSH:**
```
Host olhAI-linux
    HostName 52.67.162.232
    User ubuntu
    IdentityFile ~/path/to/key.pem
    Compression yes
    TCPKeepAlive yes
    ServerAliveInterval 60
    ServerAliveCountMax 5
```

### 14. Troubleshooting e Soluções Comuns

**Erro "nx not found":**
```bash
cd ~/twentyapptemplate/forks/twenty
yarn install
```

**Problemas de Conexão:**
- Verificar security groups AWS
- Confirmar IP público correto
- Verificar logs: `journalctl -u twenty-server -f`

**Warnings de Build:**
- Warnings PURE são não-críticos e podem ser ignorados
- Verificar compatibilidade de módulos externos

## Próximos Passos Atualizados

### 1. Otimização de Performance
- Análise e otimização dos tempos de build
- Implementação de cache para assets estáticos
- Configuração de CDN para distribuição de conteúdo

### 2. Monitoramento e Logs
- Implementação de sistema de logging centralizado
- Configuração de alertas de performance
- Definição de métricas de monitoramento

### 3. Segurança e Compliance
- Implementação de SSL/TLS
- Auditoria de segurança da infraestrutura
- Revisão de políticas de acesso

### 4. CI/CD
- Configuração de pipeline de deploy
- Automação de testes
- Implementação de rollback automatizado

### 5. Documentação e Manutenção
- Atualização contínua da documentação
- Criação de guias de troubleshooting
- Manutenção de changelog

## Conclusão

O projeto evoluiu significativamente com a implementação do ambiente de desenvolvimento frontend e a resolução de questões de infraestrutura. A base está estabelecida para o desenvolvimento contínuo e a escalabilidade futura do TwentyCRM.