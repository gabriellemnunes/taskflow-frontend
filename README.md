# TaskFlow Frontend
Aplicativo React Native + Expo para CRUD completo de tarefas, consumindo a API do repositório `taskflow-backend`.

## Pré-requisitos
Node.js 20+, npm, Expo Go no celular e backend com MongoDB funcionando.

## Como executar
1. `npm install`
2. Inicie o backend separadamente.
3. `npx expo start` e abra o QR Code no Expo Go.
4. No campo **Endereço da API** dentro do app, informe `http://IP_DO_SEU_PC:3000` e toque em **Salvar endereço da API**.

**Importante:** celular e computador devem estar na mesma rede Wi-Fi. `localhost` no celular não aponta para o computador. Verifique firewall e porta 3000. No Android com HTTP local, se houver bloqueio de tráfego sem TLS, utilize HTTPS na API publicada.

## Funcionalidades
- Criar tarefa com título e descrição.
- Listar tarefas salvas no MongoDB.
- Editar título, descrição e status.
- Marcar como concluída ou pendente.
- Excluir tarefa com confirmação.
- Salvar URL da API no AsyncStorage.

## Tecnologias
React Native, Expo, AsyncStorage, API REST. Sem armazenamento local de tarefas: o backend é a fonte de dados.
