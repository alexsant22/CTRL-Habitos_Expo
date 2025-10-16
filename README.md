# 📱 Ctrl Hábitos - App de Controle de Hábitos

Um aplicativo mobile desenvolvido em React Native/Expo para ajudar usuários a registrar e acompanhar o cumprimento diário de seus hábitos.

## 🎯 Funcionalidades

### ✅ Requisitos Mínimos Implementados

1. **Cadastro de Hábitos**

   - Criar novos hábitos com nome e frequência personalizável
   - Frequências: Diária (todos os dias) ou Semanal (X vezes por semana)
   - Armazenamento local usando AsyncStorage

2. **Marcar Cumprimento Diário**

   - Interface intuitiva para marcar/desmarcar hábitos como concluídos
   - Registro automático da data e horário
   - Persistência dos dados localmente

3. **Visualização do Progresso**

   - Tela de estatísticas com gráficos interativos
   - Progresso diário, semanal e mensal
   - Gráficos de pizza e barras para visualização intuitiva
   - Destaques: melhor hábito e hábitos que precisam melhorar

4. **Editar e Remover Hábitos**

   - Edição completa dos hábitos existentes
   - Exclusão com confirmação
   - Atualização em tempo real do localStorage

5. **Persistência de Dados**
   - Todos os dados salvos localmente usando AsyncStorage
   - Funcionamento offline completo
   - Sincronização automática ao abrir o app

### 🚀 Funcionalidades Extras Implementadas

6. **Sistema de Notificações**

   - Lembretes personalizáveis por hábito
   - Configuração de horários específicos
   - Permissões automáticas para Android/iOS
   - Notificações de conquistas (streaks e metas)

7. **Interface Responsiva e Intuitiva**

   - Design moderno seguindo princípios de Material Design
   - Navegação por abas intuitiva
   - Estados vazios com call-to-action
   - Animações e feedback visual

8. **Metas e Feedback**

   - Definição de metas semanais personalizadas
   - Feedback visual do progresso
   - Dicas personalizadas para melhorar
   - Sistema de streaks (sequências)

9. **Filtros e Organização**
   - Filtro por hábitos ativos, concluídos ou todos
   - Ordenação automática por data
   - Busca rápida e intuitiva

## 🛠 Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Desenvolvimento e build
- **React Navigation** - Navegação entre telas
- **Async Storage** - Armazenamento local
- **React Native Chart Kit** - Gráficos e visualizações
- **Expo Notifications** - Sistema de notificações
- **Expo Vector Icons** - Ícones da interface
- **React Native Community/DateTimePicker** - Seletor de data/hora

## 📋 Pré-requisitos

- Node.js 16 ou superior
- npm ou yarn
- Expo CLI
- Dispositivo mobile ou emulador

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ctrl-habitos.git
cd ctrl-habitos
```
