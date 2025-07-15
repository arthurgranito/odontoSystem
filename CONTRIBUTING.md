# 🚀 Guia de Contribuição - OdontoSystem

Obrigado por considerar contribuir com o OdontoSystem! Este guia irá te ajudar a começar.

## 📋 Índice
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 🤝 Como Contribuir

### 1. Fork do Repositório
```bash
# Clone seu fork
git clone https://github.com/SEU-USUARIO/odonto-system.git
cd odonto-system

# Adicione o repositório original como upstream
git remote add upstream https://github.com/USUARIO-ORIGINAL/odonto-system.git
```

### 2. Configuração do Ambiente
```bash
# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### 3. Crie uma Branch
```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-funcionalidade

# Para correção de bug
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/nome-da-documentacao
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js >= 18.0.0
- NPM >= 9.0.0
- Git

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/odonto-system.git

# Entre no diretório
cd odonto-system

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

## 📝 Padrões de Código

### Estrutura de Arquivos
```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── utils/         # Funções utilitárias
├── types/         # Definições TypeScript
└── services/      # Integração com APIs
```

### Convenções de Nomenclatura
- **Componentes**: PascalCase (`MeuComponente.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useMinhaFuncionalidade.ts`)
- **Utilitários**: camelCase (`minhaFuncao.ts`)
- **Tipos**: PascalCase (`MeuTipo.ts`)

### Padrões TypeScript
```typescript
// ✅ Bom
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// ✅ Bom - Props de componente
interface MeuComponenteProps {
  titulo: string;
  onClick: () => void;
}

// ✅ Bom - Hook customizado
const useMinhaFuncionalidade = () => {
  // implementação
};
```

### Padrões de Commit
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adiciona exportação de relatórios em PDF"
git commit -m "fix: corrige cálculo de faturamento mensal"
git commit -m "docs: atualiza README com novas instruções"
```

## 🔄 Processo de Pull Request

### 1. Antes de Submeter
```bash
# Atualize sua branch com a main
git checkout main
git pull upstream main
git checkout sua-branch
git rebase main

# Execute os testes
npm run lint
npm run type-check
npm run build
```

### 2. Submissão
1. **Título**: Seja claro e descritivo
2. **Descrição**: Explique o que foi alterado e por quê
3. **Screenshots**: Inclua se houver mudanças visuais
4. **Testes**: Descreva como testar as mudanças

### 3. Template de PR
```markdown
## 📋 Descrição
Breve descrição das mudanças realizadas.

## 🔄 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Screenshots incluídos (se aplicável)

## 🧪 Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado
```

## 🐛 Reportar Bugs

### Template de Bug Report
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## ✅ Comportamento Esperado
O que deveria acontecer.

## 📱 Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]

## 📸 Screenshots
Se aplicável, adicione screenshots.
```

## 💡 Sugerir Funcionalidades

### Template de Feature Request
```markdown
## 💡 Descrição da Funcionalidade
Descrição clara da funcionalidade desejada.

## 🎯 Problema que Resolve
Qual problema esta funcionalidade resolve?

## 💭 Solução Proposta
Como você imagina que deveria funcionar?

## 🔄 Alternativas Consideradas
Outras soluções que você considerou?

## 📋 Contexto Adicional
Qualquer outra informação relevante.
```

## 🎨 Padrões de UI/UX

### Componentes
- Use componentes do Shadcn/ui quando possível
- Mantenha consistência visual
- Siga o design system estabelecido

### Responsividade
- Mobile-first approach
- Teste em diferentes tamanhos de tela
- Use breakpoints do Tailwind

### Acessibilidade
- Inclua labels apropriados
- Mantenha contraste adequado
- Teste com leitores de tela

## 🧪 Testes

### Executar Testes
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

### Escrever Testes
- Teste funcionalidades críticas
- Inclua casos edge
- Mantenha testes simples e legíveis

## 📞 Suporte

### Canais de Comunicação
- **Issues**: Para bugs e funcionalidades
- **Discussions**: Para perguntas gerais
- **Email**: contato@odontosystem.com

### Tempo de Resposta
- Issues: 24-48 horas
- Pull Requests: 2-5 dias úteis
- Perguntas: 24 horas

## 🏆 Reconhecimento

Todos os contribuidores serão reconhecidos no README e releases notes.

### Hall of Fame
- Contribuidor 1 - Feature X
- Contribuidor 2 - Bug Fix Y
- Contribuidor 3 - Documentação Z

---

**Obrigado por contribuir com o OdontoSystem! 🦷✨**